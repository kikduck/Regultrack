# Workflow Supabase

Objectif : garder un workflow rigoureux, versionné et ré-exécutable, même si tu continues parfois à passer par le `SQL Editor` de Supabase.

## Principe

- `supabase/migrations/` : uniquement les changements de schéma
- `supabase/seeds/` : synchronisation métier ré-exécutable
- `supabase/seed_*.sql` à la racine : anciens seeds one-shot, à garder comme historique/bootstrap

## Règles à suivre

### 1. Ne pas modifier une migration déjà appliquée

Une fois qu'une migration a été exécutée sur une base distante, on la considère figée.

Si tu dois corriger quelque chose :
- crée une nouvelle migration `00X_nom.sql`
- n'édite pas l'ancienne

### 2. Favoriser des seeds ré-exécutables

Évite les `INSERT` bruts pour les données métier qui vont évoluer.

Préférer :
- `INSERT ... ON CONFLICT DO UPDATE`
- ou `UPDATE + INSERT WHERE NOT EXISTS`

Dans ce repo :
- `supabase/seed_securite_privee.sql` = seed initial one-shot
- `supabase/seeds/seed_securite_privee_upsert.sql` = script de sync ré-exécutable

### 3. Séparer schéma et données métier

Exemples :
- ajouter une colonne = migration
- enrichir une obligation CNAPS = seed métier ré-exécutable

### 4. Toujours tester d'abord sur une base de dev

Ordre recommandé :
1. base locale ou projet Supabase de dev
2. vérification visuelle dans l'UI
3. projet principal

## Ce que tu dois exécuter maintenant

Tu as déjà exécuté :
- `supabase/migrations/002_enrich_obligation_templates.sql`

Il te reste à exécuter, dans cet ordre :

### Étape 1. Garde-fou d'upsert

Dans le `SQL Editor`, exécute :
- `supabase/migrations/003_guard_obligation_templates_upsert.sql`

Ce script :
- renomme 2 anciens templates pour rester cohérent avec le nouveau seed
- repointe les obligations vers un template canonique si doublons
- supprime les doublons de templates
- ajoute un index unique sur `(sector, name, applies_to)`

### Étape 2. Synchronisation métier

Ensuite, dans le `SQL Editor`, exécute :
- `supabase/seeds/seed_securite_privee_upsert.sql`

Ce script :
- met à jour les templates existants
- insère les templates manquants
- peut être rejoué sans recréer de doublons

## Workflow recommandé pour les prochains changements

### Cas A. Tu modifies le schéma

Exemple : ajouter `job_title_id` sur `employees`

À faire :
1. créer `supabase/migrations/004_add_job_title_id.sql`
2. exécuter la migration sur la base de dev
3. valider
4. exécuter sur la base distante

### Cas B. Tu modifies la base de connaissances

Exemple : changer `help_text` de la carte CNAPS

À faire :
1. modifier `supabase/seeds/seed_securite_privee_upsert.sql`
2. rejouer ce script

### Cas C. Tu ajoutes un nouveau secteur

Exemple : crèches privées

À faire :
1. créer le seed ré-exécutable du secteur
2. lui donner une clé métier stable
3. utiliser `ON CONFLICT`

## Passage progressif au CLI

Le repo a maintenant ces scripts :

```bash
npm run db:push
npm run db:reset
npm run db:diff
```

Ils utilisent `npx supabase`.

Quand tu voudras passer au CLI :

1. installer/autoriser la CLI Supabase
2. lancer `npx supabase init` à la racine du projet si `supabase/config.toml` n'existe pas encore
3. lancer `npx supabase login`
4. lancer `npx supabase link --project-ref <ton-project-ref>`
5. utiliser `npm run db:push`

## Conventions de nommage

- migrations : `001_initial_schema.sql`, `002_enrich_obligation_templates.sql`
- seeds ré-exécutables : `supabase/seeds/seed_<secteur>_upsert.sql`
- un changement = un fichier dédié

## Check rapide avant exécution

Avant toute exécution sur la vraie base :

- ai-je créé un nouveau fichier au lieu d'éditer une migration déjà jouée ?
- le script est-il ré-exécutable ?
- le script peut-il créer des doublons ?
- ai-je séparé schéma et données métier ?
- ai-je testé sur une base de dev ou un projet jetable ?
