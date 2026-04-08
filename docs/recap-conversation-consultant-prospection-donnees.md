# Récapitulatif — conversation consultant (produit, prospection, données)

> Source : [conversation partagée Claude](https://claude.ai/share/07ac2326-2699-4ba9-a8ba-42d85d6e39a3) (copie d’un échange entre l’auteur du projet et l’assistant).  
> **Documents de référence dans le dépôt :** [`CHECKLIST.md`](../CHECKLIST.md) (section *Validation marché & retour consultant*), [`conformite-multi-sites.md`](../conformite-multi-sites.md) (§ 12 *Synthèse retour externe & prospection*).  
> Les chiffres issus des exports API (80.10Z, 88.91A) reflètent l’état des analyses au moment de l’échange ; les totaux peuvent évoluer si les scripts ou filtres changent.

---

## 1. Demande initiale de l’auteur

- Présentation du SaaS Regultrack (conformité multi-sites, obligations vs GED, tarification, etc.).
- Demande d’un **avis objectif et sincère** : forces / faiblesses, viabilité, justesse de la proposition (problèmes, solutions, tarifs), intérêt du marché.

---

## 2. Retour global sur le produit et le marché

### 2.1 Synthèse « l’essentiel »

- **Bon problème**, **proposition claire**, **exécution technique impressionnante**, mais **angles morts réels** à regarder en face.

### 2.2 Ce qui est jugé solide

| Thème | Détail |
|--------|--------|
| Problème | Réel et bien articulé (Excel par site, mails, contrôle inopiné qui tourne mal) — vécu sectoriel, pas inventé. |
| GED vs obligation | Distinction **juste et défendable** ; la phrase clé : *« le document n’est que la preuve que l’obligation est remplie »*. |
| Vente | Angles **coût de l’incident**, **temps admin déjà dépensé**, cible **ouverture 3e–4e site** — instincts commerciaux jugés bons. |
| Roadmap | **MVP → onboarding assisté → calibreur IA** : ordre sain ; ne pas mettre l’IA en entrée de gamme = décision « adulte ». |
| Concurrence | Analyse d’EnRègle jugée **honnête** ; horizontal ~99 € vs vertical 600–1 500 € **défendable** si la profondeur sectorielle tient. |

### 2.3 Ce qui est jugé faible ou risqué

1. **Construction avant validation** — L’auteur avait noté « entretiens avant code » ; le niveau de build (Next.js, CRUD, scoring, alertes, preuves hashées, obligations seed, etc.) est pointé comme **décalage** par rapport à ce principe.
2. **Marché réel vs chiffres** — Exemple crèches : même avec des hypothèses favorables (5 % de pénétration sur 3–4 ans), l’ARR reste dans une fourchette **bootstrap** (ex. ordre de grandeur **500 k€–1 M€**), pas une ambition type levée sans changer de scope.
3. **« Moat » réglementaire** — Connaissance métier = surtout **moat d’effort** ; un concurrent motivé peut rattraper. **Maintenance** de la base = coût permanent ; risque si templates **périmés** au moment d’un contrôle.
4. **Cycle de vente 4–10 semaines** — Jugé **optimiste** ; « on en parle en interne » peut s’étirer sans sponsor budget.
5. **Prix d’entrée 300–500 €/mois (3–5 sites)** — **Tendu** pour des structures petites / admin à mi-temps sans DSI.

### 2.4 Lacunes du dossier (à compléter)

- **Canaux de distribution concrets** (contacts fédérations, avocats, assureurs, etc.) — pas seulement « LinkedIn + fédérations » en théorie.
- **ICP nominatif** : noms de **structures réelles** contactables le lendemain — sans quoi la prospection reste abstraite.

### 2.5 Verdict global (reformulé)

- **Viable ?** Oui — problème réel, marché sous-outillé, exécution sérieuse.
- **Proposition juste ?** Largement oui — positionnement vs GED, tarifs dans la bonne fourchette, bons risques identifiés **hors** nuance juridique approfondie ensuite.
- **Marché intéressant ?** Suffisant pour un **bootstrap rentable** (~500 k€–1 M€ ARR) ; **pas** suffisant tel quel pour une levée sans élargir scope / secteurs / pays.
- **Priorité** : parler à **~10 vrais prospects** avant d’empiler back-office / IA / second verticale — **validation du problème tel qu’ils le vivent**.

---

## 3. Réaction de l’auteur (codé avant validation)

- Reconnaissance du **code avant validation**, justifiée par la **facilité** avec l’IA de code et la **rapidité** de la première couche.

---

## 4. Outil de veille réglementaire (R4 / B5)

### 4.1 Ce que l’architecture règle

- **Détection de changement** sur sources officielles (ex. évolutions Légifrance / CNAPS) — **utile et réel**.

### 4.2 Ce qu’elle ne règle pas

- **Risque juridique de fond** si un template était **faux dès l’origine** (fréquence, obligation manquante, mauvaise lecture du texte) : la veille compare **ancien / nouveau**, pas « corpus archivé » vs « vérité juridique complète ».

### 4.3 Mitigations (hors seule la veille IA)

1. **Validation initiale** par un **professionnel du secteur** (CNAPS, PMI, etc.), pas uniquement un généraliste.
2. **CGU** : outil de **suivi**, pas **conseil juridique** — nécessaire mais pas suffisant seul.

**Conclusion consultant :** la veille IA = **bonne couche n°2**, pas la **protection principale**.

*(Aligné avec la synthèse dans [`CHECKLIST.md`](../CHECKLIST.md), bloc *Risque juridique — nuance sur la veille IA*.)*

---

## 5. Marges à ~500 k€–1 M€ ARR (bootstrap)

### 5.1 Coûts variables

- Infra + APIs : souvent **~2–5 %** du revenu vers **~500 k€ ARR** → **marge brute logicielle** très élevée sur le papier.

### 5.2 Scénarios « structure humaine »

| Scénario | Hypothèse | Marge nette (ordre de grandeur, avant impôt) |
|----------|-----------|-----------------------------------------------|
| Solo jusqu’à ~500 k€ ARR | ~30–50 clients max, charge élevée | **~70–80 %** |
| +1 recruté (support/vente, ex. ~45 k€ chargé) dès ~300 k€ ARR | Modèle plus sain / scalable | **~55–65 %** |
| ~1 M€ ARR, petite équipe (ex. 2 personnes, charges salariales ~100–130 k€/an) | | **~65–72 %** |

- Référence comparée : SaaS B2B vertical bootstrap bien géré souvent **~60–75 %** de marge nette avant impôt.
- **Chiffre d’ancrage** cité : à **~700 k€ ARR** bien géré, **~400–500 k€** de résultat annuel **possible** sur un horizon **3–4 ans** si les premiers clients sont signés dans les mois — à **affiner** avec expert-comptable / statut.

---

## 6. Prospection sans réseau — plan en étapes

> Synthèse opérationnelle déjà condensée dans [`CHECKLIST.md`](../CHECKLIST.md) ; ci-dessous le **détail** tel que dans la conversation.

### Étape 0 — Une niche pour commencer

- **Ne pas** lancer crèches + sécurité en parallèle.
- **Avis initial du consultant (avant analyse des CSV)** : commencer par la **sécurité privée** (douleur CNAPS immédiate, vocabulaire cadré).

### Étape 1 — Liste avant tout contact

- **Objectif : ~50 entreprises nominatives en ~1 semaine.**
- Sources citées pour la sécurité privée :
  - **LinkedIn** (directeur + sécurité privée, France ; affiner gardiennage / surveillance ; cible **20–200 agents**).
  - **Société.com / Pappers** — NAF **8010Z** ; filtres taille / région ; signal de croissance (nouveaux établissements).
  - **SNES / USP** — annuaires membres, organisations à revisiter **après** premiers clients / témoignages.
  - **Marchés publics** (BOAMP, etc.) — entreprises soumises à exigences d’habilitation / conformité.

### Étape 2 — Première approche : comprendre, pas vendre

- **Outbound froid** mais **chirurgical** ; canal : **LinkedIn puis email**.
- **Modèle de message LinkedIn** (court, pas de pitch, une question) : présenter l’outil CNAPS / formations, demander **20 minutes** « pas de pitch, juste des questions ».
- **Taux de réponse** réaliste évoqué : **~10–20 %** sur message ciblé → sur 50 contacts, **~5–10** réponses possibles.

### Étape 3 — Entretien découverte (~20 min)

- Objectif : **écouter**, pas démo en premier.
- **Cinq questions** (ordre suggéré) :
  1. Comment vous suivez aujourd’hui cartes CNAPS et formations ?
  2. Combien de temps par semaine / mois pour tenir ça à jour ?
  3. Incident déjà vécu (carte expirée, contrôle tendu) ?
  4. Qu’est-ce qui manque le plus dans le système actuel ?
  5. Si tableau de bord statut CNAPS + échéances — qu’est-ce que ça changerait ?
- **Démo ~10 min** seulement **à la fin** si l’échange est bon.

### Étape 4 — Démo

- Montrer le **flux**, pas la liste des menus ; scénario concret (ex. **45 agents**).
- Données de démo **réalistes sectorielles** (noms / sites / dates crédibles).
- Anticiper « **et si la réglementation bouge ?** » → veille + **templates maintenus**, pas tout reconfigurer côté client.
- Ne pas **s’excuser** des manques : noter et « on en discute en interne ».

### Étape 5 — Pilotes payants

- Formulation type : **3 pilotes** sur **3 mois**, **50 %** du tarif, accompagnement personnel, retours produit.
- Fourchette pilote suggérée : **~250–400 €/mois** pour **20–80 agents** — **pas gratuit**.

### À éviter

- Ne **pas** commencer par fédérations pour **signer** (lenteur 6–12 mois).
- Pas de cold call sans **2 min** sur le profil LinkedIn.
- Pas de démo sans **au moins 3 questions** de découverte.

### Plan 3 semaines (objectif)

- Ne pas viser la **signature** d’abord mais entendre le **même problème** décrit **~5 fois** de la même façon.

---

## 7. Données prospection — méthode (script API)

### 7.1 Question de l’auteur

- Liste d’entreprises par **code NAF**, script d’extraction, fichiers d’analyse : la **méthode** est-elle bonne ? Qu’en **tirer** ?

### 7.2 Avis consultant sur la méthode

- **API Recherche d’entreprises** plutôt que **scraper Pappers** : **légalement propre**, **stable**, **reproductible**.
- Script jugé **bien écrit** (rate limits, déduplication, etc.).
- **Limite** : **pas d’email / téléphone direct** dans ces exports — à combler par **enrichissement** (outils B2B type Kaspr, Dropcontact cités, conformité RGPD à vérifier) ou **manuel**.

*(Aligné avec [`CHECKLIST.md`](../CHECKLIST.md), bloc *Pappers, scraping et alternative légale* et script `fetch_securite_privee_sirene.py`.)*

---

## 8. Lecture des données — **NAF 80.10Z** (sécurité privée)

> Chiffres tels que mentionnés dans la conversation (basés sur l’analyse du fichier à ce moment-là).

### 8.1 Taille et shortlist

- **~1 691** entreprises **10+ salariés** en 80.10Z = marché **atteignable** au sens « liste brute ».
- **ICP resserré** (ex. PME, **2+ établissements ouverts**) : **~150** entreprises — jugé **très étroit** : **chaque lead compte**, pas de prospection « au hasard ».

### 8.2 Multi-sites : distribution des établissements

- **Médiane à 1 établissement** : majorité **mono-établissement** → **pas** le cœur du ICP multi-sites.
- Nuance : **établissements Sirene ≠ sites opérationnels** surveillés pour une boîte de gardiennage — à **qualifier en appel**.

### 8.3 Géographie

- Départements dominants : **93, 75, 13, 94-95-92** — forte **concentration IDF**.
- Auteur à **Lyon (69)** : **~52** entreprises dans la liste — **2e bassin** après IDF évoqué.
- **Recommandation** : prioriser **IDF + PACA (13, 06, 83) + Rhône (69)** → **~60–65 %** du marché en zones denses.

### 8.4 Tranches d’effectifs

- **20–49 salariés** : **~726** entreprises — **sweet spot** (densité max).
- Combiné **2+ établissements** : meilleur ratio qualification.
- **50–99** : **~147** entreprises — **2e priorité** (ticket plus élevé, cycle parfois plus long).

**Profil type 20–49 + 2–3 sites :** douleur CNAPS réelle, souvent pas de DSI bloquant, RH / dirigeant surchargé, **400–700 €/mois** sans comité lourd.

### 8.5 Actions recommandées sur la shortlist « 150 »

1. **Qualification manuelle LinkedIn** (~5–10 min / société) : dirigeant joignable ? vraie multi-ville ? RH / admin identifiable ? → **~12–25 h** pour 150 lignes.
2. **Enrichissement** contacts (Kaspr / Dropcontact, budget **~30–50 €/mois** cité en ordre de grandeur).

### 8.6 Reconsidération crèches / sécurité (à ce stade de l’échange)

- Hypothèse : les **crèches privées multi-sites** pourraient être un **meilleur premier marché** que la sécurité, car le multi-site est **plus structurel** (une crèche = un lieu) et le **SAM** du doc (~800–1 500 opérateurs) **plus profond** que **~150** qualifiés sécu — **à confirmer** par le **même exercice** sur **88.91A**.

---

## 9. Données **NAF 88.91A** (crèches) — comparaison directe

### 9.1 Graphiques et distributions

- **Établissements ouverts** : en sécurité, courbe **massée sur 1** ; en crèches, distribution **beaucoup plus étalée** multi-établissements.
- **Effectifs** : en crèches, **10–19** très dominant (**~1 561** entreprises) — différent de la sécu où **20–49** dominait.

### 9.2 Géographie (crèches)

- **92** en tête (**~191** entreprises) ; **69 (Rhône) 2e** avec **~120** — opportunité **Lyon** pour démos présentielles et réputation locale, puis montée en charge IDF.

### 9.3 Dirigeants manquants (~50 %)

- Problème de **qualité de donnée** : ~50 % sans nom de dirigeant dans l’API.
- Causes possibles : structures associatives / SASU / gérance peu visibles dans la source.
- **Contournement** : site web de la structure, LinkedIn, parfois mieux renseigné pour les crèches.

### 9.4 Conclusion stratégique du consultant (après comparaison des deux jeux)

- **Commencer par les crèches** — argument **quantitatif** :
  - **~869** prospects qualifiés (selon critères de shortlist crèches) vs **~150** en sécurité → **~6×** plus de marge pour **itérer** sur le pitch sans « brûler » le fichier.
  - **~3,16** établissements en moyenne (crèches) vs **~1,49** (sécu) → multi-sites **plus natif** côté crèches.
  - **Lyon 2e** avec **~120** structures → terrain **local** pour les **3 premiers clients**.

**Plan d’action immédiat suggéré (crèches) :**

- Raffiner les **869** avec **3+ établissements ouverts** + tranche **20–49** (budget plus confortable) → cible **~200–250** entreprises (chiffre cité dans l’échange — à recalculer si les filtres CSV changent).

---

## 10. Synthèse : tension entre les deux fils du conseil

1. **Fil qualitatif / premier message** : niche **sécurité privée** d’abord (CNAPS, vocabulaire, message LinkedIn très cadré).
2. **Fil quantitatif / données API** : le **même interlocuteur** conclut, après les exports, à **privilégier les crèches** sur le **volume** de comptes **multi-sites qualifiés** et la **structure** du marché.

**Implication pour le dépôt :** trancher par le **terrain** (entretiens sur les **deux** verticales si besoin) et garder les listes à jour via le hub **`docs/prospects/`** ([analyse-securite-privee.md](./prospects/analyse-securite-privee.md), [analyse-creches.md](./prospects/analyse-creches.md), [SYNTHESE-COMPARATIVE-SECTEURS.md](./prospects/SYNTHESE-COMPARATIVE-SECTEURS.md)). Les anciens chemins `docs/analyse-prospects-*.md` redirigent. La section § 12 de [`conformite-multi-sites.md`](../conformite-multi-sites.md) rappelle le plan prospection ; ce document détaille la **contradiction résolue par les chiffres** dans la conversation.

---

## 11. Fichiers cachés dans le partage

- L’interface indique *« Files hidden in shared chats »* : pièces jointes / exports complets ne sont **pas** reproduits ici ; s’appuyer sur les analyses versionnées ou locales dans `docs/` et `data/` (gitignore le cas échéant).

---

*Document rédigé pour archiver le fond de l’échange et l’aligner avec la documentation produit du dépôt.*
