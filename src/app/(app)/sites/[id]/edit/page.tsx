"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AddressAutocompleteInput } from "@/components/address-autocomplete-input";

export default function EditSitePage() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [managerEmail, setManagerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const siteId = params.id as string;

  useEffect(() => {
    async function loadSite() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("sites")
        .select("*")
        .eq("id", siteId)
        .single();

      if (error || !data) {
        setError("Impossible de charger le site.");
      } else {
        setName(data.name);
        setAddress(data.address || "");
        setManagerEmail(data.manager_email || "");
      }
      setFetching(false);
    }
    loadSite();
  }, [siteId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();

    const { error: updateError } = await supabase
      .from("sites")
      .update({
        name,
        address,
        manager_email: managerEmail || null,
      })
      .eq("id", siteId);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      router.push(`/sites/${siteId}`);
    }
  }

  if (fetching) {
    return <div className="p-6 lg:p-8">Chargement...</div>;
  }

  return (
    <div className="p-6 lg:p-8 max-w-xl">
      <Link
        href={`/sites/${siteId}`}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour au site
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Modifier le site
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
          />
        </div>

        <AddressAutocompleteInput
          id="site-address-edit"
          label="Adresse"
          value={address}
          onChange={setAddress}
          placeholder="12 rue de la Paix, 75002 Paris"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email du responsable de site
          </label>
          <input
            type="email"
            value={managerEmail}
            onChange={(e) => setManagerEmail(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
}
