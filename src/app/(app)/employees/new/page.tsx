"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Site } from "@/lib/types/database";

export default function NewEmployeePage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("agent");
  const [siteId, setSiteId] = useState("");
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function loadSites() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("org_id")
        .eq("id", user.id)
        .single();

      if (!profile?.org_id) return;

      const { data } = await supabase
        .from("sites")
        .select("*")
        .eq("org_id", profile.org_id)
        .order("name");

      if (data) {
        setSites(data as Site[]);
        const preselected = searchParams.get("site_id");
        if (preselected) {
          setSiteId(preselected);
        } else if (data.length > 0) {
          setSiteId(data[0].id);
        }
      }
    }
    loadSites();
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!siteId) {
      setError("Veuillez d'abord créer un site.");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("org_id")
      .eq("id", user.id)
      .single();

    if (!profile?.org_id) {
      setError("Organisation non trouvée.");
      setLoading(false);
      return;
    }

    const { data: employee, error: insertError } = await supabase
      .from("employees")
      .insert({
        org_id: profile.org_id,
        site_id: siteId,
        full_name: fullName,
        email: email || null,
        job_title: jobTitle,
      })
      .select()
      .single();

    if (insertError || !employee) {
      setError(insertError?.message || "Erreur lors de la création.");
      setLoading(false);
      return;
    }

    // Auto-create obligations based on templates for this sector
    const { data: templates } = await supabase
      .from("obligation_templates")
      .select("*")
      .eq("sector", "securite_privee")
      .eq("applies_to", "employee");

    if (templates && templates.length > 0) {
      const obligationsToInsert = templates.map((t) => ({
        org_id: profile.org_id!,
        template_id: t.id,
        site_id: siteId,
        employee_id: employee.id,
        status: "missing" as const,
      }));

      await supabase.from("obligations").insert(obligationsToInsert);
    }

    router.push("/employees");
  }

  return (
    <div className="p-6 lg:p-8 max-w-xl">
      <Link
        href="/employees"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux employés
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Ajouter un employé
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom complet
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="Jean Martin"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="jean.martin@entreprise.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Poste / Fonction
          </label>
          <select
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          >
            <option value="agent">Agent de sécurité</option>
            <option value="agent_ssiap">Agent SSIAP</option>
            <option value="chef_poste">Chef de poste</option>
            <option value="responsable">Responsable d&apos;agence</option>
            <option value="administratif">Administratif</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Site d&apos;affectation
          </label>
          {sites.length === 0 ? (
            <p className="mt-1 text-sm text-gray-500">
              Aucun site disponible.{" "}
              <Link href="/sites/new" className="text-primary hover:underline">
                Créer un site
              </Link>{" "}
              d&apos;abord.
            </p>
          ) : (
            <select
              value={siteId}
              onChange={(e) => setSiteId(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            >
              {sites.map((site) => (
                <option key={site.id} value={site.id}>
                  {site.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || sites.length === 0}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Création..." : "Ajouter l'employé"}
        </button>
      </form>
    </div>
  );
}
