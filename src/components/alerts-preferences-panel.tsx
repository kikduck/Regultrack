import { Bell, Mail, Clock, ShieldAlert } from "lucide-react";

/**
 * Contenu partagé pour la configuration des alertes.
 * Utilisé par /alerts (sidebar) et /settings/alerts (Paramètres).
 */
export function AlertsPreferencesPanel() {
  return (
    <div className="p-6 lg:p-8">
      <div className="max-w-3xl">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Préférences d&apos;alertes
        </h2>

        <div className="space-y-8">
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex gap-4">
            <Bell className="h-6 w-6 text-blue-500 shrink-0" />
            <div>
              <p className="text-sm font-bold text-blue-900">
                Alertes d&apos;expiration déjà actives
              </p>
              <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                Dès la création de votre espace, les rappels liés aux{" "}
                <strong>dates d&apos;expiration</strong> des obligations suivent
                les seuils du registre métier (typiquement J-90, J-30, J-7 selon
                le type de pièce). Vous n&apos;avez rien à activer pour être
                prévenu — cette page servira bientôt à{" "}
                <strong>affiner</strong> les destinataires, le périmètre (sites)
                et les seuils, sans couper les alertes critiques.
              </p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex gap-4">
            <Mail className="h-6 w-6 text-amber-600 shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-900">
                Personnalisation en cours de développement
              </p>
              <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                Prochaine étape : enregistrer vos préférences (e-mail, équipe,
                par site) ; elles seront ensuite appliquées automatiquement aux
                envois planifiés.
              </p>
            </div>
          </div>

          <div className="opacity-50 pointer-events-none space-y-6">
            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                Mes notifications
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Email récapitulatif
                      </p>
                      <p className="text-xs text-gray-500">
                        Recevoir un résumé hebdomadaire le lundi matin
                      </p>
                    </div>
                  </div>
                  <div className="h-6 w-10 bg-gray-200 rounded-full" />
                </div>
                <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        Alertes d&apos;expiration
                      </p>
                      <p className="text-xs text-gray-500">
                        Être prévenu dès qu&apos;une pièce entre dans une zone
                        d&apos;alerte
                      </p>
                    </div>
                  </div>
                  <div className="h-6 w-10 bg-primary rounded-full flex justify-end p-1">
                    <div className="h-4 w-4 bg-white rounded-full" />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                Alertes critiques
              </h3>
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-3">
                <ShieldAlert className="h-5 w-5 text-red-400 shrink-0" />
                <p className="text-xs text-gray-600">
                  Les alertes pour les obligations critiques (ex. carte CNAPS
                  proche de l&apos;expiration) ne pourront pas être désactivées
                  — conformément aux attentes audit et sécurité juridique.
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
