import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { EmployeeActions } from "@/components/employee-actions";
import type { ObligationStatus } from "@/lib/types/database";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EmployeeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: employee } = await supabase
    .from("employees")
    .select("*, sites(name)")
    .eq("id", id)
    .single();

  if (!employee) notFound();

  const { data: obligations } = await supabase
    .from("obligations")
    .select("*, obligation_templates(name, description, renewal_months, proof_type), proofs(*)")
    .eq("employee_id", id)
    .order("created_at");

  const obligationsList = obligations || [];

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <Link
        href="/employees"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux employés
      </Link>

      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {employee.full_name}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {employee.job_title} · {(employee.sites as { name: string } | null)?.name}
          </p>
          {employee.email && (
            <p className="text-sm text-gray-400">{employee.email}</p>
          )}
        </div>
        <EmployeeActions employeeId={id} />
      </div>

      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Obligations ({obligationsList.length})
      </h2>

      {obligationsList.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center text-sm text-gray-500">
          Aucune obligation rattachée à cet employé.
        </div>
      ) : (
        <div className="space-y-4">
          {obligationsList.map((obligation) => {
            const template = obligation.obligation_templates as {
              name: string;
              description: string;
              renewal_months: number;
              proof_type: string;
            } | null;
            const proofs = (obligation.proofs || []) as {
              id: string;
              file_name: string;
              file_url: string;
              valid_until: string | null;
              uploaded_at: string;
            }[];

            return (
              <div
                key={obligation.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {template?.name}
                    </p>
                    {template?.description && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {template.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Renouvellement : tous les {template?.renewal_months} mois
                    </p>
                  </div>
                  <StatusBadge status={obligation.status as ObligationStatus} />
                </div>

                {obligation.due_date && (
                  <p className="text-xs text-gray-500 mb-3">
                    Échéance :{" "}
                    <span className="font-medium">
                      {new Date(obligation.due_date).toLocaleDateString("fr-FR")}
                    </span>
                  </p>
                )}

                {proofs.length > 0 && (
                  <div className="mb-3 space-y-1">
                    {proofs.map((proof) => (
                      <a
                        key={proof.id}
                        href={proof.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-xs text-primary hover:underline"
                      >
                        {proof.file_name} — uploadé le{" "}
                        {new Date(proof.uploaded_at).toLocaleDateString("fr-FR")}
                      </a>
                    ))}
                  </div>
                )}

                <Link
                  href={`/obligations/${obligation.id}/upload`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-dark"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Ajouter une preuve
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
