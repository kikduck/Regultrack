# Prospection Sirene / API Recherche d’entreprises

## Fichiers

| Fichier | Description |
|---------|-------------|
| `sectors.json` | Registre des verticales : codes NAF, nom CSV, dossier PNG, doc d’analyse |
| `sirene_api.py` | Client HTTP, pagination, tranches effectif, écriture CSV/JSONL |
| `fetch_sector_prospects.py` | **Point d’entrée recommandé** : `--list`, `--sector <id>`, `--all` |
| `fetch_securite_privee_sirene.py` | Export **un seul** NAF (`--activite`, `--out`) — rétrocompatibilité |
| `export_analysis_figures.py` | Génère 4 PNG par secteur : `--sector`, `--all-sectors`, ou `--csv` + `--out-dir` |
| `sector_stats.py` | Agrégats par CSV (`--json` pour machine-readable) |
| `export_prospects_segments_xlsx.py` | Un **.xlsx** par secteur : CSV + colonnes **Secteur** et **Segment client** (`--sector` / `--all`) |

## Commandes

```bash
# Liste des identifiants secteur
python scripts/prospecting/fetch_sector_prospects.py --list

# Export un secteur (voir sectors.json)
python scripts/prospecting/fetch_sector_prospects.py --sector ehpad

# Tous les secteurs (très long)
python scripts/prospecting/fetch_sector_prospects.py --all

# Tests : limiter les pages
python scripts/prospecting/fetch_sector_prospects.py --sector ehpad --max-pages 2

# Figures
python scripts/prospecting/export_analysis_figures.py --sector creches
python scripts/prospecting/export_analysis_figures.py --all-sectors

# Stats
python scripts/prospecting/sector_stats.py
python scripts/prospecting/sector_stats.py --json

# Excel avec segmentation (openpyxl requis)
pip install openpyxl
python scripts/prospecting/export_prospects_segments_xlsx.py --sector creches
python scripts/prospecting/export_prospects_segments_xlsx.py --all
```

## Documentation produit

- `docs/prospects/README.md` — index analyses + synthèse comparative

## Dépendances

- Export : **stdlib** uniquement  
- Figures / stats : `pandas`, `numpy`, `matplotlib` (voir notebooks)  
- Export XLSX segments : `openpyxl`
