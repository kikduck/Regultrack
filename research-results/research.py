# -*- coding: utf-8 -*-
"""
Deep research réglementaire par secteur — Brave Search API → Ollama.

Contexte web : Brave **LLM Context** (extrait prêt pour LLM, sans scraping).
Repli : Brave **Web Search** (`extra_snippets`), puis éventuellement DDG + scrape.

Clé API : variable d'environnement `BRAVE_API_KEY`, ou fichier `.env.local` / `.env`
à la racine du dépôt Regultrack.

Docs :
  https://api-dashboard.search.brave.com/documentation/services/web-search
  https://api-dashboard.search.brave.com/documentation/services/llm-context
  https://api-dashboard.search.brave.com/documentation/services/answers

Usage :
  python research.py
  python research.py creches
  python research.py creches 01
  python research.py securite-privee --fallback-ddg   # si Brave indisponible
"""

from __future__ import annotations

import argparse
import importlib.util
import json
import os
import re
import sys
import time
import warnings
from datetime import datetime
from pathlib import Path

import requests

# Paquet renommé ddgs ; évite le bruit à l'exécution
warnings.filterwarnings("ignore", message=".*duckduckgo_search.*renamed.*", category=RuntimeWarning)

# ──────────────────────────────────────────────
OLLAMA_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434/api/chat")
MODEL = os.environ.get("OLLAMA_MODEL", "gemma4:26b")

BRAVE_WEB_SEARCH_URL = "https://api.search.brave.com/res/v1/web/search"
BRAVE_LLM_CONTEXT_URL = "https://api.search.brave.com/res/v1/llm/context"

# Contexte envoyé au modèle local (caractères max pour limiter le prompt)
CONTEXT_CHAR_BUDGET = 28_000

MAX_RESULTS_LEGACY = 6
MAX_CHARS_LEGACY = 1200

# Brave LLM Context : contraintes documentées sur `q` (≈ 400 caractères, 50 mots max).
BRAVE_Q_MAX_CHARS = 380
BRAVE_Q_MAX_WORDS = 48
# Débit : ~2 req/s sur le plan gratuit — espacer les appels et retenter les 429.
BRAVE_MIN_INTERVAL_S = 0.55
BRAVE_BETWEEN_FICHES_S = float(os.environ.get("BRAVE_BETWEEN_FICHES_S", "6"))
# Forcer Web Search uniquement (équivalent à détection OPTION_NOT_IN_PLAN).
_BRAVE_WEB_SEARCH_ONLY = os.environ.get("BRAVE_WEB_SEARCH_ONLY", "").lower() in ("1", "true", "yes")
# ──────────────────────────────────────────────

_last_brave_call_monotonic: float = 0.0
# LLM Context désactivé après OPTION_NOT_IN_PLAN ou si BRAVE_WEB_SEARCH_ONLY.
_BRAVE_LLM_CONTEXT_UNAVAILABLE: bool = _BRAVE_WEB_SEARCH_ONLY
_BRAVE_LLM_PLAN_NOTICE_SHOWN: bool = False


def _throttle_brave() -> None:
    global _last_brave_call_monotonic
    now = time.monotonic()
    wait = BRAVE_MIN_INTERVAL_S - (now - _last_brave_call_monotonic)
    if wait > 0:
        time.sleep(wait)
    _last_brave_call_monotonic = time.monotonic()


def clamp_brave_query(q: str) -> str:
    """Respecte les limites Brave sur `q` (évite les 400 Bad Request)."""
    q = " ".join((q or "").split()).strip()
    if not q:
        return q
    words = q.split()
    if len(words) > BRAVE_Q_MAX_WORDS:
        q = " ".join(words[:BRAVE_Q_MAX_WORDS])
    if len(q) > BRAVE_Q_MAX_CHARS:
        q = q[:BRAVE_Q_MAX_CHARS].rsplit(" ", 1)[0]
    return q


def _brave_headers(api_key: str) -> dict[str, str]:
    return {
        "X-Subscription-Token": api_key,
        "Accept": "application/json",
        "Accept-Encoding": "gzip",
    }


