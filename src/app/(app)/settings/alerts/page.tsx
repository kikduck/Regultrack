import { AlertsPreferencesPanel } from "@/components/alerts-preferences-panel";
import Link from "next/link";

export default function AlertsSettingsPage() {
  return (
    <>
      <div className="px-6 pt-4 pb-0 lg:px-8">
        <p className="text-xs text-gray-500">
          <Link href="/alerts" className="text-primary font-medium hover:underline">
            Vue dédiée « Alertes »
          </Link>{" "}
          dans la barre latérale — même contenu.
        </p>
      </div>
      <AlertsPreferencesPanel />
    </>
  );
}
