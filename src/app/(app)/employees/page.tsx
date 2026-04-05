import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Users, Plus } from "lucide-react";
import { StatusDot } from "@/components/status-badge";
import type { ObligationStatus } from "@/lib/types/database";
import { employesActifsLabel } from "@/lib/format-fr";

export default async function EmployeesPage() {
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

  if (!profile?.org_id) redirect("/signup");

  const [employeesResult, sitesResult, obligationsResult] = await Promise.all([
    supabase
      .from("employees")
      .select("*")
      .eq("org_id", profile.org_id)
      .eq("active", true)
      .order("full_name"),
    supabase.from("sites").select("id, name").eq("org_id", profile.org_id),
    supabase
      .from("obligations")
      .select("employee_id, status")
      .eq("org_id", profile.org_id),
  ]);

  const employees = employeesResult.data || [];
  const sites = sitesResult.data || [];
  const obligations = obligationsResult.data || [];

  const siteMap = new Map(sites.map((s) => [s.id, s.name]));

  function getEmployeeStatus(empId: string): ObligationStatus {
    const empObs = obligations.filter((o) => o.employee_id === empId);
    if (empObs.length === 0) return "missing";
    if (empObs.some((o) => o.status === "expired")) return "expired";
    if (empObs.some((o) => o.status === "expiring_soon")) return "expiring_soon";
    if (empObs.some((o) => o.status === "missing")) return "missing";
    return "valid";
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employés</h1>
          <p className="mt-1 text-sm text-gray-500">
            {employesActifsLabel(employees.length)}
          </p>
        </div>
        <Link
          href="/employees/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors"
        >
          <Plus className="h-4 w-4" />
          Ajouter un employé
        </Link>
      </div>

      {employees.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
          <Users className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-900">
            Aucun employé
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Ajoutez vos agents et collaborateurs.
          </p>
          <Link
            href="/employees/new"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
          >
            <Plus className="h-4 w-4" />
            Ajouter un employé
          </Link>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-5 py-3 text-left font-medium text-gray-500">
                  Statut
                </th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">
                  Nom
                </th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">
                  Poste
                </th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">
                  Site
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {employees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <StatusDot status={getEmployeeStatus(emp.id)} />
                  </td>
                  <td className="px-5 py-3">
                    <Link
                      href={`/employees/${emp.id}`}
                      className="font-medium text-gray-900 hover:text-primary"
                    >
                      {emp.full_name}
                    </Link>
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {emp.job_title || "—"}
                  </td>
                  <td className="px-5 py-3 text-gray-500">
                    {siteMap.get(emp.site_id) || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