def _brave_api_error_code(r: requests.Response) -> str | None:
    try:
        data = r.json()
        err = data.get("error")
        if isinstance(err, dict):
            return err.get("code")
    except Exception:
        pass
    return None


def _disable_brave_llm_context_if_not_in_plan(r: requests.Response) -> bool:
    """
    Brave renvoie code OPTION_NOT_IN_PLAN si l'option LLM Context n'est pas souscrite.
    Voir https://api-dashboard.search.brave.com/documentation/services/llm-context
    """
    global _BRAVE_LLM_CONTEXT_UNAVAILABLE, _BRAVE_LLM_PLAN_NOTICE_SHOWN
    code = _brave_api_error_code(r)
    if code != "OPTION_NOT_IN_PLAN":
        return False
    _BRAVE_LLM_CONTEXT_UNAVAILABLE = True
    if not _BRAVE_LLM_PLAN_NOTICE_SHOWN:
        _BRAVE_LLM_PLAN_NOTICE_SHOWN = True
        print(
            "  Note : LLM Context n’est pas inclus dans votre abonnement Brave (OPTION_NOT_IN_PLAN).\n"
            "     Passage automatique à **Web Search** uniquement pour cette session.\n"
            "     Pour activer LLM Context : surgradez le plan sur https://api-dashboard.search.brave.com/\n"
            "     Ou définissez BRAVE_WEB_SEARCH_ONLY=1 pour éviter tout appel LLM Context."
        )
    return True


def _brave_request(
    method: str,
    url: str,
    *,
    api_key: str,
    params: dict | None = None,
    json_body: dict | None = None,
    timeout: int = 45,
) -> requests.Response | None:
    """Requête Brave avec throttle + retries sur 429."""
    headers = {**_brave_headers(api_key), "User-Agent": "Regultrack-research/1.0"}
    if json_body is not None:
        headers["Content-Type"] = "application/json"
    delays = (1.0, 3.0, 8.0)
    for attempt, delay in enumerate((*delays, 0)):
        _throttle_brave()
        try:
            if method.upper() == "POST" and json_body is not None:
                r = requests.post(url, headers=headers, json=json_body, timeout=timeout)
            else:
                r = requests.get(url, headers=headers, params=params, timeout=timeout)
        except requests.RequestException as e:
            if attempt < len(delays):
                print(f"  [Brave] Erreur réseau, nouvel essai dans {delay}s… ({e})")
                time.sleep(delay)
                continue
            raise
        if r.status_code == 429 and attempt < len(delays):
            print(f"  [Brave] 429 Too Many Requests — attente {delay}s puis retry…")
            time.sleep(delay)
            continue
        return r
    return None

ROOT = Path(__file__).resolve().parent
REPO_ROOT = ROOT.parent


def load_env_files() -> None:
    """Charge .env.local puis .env à la racine du repo (sans écraser l'env existant)."""
    for name in (".env.local", ".env"):
        path = REPO_ROOT / name
        if not path.is_file():
            continue
        try:
            raw = path.read_text(encoding="utf-8")
        except OSError:
            continue
        for line in raw.splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, _, val = line.partition("=")
            key = key.strip()
            if not key or key in os.environ:
                continue
            val = val.strip()
            if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
                val = val[1:-1]
            os.environ[key] = val


def get_brave_api_key() -> str | None:
    load_env_files()
    key = os.environ.get("BRAVE_API_KEY", "").strip()
    return key or None


