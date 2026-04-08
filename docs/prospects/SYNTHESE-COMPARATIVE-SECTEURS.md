# Synthèse comparative — verticales Regultrack et données de prospection

Ce document croise **(A)** des critères stratégiques « produit / marché » (multi-sites structurel, obligations codifiées, gravité si non-conforme, accessibilité sans DSI) et **(B)** des **indicateurs issus des exports API** (avril 2026, tranches effectif INSEE ≥ 10 salariés). Les volumes ne sont **pas** le SAM réel pour tous les secteurs : voir les mises en garde par NAF (notamment **56.29A** et **47.73Z**).

**Index analyses détaillées :** [README.md](./README.md)  
**Méthode technique :** [METHODOLOGIE-API.md](./METHODOLOGIE-API.md)  
**Registre technique :** `scripts/prospecting/sectors.json`  
**Recalcul des chiffres :** `python scripts/prospecting/sector_stats.py` ; export JSON versionné : `python scripts/prospecting/sector_stats.py -o docs/prospects/stats-secteurs.json` (ou `--json` sur la sortie standard).

---

## 1. Cadre de sélection (avant de coder une nouvelle verticale)

Un secteur est pertinent pour Regultrack s’il cumule idéalement **quatre** propriétés :


| #   | Critère                        | Question test                                                                          |
| --- | ------------------------------ | -------------------------------------------------------------------------------------- |
| 1   | **Multi-sites natif**          | Plusieurs établissements **physiques** sont-ils la norme du métier (pas l’exception) ? |
| 2   | **Obligations très codifiées** | Textes / normes précis : qui, quoi, fréquence, preuve ?                                |
| 3   | **Conséquence grave**          | Suspension, amende lourde, risque pénal du dirigeant — pas un simple rappel ?          |
| 4   | **Sans DSI**                   | PME / ETI sans projet SI interne qui bloque l’achat 18 mois ?                          |


**Important :** « avoir des obligations » ne suffit pas si la structure n’est pas **multi-établissements** au sens du produit (vue siège, par site).

---

## 2. Tableau comparatif — données API (unités légales, effectif ≥ 10)

Chiffres arrondis ; **shortlist** = indicateur technique PME + tranches 10–49 sal. + **≥ 2** établissements ouverts (à recaler selon l’ICP réel).


| Secteur                   | NAF (registre)  | UL        | % dirigeants API | Shortlist ICP | Médiane étab. ouverts | PME / ETI / GE        |
| ------------------------- | --------------- | --------- | ---------------- | ------------- | --------------------- | --------------------- |
| **Crèches**               | 88.91A          | 2 409     | 50 %             | **869**       | 1                     | 2 128 / 240 / 41      |
| **EHPAD / héb. âgées**    | 87.10A + 87.30A | 1 402     | 38 %             | 143           | 1                     | 1 000 / 222 / **178** |
| **Ambulances**            | 86.90A          | 2 196     | **99,8 %**       | **732**       | 1                     | 2 087 / 92 / 17       |
| **OF (formation)**        | 85.59A + 85.59B | 2 655     | 56 %             | 754           | 1                     | 2 365 / 238 / 52      |
| **Pharmacies (47.73Z)**   | 47.73Z          | **3 849** | 99,8 %           | **93**        | **1**                 | 3 847 / 2 / 0         |
| **Sécurité privée**       | 80.10Z          | 1 691     | 99,4 %           | 150           | 1                     | 1 518 / 146 / 27      |
| **Restauration (56.29A)** | 56.29A          | **143**   | 89,5 %           | 30            | **2**                 | 88 / 31 / 24          |


**Lecture rapide**

- **Crèches** et **ambulances** : meilleurs compromis **volume × shortlist** avec critère multi-sites sur ce périmètre exporté.  
- **EHPAD** : volume correct mais **beaucoup de GE** et **dirigeants API rares** → cible plus « enterprise », cycle plus long, enrichissement indispensable.  
- **Pharmacies** : **énorme fichier** mais **très mono-site** au niveau UL ; la cible « réseau » est **sous-représentée** dans ce seul NAF.  
- **56.29A** : fichier **trop petit** pour représenter la « restauration collective » métier — **autres NAF + sources** nécessaires.  
- **Sécurité** : déjà en production produit ; volume modéré, **excellente** complétude dirigeants API.

