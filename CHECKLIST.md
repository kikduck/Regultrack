# Regultrack — Plan de développement complet

> Basé sur la vision produit (`conformite-multi-sites.md`) et les décisions d'architecture prises en session.
> Priorités : d'abord ce qui rend le produit **vendable aux 3 premiers clients**, puis ce qui le rend **scalable**.

---

## Architecture : 3 piliers

```
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                          │
│   BASE DE CONNAISSANCES RÉGLEMENTAIRES (le moat)                        │
│   Obligations, fréquences, contexte métier, sources légales, aide       │
│   contextuelle. Le SaaS et le back-office lisent/écrivent ici.          │
│                                                                          │
└──────────────────┬───────────────────────────┬───────────────────────────┘
                   │                           │
    ┌──────────────▼──────────────┐  ┌─────────▼──────────────────────────┐
    │  PRODUIT A — SaaS Client    │  │  PRODUIT B — Back-office Interne   │
    │  (ce que le client voit)    │  │  (ce que toi tu vois)              │
    │                             │  │                                    │
    │  • Tableau de bord          │  │  • Gestion de tous les clients     │
    │  • Upload de preuves        │  │  • Calibreur IA (import en vrac)   │
    │  • Alertes sectorielles     │  │  • Admin base réglementaire        │
    │  • Export audit sectoriel   │  │  • Outil de veille réglementaire   │
    │  • Aide contextuelle métier │  │  • Monitoring MRR & onboarding     │
    └─────────────────────────────┘  └────────────────────────────────────┘
```

**Modèle d'onboarding retenu (Model C) :**
> Le client envoie ses documents en vrac. L'IA extrait, classe et propose une configuration complète.
> Le client valide/corrige sur un écran de confirmation. Toi, tu n'interviens pas dans le flux standard.

**Concept UX inspiré EnRègle :**
> Séparation claire entre **Collaborateurs** (agents de sécurité avec habilitations CNAPS, SST, etc.) et **Équipe** (utilisateurs du SaaS avec rôles Owner/Admin/Site Manager/Viewer).
> Cette distinction évite la confusion "est-ce que j'ajoute un agent ou un collègue qui se connecte ?"

---

## BASE DE CONNAISSANCES RÉGLEMENTAIRES

> C'est le cœur du moat. Le SaaS client y puise les obligations, l'aide contextuelle,
> les templates d'alertes et la structure des exports. Le back-office permet de la maintenir
> et de la faire évoluer avec un outil de veille.

---

### Outil de veille — Local Deep Research (Docker WSL)

> Stack de deep research : **Docker Compose** (Ollama GPU + SearXNG + LDR) dans WSL.
> Sert à faire de la veille réglementaire, enrichir la base de connaissances, vérifier des textes de loi.
> SearXNG agrège Google/Bing/DDG → résultats bien meilleurs qu'un DDG seul.

- [x] **Docker Compose configuré** : `docker/docker-compose.research.yml`
  - Ollama (GPU RTX 5090) sur port 11434
  - SearXNG (méta-moteur) sur port 8080
  - Local Deep Research (UI web) sur port 5000
- [x] **Modèle** : `gemma4:26b` (26B params, contexte 256K, multimodal)
- [x] **12 fiches de recherche générées** : `research-results/securite-privee/`
- [ ] **Valider / enrichir les fiches** avec des sources officielles (CNAPS, Légifrance)

> **Démarrer** : `cd docker && docker compose -f docker-compose.research.yml up -d`
> **Accéder** : http://localhost:5000 (LDR) — http://localhost:8080 (SearXNG)
> **Arrêter** : `docker compose -f docker-compose.research.yml down`

---

### Phase R1 — Modèle de données enrichi (migration SQL ✅)

> Aujourd'hui `obligation_templates` contient 9 colonnes. Il faut l'enrichir pour porter
> toute la connaissance métier qui rend le produit vertical.

- [x] **Nouveaux champs sur `obligation_templates`** (12 colonnes : renewal_process, help_text, etc.)
- [x] **Migration SQL** : `002_enrich_obligation_templates.sql`
- [x] **Méthode rigoureuse** : `003_guard_obligation_templates_upsert.sql` (unique constraint + index)

---

### Phase R2 — Seed complet sécurité privée (Synchronisé ✅)

> Remplir la base avec la vraie connaissance métier, pas juste des noms d'obligations.
> **Status** : Synchronisé via `seed_securite_privee_upsert.sql`

