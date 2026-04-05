# Deep Research — Base de connaissances réglementaires : Crèches privées françaises

## Contexte du projet

Je développe un SaaS de conformité réglementaire destiné aux réseaux de crèches privées françaises (micro-crèches, crèches collectives, multi-accueil). Le produit suit automatiquement toutes les obligations réglementaires d'un réseau multi-sites : formations du personnel, agréments, contrôles périodiques, exercices obligatoires, protocoles sanitaires.

Le cœur du produit est une base de connaissances réglementaires qui contient, pour chaque obligation :
- Le nom exact de l'obligation
- À qui elle s'applique (chaque membre du personnel individuellement, chaque établissement, ou l'entreprise entière)
- La fréquence de renouvellement (en mois)
- Le délai d'alerte recommandé avant expiration (en jours : J-90, J-60, J-30, J-7, etc.)
- Le processus de renouvellement étape par étape (comment faire concrètement)
- Les pièces justificatives requises pour le renouvellement
- L'organisme compétent qui délivre ou contrôle
- La référence légale exacte (article de loi, code, décret)
- L'URL officielle vers le portail ou le texte de loi
- Les conséquences concrètes en cas de non-conformité (fermeture, suspension d'agrément, mise en demeure)
- La preuve à conserver (quel document, quel format)

L'objectif de cette recherche est de recenser **de manière exhaustive** toutes les obligations réglementaires qui s'appliquent à une crèche privée française et à son personnel, avec suffisamment de détail pour alimenter directement cette base.

---

## Périmètre de la recherche

### 1. Formations et certifications par membre du personnel (applies_to: employee)

Pour chaque formation ou certification requise individuellement :

**1.1 PSC1 / SST / Gestes de premiers secours**
- Quelle formation exactement est exigée dans une crèche (PSC1, SST, PSE1, ou autre) ?
- Est-ce obligatoire pour tous les membres du personnel ou seulement certains rôles ?
- Durée de validité
- Recyclage : fréquence, durée, organisme habilité
- Distinction entre PSC1 (non recyclable officiellement) et SST (MAC tous les 2 ans) : laquelle s'applique en crèche ?

**1.2 Formation GESTES (Gestes et Soins d'Urgence)**
- Qu'est-ce que la formation GESTES exactement ?
- Qui doit la suivre (tous les éducateurs de contact ? uniquement les référents santé ?)
- Est-elle distincte du PSC1 / SST ou complémentaire ?
- Durée de validité et recyclage
- Organisme compétent pour la délivrer
- Base réglementaire

**1.3 Diplômes et qualifications du personnel encadrant**
- Quels diplômes sont exigés pour exercer en crèche selon le rôle :
  - Directeur/directrice de crèche (EJE, puéricultrice, médecin, psychomotricien...)
  - Éducatrice de jeunes enfants (EJE)
  - Auxiliaire de puériculture
  - CAP Accompagnant Éducatif Petite Enfance (AEPE, ex-CAP Petite Enfance)
  - Agent non diplômé : quel pourcentage autorisé, quelles conditions ?
- Ces diplômes sont-ils à durée illimitée ou nécessitent-ils une mise à jour ?
- Validation à conserver : attestation de diplôme, copie certifiée conforme ?

**1.4 Taux d'encadrement et qualification minimale**
- Ratio personnel / enfants réglementaire (enfants qui marchent vs. enfants qui ne marchent pas)
- Pourcentage minimal de personnel qualifié exigé par l'agrément PMI
- Ce qui se passe en cas de non-respect du taux (fermeture immédiate ?)

**1.5 Formation continue obligatoire**
- Y a-t-il des obligations de formation continue annuelle pour le personnel de crèche ?
- Contenu ou thématiques imposées
- Nombre d'heures minimal
- Qui finance (employeur, OPCO, CAF ?)

**1.6 Visite médicale d'aptitude**
- Obligatoire à l'embauche et en périodique ?
- Fréquence des visites périodiques pour le personnel en contact avec des enfants
- Vaccinations obligatoires pour le personnel de crèche (liste exacte, base légale)
- Y a-t-il des obligations spécifiques liées au contact avec des jeunes enfants (tuberculose, hépatite B, etc.) ?

**1.7 Casier judiciaire / extrait B3**
- Obligation de vérification du casier judiciaire à l'embauche ?
- Qui peut demander l'extrait B3 (l'employeur directement ?)
- Fréquence de renouvellement de la vérification
- Base légale

**1.8 Formation aux protocoles internes**
- Formation aux protocoles sanitaires de l'établissement (PAI, médicaments, urgences) : obligatoire formellement ou bonne pratique ?
- Traçabilité requise (attestation interne ?)

---

### 2. Obligations par établissement (applies_to: site)

Pour chaque document ou obligation lié à un établissement de crèche :

**2.1 Agrément PMI (Protection Maternelle et Infantile)**
- Qui délivre l'agrément (Conseil Départemental / PMI)
- Durée de validité de l'agrément initial
- Conditions de renouvellement et fréquence des visites d'inspection
- Ce que l'inspectrice PMI vérifie lors d'une visite (liste des points de contrôle)
- Capacité d'accueil : comment elle est fixée et comment la modifier
- Conditions de suspension ou de retrait d'agrément
- Référence légale précise (articles du Code de l'action sociale et des familles)

**2.2 Exercices d'évacuation incendie**
- Fréquence réglementaire (combien par an)
- Ce qui doit être consigné (date, heure, nombre de participants, durée, observations)
- Format du document à conserver (registre de sécurité, feuille d'émargement ?)
- Qui peut vérifier ce registre lors d'une inspection

**2.3 Contrôles des équipements et locaux**
- Liste des équipements à vérifier périodiquement :
  - Extincteurs (fréquence, organisme agréé)
  - Éclairage de sécurité (BAES)
  - Tables à langer et équipements de puériculture (fréquence, qui contrôle)
  - Aires de jeux extérieures (norme EN 1176, fréquence d'inspection)
  - Système d'alarme incendie
  - Portes coupe-feu
- Pour chaque équipement : qui fait le contrôle, quel document est remis, durée de validité

**2.4 Registre de sécurité de l'établissement**
- Contenu obligatoire
- Où il doit être tenu et mis à disposition
- Ce qui doit y être consigné

**2.5 Affichages obligatoires**
- Liste complète des affichages réglementaires dans une crèche :
  - Numéros d'urgence (15, 17, 18, 115, etc.)
  - Consignes incendie et plan d'évacuation
  - Règlement de fonctionnement affiché
  - Charte des droits et libertés de la personne accueillie (si applicable)
  - Affichage inspection du travail
  - Tout autre affichage spécifique PMI
- Fréquence de mise à jour de chaque affichage

**2.6 Protocoles sanitaires obligatoires**
- PAI (Projet d'Accueil Individualisé) : obligation de mise en place, renouvellement annuel
- Protocole de gestion des médicaments : qui peut administrer, quelle traçabilité
- Protocole en cas de maladie contagieuse ou épidémie
- Registre des soins / livre de bord sanitaire : obligation de tenue

**2.7 DUERP (Document Unique d'Évaluation des Risques)**
- Fréquence de mise à jour (annuelle + événementielle)
- Risques spécifiques à intégrer dans une crèche (chutes, TMS, risques biologiques, stress)
- Qui peut le rédiger

**2.8 Règlement de fonctionnement**
- Obligation d'existence et de mise à disposition des familles
- Fréquence de révision réglementaire
- Ce qu'il doit contenir (contenu minimal réglementaire)

**2.9 Projet d'établissement**
- Obligation d'existence
- Fréquence de révision
- Ce qu'il doit contenir

---

### 3. Obligations de l'organisation gestionnaire (applies_to: organization)

**3.1 Assurance Responsabilité Civile Professionnelle**
- Obligatoire ?
- Montant minimum de couverture s'il est réglementé
- Ce qui doit être conservé comme preuve (attestation annuelle)

**3.2 Agrément ou habilitation de l'organisme gestionnaire**
- Existe-t-il un agrément distinct de l'agrément PMI par établissement, pour l'organisme gestionnaire lui-même ?
- Conditions et renouvellement

**3.3 Obligations vis-à-vis de la CAF (Caisse d'Allocations Familiales)**
- Convention avec la CAF : conditions, durée, renouvellement
- PSU (Prestation de Service Unique) : obligations contractuelles et documents à produire
- Rapports d'activité annuels à la CAF

**3.4 Obligations vis-à-vis de la MSA (si applicable)**
- Pour les crèches en zone rurale ou agricole

**3.5 Agrément "entreprise solidaire d'utilité sociale" (ESUS)**
- Applicable aux crèches associatives ou coopératives ?
- Obligations découlant de cet agrément

**3.6 Obligations employeur générales**
- Registre unique du personnel
- Affichage convention collective applicable (IDCC correspondant)
- Déclaration préalable à l'embauche (DPAE)

---

### 4. Contrôles et inspections (qui contrôle, comment, avec quoi)

- **PMI (médecin ou puéricultrice du Conseil Départemental)** : fréquence des visites, ce qui est vérifié, pouvoirs d'injonction et de fermeture
- **Inspection du travail** : documents demandés
- **CAF** : contrôles de conformité liés à la PSU
- **Commission de sécurité** : pour les ERP (une crèche est un ERP de quelle catégorie ?)
- **Direction Départementale de la Protection des Populations (DDPP)** : rôle éventuel

---

### 5. Ce qui déclenche des sanctions (et leur niveau)

Pour chaque type d'infraction :
- Infraction (ce qui est en défaut)
- Sanction administrative (suspension d'agrément, fermeture administrative, mise en demeure)
- Sanction pénale éventuelle
- Responsabilité : qui est sanctionné (gestionnaire, directrice, employeur)
- Délai accordé pour se mettre en conformité avant sanction
- Exemples de cas réels ou décisions du Conseil Départemental si disponibles

---

### 6. Spécificités selon le type de structure

Préciser si les obligations diffèrent selon :

- **Micro-crèche** (moins de 12 places) vs **crèche collective** (plus de 12 places)
- **Crèche d'entreprise** vs **crèche associative** vs **crèche commerciale**
- **Multi-accueil** (accueil régulier + occasionnel) vs accueil exclusivement régulier
- **Crèche familiale** (assistantes maternelles coordonnées) : obligations spécifiques

---

### 7. Sources officielles à citer

Pour chaque obligation identifiée, fournir :
- L'article de loi ou de décret exact (Code de l'action sociale et des familles en priorité)
- Le lien vers la page Légifrance correspondante
- Le lien vers les ressources officielles CAF / CNAF
- Les circulaires ou instructions interministérielles applicables

Sources à consulter en priorité :
- Code de l'action sociale et des familles (CASF), articles L2324-1 et suivants, R2324-1 et suivants
- Décret du 7 juin 2010 relatif aux établissements et services d'accueil des enfants de moins de 6 ans (décret "Morange") et ses modifications
- Décret n°2021-1131 du 30 août 2021 (réforme des modes d'accueil)
- Décret n°2023-... (réforme des crèches de 2023 / loi plein emploi — vérifier les nouvelles obligations)
- Site CAF.fr / CNAF
- UNAF, ACEPP, Fédération Française des Entreprises de Crèches (FFEC)
- Ministère des Solidarités et de la Santé

---

### 8. Ce que je ne trouve pas facilement (questions ouvertes)

Identifier et répondre à ces points souvent flous dans la pratique :

- La réforme de 2023 (Loi Plein Emploi / bonus qualité) a-t-elle introduit de nouvelles obligations réglementaires pour les crèches privées ? Si oui, lesquelles exactement et depuis quand sont-elles applicables ?
- L'agrément PMI est-il délivré une seule fois (permanent sauf retrait) ou doit-il être renouvelé périodiquement ?
- Une directrice de crèche qui change d'établissement doit-elle faire re-délivrer un agrément PMI pour le nouveau site, ou l'agrément suit-il l'établissement ?
- Y a-t-il des obligations différentes selon le département (les PMI départementales ont-elles une marge d'interprétation ?) ?
- Le casier judiciaire (extrait B3) doit-il être renouvelé périodiquement pour le personnel en poste, ou seulement vérifié à l'embauche ?
- La formation GESTES est-elle une obligation réglementaire formelle ou une recommandation de la PMI ?
- Quelles sont les obligations spécifiques introduites suite aux scandales de maltraitance en crèches (rapport Chevalier 2023) ?

---

## Format attendu de la réponse

Pour chaque obligation identifiée, structurer la réponse ainsi :

```
### [Nom de l'obligation]
- **Applies_to** : employee / site / organization
- **Renewal_months** : X mois (ou "illimité" si pas de renouvellement)
- **Alert_days** : [J-X, J-X, J-X] (recommandation basée sur le délai de traitement réel)
- **Renewal_process** : [étapes concrètes, dans l'ordre]
- **Required_documents** : [liste des pièces]
- **Competent_authority** : [nom de l'organisme]
- **Official_url** : [URL]
- **Legal_reference** : [article précis]
- **Consequences** : [sanction en cas de non-conformité]
- **Proof_to_keep** : [quel document conserver, sous quel format]
- **Notes** : [précisions importantes, cas particuliers, différences micro-crèche vs. crèche collective]
```

Regrouper les obligations par catégorie (personnel, établissement, organisation) et signaler clairement si une information est incertaine, non trouvée, ou variable selon les cas (département, type de structure).
