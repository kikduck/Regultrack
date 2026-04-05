# Deep Research — Base de connaissances réglementaires : Sécurité privée française

## Contexte du projet

Je développe un SaaS de conformité réglementaire destiné aux entreprises de sécurité privée françaises (gardiennage, surveillance, protection rapprochée, SSIAP). Le produit suit automatiquement toutes les obligations réglementaires d'un réseau multi-sites : formations des agents, habilitations, documents d'entreprise, contrôles périodiques.

Le cœur du produit est une base de connaissances réglementaires qui contient, pour chaque obligation :
- Le nom exact de l'obligation
- À qui elle s'applique (chaque agent individuellement, chaque site, ou l'entreprise entière)
- La fréquence de renouvellement (en mois)
- Le délai d'alerte recommandé avant expiration (en jours : J-90, J-60, J-30, J-7, etc.)
- Le processus de renouvellement étape par étape (comment faire concrètement)
- Les pièces justificatives requises pour le renouvellement
- L'organisme compétent qui délivre ou contrôle
- La référence légale exacte (article de loi, code, décret)
- L'URL officielle vers le portail ou le texte de loi
- Les conséquences concrètes en cas de non-conformité (amende, suspension, interdiction)
- La preuve à conserver (quel document, quel format)

L'objectif de cette recherche est de recenser **de manière exhaustive** toutes les obligations réglementaires qui s'appliquent à une entreprise de sécurité privée française et à ses agents, avec suffisamment de détail pour alimenter directement cette base.

---

## Périmètre de la recherche

### 1. Habilitations et certifications par agent (applies_to: employee)

Pour chaque certification ou habilitation requise individuellement par agent :

**1.1 Carte professionnelle CNAPS**
- Qui est concerné exactement (quelles activités : APS, surveillance humaine, cynophile, SSIAP, transport de fonds, protection rapprochée, etc.)
- Durée de validité
- Délai réel de traitement par le CNAPS (attention : ce délai est critique pour les alertes préventives)
- Processus de renouvellement étape par étape (portail, formulaires, pièces)
- Liste exacte des pièces requises pour le renouvellement vs la première demande
- Conditions de refus ou de retrait
- Conséquences si l'agent travaille sans carte valide (pour l'agent, pour l'entreprise)
- Référence légale précise

**1.2 Recyclage aptitude professionnelle**
- En quoi consiste ce recyclage
- À quelle fréquence (est-ce lié au renouvellement de la carte CNAPS ou indépendant)
- Quels organismes de formation sont habilités à le délivrer
- Comment vérifier qu'un organisme est bien habilité CNAPS

