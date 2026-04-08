# -*- coding: utf-8 -*-
"""Requêtes deep research — EHPAD / ESSMS (sortie : ../ehpad/) — croiser avec seed_ehpad_upsert.sql"""

OUTPUT_SUBDIR = "ehpad"

SECTOR_LABEL = "EHPAD et établissements médico-sociaux pour personnes âgées (France)"

PROMPT_INSTRUCTIONS = """Tu es un expert juridique spécialisé dans la réglementation française des EHPAD et ESSMS.

Ta mission : répondre UNIQUEMENT à la question suivante.

QUESTION : {focus}

Sources web récupérées (peuvent être bruitées) :
{context}

INSTRUCTIONS :
1. Cite le droit positif (CASF, CSP, Code du travail, HAS).
2. Structure :
   - **Applies_to** : employee / site / organization
   - **Renewal_months** : mois (0 si sans cycle légal)
   - **Alert_days** : J-… recommandés
   - **Renewal_process**, **Required_documents**, **Competent_authority**, **Official_url**, **Legal_reference**
   - **Consequences**, **Proof_to_keep**, **Notes**
3. Si incertain, dis-le. Français.
"""

QUERIES = [
    {
        "slug": "01_autorisation_ARS_CPOM",
        "title": "Autorisation ARS et CPOM — EHPAD",
        "query": "autorisation fonctionnement EHPAD ARS CPOM conseil départemental durée 5 ans L313-1",
        "focus": (
            "Lien entre autorisation d'activité, CPOM, durées, rapports d'activité, inspections ARS."
        ),
    },
    {
        "slug": "02_evaluation_HAS_L312_8",
        "title": "Évaluation qualité HAS — ESSMS L312-8",
        "query": "évaluation HAS EHPAD ESSMS tous les 5 ans L312-8 réforme 2022",
        "focus": (
            "Périodicité légale, différence avec contrôle/sanction, impact sur autorisation."
        ),
    },
    {
        "slug": "03_AFGSU_arrete_2006",
        "title": "AFGSU niveaux 1 et 2 — arrêté 3 mars 2006",
        "query": "AFGSU niveau 1 2 recyclage 4 ans arrêté 3 mars 2006 IDE aide soignant",
        "focus": (
            "Qui doit quel niveau, durée de validité, obligation de recyclage, texte officiel."
        ),
    },
    {
        "slug": "04_directeur_CAFDES",
        "title": "Directeur d'EHPAD — CAFDES et équivalences",
        "query": "CAFDES directeur EHPAD titre requis RNCP niveau 1",
        "focus": (
            "Diplômes requis pour la direction, équivalences, vérification à l'embauche."
        ),
    },
    {
        "slug": "05_plan_bleu_canicule",
        "title": "Plan Bleu canicule — EHPAD",
        "query": "plan bleu canicule EHPAD obligatoire circulaire 2004 référent",
        "focus": (
            "Base réglementaire ou circulaire, mise à jour, contenu minimum."
        ),
    },
    {
        "slug": "06_CVS_L311_6",
        "title": "Conseil de la vie sociale — fréquence",
        "query": "conseil vie sociale EHPAD 3 fois par an L311-6 R311-1",
        "focus": (
            "Obligation légale, nombre de réunions, documentation."
        ),
    },
    {
        "slug": "07_bientraitance_maltraitance",
        "title": "Formation bientraitance et prévention maltraitance",
        "query": "formation bientraitance EHPAD HAS ARS obligation périodicité CPOM",
        "focus": (
            "Statut obligatoire ou recommandé, liens HAS/ARS/CPOM, fréquence usuelle."
        ),
    },
    {
        "slug": "08_ERP_type_J_commission_securite",
        "title": "ERP type J — commission de sécurité EHPAD",
        "query": "ERP type J EHPAD commission sécurité visite périodique 3 ans catégorie",
        "focus": (
            "Type d'ERP, périodicité des visites selon catégorie."
        ),
    },
    {
        "slug": "09_convention_CPAM_soins",
        "title": "Convention Assurance Maladie — facturation soins EHPAD",
        "query": "convention EHPAD assurance maladie forfait soins CPAM",
        "focus": (
            "Conventionnement, contrôles CPAM, documents à conserver."
        ),
    },
    {
        "slug": "10_rapport_financier_ARS",
        "title": "Rapport financier annuel — ARS département",
        "query": "compte administratif EHPAD transmission ARS département contrôle gestion",
        "focus": (
            "Obligations de transmission, fréquence, destinataires."
        ),
    },
]
