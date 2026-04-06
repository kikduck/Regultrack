# Conformité multi-sites — dossier complet

> Document de travail. Chiffres = ordres de grandeur, pas des vérités absolues.

---

## Table des matières

1. [L'idée en une phrase](#idee)
2. [Le problème réel](#probleme)
3. [Pourquoi ce n'est pas une GED](#pas-une-ged)
4. [Deux exemples de clients réalistes](#exemples)
5. [La solution — vue produit](#solution)
6. [Modèle économique et prix](#prix)
7. [Comment le vendre](#vente)
8. [Concurrence : EnRègle et positionnement vertical](#concurrence)
9. [Taille du marché](#marche)
10. [Risques et limites](#risques)
11. [Par où commencer](#demarrage)

---

<a id="idee"></a>

## 1. L'idée en une phrase

Un logiciel qui dit à un réseau multi-sites **ce qui est en règle, ce qui ne l'est plus, et ce qui va expirer** — avant qu'un contrôle inopiné ou un incident révèle le problème.

---

<a id="probleme"></a>

## 2. Le problème réel

### Ce qui se passe dans un réseau de 5 à 30 sites

Dès qu'une entreprise gère plusieurs établissements, elle accumule une masse d'obligations récurrentes qui ne disparaissent jamais :

- formations obligatoires des employés (secourisme, hygiène, habilitations électriques, gestes d'urgence)
- licences, agréments et certifications liés à l'établissement ou aux personnes
- contrôles périodiques d'équipements (extincteurs, ascenseurs, matériel médical, chambres froides)
- exercices obligatoires à documenter (évacuation, intrusion)
- documents à tenir à disposition pour un contrôle inopiné

### Comment c'est géré aujourd'hui

Dans l'immense majorité des réseaux de taille moyenne (5–30 sites), la gestion est :

- **un Excel par site**, souvent tenu à jour à moitié
- **des mails entre la directrice du site et l'assistante du siège** pour chasser les pièces
- **des rappels d'agenda placés à la main**, qu'on décale quand on est débordé
- parfois **un classeur physique** dans l'établissement

Résultat : personne au siège n'a de vue consolidée. La plupart du temps "ça passe" — jusqu'au jour où ça ne passe plus.

### Ce qui déclenche la douleur

Les incidents déclencheurs sont toujours les mêmes :

- un **contrôle inopiné** (PMI pour les crèches, CPAM pour la santé, CNAPS pour la sécurité) où il faut produire les documents en quelques minutes
- une **formation expirée** découverte trop tard, qui bloque un employé à travailler légalement
- un **agrément non renouvelé** qui entraîne une suspension d'activité
- un **audit interne** préparé dans la panique, avec 2 semaines de chasse aux documents
- l'**ouverture d'un nouveau site**, qui révèle que le process qui "marchait bien avec 3 sites" ne tient pas à 6

### Pourquoi c'est mal géré même dans des boîtes sérieuses

Ce n'est pas un problème de mauvaise volonté. C'est un problème de **croissance sans outillage** : une entreprise qui passe de 2 à 8 sites en 3 ans n'a jamais pris le temps de construire un système central, parce que le prochain site à ouvrir était toujours plus urgent.

---

<a id="pas-une-ged"></a>

## 3. Pourquoi ce n'est pas une GED

### C'est quoi une GED

GED = Gestion Électronique de Documents. Un endroit pour stocker, classer et retrouver des fichiers. Google Drive, SharePoint, Notion avec pièces jointes : ce sont des GED.

Une GED répond à la question : **"où est le document ?"**

### Ce que ce produit fait de différent

Ce produit répond à : **"est-ce que tu es en règle, sur quoi, pour qui, et jusqu'à quand ?"**

| Capacité | GED | Ce produit |
|----------|-----|------------|
| Stocker un PDF | Oui | Oui |
| Savoir qu'un document expire à une date précise | Non | Oui |
| Alerter automatiquement avant expiration | Non | Oui |
| Identifier quel site ou employé est concerné par quelle obligation | Non | Oui |
| Montrer l'écart entre ce qui devrait exister et ce qui existe | Non | Oui |
| Générer un export audit structuré en 30 secondes | Non | Oui |
| Distinguer un document actif d'un document périmé | Non | Oui |
| Vue consolidée siège sur tous les sites | Non | Oui |

### Le vrai risque : glisser vers une GED

Ce glissement arrive souvent quand un prospect dit "on a juste besoin de mieux stocker nos docs". Si tu simplifies pour faire la vente, tu construis un bel upload + classement. Le client est content 3 mois, puis réalise que c'est Google Drive en plus cher.

**La règle pour éviter ça :** construire autour de l'**obligation** (ce qui doit exister, pour qui, à quelle fréquence), pas autour du document. Le document n'est que la preuve que l'obligation est remplie.

### Ce qui rend le produit défendable

La vraie valeur est la **connaissance métier encodée dans le produit** :

Pour les crèches, le produit sait que :
- la formation GESTES doit être renouvelée tous les 2 ans par employé de contact
- l'agrément PMI est lié à l'établissement, pas à la personne
- un exercice évacuation doit être fait 2 fois par an avec date et signature

Pour la sécurité privée, le produit sait que :
- la carte CNAPS expire tous les 5 ans, par agent, et bloque l'activité si périmée
- l'autorisation préfectorale est liée à la société
- un recyclage aptitude est requis à chaque renouvellement carte

Cette connaissance métier, Google Drive ne l'a pas. Un concurrent qui veut copier doit d'abord la comprendre avant d'écrire une ligne de code. C'est le moat réel — pas la technologie.

---

<a id="exemples"></a>

## 4. Deux exemples de clients réalistes

### Exemple 1 — Réseau de 12 crèches privées

**Profil :** groupe familial ou régional, 12 établissements, 120–180 employés, pas de DSI, une ou deux personnes au siège pour l'admin.

**Obligations concrètes à gérer :**

- chaque éducatrice : diplôme valide + formation premiers secours (PSC1 ou équivalent, renouvelable tous les 2 ans) + parfois formation GESTES
- chaque crèche : agrément PMI renouvelable, conditionné à des visites de l'inspectrice
- contrôles matériels : mobilier, tables à langer, jeux extérieurs — fréquences imposées
- exercices évacuation : 2 fois par an minimum, avec registre signé
- affichages obligatoires à jour dans chaque établissement

**Ce qui se passe en pratique :**

La responsable administrative du siège a un Excel avec les dates clés. Il est tenu à jour à moitié. Deux ou trois fois par an elle fait le tour des directrices par mail pour récupérer les attestations. Une formation PSC1 a expiré sur un site sans que personne ne le remarque — découvert lors d'une visite PMI surprise. La directrice du site a dû appeler le siège pendant l'inspection pour retrouver les pièces. L'inspectrice a noté la désorganisation dans son rapport.

**Ce que le produit change :**

Le siège ouvre le tableau de bord : 12 sites en vert, orange ou rouge. Un site en orange : 2 formations expirent dans 18 jours. Un clic : quelles personnes, quelle formation, quel site. Alerte automatique déjà partie au responsable du site à J-30 et J-7. En inspection, la directrice du site ouvre l'app sur son téléphone et montre le dossier complet, structuré, en 30 secondes.

**Valeur financière perçue :**

Une suspension d'agrément PMI même de 2 semaines sur un site = 40–80 familles à reloger + revenu arrêté + réputation. À 900–1 200 €/enfant/mois sur 40–80 enfants, c'est 36 000–96 000 € de revenu sur les 2 semaines d'arrêt — sans compter l'accompagnement des familles et les impacts long terme. Le logiciel à 700 €/mois, c'est de l'assurance pas chère.

---

### Exemple 2 — Entreprise de sécurité privée, 80 agents, 3 sites

**Profil :** PME sécurité privée (gardiennage, surveillance), 80 agents sur plusieurs sites clients, 3 agences régionales.

**Obligations concrètes à gérer :**

- chaque agent : carte professionnelle CNAPS obligatoire, valable 5 ans — sans elle, l'agent ne peut pas travailler légalement le lendemain matin
- recyclage aptitude professionnelle à chaque renouvellement de carte
- autorisation d'exercer : liée à la société, renouvelable, délivrée par préfecture
- formation continue selon les types de missions (SSIAP pour les agents en ERP, par exemple)
- suivi des contrats clients : certains contrats imposent des niveaux d'habilitation spécifiques

**Ce qui se passe en pratique :**

Le responsable RH suit les cartes CNAPS dans un Excel. Il y a 80 lignes. Quand un agent part, sa ligne reste souvent. Quand un nouvel agent arrive, la ligne est ajoutée — parfois. Trois cartes ont expiré dans l'année sans être repérées à temps. L'une d'elles concernait un agent affecté à un contrat sensible. Le client a failli être informé par l'inspection du travail avant l'entreprise elle-même.

**Ce que le produit change :**

Le responsable RH voit les 80 agents avec le statut de leur carte CNAPS, le délai restant, et le calendrier des renouvellements à engager (car le process CNAPS prend 6–8 semaines). Les alertes à 90, 60 et 30 jours partent automatiquement. En cas de contrôle préfectoral, le dossier par agent est exportable en 2 minutes.

**Valeur financière perçue :**

Un agent hors conformité découvert lors d'un contrôle = amende (jusqu'à 30 000 € pour l'entreprise selon les infractions), voire retrait d'autorisation d'exercer. La perte d'un seul contrat client à cause d'un incident de conformité représente souvent 50 000–200 000 € de CA annuel. Le logiciel à 600–900 €/mois est négligeable face à ce risque.

---

<a id="solution"></a>

## 5. La solution — vue produit

### Les briques core (ce sans quoi ça devient une GED)

**Registre d'obligations par secteur**
Pas juste "des documents". Chaque type d'obligation a sa logique : à quelle fréquence elle se renouvelle, qui est concerné (l'établissement ? un rôle ? un individu ?), quelle preuve est attendue, quel délai de renouvellement est nécessaire.

**Moteur d'écart**
Pour chaque site et chaque obligation : est-ce que la preuve existe ? Est-elle valide ? Expire-t-elle bientôt ? Ce moteur est le cœur du produit. Sans lui, c'est une GED.

**Vue siège consolidée**
Tableau de bord global : code couleur par site (vert / orange / rouge), filtrable par type d'obligation, par site, par délai. Un coup d'œil suffit pour savoir où agir.

**Alertes automatiques**
À J-90, J-30, J-7 selon la criticité, adressées à la bonne personne (responsable de site, RH, direction). Pas un rappel de calendrier — une notification contextuelle avec le lien direct vers la pièce à renouveler. **Par défaut**, ces rappels d’**expiration** sont déjà programmés selon le secteur ; une entrée **« Alertes » dans la sidebar** permet d’ajuster finement (seuils, périmètre, destinataires) sans partir d’un produit « muet » à l’inscription.

**Dépôt de preuves simple**
Upload depuis mobile (photo) ou desktop (PDF). Le document est lié à l'obligation précise, pas juste stocké dans un dossier. Horodatage, versioning léger.

**Export audit**
Génère en 30 secondes un dossier structuré (PDF ou ZIP) prêt pour un inspecteur ou un audit externe. La structure suit la logique de l'inspection, pas la logique interne du logiciel.

**Rôles distincts**
Le siège voit tout. Le responsable de site gère uniquement son périmètre. L'employé peut éventuellement uploader lui-même sa pièce via un lien simple.

### Ce qu'on ne construit pas au départ

- pas de signature électronique (ça peut venir mais c'est un add-on)
- pas de workflow de validation complexe
- pas d'intégration RH profonde (import manuel au départ)
- pas d'app native (PWA ou web mobile suffisent pour commencer)

---

<a id="prix"></a>

## 6. Modèle économique et prix

### Structure tarifaire recommandée

**Abonnement mensuel basé sur le nombre de sites**, avec une option par nombre d'utilisateurs pour les gros comptes.

| Taille réseau | Prix indicatif | Logique |
|---------------|----------------|---------|
| 3–5 sites | 300–500 €/mois | Entrée de gamme, vente rapide |
| 6–15 sites | 600–1 200 €/mois | Cœur de cible |
| 16–30 sites | 1 200–2 500 €/mois | Mid-market |
| 30+ sites | Sur devis | Enterprise light |

**Setup / onboarding**

- 500–2 000 € de frais de mise en place selon la complexité
- Inclut la configuration du registre d'obligations pour leur secteur, l'import des données existantes, la formation des utilisateurs
- À ne pas négliger : c'est aussi ce qui force une vraie conversation de découverte avec le client

**Pas de "par dossier" au départ.** Le modèle récurrent est plus sain et plus simple à vendre.

### Économie du produit

- **Coût variable principal** : hébergement + APIs (LLM si tu automatises certaines extractions) → faible
- **Coût réel** : ton temps sur le support, l'onboarding et la vente
- **Marge brute logicielle** : 70–85 % une fois les templates sectoriels stables
- **Marge après temps** : plus faible les 6 premiers mois si tu fais tout toi-même, meilleure ensuite

### MRR à 6 mois (bootstrap, sans survente)

| Scénario | Clients | MRR |
|----------|---------|-----|
| Conservateur | 2–3 réseaux signés | 1 500–4 000 €/mois |
| Correct | 4–6 réseaux | 4 000–9 000 €/mois |
| Optimiste | 8–10 réseaux | 8 000–15 000 €/mois |

Le scénario "correct" suppose environ 2–3 démos par semaine dès le mois 2, et un cycle de vente de 4–8 semaines. Le scénario "conservateur" est plus probable si tu construis en parallèle.

---

<a id="vente"></a>

## 7. Comment le vendre

### Le problème de l'angle "conformité"

Le mot "conformité" est perçu comme barbant et non prioritaire. Personne n'a de budget intitulé "conformité". Ne jamais commencer par "notre solution de conformité".

### Les angles qui fonctionnent

**Angle 1 — L'inspection surprise**

> "La prochaine fois qu'un inspecteur arrive sans prévenir, tu as le dossier de chaque site en 30 secondes, ou tu passes 2 heures à appeler tout le monde ?"

C'est concret, c'est stressant, c'est déjà arrivé à la plupart des prospects. Ça ouvre la conversation sans vendre.

**Angle 2 — Le coût de l'incident**

Calculer avec le prospect ce qu'une suspension, une amende ou un incident de conformité coûterait réellement :

- crèches : suspension PMI = revenu arrêté, familles à reloger, réputation → 30 000–100 000 € facilement
- sécurité privée : retrait d'agrément partiel + perte d'un contrat → 50 000–200 000 €
- kinés : engagement de responsabilité personnelle du gérant en cas d'incident sur une RCP expirée

Face à ces chiffres, l'abonnement à 700–1 200 €/mois ressemble à une prime d'assurance raisonnable.

**Angle 3 — Le temps admin déjà dépensé**

Poser la question directement :
> "Combien d'heures par semaine votre assistante passe-t-elle à chasser des documents et vérifier des dates entre les sites ?"

La réponse est souvent 4 à 10 heures/semaine. À 35–45 €/h chargés, c'est 600 à 1 800 €/mois déjà dépensés pour faire ce que le logiciel ferait. La vente se justifie d'elle-même.

**Angle 4 — La croissance comme déclencheur**

Le meilleur moment pour vendre : quand un réseau vient d'ouvrir son 3e ou 4e site. À ce stade, le dirigeant réalise que son système "qui marchait bien avec 2 sites" ne tient plus. Il cherche activement une solution. Cibler les annonces d'ouverture de nouveaux sites dans ta niche.

### Ce qu'il ne faut pas dire

- "Optimisez votre conformité" → trop abstrait
- "Notre plateforme centralise vos documents" → ressemble à une GED à 50 €/mois
- ROI en % d'efficacité → trop flou

### Qui cibler dans l'organisation

| Interlocuteur | Rôle dans la vente |
|---------------|--------------------|
| Directeur / gérant du réseau | Décideur final, sensible au risque et à la réputation |
| Directrice administrative ou RH siège | Utilisatrice principale, sensible au gain de temps |
| Directrice régionale | Relais opérationnel, souvent le premier converti |

Ne pas commencer par le service informatique — il n'existe souvent pas dans ces structures, et s'il existe, il va chercher à intégrer dans un système existant.

### Cycle de vente attendu

- 4 à 10 semaines du premier contact à la signature
- 1 démo suffit généralement si le prospect a déjà vécu un incident
- Le frein principal : "on va en parler en interne" → relancer à J+10 avec le calcul du coût admin hebdomadaire fait avec eux

---

<a id="concurrence"></a>

## 8. Concurrence : EnRègle et positionnement vertical

En France existe déjà **[EnRègle](https://enregle.fr)** (Cybergraphe SAS) : solution de **conformité opérationnelle employeur** (habilitations, DUERP, Code du travail L4121-1 à L4121-3-1), hébergement souverain, essai 30 jours sans CB. Ce n'est pas un concurrent imaginaire — il valide que le **marché existe**. La question est **comment se différencier**, pas si le besoin est réel.

### Ce qu'EnRègle fait

- Tableau de bord des échéances, alertes (J-30, J-15, J-7), exports CSV/PDF
- Suivi des habilitations par collaborateur, formations, justificatifs
- DUERP structuré avec versionnement
- **Multi-établissements** et rôles par périmètre (présent sur le papier, pas le cœur du message marketing)
- Tarif **unique 99 €/mois** (ou 990 €/an), collaborateurs et établissements **illimités**
- Positionnement : **PME françaises**, souveraineté, simplicité, déploiement annoncé en **moins de 15 minutes**
- Produit complémentaire **LuVu** pour la chaîne de preuve (hash, horodatage, PDF vérifiable)

### Comment ils vendent (PLG / self-serve)

- **Product-led** : inscription, essai gratuit, conversion sans cycle commercial long
- **Pas de grille tarifaire complexe** : un prix, tout inclus, onboarding assisté en visio **inclus** dans l'abonnement
- Cible les entreprises qui **cherchent déjà** un outil générique "conformité RH" (SEO, bouche-à-oreille, contenu légal)
- **Ticket moyen bas** : même avec beaucoup de clients, le plafond MRR par compte reste à 99 €/mois

### Les données : tout est à la main côté client ?

Pour l'essentiel, **oui** : c'est le prix du **horizontal**. Le client doit :

- importer ou saisir les **collaborateurs** (souvent via CSV modèle)
- **configurer** les types d'habilitations / obligations pertinentes pour son activité
- renseigner dates, organismes, **upload des justificatifs**

Le produit ne sait pas à l'avance ce qu'une **crèche PMI** vs une **entreprise de sécurité CNAPS** vs un **atelier** doit suivre en détail. Il fournit un **cadre générique** (Code du travail, DUERP) que le client remplit.

### Toi, en vertical (crèches, sécurité privée, etc.)

| | EnRègle (horizontal) | Produit vertical multi-sites |
|--|----------------------|------------------------------|
| Prix | 99 €/mois tout inclus | 600–1 500 €/mois + setup |
| Vente | Self-serve, peu ou pas de commercial | Démo, 4–10 semaines, outbound ciblé |
| Onboarding | "15 minutes", client autonome | Guidé, obligations **pré-chargées** métier |
| Saisie | Client configure tout (cases vides) | **Registre métier** déjà rempli : types d'obligations, fréquences, qui est concerné |
| Multi-sites / vue siège | Fonctionnalité parmi d'autres | **Promesse centrale** du produit |
| Niches (PMI, CNAPS…) | Non modélisées en profondeur | **Cœur du moat** |
| Argument différenciant | Souveraineté, simplicité, prix | *"Vous n'avez rien à configurer : les obligations de votre secteur sont déjà là."* |

**Exemple crèches :** à l'inscription, le produit propose déjà PSC1/GESTES (qui, renouvellement), agrément PMI par site, exercices d'évacuation, etc. Le client ajoute **sites + personnes + preuves**, pas la structure réglementaire.

### Ce que ça change pour ton argument commercial

Phrase simple à tenir en démo :

> *"Vous créez un compte, vous entrez vos sites et vos équipes. Les obligations [PMI / CNAPS / …] sont déjà dans le produit. En 20 minutes vous avez un premier tableau de bord — sans passer une journée à paramétrer des types d'habilitation."*

EnRègle **ne peut pas** porter ce message pour une crèche ou une boîte de gardiennage sans devenir un autre produit. Toi si, parce que le **savoir-faire métier est dans le code**.

### Nom de marque

**Ne pas utiliser** *En Règle* / *enregle* comme marque : le `.fr` est pris et actif. Préférer un nom distinct (ex. Reglify, Certrack, Duetrack, etc.) vérifié chez un **registraire** (WHOIS), pas seulement via DNS.

---

<a id="marche"></a>

## 9. Taille du marché

### Niche 1 — Crèches privées en réseau (France)

| Indicateur | Estimation |
|------------|-----------|
| Crèches privées en France | ~14 000 établissements |
| Part gérée par des opérateurs multi-sites (3 sites et +) | ~30–40 % → ~4 000–5 000 établissements regroupés |
| Opérateurs de 3 à 30 sites (cœur de cible) | ~800–1 500 opérateurs |
| Prix moyen estimé | 600–1 000 €/mois |
| Marché adressable France (SAM) | 6–15 M€/an |
| Part capturable à 3–5 ans (sans levée) | 5–10 % → **300 k–1,5 M€ ARR** |

### Niche 2 — Sécurité privée (France)

| Indicateur | Estimation |
|------------|-----------|
| Entreprises de sécurité privée en France | ~4 500 |
| Avec 20+ agents (douleur compliance réelle) | ~1 500–2 000 |
| Prix moyen estimé | 500–900 €/mois |
| Marché adressable France (SAM) | 9–18 M€/an |
| Part capturable à 3–5 ans (sans levée) | 5–10 % → **450 k–1,8 M€ ARR** |
| Point fort | La carte CNAPS est une obligation très codifiée, facile à modéliser |

### Combiné (2 niches, France)

- SAM total : 15–33 M€/an
- Objectif réaliste à 3–4 ans en bootstrap : **1–3 M€ ARR**
- C'est suffisant pour une boîte rentable, ou une base pour une acquisition ou une levée ciblée

### Extension Europe

Les mêmes secteurs ont des obligations comparables en Belgique, Suisse, Espagne, Allemagne. Le SAM européen sur ces deux niches serait 5–8x le marché France, soit **75–250 M€/an**. À envisager après avoir prouvé le modèle France.

### Pourquoi ce marché est sous-outillé

- Les gros acteurs (Ideagen, Alcumus, SafetyCulture) visent l'enterprise à partir de 500 k€/an de contrat
- Les petits acteurs locaux ont souvent des outils datant des années 2000–2010, peu mobiles, peu UX
- Les réseaux de 5–30 sites sont trop petits pour les gros, trop grands pour Excel
- C'est exactement le segment laissé de côté
- **EnRègle** couvre la conformité **employeur générique** (habilitations, DUERP) à bas prix en self-serve ; il reste de la place pour un produit **vertical**, **multi-sites en tête**, et **ticket plus élevé** (voir [§ 8](#concurrence))

---

<a id="risques"></a>

## 10. Risques et limites

**Risque 1 — Glisser vers une GED**
Si tu simplifies trop pour faire des ventes rapides, tu perds la différenciation. Garder le registre d'obligations comme colonne vertébrale du produit, même si c'est plus long à construire.

**Risque 2 — Changer de niche trop vite**
La tentation de vendre à "toutes les PME multi-sites" est forte. Ça dilue le message, multiplie les cas d'usage à supporter, et rend la vente plus difficile. Rester sur 1–2 niches au moins jusqu'à 500 k€ ARR.

**Risque 3 — Cycle de vente long**
Les décisions dans ces structures prennent du temps. Il faut un pipeline de 20–30 prospects actifs pour avoir des signatures régulières. La prospection doit être un travail hebdomadaire, pas ponctuel.

**Risque 4 — Mise à jour réglementaire**
Les obligations changent. Une réforme sectorielle peut rendre une partie du registre obsolète. Prévoir un process de veille et de mise à jour, et facturer la valeur de ce service dans le prix.

**Risque 5 — Résistance à l'adoption sur les sites**
Le siège est convaincu, mais les responsables de site trouvent le changement contraignant. L'onboarding doit être rapide (moins de 30 minutes) et le dépôt de documents doit être faisable depuis un téléphone en 3 clics.

---

<a id="demarrage"></a>

## 11. Par où commencer

### Étape 1 — Choisir une niche (et une seule)

Les deux meilleures options :

| Critère | Crèches privées | Sécurité privée |
|---------|-----------------|-----------------|
| ICP très précis | Oui | Oui |
| Obligations très codifiées | Oui (PMI, formations) | Très oui (CNAPS) |
| Cycle de vente | Moyen (4–8 semaines) | Court si carte CNAPS imminente |
| Ticket moyen | Moyen | Moyen à bon |
| Concurrence directe **verticalisée** | Faible (voir § 8 EnRègle = horizontal) | Faible |
| Accès aux prospects | Via fédérations, LinkedIn, events | Via syndicats pro, LinkedIn |

**Recommandation :** commencer par la sécurité privée si tu veux un argument de vente très concret (carte CNAPS = blocage immédiat si expirée). Commencer par les crèches si tu préfères un secteur où le lien avec la qualité du service aux enfants renforce l'argument éthique et réputationnel.

### Étape 2 — 5 entretiens prospects avant d'écrire du code

Appeler 5 directeurs de réseaux de ta niche. Pas pour vendre. Pour poser 3 questions :

1. "Comment vous suivez aujourd'hui les formations et agréments de vos sites ?"
2. "Vous avez déjà eu un incident lié à un document expiré ou manquant ?"
3. "Si vous aviez un tableau de bord qui vous disait en temps réel ce qui est à risque, vous payeriez combien pour ça ?"

Ce que tu entends conditionne ce que tu construis.

### Étape 3 — MVP en 6–8 semaines

Fonctionnalités minimales pour signer les 3 premiers clients :

- registre d'obligations pour ta niche (codé en dur au départ, pas besoin d'admin dynamique)
- fiche par site avec statut de chaque obligation
- upload de preuves (PDF ou photo)
- alertes e-mail automatiques sur dates d'expiration
- vue siège simple (tableau statuts)

Pas d'export PDF au départ. Pas d'app mobile native. Pas de SSO. Ces choses viennent après.

### Étape 4 — Prix de lancement

Proposer les 3 premiers clients à **50 % du tarif normal** en échange de feedback et de témoignage. Ne pas faire gratuit — un client qui ne paye pas ne s'investit pas dans le produit. À partir du 4e client, tarif plein.

### Étape 5 — Ce qui fait la différence à 12 mois

Pas la technologie. La profondeur du registre d'obligations : est-ce que le produit connaît vraiment les contraintes métier du secteur ? Est-ce que les alertes correspondent à ce que vit vraiment le responsable de site ? Est-ce que l'export ressemble à ce qu'un inspecteur demande vraiment ?

Cette connaissance s'acquiert en passant du temps avec les clients. Les 12 premiers mois, autant de temps en support et en écoute qu'en développement.

---

## Résumé en une page

| Quoi | Détail |
|------|--------|
| Produit | Logiciel de suivi des obligations et documents réglementaires pour réseaux multi-sites |
| Différence vs GED | Construit autour des obligations, pas des documents — moteur d'écart + alertes + vue siège |
| Cibles prioritaires | Réseaux crèches privées (3–30 sites) ou entreprises sécurité privée (20–200 agents) |
| Prix | 300–2 500 €/mois selon taille + setup 500–2 000 € |
| Argument de vente principal | Coût d'un incident >> coût du logiciel + temps admin déjà dépensé pour faire ça manuellement |
| Concurrence FR notoire | [EnRègle](https://enregle.fr) : horizontal, 99 €/mois, habilitations + DUERP, saisie/config côté client — te différencier par **vertical + obligations pré-chargées + vue siège** ([§ 8](#concurrence)) |
| MRR à 6 mois (réaliste) | 1 500–9 000 €/mois selon intensité commerciale |
| SAM France (2 niches) | 15–33 M€/an |
| Objectif 3–4 ans | 1–3 M€ ARR en bootstrap |
| Risque principal | Glisser vers une GED ou trop s'élargir trop vite |
| Premier pas | 5 entretiens prospects avant d'écrire du code |
