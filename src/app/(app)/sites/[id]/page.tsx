import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import type { ObligationStatus } from "@/lib/types/database";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SiteDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: site } = await supabase
    .from("sites")
    .select("*")
    .eq("id", id)
    .single();

  if (!site) notFound();

  const [employeesResult, obligationsResult] = await Promise.all([
    supabase
      .from("employees")
      .select("*")
      .eq("site_id", id)
      .eq("active", true)
      .order("full_name"),
    supabase
      .from("obligations")
      .select("*, obligation_templates(name, applies_to), employees(full_name)")
      .eq("site_id", id),
  ]);

  const employees = employeesResult.data || [];
  const obligations = obligationsResult.data || [];

  const siteObligations = obligations.filter(
    (o) =>
      (o.obligation_templates as { applies_to: string } | null)?.applies_to ===
      "site"
  );
  const employeeObligations = obligations.filter(
    (o) =>
      (o.obligation_templates as { applies_to: string } | null)?.applies_to ===
      "employee"
  );

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <Link
        href="/sites"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux sites
      </Link>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{site.name}</h1>
          <p className="mt-1 text-sm text-gray-500">{site.address}</p>
          {site.manager_email && (
            <p className="text-sm text-gray-400 mt-0.5">
              Responsable : {site.manager_email}
            </p>
          )}
        </div>
        <Link
          href={`/employees/new?site_id=${id}`}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors"
        >
          <Plus className="h-4 w-4" />
          Ajouter un employé
        </Link>
      </div>

      {/* Site-level obligations */}
      {siteObligations.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            Obligations du site
          </h2>
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm divide-y divide-gray-50">
            {siteObligations.map((o) => (
              <div key={o.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {(o.obligation_templates as { name: string } | null)?.name}
                  </p>
                  {o.due_date && (
                    <p className="text-xs text-gray-500">
                      Échéance : {new Date(o.due_date).toLocaleDateString("fr-FR")}
                    </p>
                  )}
                </div>
                <StatusBadge status={o.status as ObligationStatus} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Employees and their obligations */}
      <h2 className="text-lg font-semibold text-gray-900 mb-3">
        Employés ({employees.length})
      </h2>

      {employees.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
          <p className="text-sm text-gray-500">
            Aucun employé sur ce site.
          </p>
          <Link
            href={`/employees/new?site_id=${id}`}
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-dark"
          >
            <Plus className="h-4 w-4" />
            Ajouter un employé
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {employees.map((emp) => {
            const empObs = employeeObligations.filter(
              (o) => o.employee_id === emp.id
            );
            return (
              <Link
                key={emp.id}
                href={`/employees/${emp.id}`}
                className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {emp.full_name}
                    </p>
                    <p className="text-xs text-gray-500">{emp.job_title}</p>
                  </div>
                </div>
                {empObs.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {empObs.map((o) => (
                      <StatusBadge
                        key={o.id}
                        status={o.status as ObligationStatus}
                      />
                    ))}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