**1.3 SSIAP (Service de Sécurité Incendie et d'Assistance à Personnes)**
- Les 3 niveaux (SSIAP 1, 2, 3) : qui doit avoir quoi
- Dans quels établissements chaque niveau est requis (ERP, IGH, etc.)
- Durée de validité par niveau
- MAC (Maintien et Actualisation des Compétences) : fréquence, durée, contenu
- Organismes habilités
- Différence entre le MAC SSIAP et le recyclage initial

**1.4 SST (Sauveteur Secouriste du Travail)**
- Qui doit l'avoir dans le secteur sécurité privée (est-ce obligatoire ou recommandé)
- Durée de validité
- MAC SST : fréquence
- Distinction SST / PSC1 / PSE1 : laquelle est exigée dans quel contexte

**1.5 Habilitation électrique**
- Dans quels cas un agent de sécurité doit être habilité électriquement
- Niveaux d'habilitation pertinents (B0, H0, etc.)
- Durée de validité recommandée (pas réglementée uniformément — préciser)
- Organisme de formation

**1.6 Formation préalable à l'embauche (FPE)**
- Obligatoire pour tout nouvel agent sans expérience ?
- Durée et contenu
- Qui peut la dispenser

**1.7 Formation continue / perfectionnement**
- Y a-t-il des obligations de formation continue au-delà du recyclage aptitude
- Convention collective de la sécurité privée (IDCC 1351) : obligations CPF, entretien professionnel, plan de développement des compétences

**1.8 Visite médicale d'aptitude**
- Obligatoire pour les agents de sécurité ?
- Fréquence (visite initiale + périodique)
- Médecin du travail ou agrément spécifique
- Y a-t-il des aptitudes spécifiques requises (port d'arme, travail de nuit, agent cynophile)

**1.9 Aptitude au port d'arme**
- Pour quelles activités le port d'arme est autorisé
- Habilitation spécifique requise
- Formation et recyclage tir
- Déclaration préfectorale

**1.10 Autres certifications éventuelles**
- Agent cynophile : certification spécifique ?
- Transport de fonds : formations particulières ?
- Protection rapprochée : exigences supplémentaires ?
- Télésurveillance : obligations spécifiques ?

---

### 2. Obligations par site / agence (applies_to: site)

Pour chaque document ou obligation lié à un établissement ou une agence :

**2.1 DUERP (Document Unique d'Évaluation des Risques Professionnels)**
- Fréquence de mise à jour réglementaire (annuelle + événementielle)
- Ce que doit contenir un DUERP dans le secteur sécurité privée (risques spécifiques : agression, stress, travail de nuit, port de charge)
- Qui peut le rédiger
- Où doit-il être conservé et mis à disposition

**2.2 Registre de sécurité du site**
- Contenu obligatoire
- Fréquence de mise à jour
- Contrôles périodiques à y consigner (extincteurs, éclairage de sécurité, etc.)

**2.3 Affichages obligatoires**
- Liste complète des affichages obligatoires dans une agence de sécurité privée (inspection du travail, règlement intérieur, consignes incendie, etc.)
- Fréquence de mise à jour

**2.4 Registre du personnel**
- Obligations de tenue du registre unique du personnel
- Informations à y faire figurer pour les agents

**2.5 Exercices de sécurité**
- Exercices d'évacuation incendie : fréquence réglementaire par type d'établissement
- Document à conserver

---

### 3. Obligations de l'entreprise (applies_to: organization)

**3.1 Autorisation d'exercer (préfectorale)**
- Nom exact de cette autorisation
- Durée de validité
- Processus de renouvellement
- Conditions de retrait
- Cas où elle est requise vs. non requise
- Référence légale

**3.2 Assurance Responsabilité Civile Professionnelle**
- Obligatoire ou recommandée ?
- Montant minimum de couverture réglementaire s'il en existe un
- Renouvellement annuel : ce qui doit être conservé comme preuve

**3.3 Garantie financière**
- Existe-t-il une obligation de garantie financière pour les entreprises de sécurité privée ?

**3.4 Déclaration des dirigeants et associés au CNAPS**
- Obligation de déclaration de chaque dirigeant, associé, salarié en contact avec la clientèle
- Fréquence de mise à jour
- Documents à fournir

**3.5 Convention collective (IDCC 1351)**
- Obligations découlant directement de la CC pour l'employeur (registres, affichages spécifiques, etc.)

**3.6 Agrément pour activités spécifiques**
- Transport de fonds : agrément spécifique requis ?
- Surveillance de manifestations sportives ou culturelles : exigences particulières ?

**3.7 Obligations RGPD spécifiques**
- Vidéosurveillance : déclarations, autorisations préfectorales pour les clients ?
- Traitement des données des agents et des clients

---

### 4. Contrôles et inspections (qui contrôle, comment, avec quoi)

- **CNAPS** : pouvoirs de contrôle, fréquence des contrôles, ce qu'ils demandent à voir, sanctions possibles
- **Inspection du travail** : documents demandés lors d'un contrôle dans une entreprise de sécurité privée
- **Préfecture** : occasions de contrôle de l'autorisation d'exercer
- **Client donneur d'ordre** : obligations contractuelles typiques imposées par les clients (cahiers des charges, exigences de conformité)

---

### 5. Ce qui déclenche des sanctions (et leur niveau)

Pour chaque infraction principale :
- Infraction (ce qui est en défaut)
- Sanction administrative (amende CNAPS, suspension, retrait d'agrément)
- Sanction pénale éventuelle
- Responsabilité : qui est sanctionné (entreprise, dirigeant, agent)
- Exemples de cas réels ou jurisprudence si disponible

---

### 6. Sources officielles à citer

Pour chaque obligation identifiée, fournir :
- L'article de loi ou de décret exact (Livre VI du Code de la sécurité intérieure en priorité)
- Le lien vers la page Légifrance correspondante
- Le lien vers la page officielle du CNAPS correspondante (si applicable)
- Les formulaires officiels (avec numéro de cerfa si existant)

Sources à consulter en priorité :
- Code de la sécurité intérieure (CSI), Livre VI
- Site officiel CNAPS : cnaps.interieur.gouv.fr
- Légifrance
- Convention collective nationale des entreprises de prévention et de sécurité (IDCC 1351)
- Site du Ministère de l'Intérieur
- USP (Union des entreprises de Sécurité Privée) et SNES (Syndicat National des Entreprises de Sécurité)

---

### 7. Ce que je ne trouve pas facilement (questions ouvertes)

Identifier et répondre à ces points souvent flous dans la pratique :

- Quelle est la différence exacte entre "carte professionnelle" et "autorisation d'exercer" ? Sont-ce deux choses distinctes ?
- Un agent dont la carte CNAPS est en cours de renouvellement peut-il continuer à travailler pendant la période de traitement ?
- Y a-t-il des obligations différentes selon la taille de l'entreprise (moins de 11 salariés vs. plus) ?
- Les obligations varient-elles selon les régions ou départements (préfectures locales) ?
- Quelles sont les nouveautés réglementaires introduites entre 2023 et 2026 (réformes, nouvelles obligations) ?

---

## Format attendu de la réponse

Pour chaque obligation identifiée, structurer la réponse ainsi :

```
### [Nom de l'obligation]
- **Applies_to** : employee / site / organization
- **Renewal_months** : X mois
- **Alert_days** : [J-X, J-X, J-X] (recommandation basée sur le délai de traitement réel)
- **Renewal_process** : [étapes concrètes, dans l'ordre]
- **Required_documents** : [liste des pièces]
- **Competent_authority** : [nom de l'organisme]
- **Official_url** : [URL]
- **Legal_reference** : [article précis]
- **Consequences** : [sanction en cas de non-conformité]
- **Proof_to_keep** : [quel document conserver, sous quel format]
- **Notes** : [précisions importantes, cas particuliers]
```

Regrouper les obligations par catégorie (agent, site, entreprise) et signaler clairement si une information est incertaine, non trouvée, ou variable selon les cas.
