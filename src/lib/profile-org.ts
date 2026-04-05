/** Supabase renvoie souvent `organizations(...)` comme tableau même pour une relation 1–1. */
export function resolveOrgSector(organizations: unknown): string {
  const row = organizations as
    | { sector: string }[]
    | { sector: string }
    | null
    | undefined;
  if (Array.isArray(row)) return row[0]?.sector || "securite_privee";
  return row?.sector || "securite_privee";
}
