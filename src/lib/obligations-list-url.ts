/** Query string pour la liste des obligations (filtres combinables). */
export function buildObligationsListHref(opts: {
  status?: string;
  obligation?: string;
  concerne?: string;
  due?: string;
}): string {
  const sp = new URLSearchParams();
  if (opts.status) sp.set("status", opts.status);
  const obl = opts.obligation?.trim();
  const conc = opts.concerne?.trim();
  if (obl) sp.set("obligation", obl);
  if (conc) sp.set("concerne", conc);
  if (opts.due === "none" || opts.due === "set") sp.set("due", opts.due);
  const q = sp.toString();
  return q ? `/obligations?${q}` : "/obligations";
}
