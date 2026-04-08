#!/usr/bin/env python3
"""
Exporte un fichier Excel (.xlsx) par secteur : colonnes du CSV prospect enrichies pour la lecture humaine
+ « Secteur » et « Segment client » (seuil minimal / cœur de cible / plafond bootstrap / hors segment).

Valeurs détaillées dans l’Excel (pas seulement les codes bruts) :
  - tranche d’effectif : « Code tranche effectif (INSEE) » + « Tranche effectif salarié » (libellé INSEE) ;
  - catégorie d’entreprise : code PME/ETI/GE + libellé complet.

  python scripts/prospecting/export_prospects_segments_xlsx.py --sector creches
  python scripts/prospecting/export_prospects_segments_xlsx.py --all

Dépendance : openpyxl (pip install openpyxl)
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import pandas as pd

from sector_stats import (
    CATEGORIE_ENTREPRISE_LABELS,
    TRANCHE_EFFECTIF_SALARIE_LABELS,
    segment_client_labels,
    tranche_effectif_codes_for_label_map,
)


def load_sectors_config(reg_path: Path) -> dict:
    data = json.loads(reg_path.read_text(encoding="utf-8"))
    return data["sectors"]


def humanize_columns_for_xlsx(df: pd.DataFrame) -> pd.DataFrame:
    """
    Remplace les codes bruts par des colonnes lisibles pour l’export Excel :
    tranche d’effectif INSEE (code + libellé), catégorie d’entreprise (code + libellé).
    """
    out = df.copy()
    col_order: list[str] = []
    for c in df.columns:
        if c == "tranche_effectif_salarie":
            codes = tranche_effectif_codes_for_label_map(out[c])
            out["Code tranche effectif (INSEE)"] = out[c]
            out["Tranche effectif salarié"] = codes.map(TRANCHE_EFFECTIF_SALARIE_LABELS).fillna("(autre)")
            col_order.extend(["Code tranche effectif (INSEE)", "Tranche effectif salarié"])
            continue
        if c == "categorie_entreprise":
            out["Catégorie entreprise (code)"] = out[c]
            ce = out[c]
            out["Catégorie entreprise (libellé)"] = ce.map(CATEGORIE_ENTREPRISE_LABELS).fillna(ce.astype(str))
            col_order.extend(["Catégorie entreprise (code)", "Catégorie entreprise (libellé)"])
            continue
        col_order.append(c)
    drop_old = [c for c in ("tranche_effectif_salarie", "categorie_entreprise") if c in out.columns]
    out.drop(columns=drop_old, inplace=True)
    return out[col_order]


def export_sector(
    root: Path,
    sector_id: str,
    cfg: dict,
    out_dir: Path,
) -> Path | None:
    csv_path = root / "data" / cfg["csv_filename"]
    if not csv_path.is_file():
        return None

    df = pd.read_csv(
        csv_path,
        dtype={"siren": str, "siege_code_postal": str, "siege_departement": str},
    )
    label = cfg.get("label", sector_id)
    seg = segment_client_labels(sector_id, df)

    out = humanize_columns_for_xlsx(df)
    out.insert(0, "Segment client", seg)
    out.insert(0, "Secteur", label)

    out_dir.mkdir(parents=True, exist_ok=True)
    safe_id = sector_id.replace("/", "-")
    xlsx_path = out_dir / f"prospects_{safe_id}_segments.xlsx"
    out.to_excel(xlsx_path, index=False, sheet_name="Prospects", engine="openpyxl")
    return xlsx_path


def main() -> int:
    here = Path(__file__).resolve().parent
    root = here.parents[1]
    reg = here / "sectors.json"

    p = argparse.ArgumentParser(description="Export XLSX prospects + colonnes Secteur et Segment client")
    p.add_argument("--sector", metavar="ID", help="Identifiant sectors.json (ex. creches)")
    p.add_argument("--all", action="store_true", help="Tous les secteurs du registre")
    p.add_argument(
        "--out-dir",
        type=Path,
        default=root / "data" / "prospects_segments_xlsx",
        help="Dossier de sortie (défaut: data/prospects_segments_xlsx)",
    )
    args = p.parse_args()

    if not args.all and not args.sector:
        p.error("Indiquez --sector <id> ou --all")

    sectors = load_sectors_config(reg)

    try:
        import openpyxl  # noqa: F401
    except ImportError:
        print("Installez openpyxl : pip install openpyxl", file=sys.stderr)
        return 1

    ids = list(sectors.keys()) if args.all else [args.sector]
    for sid in ids:
        if sid not in sectors:
            print(f"Secteur inconnu : {sid!r} (utilisez fetch_sector_prospects.py --list)", file=sys.stderr)
            return 1

    written: list[Path] = []
    missing: list[str] = []
    for sid in ids:
        path = export_sector(root, sid, sectors[sid], args.out_dir)
        if path is None:
            missing.append(sectors[sid]["csv_filename"])
        else:
            written.append(path)

    for path in written:
        print(path)
    if missing:
        print("CSV absents (export ignoré) :", ", ".join(missing), file=sys.stderr)
        return 1 if not written else 0

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
