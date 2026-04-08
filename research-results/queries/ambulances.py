# -*- coding: utf-8 -*-
"""Requêtes deep research — transport sanitaire / ambulances (sortie : ../ambulances/) — croiser avec seed_ambulances_upsert.sql"""

OUTPUT_SUBDIR = "ambulances"

SECTOR_LABEL = "ambulances et transport sanitaire (France)"

PROMPT_INSTRUCTIONS = """Tu es un expert juridique spécialisé dans la réglementation française du TRANSPORT SANITAIRE (ambulances, VSL, entreprises agréées).

Ta mission : répondre UNIQUEMENT à la question suivante.

QUESTION : {focus}

Sources web récupérées :
{context}

INSTRUCTIONS :
1. Base-toi sur le Code de la santé publique, arrêtés ministériels, CPAM.
2. Structure :
   - **Applies_to** : employee / site / organization (rappelle : un véhicule agréé peut être modélisé comme « site » dans un registre)
   - **Renewal_months**, **Alert_days**, **Renewal_process**, **Required_documents**
   - **Competent_authority**, **Official_url**, **Legal_reference**
   - **Consequences**, **Proof_to_keep**, **Notes**
3. Si incertain, dis-le. Français.
"""

QUERIES = [
    {
        "slug": "01_DEA_formation_continue_FCA",
        "title": "DEA — formation initiale et FCA 35h / 5 ans",
        "query": "diplôme état ambulancier DEA formation continue 35 heures 5 ans arrêté 2014 2022 facturation assurance maladie",
        "focus": (
            "Durée formation initiale DEA, obligation FCA pour facturer l'Assurance Maladie, références d'arrêtés."
        ),
    },
    {
        "slug": "02_agrement_prefectoral_entreprise",
        "title": "Agrément préfectoral entreprise transport sanitaire",
        "query": "agrément préfecture transport sanitaire ambulance durée 5 ans renouvellement R6312",
        "focus": (
            "Article R6312-1 CSP, durée, conditions de renouvellement, siège social."
        ),
    },
    {
        "slug": "03_AMS_vehicule_ARS",
        "title": "Autorisation de mise en service — véhicule ARS",
        "query": "autorisation mise en service ambulance ARS véhicule transport sanitaire R6312",
        "focus": (
            "Un agrément par véhicule ? Renouvellement lors du changement de véhicule ? Textes."
        ),
    },
    {
        "slug": "04_controle_technique_VTP",
        "title": "Contrôle technique annuel véhicule transport sanitaire",
        "query": "contrôle technique annuel ambulance véhicule sanitaire obligation France",
        "focus": (
            "Obligation légale, fréquence, catégories de véhicules concernés."
        ),
    },
    {
        "slug": "05_AFGSU_ambulancier",
        "title": "AFGSU — ambulanciers et auxiliaires",
        "query": "AFGSU niveau 2 ambulancier DEA recyclage 4 ans auxiliaire niveau 1 VSL",
        "focus": (
            "Niveaux requis selon le poste, validité, recyclage."
        ),
    },
    {
        "slug": "06_conventionnement_CPAM",
        "title": "Conventionnement CPAM — transport remboursable",
        "query": "conventionnement transport sanitaire CPAM convention nationale ambulancier facturation",
        "focus": (
            "Indispensabilité pour facturer, contrôles CPAM, sans convention conséquences."
        ),
    },
    {
        "slug": "07_garde_ARS_departement",
        "title": "Service de garde ambulancière — ARS",
        "query": "garde ambulancière ARS département planning obligation transport sanitaire",
        "focus": (
            "Participation obligatoire, déclaration des plannings, base réglementaire locale/nationale."
        ),
    },
    {
        "slug": "08_equipement_ambulance_R6312",
        "title": "Équipement obligatoire ambulance — DEA matériel",
        "query": "équipement obligatoire ambulance défibrillateur liste R6312-9 transport sanitaire",
        "focus": (
            "Liste réglementaire du matériel, maintenance DEA, oxygène."
        ),
    },
    {
        "slug": "09_permis_visite_medicale_conduite",
        "title": "Permis et visite médicale aptitude conduite professionnelle",
        "query": "visite médicale aptitude conduite professionnelle 5 ans permis B ambulance France",
        "focus": (
            "Fréquence des visites selon âge et permis B/C, textes."
        ),
    },
    {
        "slug": "10_desinfection_vehicule",
        "title": "Désinfection et hygiène des ambulances",
        "query": "désinfection ambulance après transport protocole traçabilité ARS recommandation",
        "focus": (
            "Obligations de traçabilité, référentiels, contrôles."
        ),
    },
]
