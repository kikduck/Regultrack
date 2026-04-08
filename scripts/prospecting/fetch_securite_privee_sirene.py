#!/usr/bin/env python3
"""
Export d'entreprises par code NAF via l'API « Recherche d'entreprises » (api.gouv.fr).

Pour une gestion multi-secteurs : préférer `fetch_sector_prospects.py` + `sectors.json`.

Exemples :
  python scripts/prospecting/fetch_securite_privee_sirene.py --out data/prospects_securite_8010z.csv
  python scripts/prospecting/fetch_securite_privee_sirene.py --activite 88.91A --out data/prospects_creches_8891a.csv

Dépendances : Python 3.10+ (stdlib uniquement).
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

from sirene_api import TRANCHES_10_PLUS, collect_naf, DEFAULT_UA, write_csv


def main() -> int:
    p = argparse.ArgumentParser(description="Export entreprises par NAF via API Recherche d'entreprises")
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
    p.add_argument("--per-page", type=int, default=25)
    p.add_argument("--max-pages", type=int, default=0)
    p.add_argument("--user-agent", default=DEFAULT_UA)
    p.add_argument("--delay", type=float, default=0.2)
    args = p.parse_args()

    tranches = [t.strip() for t in args.tranches.split(",") if t.strip()]
    if not tranches:
        tranches = [""]

    seen: set[str] = set()
    rows = collect_naf(
        activite=args.activite,
        tranches=tranches,
        per_page=args.per_page,
        max_pages=args.max_pages,
        user_agent=args.user_agent,
        delay_s=args.delay,
        already_seen=seen,
    )
    write_csv(args.out, rows)
    print(f"Écrit {len(rows)} lignes dans {args.out}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