def fetch_brave_llm_context(query: str, api_key: str, timeout: int = 45) -> str:
    """
    Brave LLM Context : extraits pertinents par URL (pas de scrape local).
    Voir https://api-dashboard.search.brave.com/documentation/services/llm-context
    """
    if _BRAVE_LLM_CONTEXT_UNAVAILABLE:
        return ""

    q = clamp_brave_query(query)
    if not q:
        return ""

    # POST JSON : évite les URLs trop longues ; paramètres conservateurs (certains plans plafonnent les tokens).
    body = {
        "q": q,
        "country": "FR",
        "search_lang": "fr",
        "count": 10,
        "maximum_number_of_urls": 10,
        "maximum_number_of_tokens": 8192,
        "context_threshold_mode": "balanced",
    }
    try:
        r = _brave_request(
            "POST",
            BRAVE_LLM_CONTEXT_URL,
            api_key=api_key,
            json_body=body,
            timeout=timeout,
        )
        if r is None:
            return ""
        if r.status_code >= 400:
            if _disable_brave_llm_context_if_not_in_plan(r):
                return ""
            hint = (r.text or "")[:400].replace("\n", " ")
            print(f"  [Brave LLM Context] HTTP {r.status_code} — {hint or r.reason}")
            # Repli GET minimal (certains comptes n'acceptent que GET) — inutile si OPTION_NOT_IN_PLAN
            if r.status_code == 400:
                _throttle_brave()
                r2 = _brave_request(
                    "GET",
                    BRAVE_LLM_CONTEXT_URL,
                    api_key=api_key,
                    params={
                        "q": q,
                        "country": "FR",
                        "search_lang": "fr",
                        "count": 10,
                    },
                    timeout=timeout,
                )
                if r2 is None or r2.status_code >= 400:
                    if r2 is not None:
                        if _disable_brave_llm_context_if_not_in_plan(r2):
                            return ""
                        h2 = (r2.text or "")[:400].replace("\n", " ")
                        print(f"  [Brave LLM Context] GET fallback HTTP {r2.status_code} — {h2 or r2.reason}")
                    return ""
                r = r2
            else:
                return ""
        data = r.json()
    except requests.RequestException as e:
        print(f"  [Brave LLM Context] Erreur : {e}")
        return ""

    grounding = data.get("grounding") or {}
    generic = grounding.get("generic") or []
    parts: list[str] = []
    for i, item in enumerate(generic, 1):
        url = item.get("url") or ""
        title = item.get("title") or ""
        snippets = item.get("snippets") or []
        if not snippets and not title:
            continue
        block = f"[Source {i} — {title}]\n{url}\n" + "\n".join(snippets)
        parts.append(block)
    return "\n\n".join(parts)


def fetch_brave_web_search_context(query: str, api_key: str, timeout: int = 30) -> str:
    """
    Repli : Web Search avec extra_snippets.
    https://api-dashboard.search.brave.com/documentation/services/web-search
    """
    q = clamp_brave_query(query)
    if not q:
        return ""
    params = {
        "q": q,
        "country": "FR",
        "search_lang": "fr",
        "count": 8,
        "extra_snippets": "true",
    }
    try:
        r = _brave_request("GET", BRAVE_WEB_SEARCH_URL, api_key=api_key, params=params, timeout=timeout)
        if r is None:
            return ""
        if r.status_code >= 400:
            hint = (r.text or "")[:400].replace("\n", " ")
            print(f"  [Brave Web Search] HTTP {r.status_code} — {hint or r.reason}")
            return ""
        data = r.json()
    except requests.RequestException as e:
        print(f"  [Brave Web Search] Erreur : {e}")
        return ""

    web = data.get("web") or {}
    results = web.get("results") or []
    parts: list[str] = []
    for i, item in enumerate(results, 1):
        url = item.get("url") or ""
        title = item.get("title") or ""
        desc = item.get("description") or ""
        extra = item.get("extra_snippets") or []
        chunks = [desc] if desc else []
        chunks.extend(extra if isinstance(extra, list) else [])
        if not chunks:
            continue
        parts.append(f"[Source {i} — {title}]\n{url}\n" + "\n".join(chunks))
    return "\n\n".join(parts)


def fetch_page(url: str, timeout: int = 8) -> str:
    try:
        from bs4 import BeautifulSoup
    except ImportError:
        return ""
    try:
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        r = requests.get(url, headers=headers, timeout=timeout)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, "html.parser")
        for tag in soup(["script", "style", "nav", "footer", "header", "aside"]):
            tag.decompose()
        text = soup.get_text(separator=" ", strip=True)
        text = re.sub(r"\s+", " ", text)
        return text[:MAX_CHARS_LEGACY]
    except Exception:
        return ""


