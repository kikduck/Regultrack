# -*- coding: utf-8 -*-
"""
Deep research réglementaire par secteur — DuckDuckGo → scraping → Ollama.

Usage :
  python research.py                      # défaut : sécurité privée
  python research.py securite-privee      # explicite
  python research.py creches
  python research.py ehpad
  python research.py ambulances
  python research.py creches 01           # une seule fiche (slug commence par 01)

Les définitions de requêtes sont dans queries/<secteur>.py (underscore à la place des tirets).
Les sorties .md vont dans <dossier_secteur>/ (ex. securite-privee/, creches/).
"""

import argparse
import importlib.util
import json
import re
import sys
import time
from datetime import datetime
from pathlib import Path

import requests
from bs4 import BeautifulSoup
from duckduckgo_search import DDGS

# ──────────────────────────────────────────────
OLLAMA_URL = "http://localhost:11434/api/chat"
MODEL = "gemma4:26b"
MAX_RESULTS = 6
MAX_CHARS = 1200
# ──────────────────────────────────────────────

ROOT = Path(__file__).resolve().parent


def sector_module_name(sector_key: str) -> str:
    """securite-privee → securite_privee"""
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


def fetch_page(url: str, timeout: int = 8) -> str:
    try:
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        r = requests.get(url, headers=headers, timeout=timeout)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, "html.parser")
        for tag in soup(["script", "style", "nav", "footer", "header", "aside"]):
            tag.decompose()
        text = soup.get_text(separator=" ", strip=True)
        text = re.sub(r"\s+", " ", text)
        return text[:MAX_CHARS]
    except Exception:
        return ""


def search_ddg(query: str, max_results: int = MAX_RESULTS) -> list[dict]:
    try:
        with DDGS() as ddgs:
            return list(ddgs.text(query, max_results=max_results, region="fr-fr"))
    except Exception as e:
        print(f"  [DDG] Erreur : {e}")
        return []


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


def research_one(focus: str, query: str, prompt_template: str) -> str:
    print(f"\n  → Recherche DuckDuckGo : {query[:60]}...")
    results = search_ddg(query)

    if not results:
        print("  Aucun résultat DDG.")
        return "[Aucun résultat de recherche.]"

    context_parts = []
    for i, r in enumerate(results[:MAX_RESULTS], 1):
        url = r.get("href", "")
        snippet = r.get("body", "")
        print(f"  [{i}/{len(results[:MAX_RESULTS])}] Scraping : {url[:60]}...")
        page_text = fetch_page(url)
        content = page_text if page_text else snippet
        if content:
            context_parts.append(f"[Source {i} — {url}]\n{content}")

    context = "\n\n".join(context_parts)
    prompt = prompt_template.format(focus=focus, context=context[:12000])

    print(f"  → Synthèse avec {MODEL}...")
    return call_ollama(prompt, stream=True)


def save_result(output_dir: Path, slug: str, title: str, content: str, query: str) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M")
    filepath = output_dir / f"{slug}.md"
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(f"# {title}\n\n")
        f.write(f"_Recherche : {timestamp} | Modèle : {MODEL} | Requête DDG : `{query}`_\n\n")
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
    return p.parse_args()


def run():
    args = parse_args()
    sector_key = args.sector.strip().lower()
    mod = load_sector(sector_key)

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
    print(f" Modèle : {MODEL} | Sortie : {output_dir.name}/")
    print("=" * 60)

    if not slug_filter and done_before:
        print(f"\n{done_before} recherche(s) déjà présentes, reprise des manquantes.\n")

    if not todo:
        print(f"\nRien à faire — {len(queries)} fiches déjà dans {output_dir}")
        return

    for i, item in enumerate(todo, 1):
        print(f"\n{'─' * 60}")
        print(f"[{i}/{len(todo)}] {item['title']}")

        result = research_one(
            focus=item["focus"],
            query=item["query"],
            prompt_template=prompt_template,
        )
        save_result(output_dir, item["slug"], item["title"], result, item["query"])

        if i < len(todo):
            print("  Pause 3s...")
            time.sleep(3)

    total = len(list(output_dir.glob("*.md")))
    print(f"\n{'=' * 60}")
    print(f" Terminé — {total}/{len(queries)} fiches dans : {output_dir}")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    # Compat : ancien usage `python research.py 01` sans secteur → sécurité privée
    if len(sys.argv) == 2 and sys.argv[1].startswith(("0", "1", "2")) and "-" not in sys.argv[1]:
        sys.argv = [sys.argv[0], "securite-privee", sys.argv[1]]
    run()
