"""
Client minimal pour l'API Recherche d'entreprises (api.gouv.fr).
Utilisé par fetch_securite_privee_sirene.py et fetch_sector_prospects.py.
"""

from __future__ import annotations

import csv
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

API_BASE = "https://recherche-entreprises.api.gouv.fr/search"
DEFAULT_UA = "RegultrackProspecting/1.0 (prospection interne; contact entreprise à renseigner)"

# Tranches effectif 10+ salariés (niveau unité légale INSEE)
TRANCHES_10_PLUS = ("11", "12", "22", "31", "32", "41", "42", "51", "52", "53")


def fetch_page(
    *,
    activite: str,
    tranche: str | None,
    page: int,
    per_page: int,
    user_agent: str,
    min_delay_s: float,
) -> dict:
    params: dict[str, str] = {
        "activite_principale": activite,
        "page": str(page),
        "per_page": str(per_page),
    }
    if tranche:
        params["tranche_effectif_salarie"] = tranche

    url = f"{API_BASE}?{urllib.parse.urlencode(params)}"
    req = urllib.request.Request(url, headers={"User-Agent": user_agent})

    last_err: Exception | None = None
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=60) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if e.code == 429 and "Retry-After" in e.headers:
                wait = float(e.headers["Retry-After"])
                time.sleep(max(wait, min_delay_s))
                last_err = e
                continue
            if e.code == 429:
                time.sleep(2.0 * (attempt + 1))
                last_err = e
                continue
            raise
        except OSError as e:
            last_err = e
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError(f"Échec après plusieurs tentatives : {last_err}") from last_err


def row_from_result(r: dict) -> dict:
    siege = r.get("siege") or {}
    dirigeants = r.get("dirigeants") or []
    noms_dir = []
    for d in dirigeants if isinstance(dirigeants, list) else []:
        if isinstance(d, dict):
            nom = d.get("nom") or d.get("nom_complet") or d.get("type_dirigeant")
            if nom:
                noms_dir.append(str(nom))
    return {
        "siren": r.get("siren"),
        "nom_complet": r.get("nom_complet"),
        "activite_principale": r.get("activite_principale"),
        "tranche_effectif_salarie": r.get("tranche_effectif_salarie"),
        "categorie_entreprise": r.get("categorie_entreprise"),
        "nombre_etablissements_ouverts": r.get("nombre_etablissements_ouverts"),
        "siege_adresse": siege.get("geo_adresse") or siege.get("adresse"),
        "siege_code_postal": siege.get("code_postal"),
        "siege_commune": siege.get("libelle_commune"),
        "siege_departement": siege.get("departement"),
        "dirigeants": " | ".join(noms_dir) if noms_dir else "",
    }


def collect_naf(
    *,
    activite: str,
    tranches: list[str],
    per_page: int,
    max_pages: int,
    user_agent: str,
    delay_s: float,
    already_seen: set[str],
) -> list[dict]:
    """Récupère toutes les pages pour chaque tranche ; déduplique par SIREN avec already_seen."""
    rows: list[dict] = []
    for tranche in tranches:
        page = 1
        total_pages = 1
        label = tranche or "(sans filtre tranche)"
        print(f"  NAF {activite} — tranche {label} …", file=sys.stderr)
        while page <= total_pages:
            data = fetch_page(
                activite=activite,
                tranche=tranche or None,
                page=page,
                per_page=per_page,
                user_agent=user_agent,
                min_delay_s=delay_s,
            )
            total_pages = int(data.get("total_pages") or 1)
            if max_pages:
                total_pages = min(total_pages, max_pages)
            for r in data.get("results") or []:
                siren = str(r.get("siren") or "")
                if not siren or siren in already_seen:
                    continue
                already_seen.add(siren)
                rows.append(row_from_result(r))
            print(f"    page {page}/{total_pages} — cumul secteur {len(already_seen)} UL", file=sys.stderr)
            page += 1
            time.sleep(delay_s)
    return rows


def write_csv(path: Path, rows: list[dict]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    suffix = path.suffix.lower()
    if suffix == ".csv":
        if not rows:
            path.write_text("", encoding="utf-8")
            return
        with path.open("w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
            w.writeheader()
            w.writerows(rows)
    else:
        with path.open("w", encoding="utf-8") as f:
            for row in rows:
                f.write(json.dumps(row, ensure_ascii=False) + "\n")