def search_ddg(query: str, max_results: int = MAX_RESULTS_LEGACY) -> list[dict]:
    try:
        try:
            from ddgs import DDGS
        except ImportError:
            from duckduckgo_search import DDGS
    except ImportError:
        print("  [DDG] Installez `ddgs` ou `duckduckgo-search`.")
        return []
    try:
        with DDGS() as ddgs:
            return list(ddgs.text(query, max_results=max_results, region="fr-fr"))
    except Exception as e:
        print(f"  [DDG] Erreur : {e}")
        return []


def _ddg_legal_bias_query(query: str) -> str:
    """Oriente les résultats vers des sources françaises plutôt que du bruit international."""
    q = query.strip()
    if not q:
        return q
    return (
        f"{q} (site:legifrance.gouv.fr OR site:service-public.fr "
        f"OR site:solidarites.gouv.fr OR site:ameli.fr OR site:interieur.gouv.fr)"
    )


def fetch_context_legacy_ddg_scrape(query: str) -> str:
    """Ancien pipeline : DDG + scrape BeautifulSoup."""
    results = search_ddg(_ddg_legal_bias_query(query))
    if not results:
        return ""
    context_parts = []
    for i, r in enumerate(results[:MAX_RESULTS_LEGACY], 1):
        url = r.get("href", "")
        snippet = r.get("body", "")
        print(f"  [{i}/{min(len(results), MAX_RESULTS_LEGACY)}] Scraping : {url[:70]}...")
        page_text = fetch_page(url)
        content = page_text if page_text else snippet
        if content:
            context_parts.append(f"[Source {i} — {url}]\n{content}")
    return "\n\n".join(context_parts)


def get_ollama_base_url() -> str:
    """Base HTTP pour /api/tags et /api/chat (OLLAMA_HOST ou dérivé de OLLAMA_URL)."""
    env = os.environ.get("OLLAMA_HOST", "").strip().rstrip("/")
    if env:
        return env
    u = OLLAMA_URL.rstrip("/")
    if "/api/chat" in u:
        return u.split("/api/chat", 1)[0].rstrip("/") or "http://localhost:11434"
    return "http://localhost:11434"


def check_ollama_reachable() -> tuple[bool, str]:
    """Vérifie qu'Ollama répond avant de consommer des quotas Brave."""
    base = get_ollama_base_url()
    url = f"{base}/api/tags"
    try:
        r = requests.get(url, timeout=5)
        if r.status_code == 200:
            return True, base
        return False, f"HTTP {r.status_code} sur {url}"
    except requests.RequestException as e:
        return False, str(e)


def synthesis_failed(text: str) -> bool:
    """True si call_ollama n'a pas produit une synthèse exploitable."""
    t = (text or "").strip()
    if not t:
        return True
    if t.startswith("[Erreur Ollama"):
        return True
    if "HTTPConnectionPool" in t and "11434" in t:
        return True
    if "Failed to establish a new connection" in t:
        return True
    return False


def call_ollama(prompt: str, stream: bool = True) -> str:
    payload = {
        "model": MODEL,
        "messages": [{"role": "user", "content": prompt}],
        "stream": stream,
        "options": {"temperature": 0.3},
    }
    try:
        if stream:
            response = requests.post(OLLAMA_URL, json=payload, stream=True, timeout=300)
            response.raise_for_status()
            result = []
            for line in response.iter_lines():
                if line:
                    chunk = json.loads(line)
                    token = chunk.get("message", {}).get("content", "")
                    if token:
                        result.append(token)
                        print(token, end="", flush=True)
            print()
            return "".join(result)
        response = requests.post(OLLAMA_URL, json=payload, timeout=300)
        response.raise_for_status()
        return response.json()["message"]["content"]
    except Exception as e:
        return f"[Erreur Ollama : {e}]"


