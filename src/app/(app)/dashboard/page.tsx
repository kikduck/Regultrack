import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Building2,
  Users,
  ShieldCheck,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { StatusDot, StatusBadge } from "@/components/status-badge";
import { ObligationCard } from "@/components/obligation-card";
import Link from "next/link";
import type { ObligationStatus } from "@/lib/types/database";

export default async function DashboardPage() {
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

  if (!profile?.org_id) {
    redirect("/setup");
  }

  const orgId = profile.org_id;

  const [sitesResult, employeesResult, obligationsResult] = await Promise.all([
    supabase.from("sites").select("*").eq("org_id", orgId),
    supabase.from("employees").select("*").eq("org_id", orgId).eq("active", true),
    supabase
      .from("obligations")
      .select("*, sites(name), employees(full_name), obligation_templates(*), proofs(*)")
      .eq("org_id", orgId),
  ]);

  const sites = sitesResult.data || [];
  const employees = employeesResult.data || [];
  const obligations = obligationsResult.data || [];

  const orgObligations = obligations.filter(o => (o.obligation_templates as any)?.applies_to === 'organization');
  const otherObligations = obligations.filter(o => (o.obligation_templates as any)?.applies_to !== 'organization');

  const validCount = obligations.filter((o) => o.status === "valid").length;
  const expiringCount = obligations.filter(
    (o) => o.status === "expiring_soon"
  ).length;
  const expiredCount = obligations.filter((o) => o.status === "expired").length;
  const missingCount = obligations.filter((o) => o.status === "missing").length;

  const urgentObligations = obligations
    .filter((o) => o.status === "expired" || o.status === "expiring_soon")
    .sort((a, b) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    })
    .slice(0, 10);

  function getSiteStatus(
    siteId: string
  ): ObligationStatus {
    const siteObligations = obligations.filter((o) => o.site_id === siteId);
    if (siteObligations.some((o) => o.status === "expired")) return "expired";
    if (siteObligations.some((o) => o.status === "expiring_soon"))
      return "expiring_soon";
    if (siteObligations.some((o) => o.status === "missing")) return "missing";
    return "valid";
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="mt-1 text-sm text-gray-500">
          Vue d&apos;ensemble de la conformité de vos sites
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        <StatCard
          title="Sites"
          value={sites.length}
          icon={Building2}
        />
        <StatCard
          title="Employés actifs"
          value={employees.length}
          icon={Users}
        />
        <StatCard
          title="En règle"
          value={validCount}
          icon={ShieldCheck}
          variant="success"
        />
        <StatCard
          title="Expire bientôt"
          value={expiringCount}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Expiré / Manquant"
          value={expiredCount + missingCount}
          icon={XCircle}
          variant="danger"
        />
      </div>

      {/* Organization Obligations */}
      {orgObligations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gray-400" />
            Obligations de l&apos;entreprise
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orgObligations.map((o) => (
              <div key={o.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-900">{(o.obligation_templates as any)?.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={o.status as ObligationStatus} />
                    {o.due_date && (
                      <span className="text-[10px] text-gray-500">Échéance : {new Date(o.due_date).toLocaleDateString("fr-FR")}</span>
                    )}
                  </div>
                </div>
                <Link 
                  href={`/obligations/${o.id}/upload`}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  Gérer
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sites overview */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-base font-semibold text-gray-900">
              Statut par site
            </h2>
            <Link
              href="/sites"
              className="text-sm font-medium text-primary hover:text-primary-dark"
            >
              Voir tout
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {sites.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">
                Aucun site ajouté.{" "}
                <Link href="/sites" className="text-primary hover:underline">
                  Ajouter un site
                </Link>
              </div>
            ) : (
              sites.map((site) => {
                const status = getSiteStatus(site.id);
                return (
                  <Link
                    key={site.id}
                    href={`/sites/${site.id}`}
                    className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <StatusDot status={status} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {site.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {site.address}
                      </p>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Urgent obligations */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4">
            <h2 className="text-base font-semibold text-gray-900">
              Actions urgentes
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {urgentObligations.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">
                Tout est en règle.
              </div>
            ) : (
              urgentObligations.map((obligation) => (
                <div
                  key={obligation.id}
                  className="flex items-center gap-3 px-5 py-3"
                >
                  <StatusDot status={obligation.status as ObligationStatus} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {(obligation.obligation_templates as { name: string } | null)?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(obligation.employees as { full_name: string } | null)?.full_name ||
                        (obligation.sites as { name: string } | null)?.name ||
                        "—"}
                      {obligation.due_date &&
                        ` · Échéance : ${new Date(obligation.due_date).toLocaleDateString("fr-FR")}`}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
