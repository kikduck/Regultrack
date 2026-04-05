/** Calcul du score de conformité par site et au niveau global. */

export type ObligationCounts = {
  valid: number;
  expiring_soon: number;
  expired: number;
  missing: number;
  total: number;
};

export type SiteScore = ObligationCounts & {
  /** 0–100 : (valid / total) × 100. 100 si aucune obligation. */
  score: number;
  /** Pire statut présent, utilisé pour la couleur de la carte. */
  worstStatus: "valid" | "expiring_soon" | "expired" | "missing";
};

export function countsByStatus(
  obligations: { status: string }[]
): ObligationCounts {
  let valid = 0,
    expiring_soon = 0,
    expired = 0,
    missing = 0;
  for (const o of obligations) {
    if (o.status === "valid") valid++;
    else if (o.status === "expiring_soon") expiring_soon++;
    else if (o.status === "expired") expired++;
    else if (o.status === "missing") missing++;
  }
  return { valid, expiring_soon, expired, missing, total: obligations.length };
}

export function computeSiteScore(counts: ObligationCounts): SiteScore {
  const score =
    counts.total > 0
      ? Math.round((counts.valid / counts.total) * 100)
      : 100;
  const worstStatus: SiteScore["worstStatus"] =
    counts.expired > 0
      ? "expired"
      : counts.missing > 0
      ? "missing"
      : counts.expiring_soon > 0
      ? "expiring_soon"
      : "valid";
  return { ...counts, score, worstStatus };
}

/** Classes Tailwind statiques (ne pas générer dynamiquement pour que Tailwind les purge). */
export const SITE_CARD_COLORS: Record<
  SiteScore["worstStatus"],
  { leftBorder: string; scoreText: string }
> = {
  expired: {
    leftBorder: "border-l-red-500",
    scoreText: "text-red-600",
  },
  missing: {
    leftBorder: "border-l-red-300",
    scoreText: "text-red-400",
  },
  expiring_soon: {
    leftBorder: "border-l-amber-400",
    scoreText: "text-amber-600",
  },
  valid: {
    leftBorder: "border-l-green-500",
    scoreText: "text-green-600",
  },
};

/** Classes Tailwind pour le score global affiché en grand dans le header. */
export const GLOBAL_SCORE_TEXT: Record<SiteScore["worstStatus"], string> = {
  expired: "text-red-600",
  missing: "text-red-400",
  expiring_soon: "text-amber-500",
  valid: "text-green-600",
};