def sector_module_name(sector_key: str) -> str:
    return sector_key.replace("-", "_")


def load_sector(sector_key: str):
    mod_name = sector_module_name(sector_key)
    path = ROOT / "queries" / f"{mod_name}.py"
    if not path.is_file():
        print(f"Secteur inconnu : {sector_key!r} (fichier attendu : {path})")
        print("Secteurs disponibles : securite-privee, creches, ehpad, ambulances")
        sys.exit(1)
    spec = importlib.util.spec_from_file_location(f"queries_{mod_name}", path)
    mod = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(mod)
    return mod


def research_one(
    focus: str,
    query: str,
    prompt_template: str,
    *,
    brave_key: str | None,
    force_ddg: bool,
) -> tuple[str, str, bool]:
    """
    Retourne (contenu synthétisé, libellé source pour métadonnées fiche .md, succès).
    Si succès est False, l'appelant ne doit pas écrire le .md (fiche à refaire).
    """
    context = ""
    source_note = "Brave Web Search"

    if force_ddg:
        print(f"\n  → Recherche (mode legacy DDG+scrape) : {query[:60]}...")
        context = fetch_context_legacy_ddg_scrape(query)
        source_note = "DuckDuckGo + scrape"
    elif brave_key:
        if _BRAVE_LLM_CONTEXT_UNAVAILABLE:
            print(f"\n  → Brave Web Search : {query[:60]}...")
            context = fetch_brave_web_search_context(query, brave_key)
            source_note = "Brave Web Search"
        else:
            print(f"\n  → Brave LLM Context : {query[:60]}...")
            context = fetch_brave_llm_context(query, brave_key)
            if context.strip():
                source_note = "Brave LLM Context"
            else:
                print("  Contexte vide — repli Brave Web Search (extra_snippets)...")
                context = fetch_brave_web_search_context(query, brave_key)
                source_note = "Brave Web Search"
        if not context.strip():
            print("  Toujours vide — repli DDG + scrape si disponible...")
            context = fetch_context_legacy_ddg_scrape(query)
            source_note = "DuckDuckGo + scrape (repli)"
    else:
        print("\n  Erreur : BRAVE_API_KEY manquante. Définissez-la ou utilisez --fallback-ddg.")
        return "[Aucune clé Brave : configurez BRAVE_API_KEY dans .env.local ou l'environnement.]", "—", False

    if not context.strip():
        return "[Aucun résultat de recherche.]", source_note, False

    prompt = prompt_template.format(focus=focus, context=context[:CONTEXT_CHAR_BUDGET])

    print(f"  → Synthèse avec Ollama ({MODEL})...")
    text = call_ollama(prompt, stream=True)
    if synthesis_failed(text):
        print(
            "\n  Échec synthèse Ollama — fiche non enregistrée. "
            f"Vérifiez que Ollama tourne ({get_ollama_base_url()}) et que le modèle « {MODEL} » est disponible (`ollama pull {MODEL}`)."
        )
        return text, source_note, False
    return text, source_note, True


def save_result(
    output_dir: Path,
    slug: str,
    title: str,
    content: str,
    query: str,
    source_note: str,
) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    filepath = output_dir / f"{slug}.md"
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(f"# {title}\n\n")
        f.write(
            f"_Recherche : {timestamp} | Modèle : {MODEL} | Sources : {source_note} | Requête : `{query}`_\n\n"
        )
        f.write("---\n\n")
        f.write(content)
        f.write("\n")
    print(f"  ✓ Sauvegardé : {filepath.relative_to(ROOT)}")


def parse_args():
    p = argparse.ArgumentParser(description="Deep research réglementaire par secteur")
    p.add_argument(
        "sector",
        nargs="?",
        default="securite-privee",
        help="securite-privee | creches | ehpad | ambulances",
    )
    p.add_argument(
        "slug_prefix",
        nargs="?",
        default=None,
        help="Optionnel : ex. 01 pour ne lancer qu'une fiche",
    )
    p.add_argument(
        "--fallback-ddg",
        action="store_true",
        help="Ne pas appeler Brave : ancien flux DuckDuckGo + scraping (sans BRAVE_API_KEY).",
    )
    p.add_argument(
        "--skip-ollama-check",
        action="store_true",
        help="Ne pas vérifier GET /api/tags avant la boucle (déconseillé).",
    )
    return p.parse_args()


