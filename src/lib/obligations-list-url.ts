/** Sérialise un tableau en chaîne séparée par des virgules (URL-safe). */
export function serializeMulti(values: string[]): string {
  return values.filter(Boolean).join(",");
}

/** Désérialise une chaîne séparée par des virgules en tableau. */
export function parseMulti(value: string | undefined): string[] {
  if (!value?.trim()) return [];
  return value.split(",").map((v) => v.trim()).filter(Boolean);
}

/** Query string pour la liste des obligations (filtres combinables). */
export function buildObligationsListHref(opts: {
  status?: string;
  obligations?: string[];
  concernes?: string[];
  dueFrom?: string;
  dueTo?: string;
  dueNone?: boolean;
}): string {
  const sp = new URLSearchParams();
  if (opts.status) sp.set("status", opts.status);
  const obl = serializeMulti(opts.obligations ?? []);
  const conc = serializeMulti(opts.concernes ?? []);
  if (obl) sp.set("obligation", obl);
  if (conc) sp.set("concerne", conc);
  if (opts.dueFrom) sp.set("due_from", opts.dueFrom);
  if (opts.dueTo) sp.set("due_to", opts.dueTo);
  if (opts.dueNone) sp.set("due_none", "1");
  const q = sp.toString();
  return q ? `/obligations?${q}` : "/obligations";
}
