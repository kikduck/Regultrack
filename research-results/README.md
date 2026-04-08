# Résultats de recherche réglementaire (local)

Ce dossier est **principalement ignoré par Git** (voir `.gitignore`) : les exports du stack *deep research* Docker et les gros fichiers restent sur votre machine. Seul ce `README.md` est versionné pour documenter la convention.

## Convention de nommage

| Élément | Règle |
|--------|--------|
| Dossier secteur | **kebab-case**, en français court : `securite-privee`, `creches`, `ehpad`, `ambulances`, `pharmacies` |
| Fiches | `NN_theme_court.md` avec `NN` = ordre d’importance (01, 02, …) |
| Contenu | Métadonnées en tête (date, modèle, requête), puis champs alignés sur `obligation_templates` quand c’est possible |

## Secteurs prévus

- `securite-privee/` — référence existante (12 fiches)
- `creches/` — accueil du jeune enfant, PMI, ERP type R (à compléter par la recherche)
- `ehpad/` — ESSMS, ARS, HAS, AFGSU (à compléter)
- `ambulances/` — transport sanitaire, agrément, FCA DEA (à compléter)
- `pharmacies/` — réservé futur registre

## Lien avec les seeds Supabase

Les seeds rerunnable sont dans `supabase/seeds/` :

- `seed_securite_privee_upsert.sql`
- `seed_creches_upsert.sql`
- `seed_ehpad_upsert.sql`
- `seed_ambulances_upsert.sql`

Après génération de nouvelles fiches dans `research-results/<secteur>/`, mettre à jour le seed correspondant et ajuster `last_verified_at` / `verified_by` dans le `INSERT`.

## Commande Docker (rappel)

Depuis `docker/` : `docker compose -f docker-compose.research.yml up -d` (voir `CHECKLIST.md`).
