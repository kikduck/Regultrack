"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, User, Mail, Shield } from "lucide-react";

export default function AccountSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUser(user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profile);
      setLoading(false);
    }
    loadUser();
  }, []);

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
        <h2 className="text-xl font-bold text-gray-900 mb-6">Mon compte</h2>
        
        <div className="space-y-8">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-gray-900">{profile?.full_name || 'Utilisateur'}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> Nom complet
              </label>
              <p className="text-sm font-medium text-gray-900">{profile?.full_name || '—'}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Email
              </label>
              <p className="text-sm font-medium text-gray-900">{user?.email}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" /> Rôle
              </label>
              <p className="text-sm font-medium text-gray-900 capitalize">{profile?.role}</p>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <button className="text-sm font-bold text-primary hover:underline">
              Modifier mes informations (Prochainement)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
