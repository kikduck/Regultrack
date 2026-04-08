# Méthodologie — listes d’entreprises par NAF (API publique)

## Pourquoi éviter le scraping de sites agrégateurs

- **CGU** : l’extraction automatisée sans accord est en général interdite (ex. Pappers).
- **Fragilité** : HTML, anti-bot, changements fréquents.
- Les **données publiques** couvrent le besoin « liste nominative + effectif » pour la prospection outbound.

## Source : API Recherche d’entreprises (api.gouv.fr)

- **Documentation :** [API Recherche d’entreprises](https://api.gouv.fr/les-api/api-recherche-entreprises)
- **Endpoint :** `https://recherche-entreprises.api.gouv.fr/search`
- **Limite :** jusqu’à **7 requêtes / seconde** par utilisateur (non garanti en période de charge).
- **User-Agent** : doit être **explicite** et identifiable.

### Filtres utilisés

- `activite_principale` : code NAF Rev. 2 (ex. `80.10Z`, `88.91A`). Pour un secteur à plusieurs codes (EHPAD, OF), le script enchaîne les NAF et **dédoublonne** par SIREN.
- `tranche_effectif_salarie` : tranches INSEE niveau **unité légale** ; par défaut on restreint aux tranches **à partir de 10 salariés** (codes `11` à `53`). Réf. [documentation Sirene](https://www.sirene.fr/static-resources/documentation/v_sommaire_311.htm).

### Ce que l’API ne donne pas

- Pas d’e-mail ni de LinkedIn : **enrichissement** manuel ou outil autorisé.
- Les **non-diffusibles** et certaines entités peuvent être absentes de l’API.
- Le **code NAF principal** ne décrit qu’une facette de l’activité réelle : pour certains métiers (ex. restauration collective), une partie du marché est sous **d’autres codes NAF** — les volumes exportés sont des **planchers** pour le code interrogé.

## Implémentation dans le dépôt

| Fichier | Rôle |
|---------|------|
| `scripts/prospecting/sectors.json` | Registre des secteurs : NAF, nom de fichier CSV, dossier PNG, lien doc |
| `scripts/prospecting/sirene_api.py` | Appels HTTP, pagination, troncs communs |
| `scripts/prospecting/fetch_sector_prospects.py` | CLI `--sector` / `--all` / `--list` |
| `scripts/prospecting/fetch_securite_privee_sirene.py` | CLI historique `--activite` + `--out` (un seul NAF) |
| `scripts/prospecting/export_analysis_figures.py` | PNG : `--sector`, `--all-sectors`, ou `--csv` + `--out-dir` |
| `scripts/prospecting/sector_stats.py` | Tableau / JSON d’indicateurs par secteur + **segments_clients** (proxy étab. + TEF) ; `-o` pour écrire `docs/prospects/stats-secteurs.json` |
| `scripts/prospecting/export_prospects_segments_xlsx.py` | Export **.xlsx** (colonnes **Secteur**, **Segment client**) — `openpyxl` |

**Exports CSV** : `data/<csv_filename>` (voir `sectors.json`). Fichiers `data/prospects_*` ignorés par git.

**Figures** : `docs/assets/<assets_subdir>/` (quatre PNG par secteur : tranches, catégories, top départements, histogramme établissements).

## Champs du CSV

| Colonne | Description |
|---------|-------------|
| `siren` | Unité légale |
| `nom_complet` | Dénomination |
| `activite_principale` | NAF principal INSEE |
| `tranche_effectif_salarie` | Tranche effectif |
| `categorie_entreprise` | PME / ETI / GE |
| `nombre_etablissements_ouverts` | Établissements ouverts |
| `siege_*` | Siège |
| `dirigeants` | Noms agrégés (` \| `) si présents dans la réponse API |

## Shortlist « ICP » dans les stats

Indicateur **indicatif** : PME + tranches `11`–`12` (10–49 sal.) + au moins **2** établissements ouverts. À recaler selon ta cible commerciale ; pour les pharmacies, beaucoup d’UL sont **mono-officine** (shortlist naturellement basse).
