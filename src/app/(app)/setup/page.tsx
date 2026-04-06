"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Shield, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

export default function SetupPage() {
  const [orgName, setOrgName] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkStatus() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("org_id, full_name")
        .eq("id", user.id)
        .single();

      if (profile?.org_id) {
        router.replace("/dashboard");
      } else {
        setFullName(profile?.full_name || "");
        try {
          const pendingOrg = sessionStorage.getItem("regultrack_pending_org_name");
          if (pendingOrg) {
            setOrgName(pendingOrg);
            sessionStorage.removeItem("regultrack_pending_org_name");
          }
        } catch {
          /* ignore */
        }
        setChecking(false);
      }
    }
    checkStatus();
  }, [router]);

  async function handleSetup(e: React.FormEvent) {
    e.preventDefault();
    const name = fullName.trim();
    const company = orgName.trim();
    if (!name || !company) {
      setError("Renseignez votre nom complet et le nom de l’entreprise pour continuer.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/setup-org", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgName: company, fullName: name }),
        credentials: "same-origin",
      });

      const text = await res.text();
      let payload: { error?: string } = {};
      try {
        payload = text ? (JSON.parse(text) as { error?: string }) : {};
      } catch {
        payload = { error: text || "Réponse serveur invalide" };
      }

      if (!res.ok) {
        throw new Error(payload.error || `Erreur ${res.status}`);
      }

      await router.refresh();
      router.replace("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la configuration");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-gray-900">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-primary p-8 text-white flex flex-col items-center text-center">
          <div className="bg-white/20 p-3 rounded-xl mb-4">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold">Bienvenue sur Regultrack</h1>
          <p className="mt-2 text-primary-light text-sm max-w-md">
            Votre compte a été créé. Configurons votre espace de travail pour commencer à suivre votre conformité.
          </p>
        </div>

        <div className="p-8 lg:p-12">
          <form onSubmit={handleSetup} className="space-y-8">
            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-100">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Informations</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nom complet</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Nom de l'entreprise</label>
                    <input
                      type="text"
                      required
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                      placeholder="Ex: Sécurité Plus SARL"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Inclus dans votre espace</h2>
                <ul className="space-y-3">
                  {[
                    "Base réglementaire Sécurité Privée",
                    "Tableau de bord multi-sites",
                    "Alertes email automatiques",
                    "Export dossier d'audit PDF"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Configuration de votre espace...
                </>
              ) : (
                <>
                  Démarrer l'expérience
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