---

## 2 bis. Segmentation clients (seuil minimal / cœur / plafond bootstrap)

Trois paliers pour **calibrer** prospection, **prix**, **cycle de vente** et **support** (discussion stratégique détaillée dans chaque `analyse-*.md`). **Le CA** n’est en général **pas** dans l’export API : les profils métier restent **indicatifs** ; les **comptages** ci-dessous recoupent uniquement **établissements ouverts**, **tranche effectif INSEE** et **catégorie** (PME/ETI selon les règles). Voir `stats-secteurs.json` → `segments_clients.regles_proxy` par secteur.


| Secteur                 | Seuil minimal (UL) | Cœur de cible (UL) | Plafond bootstrap (UL) | Notes proxy                                                                        |
| ----------------------- | ------------------ | ------------------ | ---------------------- | ---------------------------------------------------------------------------------- |
| **Crèches**             | 346                | 87                 | 21                     | Établissements + TEF ; cœur = PME|ETI, 6–15 étab.                                  |
| **EHPAD**               | 395                | 73                 | 21                     | PME|ETI, hors GE dans ces règles                                                   |
| **Ambulances**          | 630                | 115                | 8                      | **Agences** ≈ étab. ouverts ; **pas** de parc véhicules                            |
| **OF formation**        | 566                | 256                | 46                     | **Lieux** ≈ étab. ouverts                                                          |
| **Pharmacies**          | 90                 | 6                  | 9                      | **47.73Z** = surtout mono-UL ; réseaux ailleurs                                    |
| **Sécurité**            | 16                 | 5                  | 0                      | Règles alignées crèches pour comparabilité ; gros réseaux souvent hors recoupement |
| **Restauration 56.29A** | 16                 | 5                  | 7                      | **Échantillon NAF trop petit** — ne pas en déduire le SAM                          |


**Lecture conseillée (bootstrap) :** commercialement, viser d’abord le **cœur de cible** ; le **seuil minimal** alimente le volume mais augmente **churn** et fragilité ; le **plafond** = tickets plus élevés et cycles plus longs.

---

## 3. Notation qualitative (alignée discussion consultant / fondateur)

Échelle indicative ★ à ★★★★★ sur les **quatre critères** + **probabilité de shortlist exploitable** sur la base des exports actuels.


| Secteur                | Multi-sites structurel | Obligations codifiées | Douleur / sanction | Accessible sans DSI | Données liste (proxy) | **Rang stratégique**    |
| ---------------------- | ---------------------- | --------------------- | ------------------ | ------------------- | --------------------- | ----------------------- |
| **Crèches**            | ★★★★★                  | ★★★★★                 | ★★★★★              | ★★★★☆               | ★★★★★                 | **1**                   |
| **EHPAD**              | ★★★★★                  | ★★★★★                 | ★★★★★              | ★★★☆☆               | ★★★☆☆                 | **2**                   |
| **Ambulances**         | ★★★☆☆                  | ★★★★★                 | ★★★★★              | ★★★★☆               | ★★★★☆                 | **3**                   |
| **Restauration coll.** | ★★★★☆                  | ★★★★☆                 | ★★★★☆              | ★★★☆☆               | ★☆☆☆☆ (NAF étroit)    | **4**                   |
| **Pharmacies réseau**  | ★★★☆☆                  | ★★★★☆                 | ★★★★☆              | ★★★☆☆               | ★★☆☆☆ (mono-UL)       | **5**                   |
| **OF Qualiopi**        | ★★★☆☆                  | ★★★☆☆                 | ★★★☆☆              | ★★★★☆               | ★★★★☆                 | **6**                   |
| **Sécurité privée**    | ★★★☆☆                  | ★★★★★                 | ★★★★★              | ★★★★☆               | ★★★☆☆                 | *(déjà choisi produit)* |


---

## 4. Analyse par secteur (synthèse)

### Crèches (88.91A)

