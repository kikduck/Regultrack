import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { ObligationsColumnFilters } from "@/components/obligations-column-filters";
import { countsByStatus } from "@/lib/compliance-score";
import { buildObligationsListHref } from "@/lib/obligations-list-url";
import type { ObligationStatus } from "@/lib/types/database";

const STATUS_FILTERS = [
  { key: undefined, label: "Toutes" },
  { key: "expired", label: "Expirées" },
  { key: "expiring_soon", label: "Expire bientôt" },
  { key: "missing", label: "Manquantes" },
  { key: "valid", label: "En règle" },
] as const;

function entityLabel(o: {
  employees: unknown;
  sites: unknown;
}): string {
  const employee = o.employees as { full_name: string } | null;
  const site = o.sites as { name: string } | null;
  return employee?.full_name ?? site?.name ?? "Organisation";
}

export default async function ObligationsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    obligation?: string;
    concerne?: string;
    due?: string;
  }>;
}) {
  const {
    status: statusFilter,
    obligation: obligationParam,
    concerne: concerneParam,
    due: dueParam,
  } = await searchParams;
  const obligationQ = obligationParam?.trim().toLowerCase() ?? "";
  const concerneQ = concerneParam?.trim().toLowerCase() ?? "";
  const dueFilter = dueParam === "none" || dueParam === "set" ? dueParam : "";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id")
    .eq("id", user.id)
    .single();
  if (!profile?.org_id) redirect("/setup");

  const { data: obligations } = await supabase
    .from("obligations")
    .select(
      "id, status, due_date, site_id, employee_id, obligation_templates(name, applies_to), sites(name), employees(full_name)"
    )
    .eq("org_id", profile.org_id)
    .order("due_date", { ascending: true, nullsFirst: false });

  const all = obligations || [];
  const counts = countsByStatus(all);

  let filtered = statusFilter
    ? all.filter((o) => o.status === statusFilter)
    : all;

  if (obligationQ) {
    filtered = filtered.filter((o) => {
      const tpl = o.obligation_templates as unknown as {
        name: string;
      } | null;
      const name = tpl?.name?.toLowerCase();
      return name?.includes(obligationQ) ?? false;
    });
  }
  if (concerneQ) {
    filtered = filtered.filter((o) =>
      entityLabel(o).toLowerCase().includes(concerneQ)
    );
  }
  if (dueFilter === "none") {
    filtered = filtered.filter((o) => !o.due_date);
  } else if (dueFilter === "set") {
    filtered = filtered.filter((o) => !!o.due_date);
  }

  // Ordered by urgency for the filtered set
  const ordered = [...filtered].sort((a, b) => {
    const urgency = (s: string) =>
      s === "expired" ? 0 : s === "expiring_soon" ? 1 : s === "missing" ? 2 : 3;
    const diff = urgency(a.status) - urgency(b.status);
    if (diff !== 0) return diff;
    if (!a.due_date) return 1;
    if (!b.due_date) return -1;
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-gray-400" />
          Obligations
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Vue globale de toutes les obligations de conformité
        </p>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {STATUS_FILTERS.map((f) => {
          const isActive =
            f.key === statusFilter || (!statusFilter && f.key === undefined);
          const count =
            f.key !== undefined ? counts[f.key] : counts.total;
          const href = buildObligationsListHref({
            status: f.key,
            obligation: obligationParam,
            concerne: concerneParam,
            due: dueFilter,
          });
          return (
            <Link
              key={f.label}
              href={href}
              className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-gray-900 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {f.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {all.length > 0 && (
          <ObligationsColumnFilters
            status={statusFilter}
            obligation={obligationParam ?? ""}
            concerne={concerneParam ?? ""}
            due={dueFilter}
          />
        )}
        {ordered.length === 0 ? (
          <div className="p-12 text-center">
            <ClipboardList className="mx-auto h-8 w-8 text-gray-300 mb-3" />
            <p className="text-sm text-gray-400">
              Aucune obligation ne correspond à ces filtres.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                    Obligation
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                    Concerne
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                    Statut
                  </th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                    Échéance
                  </th>
                  <th className="px-5 py-3 w-20" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {ordered.map((o) => {
                  const template = o.obligation_templates as unknown as {
                    name: string;
                    applies_to: string;
                  } | null;
                  const entity = entityLabel(o);
                  return (
                    <tr
                      key={o.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-3.5 font-medium text-gray-900">
                        {template?.name}
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">{entity}</td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={o.status as ObligationStatus} />
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">
                        {o.due_date
                          ? new Date(o.due_date).toLocaleDateString("fr-FR")
                          : "—"}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/obligations/${o.id}/upload`}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          Gérer
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
