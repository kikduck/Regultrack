# Prospection multi-secteurs (NAF / API)

Ce dossier centralise la **méthode**, les **analyses par verticale** et la **synthèse stratégique** alignées sur le registre `scripts/prospecting/sectors.json`.

## Documents

| Fichier | Contenu |
|---------|---------|
| [METHODOLOGIE-API.md](./METHODOLOGIE-API.md) | Pourquoi pas Pappers, API api.gouv.fr, champs CSV, scripts |
| [SYNTHESE-COMPARATIVE-SECTEURS.md](./SYNTHESE-COMPARATIVE-SECTEURS.md) | Critères de sélection, comparatif données + stratégie par secteur |
| [analyse-securite-privee.md](./analyse-securite-privee.md) | NAF 80.10Z |
| [analyse-creches.md](./analyse-creches.md) | NAF 88.91A |
| [analyse-ehpad.md](./analyse-ehpad.md) | NAF 87.10A + 87.30A |
| [analyse-restauration-collective.md](./analyse-restauration-collective.md) | NAF 56.29A |
| [analyse-ambulances.md](./analyse-ambulances.md) | NAF 86.90A |
| [analyse-organisme-formation.md](./analyse-organisme-formation.md) | NAF 85.59A + 85.59B |
| [analyse-pharmacies.md](./analyse-pharmacies.md) | NAF 47.73Z |

## Redirections (anciens chemins)

- `docs/analyse-prospects-securite-8010z.md` → voir [analyse-securite-privee.md](./analyse-securite-privee.md)
- `docs/analyse-prospects-creches-8891a.md` → voir [analyse-creches.md](./analyse-creches.md)

## Figures (PNG)

Sous `docs/assets/` : un sous-dossier par secteur (`prospects-analysis`, `prospects-analysis-creches`, `prospects-analysis-ehpad`, …). Régénération :

```bash
python scripts/prospecting/export_analysis_figures.py --all-sectors
```

Un **instantané** des indicateurs agrégés et des **segments clients** (seuil / cœur / plafond) est versionnable dans [`stats-secteurs.json`](./stats-secteurs.json) ; le régénérer avec `python scripts/prospecting/sector_stats.py -o docs/prospects/stats-secteurs.json` (ou `--json` pour la sortie standard).

## Scripts (racine du dépôt)

```bash
python scripts/prospecting/fetch_sector_prospects.py --list
python scripts/prospecting/fetch_sector_prospects.py --sector ehpad
python scripts/prospecting/sector_stats.py
python scripts/prospecting/sector_stats.py -o docs/prospects/stats-secteurs.json
python scripts/prospecting/sector_stats.py --json

# Excel (.xlsx) par secteur : colonnes Secteur + Segment client (openpyxl)
pip install openpyxl
python scripts/prospecting/export_prospects_segments_xlsx.py --all
```

Fichiers générés sous `data/prospects_segments_xlsx/` (ex. `prospects_creches_segments.xlsx`).

Voir `scripts/prospecting/README.md`.

## Notebook paramétrable

`notebooks/analyse_prospects_sectoriel.ipynb` — définir `SECTOR_ID` en tête de notebook (clé du `sectors.json`).
