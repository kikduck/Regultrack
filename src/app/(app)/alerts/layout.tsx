import Link from "next/link";

export default function AlertsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="p-6 lg:p-10 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Alertes</h1>
        <p className="mt-2 text-gray-500 max-w-2xl">
          Pilotez qui est prévenu, quand et sur quel périmètre. Les rappels
          liés aux échéances sont déjà en place selon votre secteur ; vous
          pourrez bientôt les ajuster finement.
        </p>
        <p className="mt-3 text-sm text-gray-500">
          <Link
            href="/settings/alerts"
            className="text-primary font-medium hover:underline"
          >
            Même écran sous Paramètres → Alertes
          </Link>{" "}
          si vous préférez tout regrouper dans les réglages.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {children}
      </div>
    </div>
  );
}