def run():
    args = parse_args()
    sector_key = args.sector.strip().lower()
    mod = load_sector(sector_key)

    brave_key = None if args.fallback_ddg else get_brave_api_key()
    if not args.fallback_ddg and not brave_key:
        print(
            "\nBRAVE_API_KEY introuvable. Ajoutez-la dans `.env.local` à la racine du projet "
            "ou exportez-la dans l'environnement.\n"
            "Ou lancez avec --fallback-ddg pour l'ancien mode DuckDuckGo.\n"
        )
        sys.exit(1)

    output_subdir = getattr(mod, "OUTPUT_SUBDIR", sector_key.replace("-", "_"))
    output_dir = ROOT / output_subdir
    queries = mod.QUERIES
    prompt_template = mod.PROMPT_INSTRUCTIONS

    slug_filter = args.slug_prefix
    if slug_filter:
        todo = [q for q in queries if q["slug"].startswith(slug_filter)]
        if not todo:
            print(f"Aucune requête dont le slug commence par {slug_filter!r}")
            sys.exit(1)
    else:
        todo = [q for q in queries if not (output_dir / f"{q['slug']}.md").exists()]

    done_before = len(queries) - len(todo) if not slug_filter else 0

    print("\n" + "=" * 60)
    print(f" Deep Research — {getattr(mod, 'SECTOR_LABEL', sector_key)}")
    mode = "Brave API + Ollama" if not args.fallback_ddg else "DDG legacy + Ollama"
    print(f" Pipeline : {mode} | Modèle local : {MODEL} | Sortie : {output_dir.name}/")
    print("=" * 60)

    if not slug_filter and done_before:
        print(f"\n{done_before} recherche(s) déjà présentes, reprise des manquantes.\n")

    if not todo:
        print(f"\nRien à faire — {len(queries)} fiches déjà dans {output_dir}")
        return

    if not args.fallback_ddg and not args.skip_ollama_check:
        ok, detail = check_ollama_reachable()
        if not ok:
            print(
                f"\nOllama ne répond pas ({detail}).\n"
                f"  Attendu : {get_ollama_base_url()} (API /api/chat pour le modèle « {MODEL} »).\n"
                "  Démarrez Ollama, puis `ollama pull " + MODEL + "` si besoin.\n"
                "  Option : --skip-ollama-check pour ignorer ce test (les fiches échoueront quand même sans serveur).\n"
            )
            sys.exit(1)

    for i, item in enumerate(todo, 1):
        print(f"\n{'─' * 60}")
        print(f"[{i}/{len(todo)}] {item['title']}")

        result, source_note, ok = research_one(
            focus=item["focus"],
            query=item["query"],
            prompt_template=prompt_template,
            brave_key=brave_key,
            force_ddg=args.fallback_ddg,
        )
        if ok:
            save_result(output_dir, item["slug"], item["title"], result, item["query"], source_note)
        else:
            print("  [X] Fiche non écrite — corrigez le problème puis relancez (ex. `python research.py creches 11`).")
            sys.exit(1)

        if i < len(todo):
            pause = BRAVE_BETWEEN_FICHES_S if not args.fallback_ddg else 3.0
            print(f"  Pause {pause:.0f}s (évite 429 Brave / surcharge)…")
            time.sleep(pause)

    total = len(list(output_dir.glob("*.md")))
    print(f"\n{'=' * 60}")
    print(f" Terminé — {total}/{len(queries)} fiches dans : {output_dir}")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    if len(sys.argv) == 2 and sys.argv[1].startswith(("0", "1", "2")) and "-" not in sys.argv[1]:
        sys.argv = [sys.argv[0], "securite-privee", sys.argv[1]]
    run()