- [x] **Carte professionnelle CNAPS** (Enrichie)
- [x] **Compléter les 8 obligations existantes** (SST, SSIAP, RC Pro, etc.)
- [x] **Ajouter les obligations manquantes** :
  - Visite médicale du travail (aptitude)
  - Registre du personnel
  - Affichages obligatoires par site

---

### Phase R3 — Seed crèches privées

> Deuxième niche. Même niveau de détail que la sécurité privée.

- [ ] **Agrément PMI** : lié à l'établissement, délivré par le Conseil Départemental, visite d'inspection
- [ ] **PSC1 / SST** : formation premiers secours, par employé de contact, renouvelable tous les 2 ans
- [ ] **Formation GESTES** : gestes d'urgence pédiatrique, par éducatrice
- [ ] **Exercices d'évacuation** : 2x/an minimum, avec date, heure, signature, nombre de participants
- [ ] **Affichages obligatoires** : consignes de sécurité, numéros d'urgence, protocoles
- [ ] **Diplômes éducatrices** : CAP AEPE, EJE, infirmière puéricultrice — validation initiale
- [ ] **Protocoles sanitaires** : PAI (Projet d'Accueil Individualisé), protocole médicaments
- [ ] Remplir tous les champs enrichis (R1) pour chaque obligation crèche

---

### Phase R4 — Outil de veille réglementaire (back-office)

> Quand une loi change, la base doit être mise à jour. Cet outil te prévient et t'aide.

#### R4.1 — Veille manuelle assistée

- [ ] **Dashboard veille** dans le back-office : liste de toutes les obligations classées par `last_verified_at` (les plus anciennes en haut)
- [ ] **Alerte interne** : notification quand une obligation n'a pas été vérifiée depuis 6 mois
- [ ] **Workflow de vérification** : bouton "Vérifier maintenant" → ouvre le lien officiel dans un nouvel onglet + champ pour noter le résultat
- [ ] **Historique des modifications** : quand tu changes `renewal_months` ou `required_documents`, l'ancienne valeur est archivée avec la date

#### R4.2 — Veille IA semi-automatique

- [ ] **Sources à surveiller** : liste configurable d'URLs officielles (Journal Officiel, CNAPS, Légifrance, sites ministériels)
- [ ] **Cron de scraping** : extraction périodique (hebdomadaire) du contenu des pages surveillées
- [ ] **Détection de changement** : LLM compare le contenu actuel avec le précédent et identifie les changements potentiellement pertinents
- [ ] **Alerte interne enrichie** : "Changement détecté sur cnaps.interieur.gouv.fr — peut impacter l'obligation 'Carte CNAPS'. Résumé du changement : [...]"
- [ ] **Validation humaine obligatoire** : le changement n'est jamais appliqué automatiquement — tu valides et tu mets à jour manuellement

#### R4.3 — Propagation aux clients

- [ ] **Quand une obligation change** : identifier tous les clients impactés (même secteur)
- [ ] **Notification client** : email automatique "La réglementation a changé : [résumé]. Votre espace Regultrack a été mis à jour."
- [ ] **Mise à jour des obligations actives** : si `renewal_months` change, recalculer les `due_date` des obligations en cours

---

## PRODUIT A — SaaS Client

---

### Phase 0 — Infrastructure ✅

- [x] Migration SQL initiale (`001_initial_schema.sql`)
- [x] Seed registre sécurité privée (`seed_securite_privee.sql`)
- [x] Bucket Storage "proofs" dans Supabase
- [x] `.env.local` configuré (4 variables)
- [x] Désactiver confirmation email (Supabase Auth)
- [x] Signup → dashboard fonctionnel
- [x] Fix 403 signup : API route admin (`/api/auth/setup-org`)
- [x] Pages existantes : dashboard, sites, sites/[id], employees, employees/[id], employees/new, sites/new, obligations/[id]/upload
- [x] Landing page sécurité privée (`/landing`)
- [x] Cron routes squelette (`send-alerts`, `update-statuses`)

### Audit navigateur — écarts constatés (avril 2026)

> Parcours manuel connecté : `/dashboard`, `/sites`, `/employees`, `/sites/new`, `/employees/new`, `/landing`. Objectif : noter ce qui manque ou grince dans l’UI actuelle par rapport à la vision produit (sans doublon inutile avec les phases ci-dessous — renvois indiqués).

#### Correctifs rapides (copy / accessibilité)

- [x] **Pluriels français sur les listes Sites et Employés** : libellés complets via src/lib/format-fr.ts (sites enregistrés, employés actifs, employés par carte site). Fichiers : sites/page.tsx, employees/page.tsx.

#### Navigation et pages absentes dans la sidebar

- [ ] **Pas de lien vers une vue globale des obligations** (`/obligations` ou équivalent) — prévu Phase 2.2 (tableau filtrable).
- [ ] **Pas de `/settings`** (organisation, compte, postes métier) — prévu Phases 1.4 et 4.
- [ ] **Pas de page `/legal`** (CGU, confidentialité, RGPD) — prévu Phase 9 ; la landing n’expose que des `mailto:` pour « Contact » / pied de page.

#### Écart promesse marketing ↔ produit actuel

- [ ] **Dashboard « vert / orange / rouge »** : la landing (`/landing`) promet une vue siège code couleur par site ; le dashboard actuel affiche des cartes de compteurs et un bloc « Statut par site », mais pas encore la grille dense ni les filtres décrits Phase 2.2 — à aligner lors de la refonte dashboard.

#### Comportements vérifiés OK

- [x] **Employé sans site** : `/employees/new` affiche « Aucun site disponible », lien « Créer un site », bouton de soumission désactivé tant qu’il n’y a pas de site — parcours cohérent.
- [x] **Landing** : vocabulaire secteur (CNAPS, SSIAP, SST, RC Pro, inspection) présent — la Phase 7 « audit contenu landing » reste utile pour la finesse, mais le socle est là.

#### Rappels (déjà listés ailleurs dans cette CHECKLIST)

- Phase **1.3** ✅ : écran bienvenue post-signup, aide contextuelle métier sur les obligations (`help_text`, procédures, lien officiel), CTA upload visible sur `missing`/`expired`, affichage « jours restants », vue obligations **organisation** au dashboard.
- Phase **2.1** : moteur d’écart / scores / cron `update-statuses` réellement branchés sur les transitions de statut.
- Phase **3** : alertes email (Resend) encore à brancher.

---

### Phase 1 — Corriger les fondations (MVP fonctionnel)

> Sans ces corrections, impossible de faire une démo correcte.

#### 1.1 — CRUD complet ✅

- [x] **Page "Modifier un site"** : `/sites/[id]/edit` — formulaire d'édition (nom, adresse, email responsable)
- [x] **Page "Modifier un employé"** : `/employees/[id]/edit` — formulaire d'édition (nom, email, poste, site)
- [x] **Archiver un employé** : bouton soft-delete (`active = false`) sur la fiche employé — l'employé disparaît des listes mais ses obligations/preuves restent (historique)
- [x] **Supprimer un site** : bouton avec confirmation (si aucun employé actif rattaché)

#### 1.2 — Auto-création des obligations ✅

- [x] **Obligations employé** : à la création d'un employé, créer automatiquement une obligation `missing` pour chaque `obligation_template` du secteur avec `applies_to = 'employee'`
- [x] **Obligations site** : à la création d'un site, créer les obligations `missing` pour `applies_to = 'site'`
- [x] **Obligations organisation** : à la création de l'org (signup), créer les obligations `missing` pour `applies_to = 'organization'`
- [x] **Ne pas dupliquer** : vérifier qu'une obligation n'existe pas déjà avant de créer

#### 1.3 — UX verticale (ce qui fait "ce logiciel connaît mon métier" ✅)

- [x] **Écran bienvenue sectoriel post-signup** : page `/setup` claire qui gère la création d'organisation
- [x] **Aide contextuelle par obligation** : composant `ObligationCard` affichant `help_text`, procédures, pièces requises et liens officiels
- [x] **CTA upload sur obligations `missing`** : bouton mis en avant sur les fiches obligations
- [x] **Affichage jours restants** : calcul automatique et badge de statut temporel sur chaque obligation
- [x] **Vue obligations organisation** : section dédiée dans le dashboard pour les obligations d'entreprise (Autorisation CNAPS, RC Pro)
- [x] **Redirection post-signup** : flux robuste redirigeant vers `/setup` si l'organisation n'est pas encore configurée

#### 1.4 — Postes personnalisables (inspiré EnRègle)

> EnRègle permet de créer des postes custom. C'est essentiel pour s'adapter à la diversité des structures.

- [ ] **Table `job_titles`** : scoped par organisation, permet de créer des postes métiers personnalisés
  - Exemples : "Agent de surveillance nuit", "Chef d'équipe régional Sud", "Superviseur multi-sites"
  - Champs : `org_id`, `name`, `description`, `created_at`
- [ ] **Migration** : ajouter `job_title_id` sur `employees` (nullable, garde `job_title` text comme fallback)
- [ ] **UI gestion des postes** : dans `/settings` ou modal lors de l'ajout d'employé
  - Liste des postes existants + bouton "+ Créer un poste"
  - Autocomplete avec création rapide inline

---

### Phase 2 — Moteur d'écart & vue siège (le cœur du produit)

> C'est ce qui différencie Regultrack d'une GED. Sans ça, c'est Google Drive en plus cher.

#### 2.1 — Moteur d'écart

- [ ] **Score de conformité par site** : calculer % d'obligations `valid` / total obligations (sites + employés du site)
- [ ] **Score de conformité global** : même chose au niveau organisation
- [x] **Cron `update-statuses`** : recalcule chaque nuit selon `due_date` et `max(alert_days)` du template (`obligation-status.ts` partagé avec l’upload preuve) ; les lignes `missing` ne sont pas recalculées (pas de preuve / pas d’échéance fiable côté produit)
- [ ] **Tests unitaires moteur d'écart** : vérifier les transitions de statut sur des cas limites (cible prioritaire : `obligation-status.ts`)

#### 2.2 — Vue siège consolidée

- [ ] **Dashboard refondu** : grille de sites avec code couleur (vert / orange / rouge) basé sur le pire statut du site
- [ ] **Filtres dashboard** : par statut (rouge uniquement), par type d'obligation, recherche par nom de site
- [ ] **Compteur par catégorie par site** : X en règle / Y expire bientôt / Z expiré — visible au survol ou en sous-ligne
- [ ] **Vue "toutes les obligations"** : page `/obligations` avec tableau filtrable (par site, par employé, par statut, par type)

#### 2.3 — Historique et versioning des preuves

- [ ] **Liste des preuves par obligation** : afficher toutes les preuves (pas seulement la dernière) avec date d'upload et validité
- [ ] **Preuve active vs périmée** : distinguer visuellement la preuve en cours de validité des anciennes
- [ ] **Empêcher suppression** : les preuves ne sont jamais supprimées (traçabilité pour audit)

---

### Phase 3 — Alertes email sectorielles

> Les alertes sont la promesse n°1 du produit : "vous êtes prévenu avant l'inspecteur".
> Chaque alerte parle le langage du métier, pas un rappel générique.

- [ ] Installer Resend : `npm install resend`
- [ ] Créer compte [resend.com](https://resend.com), récupérer clé API
- [ ] Ajouter `RESEND_API_KEY` dans `.env.local`
- [ ] **Brancher Resend** dans `/api/cron/send-alerts` (remplacer le TODO)
- [ ] **Template email sectoriel** : utiliser `alert_message_template` de la base de connaissances. L'email inclut le contexte métier : délai de renouvellement réel, organisme compétent, pièces requises — pas juste "votre document expire dans X jours"
- [ ] **Template email récap hebdomadaire** : résumé du lundi matin pour le dirigeant (X obligations à risque, Y actions cette semaine)
- [ ] **Configurer cron Vercel** (`vercel.json`) : `send-alerts` et `update-statuses` chaque jour à 8h
- [ ] **Log des alertes envoyées** : table `alert_logs` pour éviter les doublons et permettre l'audit
- [ ] **Variable `CRON_SECRET`** : sécuriser les routes cron

---

### Phase 4 — Rôles et permissions

> 3 niveaux : siège voit tout, site manager gère son périmètre, employé uploade via lien.

#### 4.1 — Rôles enrichis (inspiré EnRègle — séparation "Collaborateurs" vs "Équipe")

> EnRègle distingue bien : **Collaborateurs** (agents de sécurité avec habilitations) vs **Équipe** (utilisateurs du SaaS avec permissions).
> On garde cette clarté dans l'UX.

| Rôle SaaS | Description | Équivalent EnRègle |
|-----------|-------------|-------------------|
| **Owner** | Propriétaire/dirigeant — accès complet, gestion facturation | BUT |
| **Admin** | Accès complet au pilotage quotidien, hors gestion propriétaire (pas de changement de plan) | ADMIN |
| **Site Manager** | Voir et gérer uniquement son(ses) site(s) assigné(s) | MEMBRE (limité) |
| **Viewer** | Consultation opérationnelle sans modification | MEMBRE (lecture seule) |

- [ ] **Admin/Owner** : accès complet à tous les sites et employés (déjà le cas par défaut)
- [ ] **Site Manager** : le layout et les pages filtrent les données au périmètre du site assigné
- [ ] **Viewer** (nouveau) : accès en lecture seule, idéal pour les dirigeants qui veulent suivre sans intervenir
- [ ] **Vérifier RLS** : un `site_manager` ne peut pas accéder aux données d'un autre site via manipulation d'URL
- [ ] **Sélecteur de rôle** : dans le formulaire d'ajout d'utilisateur, pouvoir assigner `admin`, `site_manager`, ou `viewer`

#### 4.2 — Lien d'upload employé (sans compte)

- [ ] **Lien partageable** : URL unique par employé (token signé, sans compte) permettant d'uploader une preuve pour une obligation précise
- [ ] **Page d'upload simplifiée** : pas de sidebar, juste le formulaire d'upload avec le nom de l'obligation et de l'employé
- [ ] **Notification au manager** : quand un employé uploade via lien, le site manager reçoit un email

#### 4.3 — Invitation site managers

- [ ] **Inviter un responsable de site** : email d'invitation avec lien de création de compte pré-rattaché au site
- [ ] **Page d'acceptation d'invitation** : `/invite/[token]` → création de compte + rattachement automatique

---

### Phase 5 — Export audit sectoriel (la promesse "30 secondes")

> "Un inspecteur arrive ? Vous ouvrez le dossier du site, structuré et à jour, depuis votre téléphone."
> L'export suit la logique de l'inspection du secteur, pas la logique interne du logiciel.

- [ ] **Structure d'export par secteur** : utiliser `inspection_order` et `inspection_section` de la base de connaissances pour ordonner les sections du PDF selon ce que l'inspecteur regarde en premier
  - Sécurité privée : autorisation préfectorale → liste agents + cartes CNAPS → formations → documents entreprise
  - Crèches : agrément PMI → diplômes et formations éducatrices → exercices évacuation → protocoles sanitaires
- [ ] **Export PDF par site** : bouton sur la page site → génère un PDF structuré avec :
  - Informations du site (nom, adresse, responsable)
  - Sections ordonnées par `inspection_section`
  - Pour chaque obligation : statut, date d'échéance, dernière preuve (référence, date)
- [ ] **Export PDF par employé** : dossier individuel (utile pour contrôle CNAPS par agent)
- [ ] **Export global organisation** : PDF ou ZIP avec un dossier par site
- [ ] **Bibliothèque PDF** : utiliser `@react-pdf/renderer` ou `jspdf` côté serveur
- [ ] **Horodatage** : chaque export porte la date et l'heure de génération

---

### Phase 6 — Onboarding IA (Model C : IA propose, client valide)

> Le client envoie ses documents en vrac. L'IA fait le gros du travail. Le client confirme en 15 minutes.
> Il ne remplit rien à la main. Il valide ce que l'IA a trouvé.

#### 6.1 — Wizard post-signup (flow standard)

- [ ] **Étape 1** : Confirmer le nom d'organisation, le secteur
- [ ] **Étape 2** : Méthode d'onboarding — choix entre :
  - "Je dépose mes documents en vrac" → flux IA (Phase 6.2)
  - "Je saisis manuellement" → wizard classique (Phase 6.3)
- [ ] **Barre de progression** : visible dans le dashboard tant que le setup n'est pas terminé ("3/5 étapes complétées")

#### 6.2 — Flux IA (import en vrac)

- [ ] **Zone de dépôt** : interface drag & drop acceptant ZIP, PDF multiples, photos
- [ ] **Pipeline IA côté serveur** :
  - Extraction des employés (nom, poste) depuis Excel/CSV
  - OCR + LLM sur chaque PDF/image : identifier le type de document, la personne concernée, la date d'expiration
  - Matching automatique avec la base de connaissances : relier chaque document à l'obligation correspondante du secteur
- [ ] **Écran de validation client** :
  ```
  ✅ 12 sites détectés           → [Vérifier]
  ✅ 87 employés importés        → [Vérifier]
  ✅ 134 documents classés       → [Vérifier]
  ⚠️  3 documents non reconnus   → [Classer manuellement]
  ⚠️  2 dates incertaines         → [Confirmer]
  ```
- [ ] **Correction inline** : le client peut corriger un type de document mal classé ou une date incertaine sans quitter l'écran
- [ ] **Confirmation → import** : un clic "Tout valider" crée les sites, employés, obligations et rattache les preuves

#### 6.3 — Flux manuel (fallback)

- [ ] **Étape 2 (manuelle)** : Ajouter les sites (formulaire ou import CSV)
- [ ] **Étape 3 (manuelle)** : Ajouter les employés (formulaire multi-lignes ou import CSV : nom, email, poste, site)
- [ ] **Étape 4** : Tableau de bord pré-rempli avec toutes les obligations `missing` → "Voici ce qu'il vous reste à compléter"
- [ ] **Import CSV employés** : template téléchargeable + upload avec validation des colonnes

#### 6.4 — Données de démonstration

- [ ] **Bouton "Charger des données d'exemple"** : seed SQL ou action serveur pour les prospects en phase de test
- [ ] **Reset démo** : possibilité de vider les données de démo et recommencer

---

### Phase 7 — Déploiement & infra

- [ ] Créer un repo GitHub et pousser le code
- [ ] Créer un compte Vercel et connecter le repo
- [ ] Configurer les variables d'env sur Vercel (`.env.local` + `RESEND_API_KEY` + `CRON_SECRET`)
- [ ] Tester le déploiement sur `.vercel.app`
- [ ] Acheter un domaine et le connecter à Vercel
- [ ] **SSL + headers sécurité** : vérifier HTTPS, CSP, HSTS
- [ ] **Page `/auth/confirm`** : callback de confirmation email (pour mise en production)
- [ ] **Gestion session expirée** : redirection propre vers `/login` si token Supabase expire
- [ ] **Audit contenu landing page** : vérifier que `/landing` utilise le vocabulaire exact du secteur cible (CNAPS, préfecture, gardiennage, etc.) et pas du jargon SaaS générique

---

### Phase 8 — UX mobile (upload terrain)

> L'upload depuis le terrain (téléphone) est critique pour l'adoption des responsables de site.

- [ ] Tester l'upload depuis iPhone et Android
- [ ] `capture="environment"` sur l'input file (ouvre directement l'appareil photo)
- [ ] Responsive : tableaux sur petit écran (stacking ou scroll horizontal)
- [ ] **Compression d'image** : compresser côté client avant upload (photos téléphone = 5–10 Mo)
- [ ] **PWA minimale** : `manifest.json` + service worker basique pour l'icône d'accueil

---

### Phase 9 — Sécurité & conformité technique

- [ ] **Audit RLS complet** : script de test vérifiant qu'un utilisateur ne peut pas accéder aux données d'une autre org via l'API
- [ ] **Validation fichiers côté serveur** : type MIME (PDF/image uniquement), taille max 10 Mo, rejet des exécutables
- [ ] **Rate limiting** : sur les routes d'upload et de création de compte
- [ ] **Sanitization** : vérifier les inputs utilisateur (XSS, injection)
- [ ] **Mentions légales** : page `/legal` (CGU, politique de confidentialité, RGPD)
- [ ] **Backup Supabase** : configurer les backups automatiques (Point-in-Time Recovery)

---

### Phase 10 — Monétisation

> Modèle : abonnement mensuel basé sur le nombre de sites (300–2 500 €/mois).

- [ ] **Stripe Checkout** : intégration paiement avec plans par taille de réseau
  - 3–5 sites : 300–500 €/mois
  - 6–15 sites : 600–1 200 €/mois
  - 16–30 sites : 1 200–2 500 €/mois
  - 30+ : sur devis
- [ ] **Stripe webhook** : gérer les événements (abonnement créé, annulé, paiement échoué)
- [ ] **Gating** : bloquer l'ajout de sites au-delà du plan souscrit
- [ ] **Période d'essai** : 14 jours gratuits sans CB, puis passage au paiement
- [ ] **Page `/settings`** : nom d'organisation, changement de mot de passe, gestion abonnement, **infos entreprise** (SIREN/SIRET, adresse siège, téléphone)
- [ ] **Page `/settings/team`** : gestion des utilisateurs SaaS (inspiré EnRègle — séparer "Collaborateurs" [agents de sécurité] de "Équipe" [utilisateurs du logiciel])
- [ ] **Page `/settings/billing`** : historique des factures, changement de plan, portail Stripe
- [ ] **Email de bienvenue** : envoyé automatiquement après signup via Resend

---

### Phase 11 — Multi-secteur (scaling du registre métier)

> Commencer par sécurité privée. Ajouter crèches. Le registre est le moat.

- [ ] **Sélecteur de secteur au signup** : choix entre "Sécurité privée" et "Crèches privées" (extensible)
- [ ] **Obligation templates dynamiques** : le dashboard charge les templates correspondant au secteur de l'org depuis la base de connaissances
- [ ] **Landing page par secteur** : `/securite-privee` et `/creches` avec vocabulaire, exemples et témoignages spécifiques à chaque niche
- [ ] **Multi-langue** : préparation i18n pour l'extension européenne (Belgique, Suisse, Espagne)

---

## PRODUIT B — Back-office Interne

> Interface privée (accessible uniquement à toi). Le client n'y a jamais accès.
> Objectif : gérer efficacement tous les clients sans passer du temps sur des tâches répétitives.

---

### Phase B1 — Tableau de bord clients

> Vue globale sur tous les comptes actifs.

- [ ] **Page `/admin`** protégée par rôle `superadmin` (variable d'env ou table dédiée)
- [ ] **Liste des organisations** : nom, secteur, nombre de sites, nombre d'employés, date de création, statut abonnement
- [ ] **Indicateurs par client** :
  - Score de conformité global
  - Nombre d'obligations en rouge
  - Dernière activité (dernier upload)
  - MRR (lié à Stripe)
- [ ] **Accès rapide à un client** : pouvoir "entrer" dans le compte d'une organisation pour voir son tableau de bord tel qu'il le voit (vue impersonnation read-only)

---

### Phase B2 — Gestion manuelle des clients (premiers clients)

> Pour les 2–3 premiers clients, tu fais l'onboarding à la main depuis ce back-office.
> L'automatisation IA (B3) vient après, une fois que tu sais exactement ce qui prend du temps.

- [ ] **Créer un compte client depuis le back-office** : créer une org + compte admin sans passer par le signup public
- [ ] **Import manuel sites** : formulaire pour créer rapidement les sites d'un client
- [ ] **Import manuel employés** : upload CSV depuis le back-office pour le compte d'un client
- [ ] **Rattachement manuel de preuves** : uploader un PDF et le rattacher à l'obligation correcte, pour le compte d'un client
- [ ] **Notes internes par client** : champ de notes (jamais visible par le client) pour le contexte commercial et technique

---

### Phase B3 — Calibreur IA (onboarding assisté interne)

> Une fois les premiers clients onboardés manuellement, tu sais exactement où l'IA peut t'aider.
> Ce calibreur peut éventuellement devenir le flux IA client (Phase 6.2) une fois validé.

- [ ] **Zone d'ingestion** : dépôt d'un ZIP ou d'un dossier de documents d'un nouveau client
- [ ] **Pipeline IA** (même logique que Phase 6.2, mais pour usage interne) :
  - OCR + LLM sur chaque document : type, personne, date
  - Matching avec la base de connaissances du secteur du client
  - Génération d'un JSON de configuration (sites, employés, obligations, preuves)
- [ ] **Interface de validation interne** : tu vois la config proposée, tu corriges les erreurs (mauvais type, date incertaine, document non reconnu)
- [ ] **Import en un clic** : une fois validé, pousser la configuration dans le compte client en production
- [ ] **Log des imports** : historique de ce qui a été importé, quand, avec quel taux de confiance IA

---

### Phase B4 — Admin base de connaissances réglementaires

> Interface CRUD pour gérer la base sans toucher au SQL. C'est la veille réglementaire opérationnelle.

- [ ] **CRUD obligation_templates complet** : ajouter / modifier / désactiver un template (tous les champs enrichis de R1)
- [ ] **Prévisualisation** : voir exactement ce que le client verra (aide contextuelle, alerte email, section d'export)
- [ ] **Versionning** : quand tu changes un champ, l'ancienne valeur est archivée avec date et motif
- [ ] **Indicateur de fraîcheur** : badge rouge sur les obligations non vérifiées depuis 6+ mois
- [ ] **Dashboard de couverture** : pour chaque secteur, % d'obligations ayant tous les champs remplis (help_text, renewal_process, etc.)

---

### Phase B5 — Outil de veille réglementaire

> Surveiller les sources officielles pour détecter les changements avant qu'un client te le signale.

#### Architecture recommandée

```
Cron hebdomadaire (Vercel)
       ↓
Jina Reader API — extraction texte propre depuis URLs officielles
(GET https://r.jina.ai/https://www.cnaps.interieur.gouv.fr)
       ↓
Diff avec la version précédente stockée en DB
       ↓
LLM (résumé du changement + pertinence pour les obligations suivies)
       ↓
Alerte interne back-office → validation humaine obligatoire
```

#### Outils à évaluer (par ordre de priorité)

- **[Jina Reader](https://jina.ai/reader/)** : convertit n'importe quelle URL en markdown propre pour LLM — gratuit jusqu'à un certain volume, aucune infra à maintenir. **Point d'entrée recommandé.**
- **[GPT Researcher](https://github.com/assafelovic/gpt-researcher)** : recherche web agentique + rapport structuré — utile si tu veux aller au-delà du simple diff de page et rechercher activement les changements réglementaires récents sur un thème.
- **[LangChain Local Deep Researcher](https://github.com/langchain-ai/local-deep-researcher)** : version self-hosted, aucun coût API pour la veille répétitive — à envisager si le volume de scraping devient significatif.
- **[Jina DeepResearch](https://github.com/jina-ai/node-DeepResearch)** : écrit en Node.js, s'intègre directement dans Next.js sans changer de runtime.
- **Perplexity / ChatGPT Deep Research** : usage manuel pour ta propre veille, pas intégrable dans un cron sans API payante.

#### Tâches

- [ ] **Liste de sources à surveiller** : URLs configurables (Journal Officiel, CNAPS, Légifrance, sites ministériels, PMI départementales)
- [ ] **Cron hebdomadaire de scraping** : récupérer le contenu via Jina Reader et stocker en DB
- [ ] **Détection de changement (LLM)** : comparer le contenu actuel avec la version précédente, identifier les changements potentiellement pertinents pour les obligations suivies
- [ ] **Alerte interne** : "Changement détecté sur [source] — peut impacter [obligation]. Résumé : [...]"
- [ ] **Validation humaine obligatoire** : le changement n'est jamais appliqué automatiquement
- [ ] **Propagation aux clients** : quand tu valides un changement, notification automatique aux clients impactés + recalcul des `due_date` si nécessaire

---

## Suivi

| Date | Action |
|------|---------|
| 04/04/2026 | ✅ Initialisation projet Next.js + Supabase, toutes les pages MVP créées |
| 04/04/2026 | ✅ Fix 403 signup : création organisation via API route admin |
| 04/04/2026 | ✅ Refonte complète du plan — architecture 2 produits, onboarding IA Model C |
| 04/04/2026 | ✅ Ajout base de connaissances réglementaires comme pilier central + outil de veille |
| 05/04/2026 | ✅ Phase R1/R2 — Migration enrichie + Seed complet sécurité privée (12 obligations) |
| 05/04/2026 | ✅ Phase 1.1 — CRUD complet (edit sites/employés, archive, delete) |
| 05/04/2026 | ✅ Phase 1.2 — Auto-création obligations (org, site, employé) avec déduplication |
| 05/04/2026 | 📝 Inspiration EnRègle — Ajout postes custom, rôles enrichis, séparation Collaborateurs/Équipe |
| 05/04/2026 | ✅ Phase 1.3 — UX Verticale (ObligationCard, setup post-signup, vue organisation dashboard) |

---

## Priorité pour signer les 3 premiers clients

**Base de connaissances :** fondation de tout le reste

1. **Phase R1** — ✅ enrichir le modèle de données (migration SQL)
2. **Phase R2** — ✅ seed complet sécurité privée (tous les champs remplis)

**Produit A :** ce qui suffit pour une démo + un usage réel

1. **Phase 1** — fondations CRUD + auto-création obligations + UX verticale
   - 1.1 ✅ CRUD complet (fait)
   - 1.2 ✅ Auto-création obligations (fait)
   - 1.3 ✅ UX verticale (fait)
   - 1.4 Postes personnalisables (inspiré EnRègle) — à faire
2. **Phase 2.1 + 2.2** — moteur d'écart + vue siège (la promesse centrale)
3. **Phase 3** — alertes email sectorielles (la valeur récurrente)
4. **Phase 5** — export PDF sectoriel (dossier d'inspection en 30 secondes)
5. **Phase 7** — déploiement (mettre en ligne avant la démo)

**Produit B :** ce qui suffit pour les 3 premiers clients onboardés manuellement

1. **Phase B1** — tableau de bord clients (voir l'état de chaque compte)
2. **Phase B2** — gestion manuelle (créer les comptes, importer les données à la main)

**Ce qui vient après les 3 premiers clients :**

- Phase R3 — Seed crèches (quand tu veux attaquer la 2e niche)
- Phase 6 — Onboarding IA client (quand tu sais exactement ce qui prend du temps manuellement)
- Phase B3 — Calibreur IA interne (bâti sur le retour des onboardings manuels)
- Phase 4 — Rôles (quand un client demande des accès site manager)
- Phase 8 — UX mobile (quand un responsable de site se plaint de l'upload)
- Phase 9 — Sécurité (avant de passer à 10+ clients)
- Phase 10 — Stripe (quand tu as des clients qui paient, même par virement au début)
- Phase 11 — Multi-secteur (quand tu veux les crèches en parallèle)
- Phase B4 — Admin base réglementaire (quand tu veux arrêter de toucher au SQL)
- Phase B5 — Veille réglementaire IA (quand la réglementation change pour la première fois)
- Phase R4 — Outil de veille complet (quand tu gères 10+ clients et que la veille manuelle ne suffit plus)
