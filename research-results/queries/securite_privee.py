# -*- coding: utf-8 -*-
"""Requêtes deep research — secteur sécurité privée (sortie : ../securite-privee/)"""

OUTPUT_SUBDIR = "securite-privee"

SECTOR_LABEL = "sécurité privée française"

PROMPT_INSTRUCTIONS = """Tu es un expert juridique spécialisé dans la réglementation française de la SÉCURITÉ PRIVÉE.

Ta mission : répondre UNIQUEMENT à la question suivante sur ce secteur.

QUESTION : {focus}

Les sources web ci-dessous peuvent contenir des informations utiles, MAIS si elles sont hors sujet ou sans rapport avec la réglementation sécurité privée française, IGNORE-LES COMPLÈTEMENT et réponds en te basant sur tes connaissances juridiques.

Sources web récupérées :
{context}

INSTRUCTIONS STRICTES :
1. Réponds TOUJOURS à la question posée, même si les sources sont inutiles.
2. Ne répète JAMAIS le contenu hors sujet des sources.
3. Structure ta réponse ainsi :
   - **Applies_to** : employee / site / organization
   - **Renewal_months** : durée en mois (0 si diplôme/titre sans cycle légal)
   - **Alert_days** : délais d'alerte recommandés (ex: J-90, J-60, J-30)
   - **Renewal_process** : étapes concrètes dans l'ordre
   - **Required_documents** : liste des pièces justificatives
   - **Competent_authority** : organisme compétent
   - **Official_url** : URL officielle
   - **Legal_reference** : référence légale exacte (article, décret)
   - **Consequences** : sanctions en cas de non-conformité
   - **Proof_to_keep** : document à conserver comme preuve
   - **Notes** : précisions importantes, cas particuliers
4. Si une info est incertaine, dis-le. Réponds en français.
"""

QUERIES = [
    {
        "slug": "01_carte_cnaps_renouvellement",
        "title": "Carte professionnelle CNAPS — renouvellement",
        "query": "renouvellement carte professionnelle CNAPS sécurité privée France délai durée validité portail",
        "focus": (
            "Durée de validité de la carte CNAPS, délai réel de traitement du dossier de renouvellement, "
            "étapes concrètes, pièces justificatives, référence légale exacte (Livre VI CSI)."
        ),
    },
    {
        "slug": "02_carte_cnaps_sanctions",
        "title": "Carte CNAPS — travail sans carte valide, sanctions",
        "query": "sanction agent sécurité sans carte CNAPS valide travail France peine amende",
        "focus": (
            "Peut-on travailler pendant un renouvellement en cours ? "
            "Sanction pour l'agent, sanction pour l'entreprise. Références légales."
        ),
    },
    {
        "slug": "03_ssiap_niveaux_mac",
        "title": "SSIAP 1/2/3 — niveaux, validité, MAC",
        "query": "SSIAP 1 2 3 durée validité MAC maintien compétences ERP IGH formation France",
        "focus": (
            "Qui doit avoir quel niveau SSIAP selon le type d'établissement (ERP/IGH), "
            "durée de validité de chaque niveau, fréquence et durée du MAC, organismes habilités."
        ),
    },
    {
        "slug": "04_sst_securite_privee",
        "title": "SST — obligation en sécurité privée",
        "query": "SST sauveteur secouriste travail sécurité privée obligatoire validité MAC recyclage France",
        "focus": (
            "Le SST est-il obligatoire pour les agents de sécurité privée ? Pour qui ? "
            "Durée de validité, fréquence du recyclage, différence avec PSC1 et PSE1."
        ),
    },
    {
        "slug": "05_visite_medicale",
        "title": "Visite médicale d'aptitude — agents de sécurité",
        "query": "visite médicale aptitude agents sécurité privée fréquence obligatoire travail de nuit arme France",
        "focus": (
            "Visite initiale et périodique : fréquence réglementaire. "
            "Aptitudes spécifiques (port d'arme, travail de nuit, cynophile). "
            "Médecin du travail ou agrément spécifique."
        ),
    },
    {
        "slug": "06_autorisation_exercer_cnaps",
        "title": "Autorisation d'exercer CNAPS — entreprise",
        "query": "autorisation exercer agrément CNAPS entreprise sécurité privée durée renouvellement France",
        "focus": (
            "Nom exact de l'autorisation, durée de validité, processus de renouvellement, "
            "conditions de retrait/suspension, référence légale. "
            "Différence entre l'autorisation entreprise et la carte professionnelle agent."
        ),
    },
    {
        "slug": "07_controles_sanctions_cnaps",
        "title": "Contrôles CNAPS — pouvoirs et sanctions",
        "query": "contrôle CNAPS inspection entreprise sécurité privée sanctions amendes retrait agrément France",
        "focus": (
            "Pouvoirs d'inspection du CNAPS, documents demandés, "
            "sanctions administratives (montants amendes, suspension, retrait agrément), "
            "sanctions pénales Livre VI CSI."
        ),
    },
    {
        "slug": "08_duerp_securite",
        "title": "DUERP — entreprise de sécurité privée",
        "query": "DUERP document unique évaluation risques sécurité privée fréquence mise à jour risques spécifiques",
        "focus": (
            "Fréquence de mise à jour réglementaire (annuelle + événementielle), "
            "risques spécifiques à inclure (agression, travail de nuit, stress), "
            "qui peut le rédiger, où conserver, référence R4121-1."
        ),
    },
    {
        "slug": "09_rc_pro",
        "title": "RC Pro — assurance obligatoire sécurité privée",
        "query": "assurance responsabilité civile professionnelle obligatoire sécurité privée France montant",
        "focus": (
            "RC Pro obligatoire ou recommandée ? Montant minimum de couverture réglementaire. "
            "Preuve de renouvellement annuel à conserver. Référence légale."
        ),
    },
    {
        "slug": "10_convention_collective_1351",
        "title": "Convention collective IDCC 1351 — obligations employeur",
        "query": "convention collective sécurité privée IDCC 1351 obligations employeur formation entretien professionnel",
        "focus": (
            "Obligations spécifiques de l'employeur : registres, affichages, formation, "
            "entretien professionnel fréquence, plan développement compétences, durée du travail."
        ),
    },
    {
        "slug": "11_recyclage_aptitude",
        "title": "Recyclage aptitude professionnelle — CNAPS",
        "query": "recyclage aptitude professionnelle CNAPS sécurité privée fréquence organismes habilités formation",
        "focus": (
            "En quoi consiste ce recyclage, est-ce lié au renouvellement de la carte ou indépendant, "
            "durée, organismes habilités CNAPS, comment vérifier l'habilitation d'un organisme."
        ),
    },
    {
        "slug": "12_habilitation_electrique",
        "title": "Habilitation électrique — agents de sécurité",
        "query": "habilitation électrique agent sécurité privée obligatoire B0 H0 France validité",
        "focus": (
            "Dans quels cas un agent de sécurité doit être habilité électriquement, "
            "niveaux concernés, durée de validité recommandée, organisme de formation."
        ),
    },
]
