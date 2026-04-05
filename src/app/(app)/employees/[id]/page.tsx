import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Upload } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { EmployeeActions } from "@/components/employee-actions";
import { ObligationCard } from "@/components/obligation-card";
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
    .select("*, obligation_templates(name, description, renewal_months, renewal_process, required_documents, competent_authority, official_url, legal_reference, help_text, proof_type), proofs(*)")
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
        <div className="grid grid-cols-1 gap-6">
          {obligationsList.map((obligation) => (
            <ObligationCard key={obligation.id} obligation={obligation as any} />
          ))}
        </div>
      )}
    </div>
  );
}
