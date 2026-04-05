"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { resolveOrgSector } from "@/lib/profile-org";

export default function NewSitePage() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("org_id, organizations(sector)")
      .eq("id", user.id)
      .single();

    if (!profile?.org_id) {
      setError("Organisation non trouvée.");
      setLoading(false);
      return;
    }

    const { data: insertedSite, error: insertError } = await supabase
      .from("sites")
      .insert({
        org_id: profile.org_id,
        name,
        address,
        manager_email: managerEmail || null,
      })
      .select()
      .single();

    if (insertError || !insertedSite) {
      setError(insertError?.message || "Erreur lors de la création.");
      setLoading(false);
      return;
    }

    // Auto-create obligations for site
    const sector = resolveOrgSector(profile.organizations);
    const { data: templates } = await supabase
      .from("obligation_templates")
      .select("*")
      .eq("sector", sector)
      .eq("applies_to", "site");

    if (templates && templates.length > 0) {
      const obligationsToInsert = templates.map((t) => ({
        org_id: profile.org_id!,
        template_id: t.id,
        site_id: insertedSite.id,
        status: "missing" as const,
      }));

      await supabase.from("obligations").insert(obligationsToInsert);
    }

    router.push("/sites");
  }

  return (
    <div className="p-6 lg:p-8 max-w-xl">
      <Link
        href="/sites"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux sites
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Ajouter un site
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom du site
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="Ex: Agence Paris Nord"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Adresse
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="12 rue de la Paix, 75002 Paris"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email du responsable de site
          </label>
          <input
            type="email"
            value={managerEmail}
            onChange={(e) => setManagerEmail(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
            placeholder="responsable@entreprise.com"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Création..." : "Créer le site"}
        </button>
      </form>
    </div>
  );
}
