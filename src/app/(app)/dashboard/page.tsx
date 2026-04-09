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
import Link from "next/link";
import type { ObligationStatus } from "@/lib/types/database";
import {
  countsByStatus,
  computeSiteScore,
  SITE_CARD_COLORS,
  GLOBAL_SCORE_TEXT,
} from "@/lib/compliance-score";

import { DashboardFilters } from "@/components/dashboard-filters";
import { documentsManquantsPhrase } from "@/lib/format-fr";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q: searchFilter, status: statusFilter } = await searchParams;
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

  const orgId = profile.org_id;

  const [sitesResult, employeesResult, obligationsResult] = await Promise.all([
    supabase.from("sites").select("*").eq("org_id", orgId),
    supabase
      .from("employees")
      .select("*")
      .eq("org_id", orgId)
      .eq("active", true),
    supabase
      .from("obligations")
      .select(
        "*, sites(name), employees(full_name), obligation_templates(*), custom_obligation_templates(*), proofs(*, profiles(full_name))"
      )
      .eq("org_id", orgId),
  ]);

  const sites = sitesResult.data || [];
  const employees = employeesResult.data || [];
  const obligations = (obligationsResult.data || []).map(o => ({
    ...o,
    template: o.obligation_templates || o.custom_obligation_templates,
    template_name: (o.obligation_templates as any)?.name || (o.custom_obligation_templates as any)?.name,
    applies_to: (o.obligation_templates as any)?.applies_to || (o.custom_obligation_templates as any)?.applies_to
  }));

  const orgObligations = obligations.filter(
    (o) => o.applies_to === "organization"
  );

  // Scores
  const globalCounts = countsByStatus(obligations);
  const globalScore = computeSiteScore(globalCounts);

  function getSiteScore(siteId: string) {
    const siteObs = obligations.filter((o) => o.site_id === siteId);
    return computeSiteScore(countsByStatus(siteObs));
  }

  // Filtrage des sites
  let filteredSites = sites;
  if (searchFilter) {
    filteredSites = filteredSites.filter((s) => 
      s.name.toLowerCase().includes(searchFilter.toLowerCase())
    );
  }
  
  if (statusFilter && statusFilter !== "all") {
    filteredSites = filteredSites.filter((s) => {
      const score = getSiteScore(s.id);
      return score.worstStatus === statusFilter;
    });
  }

  const urgentObligations = obligations
    .filter((o) => o.status === "expired" || o.status === "expiring_soon")
    .sort((a, b) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
    })
    .slice(0, 10);

  return (
    <div className="p-6 lg:p-8 max-w-7xl">
      {/* Header avec score global */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="mt-1 text-sm text-gray-500">
            Vue d&apos;ensemble de la conformité de vos sites
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
            Score global
          </p>
          <p
            className={`text-4xl font-bold tabular-nums ${GLOBAL_SCORE_TEXT[globalScore.worstStatus]}`}
          >
            {globalScore.score}%
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        <StatCard title="Sites" value={sites.length} icon={Building2} />
        <StatCard
          title="Employés actifs"
          value={employees.length}
          icon={Users}
        />
        <StatCard
          title="En règle"
          value={globalCounts.valid}
          icon={ShieldCheck}
          variant="success"
        />
        <StatCard
          title="Expire bientôt"
          value={globalCounts.expiring_soon}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Expiré / Manquant"
          value={globalCounts.expired + globalCounts.missing}
          icon={XCircle}
          variant="danger"
        />
      </div>

      {/* Obligations de l'entreprise */}
      {orgObligations.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-gray-400" />
              Obligations de l&apos;entreprise
            </h2>
            <Link
              href="/organisation"
              className="text-sm font-medium text-primary hover:text-primary-dark shrink-0"
            >
              Voir tout
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orgObligations.map((o) => (
              <div
                key={o.id}
                className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-bold text-gray-900">
                    {o.template_name}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={o.status as ObligationStatus} />
                    {o.due_date && (
                      <span className="text-[10px] text-gray-500">
                        Échéance :{" "}
                        {new Date(o.due_date).toLocaleDateString("fr-FR")}
                      </span>
                    )}
                    {o.custom_obligation_templates && (
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium text-primary ring-1 ring-inset ring-primary/20">
                        Personnalisée
                      </span>
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
        {/* Grille de sites avec code couleur */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2 className="text-base font-semibold text-gray-900">
              Statut par site
            </h2>
            <Link
              href="/sites"
              className="text-sm font-medium text-primary hover:text-primary-dark"
            >
              Gérer les sites
            </Link>
          </div>
          <div className="p-4 border-b border-gray-50 bg-gray-50/30">
            <DashboardFilters />
          </div>
          <div className="divide-y divide-gray-50">
            {filteredSites.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">
                {searchFilter || statusFilter ? "Aucun site ne correspond aux filtres." : "Aucun site ajouté."}{" "}
                {!searchFilter && !statusFilter && (
                  <Link href="/sites/new" className="text-primary hover:underline">
                    Ajouter un site
                  </Link>
                )}
              </div>
            ) : (
              filteredSites.map((site) => {
                const siteScore = getSiteScore(site.id);
                const colors = SITE_CARD_COLORS[siteScore.worstStatus];
                const statLabels: string[] = [];
                if (siteScore.valid > 0) {
                  statLabels.push(`${siteScore.valid} en règle`);
                }
                if (siteScore.expiring_soon > 0) {
                  statLabels.push(`${siteScore.expiring_soon} expire bientôt`);
                }
                if (siteScore.expired > 0) {
                  statLabels.push(`${siteScore.expired} expiré${siteScore.expired > 1 ? "s" : ""}`);
                }
                if (siteScore.missing > 0) {
                  statLabels.push(
                    `${siteScore.missing} manquant${siteScore.missing > 1 ? "s" : ""}`
                  );
                }
                const ariaSite = `Site ${site.name}, conformité ${siteScore.score} pour 100${
                  statLabels.length ? ` — ${statLabels.join(", ")}` : ""
                }`;
                return (
                  <Link
                    key={site.id}
                    href={`/sites/${site.id}`}
                    aria-label={ariaSite}
                    className={`flex items-center gap-3 pl-3 pr-5 py-3.5 hover:bg-gray-50 transition-colors border-l-4 ${colors.leftBorder}`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {site.name}
                      </p>
                      <div className="flex gap-3 mt-1 text-xs">
                        {siteScore.valid > 0 && (
                          <span className="text-green-600">
                            ✓ {siteScore.valid}
                          </span>
                        )}
                        {siteScore.expiring_soon > 0 && (
                          <span className="text-amber-500">
                            ⚠ {siteScore.expiring_soon}
                          </span>
                        )}
                        {siteScore.expired > 0 && (
                          <span className="text-red-500">
                            ✕ {siteScore.expired}
                          </span>
                        )}
                        {siteScore.missing > 0 && (
                          <span className="text-gray-400">
                            <span className="sr-only">Manquants : </span>
                            <span aria-hidden className="select-none">
                              ?
                            </span>{" "}
                            {siteScore.missing}
                          </span>
                        )}
                        {siteScore.total === 0 && (
                          <span className="text-gray-300 italic">
                            Aucune obligation
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-sm font-bold tabular-nums shrink-0 ${colors.scoreText}`}
                    >
                      {siteScore.score}%
                    </span>
                  </Link>
                );
              })
            )}
          </div>
        </div>

        {/* Actions urgentes */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              Actions urgentes
            </h2>
            {urgentObligations.length > 0 && (
              <Link
                href="/obligations"
                className="text-sm font-medium text-primary hover:text-primary-dark"
              >
                Voir tout
              </Link>
            )}
          </div>
          <div className="divide-y divide-gray-50">
            {urgentObligations.length === 0 ? (
              <div className="px-5 py-8 text-center text-sm text-gray-400">
                Aucune échéance urgente.
                {globalCounts.missing > 0 && (
                  <p className="mt-1 text-xs text-gray-400">
                    {documentsManquantsPhrase(globalCounts.missing)} —{" "}
                    <Link
                      href="/obligations?status=missing"
                      className="text-primary hover:underline"
                    >
                      voir
                    </Link>
                  </p>
                )}
              </div>
            ) : (
              urgentObligations.map((obligation) => (
                <Link
                  key={obligation.id}
                  href={`/obligations/${obligation.id}/upload`}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors"
                >
                  <StatusDot status={obligation.status as ObligationStatus} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate flex items-center gap-2">
                      {obligation.template_name}
                      {obligation.custom_obligation_templates && (
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-1 py-0.5 text-[8px] font-medium text-primary ring-1 ring-inset ring-primary/20">
                          P
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(
                        obligation.employees as {
                          full_name: string;
                        } | null
                      )?.full_name ||
                        (obligation.sites as { name: string } | null)?.name ||
                        "—"}
                      {obligation.due_date &&
                        ` · Échéance : ${new Date(obligation.due_date).toLocaleDateString("fr-FR")}`}
                    </p>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
