/** Filtres et tri des listes d’obligations (fiche employé, site, organisation). */

export const ENTITY_OBLIGATION_STATUS_FILTERS = [
  { key: undefined, label: "Toutes" },
  { key: "expired", label: "Expirées" },
  { key: "expiring_soon", label: "Expire bientôt" },
  { key: "missing", label: "Manquantes" },
  { key: "valid", label: "En règle" },
] as const;

const STATUS_QUERY_KEYS = ["expired", "expiring_soon", "missing", "valid"] as const;
export type EntityObligationStatusFilter = (typeof STATUS_QUERY_KEYS)[number];

export function parseEntityObligationStatusFilter(
  raw: string | undefined
): EntityObligationStatusFilter | undefined {
  if (!raw) return undefined;
  return (STATUS_QUERY_KEYS as readonly string[]).includes(raw)
    ? (raw as EntityObligationStatusFilter)
    : undefined;
}

/** Chemin de page sans query (ex. `/employees/uuid`, `/organisation`). */
export function buildEntityObligationListHref(
  basePath: string,
  status: (typeof ENTITY_OBLIGATION_STATUS_FILTERS)[number]["key"]
): string {
  if (!status) return basePath;
  return `${basePath}?${new URLSearchParams({ status }).toString()}`;
}

/** Manquantes → expirées → expire bientôt → en règle, puis par échéance. */
export function sortEntityObligationsByUrgency<
  T extends { status: string; due_date: string | null },
>(list: T[]): T[] {
  const urgency = (s: string) =>
    s === "missing"
      ? 0
      : s === "expired"
        ? 1
        : s === "expiring_soon"
          ? 2
          : 3;
  return [...list].sort((a, b) => {
    const diff = urgency(a.status) - urgency(b.status);
    if (diff !== 0) return diff;
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });
}
