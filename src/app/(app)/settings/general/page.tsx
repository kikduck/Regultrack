"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { sectorLabelFr } from "@/lib/sectors";
import { Loader2, Save } from "lucide-react";

export default function GeneralSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [org, setOrg] = useState<{ id: string; name: string; sector: string } | null>(null);
  const [name, setName] = useState("");

  const supabase = createClient();

  useEffect(() => {
    async function loadOrg() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("org_id, organizations(*)")
        .eq("id", user.id)
        .single();

      if (profile?.organizations) {
        const orgData = profile.organizations as any;
        setOrg(orgData);
        setName(orgData.name);
      }
      setLoading(false);
    }
    loadOrg();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org || !name.trim()) return;
    setSaving(true);

    const { error } = await supabase
      .from("organizations")
      .update({ name: name.trim() })
      .eq("id", org.id);

    if (!error) {
      setOrg({ ...org, name: name.trim() });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        Chargement...
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-2xl">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Informations générales</h2>
        
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Nom de l&apos;organisation
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
              Secteur d&apos;activité
            </label>
            <input
              type="text"
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
              value={org?.sector ? sectorLabelFr(org.sector) : ""}
            />
            <p className="mt-1.5 text-xs text-gray-400 italic">
              Le secteur est défini lors de la création de votre compte et ne peut pas être modifié.
            </p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving || !name.trim() || name === org?.name}
              className="inline-flex items-center gap-2 bg-primary px-6 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
