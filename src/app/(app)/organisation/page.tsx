import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Landmark } from "lucide-react";
import { ObligationCard } from "@/components/obligation-card";
import { PageBackNav } from "@/components/page-back-nav";
import { ObligationEntityStatusFilters } from "@/components/obligation-entity-status-filters";
import { countsByStatus } from "@/lib/compliance-score";
import {
  parseEntityObligationStatusFilter,
  sortEntityObligationsByUrgency,
} from "@/lib/obligation-entity-filters";

export default async function OrganisationPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: statusParam } = await searchParams;
  const statusFilter = parseEntityObligationStatusFilter(statusParam);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("org_id, organizations(name)")
    .eq("id", user.id)
    .single();

  if (!profile?.org_id) redirect("/setup");

  const orgId = profile.org_id;
  const orgRow = profile.organizations as
    | { name: string }[]
    | { name: string }
    | null
    | undefined;
  const orgName = Array.isArray(orgRow)
    ? orgRow[0]?.name
    : orgRow?.name ?? "Organisation";

  const { data: obligations } = await supabase
    .from("obligations")
    .select(
      "*, obligation_templates(name, description, renewal_months, renewal_process, required_documents, competent_authority, official_url, legal_reference, help_text, proof_type, applies_to), custom_obligation_templates(name, description, renewal_months, renewal_process, required_documents, official_link, help_text, applies_to), proofs(*, profiles(full_name))"
    )
    .eq("org_id", orgId)
    .order("created_at");

  const orgObligations = (obligations || [])
    .map((o) => ({
      ...o,
      applies_to:
        (o.obligation_templates as { applies_to?: string } | null)
          ?.applies_to ||
        (o.custom_obligation_templates as { applies_to?: string } | null)
          ?.applies_to,
    }))
    .filter((o) => o.applies_to === "organization");

  const counts = countsByStatus(orgObligations);
  const filtered = statusFilter
    ? orgObligations.filter((o) => o.status === statusFilter)
    : orgObligations;
  const ordered = sortEntityObligationsByUrgency(filtered);

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <PageBackNav className="mb-4" />

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Landmark className="h-7 w-7 text-gray-400 shrink-0" />
          Organisation
        </h1>
        <p className="mt-1 text-sm text-gray-500">{orgName}</p>
        <p className="mt-2 text-sm text-gray-500">
          Obligations qui s&apos;appliquent à l&apos;échelle de votre structure
          (hors sites et employés).
        </p>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Obligations ({orgObligations.length})
      </h2>

      {orgObligations.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
          Aucune obligation au niveau organisation. Vous pouvez en ajouter
          depuis les paramètres (Obligations) si votre offre le permet.
        </div>
      ) : (
        <>
          <ObligationEntityStatusFilters
            basePath="/organisation"
            counts={counts}
            statusFilter={statusFilter}
          />

          {ordered.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
              Aucune obligation ne correspond à ce filtre.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {ordered.map((obligation) => (
                <ObligationCard
                  key={obligation.id}
                  obligation={obligation as any}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
