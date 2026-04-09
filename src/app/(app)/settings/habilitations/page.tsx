"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, HelpCircle, AlertCircle, Trash2, Edit2, ShieldCheck, User, Building, Landmark, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ObligationTemplate } from "@/lib/types/database";
import { renewalMonthsLabelFr } from "@/lib/format-renewal";
import { RequiredFieldMark } from "@/components/required-field-mark";

interface CustomTemplate {
  id: string;
  name: string;
  description: string;
  applies_to: "employee" | "site" | "organization";
  renewal_months: number;
  active: boolean;
  created_at: string;
}

export default function ObligationsSettingsPage() {
  const [standardTemplates, setStandardTemplates] = useState<ObligationTemplate[]>([]);
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [orgId, setOrgId] = useState<string | null>(null);
  const [sector, setSector] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    applies_to: "employee" as "employee" | "site" | "organization",
    renewal_months: 12,
  });

  const supabase = createClient();

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from("profiles")
      .select("org_id, organizations(sector)")
      .eq("id", user.id)
      .single();

    if (!profile?.org_id) return;
    setOrgId(profile.org_id);
    const sectorValue = (profile.organizations as any)?.sector || "securite_privee";
    setSector(sectorValue);

    const [standardRes, customRes] = await Promise.all([
      supabase
        .from("obligation_templates")
        .select("*")
        .eq("sector", sectorValue)
        .order("name"),
      supabase
        .from("custom_obligation_templates")
        .select("*")
        .eq("org_id", profile.org_id)
        .order("name")
    ]);

    if (standardRes.data) setStandardTemplates(standardRes.data);
    if (customRes.data) setCustomTemplates(customRes.data);
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgId) return;
    setSaving(true);

    const { data, error } = await supabase
      .from("custom_obligation_templates")
      .insert({
        org_id: orgId,
        ...formData,
      })
      .select()
      .single();

    if (data && !error) {
      setCustomTemplates((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      setShowModal(false);
      setFormData({
        name: "",
        description: "",
        applies_to: "employee",
        renewal_months: 12,
      });
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer cette obligation personnalisée ?")) return;

    const { error } = await supabase
      .from("custom_obligation_templates")
      .delete()
      .eq("id", id);

    if (!error) {
      setCustomTemplates((prev) => prev.filter((t) => t.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        Chargement des obligations...
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100 relative">
      <div className="p-6 lg:p-8 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Registre des obligations</h2>
          <p className="mt-1 text-sm text-gray-500">
            Gérez les obligations réglementaires suivies pour votre organisation.
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 bg-primary px-4 py-2 rounded-lg text-sm font-semibold text-white shadow-sm hover:bg-primary-dark transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nouvelle obligation
        </button>
      </div>

      <div className="p-6 lg:p-8">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
          Obligations standards (secteur)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {standardTemplates.map((template) => (
            <div key={template.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex gap-4">
              <div className="h-10 w-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                {template.applies_to === "employee" ? <User className="h-5 w-5 text-blue-500" /> : 
                 template.applies_to === "site" ? <Building className="h-5 w-5 text-amber-500" /> : 
                 <Landmark className="h-5 w-5 text-purple-500" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-gray-900 truncate">{template.name}</p>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-gray-200 text-gray-600">Standard</span>
                </div>
                <p className="text-sm text-gray-500 mt-1 line-clamp-1">{template.description}</p>
                <p className="text-xs text-gray-400 mt-2">
                  Renouvellement : {renewalMonthsLabelFr(template.renewal_months)} • {template.applies_to === "employee" ? "Individuel" : template.applies_to === "site" ? "Par site" : "Organisation"}
                </p>
              </div>
            </div>
          ))}
        </div>

        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-10 mb-4">
          Obligations personnalisées
        </h3>
        {customTemplates.length === 0 ? (
          <div className="py-12 border-2 border-dashed border-gray-100 rounded-2xl flex flex-col items-center justify-center text-center">
            <ShieldCheck className="h-12 w-12 text-gray-200 mb-3" />
            <p className="text-gray-500 text-sm font-medium">Aucune obligation personnalisée</p>
            <p className="text-gray-400 text-xs mt-1">Ajoutez vos propres obligations internes ou contractuelles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customTemplates.map((template) => (
              <div key={template.id} className="p-4 border border-gray-200 rounded-xl bg-white flex gap-4 group hover:border-primary/30 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
                  {template.applies_to === "employee" ? <User className="h-5 w-5 text-primary" /> : 
                   template.applies_to === "site" ? <Building className="h-5 w-5 text-primary" /> : 
                   <Landmark className="h-5 w-5 text-primary" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 truncate">{template.name}</p>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-primary/10 text-primary">Custom</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-1">{template.description}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    Renouvellement : {renewalMonthsLabelFr(template.renewal_months)} • {template.applies_to === "employee" ? "Individuel" : template.applies_to === "site" ? "Par site" : "Organisation"}
                  </p>
                </div>
                <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDelete(template.id)}
                    className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal nouvelle obligation personnalisée */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Nouvelle obligation personnalisée</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Nom de l&apos;obligation
                  <RequiredFieldMark />
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                  placeholder="Ex: Accès zone sensible (aéroport)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Description (Optionnel)</label>
                <textarea
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none"
                  rows={2}
                  placeholder="Expliquez brièvement à quoi sert cette obligation."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Cible</label>
                  <select
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm bg-white"
                    value={formData.applies_to}
                    onChange={(e) => setFormData({ ...formData, applies_to: e.target.value as any })}
                  >
                    <option value="employee">Employé</option>
                    <option value="site">Site</option>
                    <option value="organization">Organisation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Renouvellement (mois)</label>
                  <input
                    type="number"
                    min={0}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                    value={formData.renewal_months}
                    onChange={(e) => setFormData({ ...formData, renewal_months: parseInt(e.target.value, 10) || 0 })}
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving || !formData.name}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-dark disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Création...
                    </>
                  ) : (
                    "Créer l'obligation"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
