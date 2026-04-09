import { AlertsPreferencesPanel } from "@/components/alerts-preferences-panel";
import { PageBackNav } from "@/components/page-back-nav";

export default function AlertsPage() {
  return (
    <AlertsPreferencesPanel
      header={<PageBackNav className="mb-6" />}
    />
  );
}
