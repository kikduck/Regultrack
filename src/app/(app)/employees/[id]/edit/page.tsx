"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { Site } from "@/lib/types/database";

export default function EditEmployeePage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [siteId, setSiteId] = useState("");
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;

  useEffect(() => {
    async function loadData() {
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

      const [employeeResult, sitesResult] = await Promise.all([
        supabase
          .from("employees")
          .select("*")
          .eq("id", employeeId)
          .single(),
        supabase
          .from("sites")
          .select("*")
          .eq("org_id", profile.org_id)
          .order("name")
      ]);

      if (employeeResult.error || !employeeResult.data) {
        setError("Impossible de charger l'employé.");
      } else {
        setFullName(employeeResult.data.full_name);
        setEmail(employeeResult.data.email || "");
        setJobTitle(employeeResult.data.job_title);
        setSiteId(employeeResult.data.site_id);
      }

      if (sitesResult.data) {
        setSites(sitesResult.data as Site[]);
      }
      
      setFetching(false);
    }
    loadData();
  }, [employeeId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!siteId) {
      setError("Veuillez sélectionner un site.");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { error: updateError } = await supabase
      .from("employees")
      .update({
        site_id: siteId,
        full_name: fullName,
        email: email || null,
        job_title: jobTitle,
      })
      .eq("id", employeeId);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      router.push(`/employees/${employeeId}`);
    }
  }

  if (fetching) {
    return <div className="p-6 lg:p-8">Chargement...</div>;
  }

  return (
    <div className="p-6 lg:p-8 max-w-xl">
      <Link
        href={`/employees/${employeeId}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à l&apos;employé
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Modifier l&apos;employé
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
        </div>

        <button
          type="submit"
          disabled={loading || sites.length === 0}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
}
