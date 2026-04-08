#!/usr/bin/env python3
"""
Export CSV par secteur à partir de scripts/prospecting/sectors.json.

  python fetch_sector_prospects.py --list
  python fetch_sector_prospects.py --sector ehpad
  python fetch_sector_prospects.py --all

Les fichiers sont écrits dans data/<csv_filename> (voir le registre).
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

from sirene_api import TRANCHES_10_PLUS, collect_naf, DEFAULT_UA, write_csv


def load_registry(path: Path) -> dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    return data["sectors"], data.get("defaults", {})


def main() -> int:
    root = Path(__file__).resolve().parents[2]
    reg_path = Path(__file__).resolve().parent / "sectors.json"
    sectors, defaults = load_registry(reg_path)

    p = argparse.ArgumentParser(description="Export prospects par secteur (API Recherche d'entreprises)")
    p.add_argument("--list", action="store_true", help="Lister les identifiants de secteurs")
    p.add_argument("--sector", type=str, default="", help="Identifiant secteur (clé dans sectors.json)")
    p.add_argument("--all", action="store_true", help="Enchaîner tous les secteurs du registre")
    p.add_argument("--registry", type=Path, default=reg_path)
    p.add_argument("--data-dir", type=Path, default=root / "data")
    p.add_argument("--per-page", type=int, default=25)
    p.add_argument("--max-pages", type=int, default=0, help="Limite pages par tranche et par NAF (0 = illimité)")
    p.add_argument("--delay", type=float, default=0.2)
    p.add_argument("--user-agent", default=DEFAULT_UA)
    args = p.parse_args()

    if args.list:
        for sid, cfg in sectors.items():
            nafs = ", ".join(cfg["naf_codes"])
            print(f"  {sid:28}  {cfg['label'][:50]}  [{nafs}]")
        return 0

    tranches = defaults.get("tranches_effectif") or list(TRANCHES_10_PLUS)
    tranches = [str(t) for t in tranches]

    def run_one(sid: str) -> None:
        if sid not in sectors:
            print(f"Secteur inconnu : {sid}", file=sys.stderr)
            raise SystemExit(1)
        cfg = sectors[sid]
        out = args.data_dir / cfg["csv_filename"]
        seen: set[str] = set()
        all_rows: list[dict] = []
        for naf in cfg["naf_codes"]:
            print(f"Secteur « {cfg['label']} » — NAF {naf}", file=sys.stderr)
            part = collect_naf(
                activite=naf,
                tranches=tranches,
                per_page=args.per_page,
                max_pages=args.max_pages,
                user_agent=args.user_agent,
                delay_s=args.delay,
                already_seen=seen,
            )
            all_rows.extend(part)
        write_csv(out, all_rows)
        print(f"Écrit {len(all_rows)} lignes dans {out}", file=sys.stderr)

    if args.all:
        for sid in sectors:
            run_one(sid)
        return 0
    if args.sector:
        run_one(args.sector)
        return 0

    p.print_help()
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
