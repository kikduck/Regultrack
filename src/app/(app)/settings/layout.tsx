"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "general", label: "Général", href: "/settings/general" },
  { id: "account", label: "Compte", href: "/settings/account" },
  { id: "habilitations", label: "Habilitations", href: "/settings/habilitations" },
  { id: "alerts", label: "Alertes", href: "/settings/alerts" },
  { id: "billing", label: "Abonnement", href: "/settings/billing" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="p-6 lg:p-10 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="mt-2 text-gray-500">
          Gérez votre organisation, vos préférences et vos habilitations.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        <aside className="w-full md:w-64 space-y-1">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.id}
                href={tab.href}
                className={cn(
                  "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                {tab.label}
              </Link>
            );
          })}
        </aside>

        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
