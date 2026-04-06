export type ProofForDisplay = {
  id: string;
  file_name: string;
  file_url: string;
  uploaded_at: string;
  valid_from: string | null;
  valid_until: string | null;
  file_hash: string | null;
  profiles?: { full_name: string } | null;
};

function parseLocalDate(isoDate: string): Date {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Tri : plus récent en premier (horodatage serveur). */
export function sortProofsNewestFirst(proofs: ProofForDisplay[]): ProofForDisplay[] {
  return [...proofs].sort(
    (a, b) =>
      new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
  );
}

/**
 * Preuve « actuelle » : alignée sur l’échéance obligation si possible, sinon la plus récente.
 */
export function pickActiveProofId(
  proofs: ProofForDisplay[],
  obligationDueDate: string | null
): string | null {
  const sorted = sortProofsNewestFirst(proofs);
  if (sorted.length === 0) return null;
  if (obligationDueDate) {
    const match = sorted.find((p) => p.valid_until === obligationDueDate);
    if (match) return match.id;
  }
  return sorted[0].id;
}

export function isProofValidityExpired(
  validUntil: string | null,
  todayLocalIso: string
): boolean {
  if (!validUntil) return false;
  return parseLocalDate(validUntil) < parseLocalDate(todayLocalIso);
}

export function todayLocalIso(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
