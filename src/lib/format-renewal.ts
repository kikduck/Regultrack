/** Libellé pour obligation_templates.renewal_months (0 = diplômes / titres sans cycle légal). */
export function renewalMonthsSummaryFr(months: number): string {
  if (months === 0) {
    return "Sans périodicité légale (contrôle à l’embauche ou preuve ponctuelle)";
  }
  return `tous les ${months} mois`;
}

/** Ligne « Renouvellement : … » dans les listes d’habilitations. */
export function renewalMonthsLabelFr(months: number): string {
  if (months === 0) {
    return "Sans cycle (titre / diplôme)";
  }
  return `${months} mois`;
}