Le **meilleur alignement** avec le modèle « obligation par établissement + personnes + inspections ». La liste API est **large** et la shortlist multi-sites **élevée**. Frein : **50 %** sans nom de dirigeant dans l’API — prévoir enrichissement. **Priorité 1** cohérente pour un bootstrap.

### EHPAD (87.10A + 87.30A)

**ADN réglementaire proche des crèches** (ARS, formations, équipements, multi-établissements). **Ticket** et gravité perçue souvent **supérieurs**. Freins : **sensibilité médiatique**, décideurs **fatigués** ou au contraire **très exigeants** ; **178 GE** dans l’export → mélange de gros groupes et de PME régionales ; **dirigeants API à 38 %**. Logique de **deuxième verticale après preuve sur crèches** (effort registre partiellement mutualisable).

### Ambulances (86.90A)

Modèle **binaire** (DEA, AFGSU, véhicule, aptitude) comparable à **CNAPS**. **Très bonne** qualité de liste pour la prospection (**dirigeants**). Multi-sites **plus faible** que crèches/EHPAD mais **réel** (agences). **Troisième candidat** solide si tu veux diversifier sans quitter l’univers « conformité individuelle bloquante ».

### Restauration collective (56.29A)

Sur le **papier** : HACCP / DDPP = cadre clair, fermeture admin = **douleur forte**. En **données** : le seul **56.29A** + effectif 10+ ne donne que **143 UL** — le marché est ailleurs en NAF. **Ne pas** dimensionner le SAM sur ce fichier seul. Argument commercial : **coût d’une fermeture** vs abonnement.

### Pharmacies (47.73Z)

Obligations **denses** (Ordre, DPC, équipements). **Ticket** potentiellement élevé. En liste : surtout **officines isolées** ; **réseaux** sous-représentés. Le produit Regultrack « multi-sites » demande **ciblage manuel** (enseignes, holdings). **Effort de recherche** sur le registre d’obligations **le plus lourd**.

### Organismes de formation (85.59A + 85.59B)

**Qualiopi** et audits = vraie douleur mais **moins immédiate** que carte CNAPS ou agrément PMI. Concurrence **outils métiers** déjà nombreux. **Volume** et shortlist **bons** ; utile comme **quatrième axe** ou **upsell** transversal plus que comme premier wedge.

### Sécurité privée (80.10Z)

Déjà **implémenté** dans le produit. Liste **moyenne** ; **meilleure** complétude dirigeants. Multi-sites **moins « natif »** que social / santé mais **réel** pour les réseaux d’agents.

---

## 5. Décision produit suggérée (cohérente avec l’échange consultant)

- **Séquence** : **crèches d’abord** (18 mois focalisés possibles) pour valider vente + registre + onboarding ; **EHPAD en 2e** une fois 3+ clients crèches stables — **effort marginal** sur une partie du référentiel (ARS, formations soignants, établissement) vs partir de zéro sur un métier sans lien.  
- **En parallèle « léger »** : **ambulances** comme 2e niche **sans** mutualiser le registre santé-social si tu veux diversifier le risque marché (même logique « document individuel bloquant »).  
- **56.29A** : **requalifier le ciblage NAF** avant d’investir en produit.  
- **Pharmacies** : **partenariat / expert métier** + ciblage réseaux hors seul 47.73Z.  
- **OF** : **après** traction sur une verticale à sanction immédiate, ou positionnement **add-on** conformité documentaire.

---

## 6. Régénération des exports et graphiques

```bash
# Tout le registre (long)
python scripts/prospecting/fetch_sector_prospects.py --all

# Un secteur
python scripts/prospecting/fetch_sector_prospects.py --sector ehpad

# Figures pour tous les CSV présents
python scripts/prospecting/export_analysis_figures.py --all-sectors

# Tableau de stats (+ colonnes segments) et export JSON
python scripts/prospecting/sector_stats.py
python scripts/prospecting/sector_stats.py -o docs/prospects/stats-secteurs.json
```

Les CSV sous `data/` sont **ignorés par git** ; les **PNG** et **.md** ici peuvent être versionnés pour la doc interne.