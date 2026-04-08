#!/usr/bin/env python3
"""
Calcule des indicateurs agrégés par secteur (pour SYNTHESE et vérification)
et des volumes « segmentation clients » (seuil minimal / cœur / plafond bootstrap).

  python scripts/prospecting/sector_stats.py
  python scripts/prospecting/sector_stats.py --json
  python scripts/prospecting/sector_stats.py -o docs/prospects/stats-secteurs.json
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd

# Nomenclature INSEE — tranche d’effectifs salariés (unité légale), répertoire Sirene.
TRANCHE_EFFECTIF_SALARIE_LABELS: dict[str, str] = {
    "NN": "Non employeuse / non renseigné",
    "00": "0 salarié",
    "01": "1 ou 2 salariés",
    "02": "3 à 5 salariés",
    "03": "6 à 9 salariés",
    "11": "10 à 19 salariés",
    "12": "20 à 49 salariés",
    "22": "50 à 99 salariés",
    "31": "100 à 199 salariés",
    "32": "200 à 249 salariés",
    "41": "250 à 499 salariés",
    "42": "500 à 999 salariés",
    "51": "1 000 à 1 999 salariés",
    "52": "2 000 à 4 999 salariés",
    "53": "5 000 salariés et plus",
}

CATEGORIE_ENTREPRISE_LABELS: dict[str, str] = {
    "PME": "Petite et moyenne entreprise (PME)",
    "ETI": "Entreprise de taille intermédiaire (ETI)",
    "GE": "Grande entreprise (GE)",
}


def tranche_effectif_codes_for_label_map(s: pd.Series) -> pd.Series:
    """Normalise la colonne API vers des codes str ('11', 'NN', …) pour mapper TRANCHE_EFFECTIF_SALARIE_LABELS."""

    def one(v: object) -> str:
        if pd.isna(v):
            return "NN"
        if isinstance(v, (int, np.integer)):
            return str(int(v))
        if isinstance(v, (float, np.floating)):
            return str(int(v))
        t = str(v).strip()
        if t == "" or t.lower() in ("nan", "none", "<na>"):
            return "NN"
        try:
            return str(int(float(t)))
        except (ValueError, TypeError):
            return t

    return s.map(one)


def load_registry(path: Path) -> dict:
    data = json.loads(path.read_text(encoding="utf-8"))
    return data["sectors"]


def _neo_series(df: pd.DataFrame) -> pd.Series:
    return pd.to_numeric(df["nombre_etablissements_ouverts"], errors="coerce").fillna(0)


def _tef_series(df: pd.DataFrame) -> pd.Series:
    return df["tranche_effectif_salarie"].astype(str)


def _cat_series(df: pd.DataFrame) -> pd.Series:
    return df["categorie_entreprise"]


def segment_masks(sector_id: str, df: pd.DataFrame) -> tuple[pd.Series, pd.Series, pd.Series]:
    """
    Retourne (seuil_minimal, coeur_cible, plafond_bootstrap) — trois Series booléennes alignées sur df.index.
    Les masques peuvent se recouper ; pour une unique étiquette par ligne, utiliser segment_client_labels().
    """
    n = _neo_series(df)
    t = _tef_series(df)
    c = _cat_series(df)
    pme = c.eq("PME")
    pme_eti = c.isin(["PME", "ETI"])

    if sector_id in ("creches", "securite-privee"):
        minimal = pme & (n >= 3) & (n <= 5) & t.isin(["11", "12"])
        ideal = pme_eti & (n >= 6) & (n <= 15) & t.isin(["12", "22", "31"])
        maximal = pme_eti & (n >= 15) & (n <= 30) & t.isin(["22", "31", "32", "41"])
    elif sector_id == "ehpad":
        minimal = pme_eti & (n >= 2) & (n <= 4) & t.isin(["11", "12", "22"])
        ideal = pme_eti & (n >= 5) & (n <= 12) & t.isin(["12", "22", "31", "32"])
        maximal = pme_eti & (n >= 13) & (n <= 25) & t.isin(["22", "31", "32", "41", "42"])
    elif sector_id == "ambulances":
        minimal = pme & (n >= 2) & (n <= 3) & t.isin(["11", "12"])
        ideal = pme_eti & (n >= 4) & (n <= 15) & t.isin(["11", "12", "22"])
        maximal = pme_eti & (n >= 8) & (n <= 25) & t.isin(["12", "22", "31"])
    elif sector_id == "restauration-collective":
        minimal = pme_eti & (n >= 3) & (n <= 5) & t.isin(["11", "12", "22"])
        ideal = pme_eti & (n >= 6) & (n <= 20) & t.isin(["12", "22", "31"])
        maximal = pme_eti & (n >= 15) & (n <= 50) & t.isin(["22", "31", "32", "41"])
    elif sector_id == "pharmacies-reseau":
        minimal = pme & (n >= 2) & (n <= 3) & t.isin(["11", "12"])
        ideal = pme & (n == 3) & t.isin(["11", "12", "22"])
        maximal = pme & (n >= 3) & (n <= 7) & t.isin(["11", "12", "22"])
    elif sector_id == "organisme-formation":
        minimal = pme & (n >= 2) & (n <= 3) & t.isin(["11", "12"])
        ideal = pme_eti & (n >= 4) & (n <= 10) & t.isin(["11", "12", "22"])
        maximal = pme_eti & (n >= 11) & (n <= 20) & t.isin(["12", "22", "31", "32"])
    else:
        minimal = ideal = maximal = pd.Series(False, index=df.index)

    return minimal, ideal, maximal


def segment_regles_proxy(sector_id: str) -> str:
    """Texte court pour JSON / doc (cohérent avec segment_masks)."""
    regles: dict[str, str] = {
        "creches": (
            "Seuil minimal : PME, 3–5 étab. ouverts, TEF 11|12. "
            "Cœur : PME|ETI, 6–15 étab., TEF 12|22|31. "
            "Plafond : PME|ETI, 15–30 étab., TEF 22|31|32|41."
        ),
        "securite-privee": (
            "Seuil minimal : PME, 3–5 étab. ouverts, TEF 11|12. "
            "Cœur : PME|ETI, 6–15 étab., TEF 12|22|31. "
            "Plafond : PME|ETI, 15–30 étab., TEF 22|31|32|41."
        ),
        "ehpad": (
            "Seuil minimal : PME|ETI, 2–4 étab., TEF 11|12|22. "
            "Cœur : PME|ETI, 5–12 étab., TEF 12|22|31|32. "
            "Plafond : PME|ETI, 13–25 étab., TEF 22–42 (hors GE)."
        ),
        "ambulances": (
            "Proxy agences = étab. ouverts. Seuil : PME, 2–3 agences, TEF 11|12. "
            "Cœur : PME|ETI, 4–15 agences, TEF 11|12|22. "
            "Plafond : PME|ETI, 8–25 agences, TEF 12|22|31. "
            "(Nombre de véhicules non disponible dans l’export.)"
        ),
        "restauration-collective": (
            "Proxy sites = étab. ouverts (NAF 56.29A = échantillon réduit). "
            "Seuil : PME|ETI, 3–5 étab., TEF 11|12|22. Cœur : 6–20 étab., TEF 12|22|31. "
            "Plafond : 15–50 étab., TEF 22|31|32|41."
        ),
        "pharmacies-reseau": (
            "Seuil : PME, 2–3 étab. ouverts, TEF 11|12. "
            "Cœur : PME, exactement 3 étab., TEF 11|12|22 (plafond légal titulaire). "
            "Plafond : PME, 3–7 étab., TEF 11|12|22 (périmètre élargi holdings, biais NAF)."
        ),
        "organisme-formation": (
            "Seuil : PME, 2–3 lieux, TEF 11|12. "
            "Cœur : PME|ETI, 4–10 lieux, TEF 11|12|22. "
            "Plafond : PME|ETI, 11–20 lieux, TEF 12|22|31|32."
        ),
    }
    return regles.get(sector_id, "Secteur sans règles de segmentation définies.")


def segment_client_labels(sector_id: str, df: pd.DataFrame) -> pd.Series:
    """
    Une étiquette par ligne. En cas de recoupement des masques :
    — pharmacies : Cœur > Plafond > Seuil (3 officines = cœur avant élargissement holdings) ;
    — autres secteurs : Plafond > Cœur > Seuil (gros périmètre prioritaire).
    """
    minimal, ideal, maximal = segment_masks(sector_id, df)
    if sector_id == "pharmacies-reseau":
        condlist = [ideal, maximal, minimal]
        choicelist = ["Cœur de cible", "Plafond bootstrap", "Seuil minimal"]
    else:
        condlist = [maximal, ideal, minimal]
        choicelist = ["Plafond bootstrap", "Cœur de cible", "Seuil minimal"]
    arr = np.select(condlist, choicelist, default="Hors segment")
    return pd.Series(arr, index=df.index, dtype=object)


def compute_segments(sector_id: str, df: pd.DataFrame) -> dict:
    """
    Compte des UL par palier commercial (seuil minimal / cœur / plafond bootstrap),
    à partir des seuls champs API : établissements ouverts + tranche effectif INSEE + catégorie.

    Les totaux sont calculés sur les masques bruts (recoupements possibles), pas sur segment_client_labels.
    """
    minimal, ideal, maximal = segment_masks(sector_id, df)
    regles = segment_regles_proxy(sector_id)

    return {
        "seuil_minimal": int(minimal.sum()),
        "coeur_cible": int(ideal.sum()),
        "plafond_bootstrap": int(maximal.sum()),
        "regles_proxy": regles,
    }


def compute_stats(csv_path: Path, sector_id: str | None = None) -> dict | None:
    if not csv_path.is_file():
        return None
    df = pd.read_csv(
        csv_path,
        dtype={"siren": str, "siege_code_postal": str, "siege_departement": str},
    )
    n = len(df)
    dir_col = df["dirigeants"].fillna("").astype(str).str.strip()
    has_dir = (dir_col != "") & (~dir_col.str.lower().isin(["nan", "none"]))
    neo = pd.to_numeric(df["nombre_etablissements_ouverts"], errors="coerce")
    mask_icp = (
        df["categorie_entreprise"].eq("PME")
        & df["tranche_effectif_salarie"].astype(str).isin(["11", "12"])
        & (neo >= 2)
    )
    cat = df["categorie_entreprise"].fillna("(n/a)").value_counts()
    tr = df["tranche_effectif_salarie"].value_counts().sort_index()
    dept = df["siege_departement"].fillna("(m)").astype(str).str.zfill(2).value_counts().head(5)
    out: dict = {
        "lignes": n,
        "siren_uniques": int(df["siren"].nunique()),
        "doublons_siren": int(df["siren"].duplicated().sum()),
        "pct_dirigeants_renseignes": round(100 * has_dir.mean(), 1) if n else 0,
        "pme": int(cat.get("PME", 0)),
        "eti": int(cat.get("ETI", 0)),
        "ge": int(cat.get("GE", 0)),
        "shortlist_pme_t11_12_neo2": int(mask_icp.sum()),
        "neo_median": float(neo.median()) if n else 0,
        "neo_mean": float(neo.mean()) if n else 0,
        "neo_max": float(neo.max()) if n else 0,
        "tranches": {str(k): int(v) for k, v in tr.items()},
        "top5_departements": {str(k): int(v) for k, v in dept.items()},
    }
    if sector_id:
        out["segments_clients"] = compute_segments(sector_id, df)
    return out


def main() -> int:
    root = Path(__file__).resolve().parents[2]
    reg = Path(__file__).resolve().parent / "sectors.json"
    p = argparse.ArgumentParser()
    p.add_argument("--json", action="store_true")
    p.add_argument(
        "-o",
        "--output",
        type=Path,
        metavar="FICHIER",
        help="Écriture JSON UTF-8 (stats + segments_clients) vers ce fichier",
    )
    args = p.parse_args()
    sectors = load_registry(reg)
    out: dict[str, dict | None] = {}
    for sid, cfg in sectors.items():
        path = root / "data" / cfg["csv_filename"]
        out[sid] = compute_stats(path, sector_id=sid)

    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")

    if args.json:
        print(json.dumps(out, ensure_ascii=False, indent=2))
        return 0

    print(f"{'Secteur':<28} {'Lignes':>8} {'%dir.':>7} {'Shortlist':>10} {'neo méd.':>9} {'Seg min':>8} {'Coeur':>7} {'Plaf.':>6}")
    for sid, st in out.items():
        if st is None:
            print(f"{sid:<28} {'(absent)':>8}")
            continue
        seg = st.get("segments_clients") or {}
        print(
            f"{sid:<28} {st['lignes']:>8} {st['pct_dirigeants_renseignes']:>6.1f}% {st['shortlist_pme_t11_12_neo2']:>10} {st['neo_median']:>9.1f} "
            f"{seg.get('seuil_minimal', 0):>8} {seg.get('coeur_cible', 0):>7} {seg.get('plafond_bootstrap', 0):>6}"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
