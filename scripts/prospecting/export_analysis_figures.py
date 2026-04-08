#!/usr/bin/env python3
"""
Régénère les PNG d'analyse prospection (même logique que les notebooks sous notebooks/).

Usage (depuis la racine du dépôt) :
  python scripts/prospecting/export_analysis_figures.py
  python scripts/prospecting/export_analysis_figures.py --sector ehpad
  python scripts/prospecting/export_analysis_figures.py --all-sectors
  python scripts/prospecting/export_analysis_figures.py --csv data/x.csv --out-dir docs/assets/y
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import pandas as pd  # noqa: E402

TRANCHE_LABELS = {
    "NN": "Non employeuse / non renseigné",
    "00": "0 salarié",
    "01": "1 ou 2",
    "02": "3 à 5",
    "03": "6 à 9",
    "11": "10 à 19",
    "12": "20 à 49",
    "22": "50 à 99",
    "31": "100 à 199",
    "32": "200 à 249",
    "41": "250 à 499",
    "42": "500 à 999",
    "51": "1 000 à 1 999",
    "52": "2 000 à 4 999",
    "53": "5 000 et plus",
}


def export_figures(csv_path: Path, out_dir: Path) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)

    df = pd.read_csv(
        csv_path,
        dtype={"siren": str, "siege_code_postal": str, "siege_departement": str},
    )

    vc_t = df["tranche_effectif_salarie"].value_counts().sort_index()
    tbl = vc_t.rename("nombre").reset_index()
    tbl.columns = ["tranche_code", "nombre"]
    tbl["tranche_code"] = tbl["tranche_code"].astype(str)

    plot_tbl = tbl.sort_values("nombre", ascending=True)
    codes = plot_tbl["tranche_code"]
    y_labels = [f"{c} — {TRANCHE_LABELS.get(c, c)}" for c in codes]
    fig_h = max(4.0, 0.38 * len(plot_tbl))
    fig, ax = plt.subplots(figsize=(10, fig_h))
    bars = ax.barh(range(len(plot_tbl)), plot_tbl["nombre"].values, color="steelblue", edgecolor="white")
    ax.set_yticks(range(len(plot_tbl)))
    ax.set_yticklabels(y_labels, fontsize=9)
    ax.set_xlabel("Nombre d'unités légales")
    ax.set_title("Répartition par tranche d'effectif (INSEE)")
    ax.bar_label(bars, labels=[str(int(v)) for v in plot_tbl["nombre"].values], padding=3, fontsize=8)
    plt.tight_layout()
    fig.savefig(out_dir / "tranches-effectif.png", dpi=120, bbox_inches="tight")
    plt.close()

    vc_cat = df["categorie_entreprise"].fillna("(non renseigné)").value_counts()
    fig, ax = plt.subplots(figsize=(6, 4))
    vc_cat.plot(kind="bar", ax=ax, color="darkseagreen", edgecolor="white")
    ax.set_ylabel("Nombre")
    ax.set_xlabel("Catégorie")
    ax.set_title("Catégorie d'entreprise")
    plt.xticks(rotation=0)
    plt.tight_layout()
    fig.savefig(out_dir / "categorie-entreprise.png", dpi=120, bbox_inches="tight")
    plt.close()

    dept = df["siege_departement"].fillna("(manquant)").astype(str).str.zfill(2)
    vc_dept = dept.value_counts().head(20)
    fig, ax = plt.subplots(figsize=(10, 5))
    vc_dept.plot(kind="barh", ax=ax, color="coral", edgecolor="white")
    ax.invert_yaxis()
    ax.set_xlabel("Nombre d'entreprises")
    ax.set_ylabel("Département")
    ax.set_title("Top 20 départements (siège)")
    plt.tight_layout()
    fig.savefig(out_dir / "top20-departements.png", dpi=120, bbox_inches="tight")
    plt.close()

    neo = pd.to_numeric(df["nombre_etablissements_ouverts"], errors="coerce")
    fig, ax = plt.subplots(figsize=(8, 4))
    nunique = int(neo.dropna().nunique())
    bins = min(40, max(10, nunique))
    neo.dropna().clip(upper=neo.quantile(0.99)).hist(ax=ax, bins=bins, color="mediumpurple", edgecolor="white")
    ax.set_xlabel("Établissements ouverts (tronqué au 99e percentile)")
    ax.set_ylabel("Effectif")
    ax.set_title("Distribution du nombre d'établissements ouverts")
    plt.tight_layout()
    fig.savefig(out_dir / "etablissements-ouverts.png", dpi=120, bbox_inches="tight")
    plt.close()


def load_sectors(registry: Path) -> dict:
    data = json.loads(registry.read_text(encoding="utf-8"))
    return data["sectors"]


def main() -> int:
    root = Path(__file__).resolve().parents[2]
    reg = Path(__file__).resolve().parent / "sectors.json"
    p = argparse.ArgumentParser(description="Export PNG analyse prospection depuis un CSV Sirene/API")
    p.add_argument("--sector", type=str, default="", help="Identifiant secteur (sectors.json)")
    p.add_argument("--all-sectors", action="store_true", help="Tous les secteurs dont le CSV existe")
    p.add_argument(
        "--csv",
        type=Path,
        default=None,
        help="Chemin du CSV (prioritaire sur --sector)",
    )
    p.add_argument(
        "--out-dir",
        type=Path,
        default=None,
        help="Dossier de sortie (prioritaire sur --sector)",
    )
    args = p.parse_args()

    def run_one(csv_path: Path, out_dir: Path) -> int:
        csv_path = csv_path if csv_path.is_absolute() else root / csv_path
        out_dir = out_dir if out_dir.is_absolute() else root / out_dir
        if not csv_path.is_file():
            print(f"CSV introuvable : {csv_path}", file=sys.stderr)
            return 1
        export_figures(csv_path, out_dir)
        print(f"Figures écrites dans {out_dir}")
        return 0

    if args.csv is not None and args.out_dir is not None:
        return run_one(args.csv, args.out_dir)

    if args.sector:
        sectors = load_sectors(reg)
        if args.sector not in sectors:
            print(f"Secteur inconnu : {args.sector}", file=sys.stderr)
            return 1
        cfg = sectors[args.sector]
        return run_one(root / "data" / cfg["csv_filename"], root / "docs" / "assets" / cfg["assets_subdir"])

    if args.all_sectors:
        sectors = load_sectors(reg)
        code = 0
        for sid, cfg in sectors.items():
            csv_path = root / "data" / cfg["csv_filename"]
            if not csv_path.is_file():
                print(f"[skip] {sid} — pas de fichier {csv_path.name}", file=sys.stderr)
                continue
            r = run_one(csv_path, root / "docs" / "assets" / cfg["assets_subdir"])
            if r != 0:
                code = r
        return code

    # défaut historique
    csv_d = root / "data" / "prospects_securite_8010z.csv"
    out_d = root / "docs" / "assets" / "prospects-analysis"
    return run_one(csv_d, out_d)


if __name__ == "__main__":
    raise SystemExit(main())
