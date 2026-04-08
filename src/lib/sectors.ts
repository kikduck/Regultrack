/**
 * Codes secteur côté produit (organizations.sector, obligation_templates.sector).
 * Les seeds métier arrivent progressivement : les libellés servent déjà l’UI (paramètres, onboarding futur).
 */
export const SECTOR_LABELS_FR: Record<string, string> = {
  securite_privee: "Sécurité privée",
  creches: "Crèches et accueil du jeune enfant",
  ehpad: "EHPAD et hébergement médicalisé",
  ambulances: "Ambulances et transport sanitaire",
  pharmacies: "Pharmacies (réseau d’officines)",
};

export function sectorLabelFr(code: string): string {
  return SECTOR_LABELS_FR[code] ?? code;
}

/** Texte du sélecteur de poste quand rien n’est choisi (exemples métier par secteur). */
const JOB_TITLE_EMPTY_LABEL_FR: Record<string, string> = {
  securite_privee: "Choisir un poste — ex. agent de sécurité",
  creches: "Choisir un poste — ex. éducateur de jeunes enfants",
  ehpad: "Choisir un poste — ex. aide-soignant(e)",
  ambulances: "Choisir un poste — ex. ambulancier",
  pharmacies: "Choisir un poste — ex. préparateur en pharmacie",
};

export function jobTitleEmptyLabelFr(sector: string): string {
  return JOB_TITLE_EMPTY_LABEL_FR[sector] ?? "Choisir un poste…";
}

/** Options d’onboarding : uniquement les codes autorisés par la plateforme, ordre stable. */
export function onboardingSectorOptions(allowedCodes: string[]): { code: string; label: string }[] {
  const unique = [...new Set(allowedCodes.filter(Boolean))];
  unique.sort((a, b) => sectorLabelFr(a).localeCompare(sectorLabelFr(b), "fr"));
  return unique.map((code) => ({ code, label: sectorLabelFr(code) }));
}

/**
 * Règles : si le multi-secteur SaaS est désactivé → toujours `securite_privee`.
 * Si activé et un seul code autorisé → ce code. Si plusieurs → `requestedSector` doit être dans la liste.
 */
export function resolveSectorForNewOrganization(
  showSectorOnboarding: boolean,
  allowedCodes: string[],
  requestedSector: unknown
): { sector: string } | { error: string } {
  const defaultSector = "securite_privee";

  if (!showSectorOnboarding) {
    return { sector: defaultSector };
  }

  const normalizedAllowed = [...new Set(allowedCodes.filter(Boolean))];
  if (normalizedAllowed.length === 0) {
    return { sector: defaultSector };
  }
  if (normalizedAllowed.length === 1) {
    return { sector: normalizedAllowed[0] };
  }

  const req = typeof requestedSector === "string" ? requestedSector.trim() : "";
  if (!req) {
    return { error: "Secteur requis" };
  }
  if (!normalizedAllowed.includes(req)) {
    return { error: "Secteur non disponible" };
  }
  return { sector: req };
}
