/** Libellés complets pour lecteurs d'écran et français naturel (évite « site s » fragmenté). */

export function sitesEnregistresLabel(count: number): string {
  if (count === 0) return "Aucun site enregistré";
  if (count === 1) return "1 site enregistré";
  return `${count} sites enregistrés`;
}

export function employesActifsLabel(count: number): string {
  if (count === 0) return "Aucun employé actif";
  if (count === 1) return "1 employé actif";
  return `${count} employés actifs`;
}

export function employesAuSiteLabel(count: number): string {
  if (count === 0) return "Aucun employé sur ce site";
  if (count === 1) return "1 employé";
  return `${count} employés`;
}

/** Phrase unique pour lecteurs d’écran (évite « document s manquant s » fragmenté). */
export function documentsManquantsPhrase(count: number): string {
  if (count <= 0) return "";
  if (count === 1) return "1 document manquant";
  return `${count} documents manquants`;
}
