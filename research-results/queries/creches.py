# -*- coding: utf-8 -*-
"""Requêtes deep research — crèches / EAJE (sortie : ../creches/) — à croiser avec supabase/seeds/seed_creches_upsert.sql"""

OUTPUT_SUBDIR = "creches"

SECTOR_LABEL = "établissements d'accueil du jeune enfant (crèches, France)"

PROMPT_INSTRUCTIONS = """Tu es un expert juridique spécialisé dans la réglementation française des CRÈCHES et structures d'accueil du jeune enfant.

Ta mission : répondre UNIQUEMENT à la question suivante.

QUESTION : {focus}

Les sources web ci-dessous peuvent être partiellement hors sujet : IGNORE le bruit et base-toi sur le droit positif français (Code de la santé publique, Code du travail, CASF, décrets PMI).

Sources web récupérées :
{context}

INSTRUCTIONS STRICTES :
1. Réponds TOUJOURS à la question posée.
2. Structure ta réponse ainsi :
   - **Applies_to** : employee / site / organization
   - **Renewal_months** : durée en mois (0 si titre/diplôme sans cycle légal, uniquement contrôle à l'embauche)
   - **Alert_days** : délais d'alerte recommandés
   - **Renewal_process** : étapes concrètes
   - **Required_documents** : pièces justificatives
   - **Competent_authority** : organisme compétent
   - **Official_url** : URL officielle (Légifrance, service-public, ministère)
   - **Legal_reference** : article, décret, arrêté exacts
   - **Consequences** : en cas de non-conformité
   - **Proof_to_keep** : preuve à conserver
   - **Notes** : cas particuliers, différences PMI / privé / associatif si pertinent
3. Si une info est incertaine ou dépend du département, dis-le. Réponds en français.
"""

QUERIES = [
    {
        "slug": "01_agrement_pmi_capacite",
        "title": "Agrément PMI — délivrance, durée, capacité, contrôles",
        "query": "agrément PMI crèche collective conseil départemental capacité places contrôle suspension France",
        "focus": (
            "Articles L2324-1 R2324-1 Code santé publique : qui délivre l'agrément, "
            "lien avec la capacité d'accueil, visites de contrôle, suspension/retrait, décret 2021-1131."
        ),
    },
    {
        "slug": "02_decret_2021_1131_diplomes",
        "title": "Décret 2021-1131 — diplômes CAP AEPE DEAP EJE petite enfance",
        "query": "décret 2021-1131 accueil jeune enfant qualification CAP AEPE DEAP EJE auxiliaire puériculture",
        "focus": (
            "Quels diplômes pour agents d'accueil, auxiliaires, éducateurs, directeurs ? "
            "Y a-t-il une date d'expiration des diplômes ou uniquement vérification à l'embauche ?"
        ),
    },
    {
        "slug": "03_sst_mac_creche",
        "title": "SST et premiers secours en crèche",
        "query": "SST sauveteur secouriste travail crèche MAC 24 mois 7 heures Code travail R4224-15",
        "focus": (
            "Obligation SST, durée du recyclage MAC, lien avec PSC1, référence exacte Code du travail."
        ),
    },
    {
        "slug": "04_visite_medicale_vip_creche",
        "title": "Visite médicale et VIP — personnel crèche",
        "query": "visite médicale information prévention VIP 5 ans crèche Code travail L4624-1",
        "focus": (
            "Fréquence de la visite périodique (5 ans ?), visite initiale à l'embauche, cas de suivi renforcé."
        ),
    },
    {
        "slug": "05_vaccinations_personnel_creche",
        "title": "Vaccinations obligatoires personnel en contact avec jeunes enfants",
        "query": "vaccination obligatoire professionnel crèche hépatite B coqueluche ROR Code santé publique",
        "focus": (
            "Liste des vaccins concernés pour le personnel en contact avec des enfants, base légale L3111-4 et textes d'application."
        ),
    },
    {
        "slug": "06_casier_judiciaire_B3_mineurs",
        "title": "Bulletin n°3 casier judiciaire — personnel et mineurs",
        "query": "bulletin 3 casier judiciaire embauche contact mineurs crèche L133-6 CASF",
        "focus": (
            "Obligation à l'embauche, texte L133-6 CASF, y a-t-il une obligation de renouvellement périodique ?"
        ),
    },
    {
        "slug": "07_exercices_evacuation_ERP_R",
        "title": "Exercices d'évacuation — ERP type R crèche",
        "query": "exercice évacuation incendie crèche ERP type R fréquence 2 par an registre sécurité R4227-39",
        "focus": (
            "Fréquence réglementaire (Code du travail R4227-39, arrêté ERP 1980), consignation au registre de sécurité."
        ),
    },
    {
        "slug": "08_duerp_creche",
        "title": "DUERP — risques spécifiques crèche",
        "query": "DUERP crèche petite enfance R4121-1 risques biologiques TMS chutes mise à jour annuelle",
        "focus": (
            "Fréquence légale de mise à jour, risques typiques (biologique, TMS, charge mentale), obligation d'information CSE."
        ),
    },
    {
        "slug": "09_reglement_projet_R2324_29",
        "title": "Règlement de fonctionnement et projet d'établissement",
        "query": "règlement fonctionnement crèche R2324-29 projet établissement petite enfance obligation familles",
        "focus": (
            "Contenu obligatoire, remise aux familles, affichage, périodicité de révision recommandée ou légale."
        ),
    },
    {
        "slug": "10_convention_CAF_PSU",
        "title": "Convention CAF et PSU — crèche",
        "query": "convention CAF crèche PSU prestation service unique rapport activité barème CNAF",
        "focus": (
            "Obligations de conventionnement, rapport d'activité, tarification réglementée."
        ),
    },
    {
        "slug": "11_protocoles_sanitaires_PAI",
        "title": "PAI et protocoles sanitaires (allergies, médicaments)",
        "query": "projet accueil individualisé PAI crèche allergie médicament protocole France",
        "focus": (
            "Cadre légal ou contractuel du PAI, renouvellement, traçabilité des médicaments en crèche."
        ),
    },
    {
        "slug": "12_gestes_urgence_pediatriques",
        "title": "Formation gestes d'urgence pédiatriques",
        "query": "formation urgences pédiatriques personnel crèche PMI recommandation périodicité",
        "focus": (
            "Statut réglementaire vs bonne pratique PMI, fréquence de recyclage courante."
        ),
    },
]
