"use client";

import { CreditCard, Zap, CheckCircle2 } from "lucide-react";

export default function BillingSettingsPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-3xl">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Abonnement et facturation</h2>
        
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-6 text-white shadow-xl shadow-primary/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-primary-light text-xs font-bold uppercase tracking-wider">Plan actuel</p>
                <h3 className="text-2xl font-bold mt-1">Version Bêta — Gratuit</h3>
                <p className="text-primary-light text-sm mt-2 max-w-sm">
                  Vous bénéficiez d&apos;un accès complet à toutes les fonctionnalités pendant la phase de lancement.
                </p>
              </div>
              <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Zap className="h-6 w-6" />
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-6">
              <div>
                <p className="text-primary-light text-[10px] font-bold uppercase">Sites utilisés</p>
                <p className="text-lg font-bold">Illimité</p>
              </div>
              <div>
                <p className="text-primary-light text-[10px] font-bold uppercase">Prochaine facture</p>
                <p className="text-lg font-bold">0,00 €</p>
              </div>
            </div>
          </div>

          <section>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Fonctionnalités incluses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Registre réglementaire complet",
                "Tableau de bord multi-sites",
                "Habilitations personnalisées",
                "Export PDF illimité",
                "Alertes email automatiques",
                "Support prioritaire"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </section>

          <section className="pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-gray-400" />
                <p className="text-sm text-gray-500 italic">Aucun moyen de paiement enregistré.</p>
              </div>
              <button className="text-sm font-bold text-primary hover:underline">
                Gérer via Stripe (Bientôt)
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
