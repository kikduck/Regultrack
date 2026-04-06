import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Building2, Plus } from "lucide-react";
import { StatusDot } from "@/components/status-badge";
import type { ObligationStatus } from "@/lib/types/database";
import { sitesEnregistresLabel, employesAuSiteLabel } from "@/lib/format-fr";

export default async function SitesPage() {
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

  const [sitesResult, obligationsResult, employeesResult] = await Promise.all([
    supabase.from("sites").select("*").eq("org_id", profile.org_id).order("name"),
    supabase.from("obligations").select("site_id, status").eq("org_id", profile.org_id),
    supabase.from("employees").select("site_id").eq("org_id", profile.org_id).eq("active", true),
  ]);

  const sites = sitesResult.data || [];
  const obligations = obligationsResult.data || [];
  const employees = employeesResult.data || [];

  function getSiteStatus(siteId: string): ObligationStatus {
    const siteObs = obligations.filter((o) => o.site_id === siteId);
    if (siteObs.length === 0) return "missing";
    if (siteObs.some((o) => o.status === "expired")) return "expired";
    if (siteObs.some((o) => o.status === "expiring_soon")) return "expiring_soon";
    if (siteObs.some((o) => o.status === "missing")) return "missing";
    return "valid";
  }

  function getEmployeeCount(siteId: string) {
    return employees.filter((e) => e.site_id === siteId).length;
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sites</h1>
          <p className="mt-1 text-sm text-gray-500">
            {sitesEnregistresLabel(sites.length)}
          </p>
        </div>
        <Link
          href="/sites/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors"
        >
          <Plus className="h-4 w-4" />
          Ajouter un site
        </Link>
      </div>

      {sites.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
          <Building2 className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-900">Aucun site</p>
          <p className="mt-1 text-sm text-gray-500">
            Commencez par ajouter vos établissements.
          </p>
          <Link
            href="/sites/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
          >
            <Plus className="h-4 w-4" />
            Ajouter un site
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sites.map((site) => {
            const status = getSiteStatus(site.id);
            const empCount = getEmployeeCount(site.id);
            return (
              <Link
                key={site.id}
                href={`/sites/${site.id}`}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <StatusDot status={status} />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {site.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 truncate">
                      {site.address || "Pas d'adresse"}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {employesAuSiteLabel(empCount)}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
