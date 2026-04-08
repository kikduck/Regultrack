#!/usr/bin/env python3
"""
Export d'entreprises NAF 80.10Z (activités de sécurité privée) via l'API publique
« Recherche d'entreprises » (api.gouv.fr).

Alternative recommandée au scraping du site Pappers : pas de session navigateur,
CGU respectées, rate limit documenté (7 req/s max — on reste en dessous).

Usage:
  python fetch_securite_privee_sirene.py --out ../../data/prospects_securite_8010z.jsonl

Dépendances: Python 3.10+ (stdlib uniquement).
"""

from __future__ import annotations

import argparse
import csv
import json
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

API_BASE = "https://recherche-entreprises.api.gouv.fr/search"
# User-Agent explicite recommandé par l'API
DEFAULT_UA = "RegultrackProspecting/1.0 (prospection interne; contact entreprise à renseigner)"

# Tranches effectif salarié INSEE (niveau unité légale). Exclut micro-tranches si seuil "10+".
# Réf. nomenclature : https://www.sirene.fr/static-resources/documentation/v_sommaire_311.htm
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


def main() -> int:
    p = argparse.ArgumentParser(description="Export NAF 80.10Z via API Recherche d'entreprises")
    p.add_argument(
        "--out",
        type=Path,
        default=Path("data/prospects_securite_8010z.jsonl"),
        help="Fichier sortie (.jsonl ou .csv selon l'extension)",
    )
    p.add_argument("--activite", default="80.10Z", help="Code NAF / APE principal")
    p.add_argument(
        "--tranches",
        default=",".join(TRANCHES_10_PLUS),
        help="Tranches effectif INSEE, séparées par virgule (vide = toutes)",
    )
    p.add_argument("--per-page", type=int, default=25, help="Résultats par page (max API)")
    p.add_argument("--max-pages", type=int, default=0, help="Limite pages par tranche (0 = illimité)")
    p.add_argument("--user-agent", default=DEFAULT_UA)
    p.add_argument("--delay", type=float, default=0.2, help="Pause entre requêtes (secondes)")
    args = p.parse_args()

    tranches = [t.strip() for t in args.tranches.split(",") if t.strip()]
    if not tranches:
        tranches = [""]  # une passe sans filtre tranche

    args.out.parent.mkdir(parents=True, exist_ok=True)
    seen: set[str] = set()
    rows: list[dict] = []

    for tranche in tranches:
        page = 1
        total_pages = 1
        label = tranche or "(sans filtre tranche)"
        print(f"Tranche {label} …", file=sys.stderr)
        while page <= total_pages:
            data = fetch_page(
                activite=args.activite,
                tranche=tranche or None,
                page=page,
                per_page=args.per_page,
                user_agent=args.user_agent,
                min_delay_s=args.delay,
            )
            total_pages = int(data.get("total_pages") or 1)
            if args.max_pages:
                total_pages = min(total_pages, args.max_pages)
            for r in data.get("results") or []:
                siren = str(r.get("siren") or "")
                if not siren or siren in seen:
                    continue
                seen.add(siren)
                rows.append(row_from_result(r))
            print(f"  page {page}/{total_pages} — cumul {len(seen)} unités légales", file=sys.stderr)
            page += 1
            time.sleep(args.delay)

    suffix = args.out.suffix.lower()
    if suffix == ".csv":
        if not rows:
            args.out.write_text("", encoding="utf-8")
            return 0
        with args.out.open("w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
            w.writeheader()
            w.writerows(rows)
    else:
        with args.out.open("w", encoding="utf-8") as f:
            for row in rows:
                f.write(json.dumps(row, ensure_ascii=False) + "\n")

    print(f"Écrit {len(rows)} lignes dans {args.out}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
