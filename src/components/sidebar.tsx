"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Building2,
  Users,
  ClipboardList,
  Bell,
  Shield,
  LogOut,
  ChevronLeft,
  Settings,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/sites", label: "Sites", icon: Building2 },
  { href: "/employees", label: "Employés", icon: Users },
  { href: "/obligations", label: "Obligations", icon: ClipboardList },
  { href: "/alerts", label: "Alertes", icon: Bell },
  { href: "/settings", label: "Paramètres", icon: Settings },
] as const;

/** Placeholder SSR pour Suspense (même largeur que la barre dépliée). */
export function SidebarFallback() {
  return (
    <aside
      className="flex h-full w-60 shrink-0 flex-col bg-sidebar-bg text-sidebar-text"
      aria-hidden
    >
      <div className="h-[73px] border-b border-white/10 px-4 py-5" />
      <div className="flex-1 space-y-1 px-2 py-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-10 rounded-lg bg-white/5"
          />
        ))}
      </div>
      <div className="border-t border-white/10 px-2 py-3">
        <div className="mx-3 mb-2 h-3 w-24 rounded bg-white/10" />
        <div className="h-10 rounded-lg bg-white/5" />
      </div>
    </aside>
  );
}

function isSidebarItemActive(pathname: string, href: string): boolean {
  if (href === "/alerts") {
    return (
      pathname === "/alerts" ||
      pathname.startsWith("/alerts/") ||
      pathname.startsWith("/settings/alerts")
    );
  }
  if (href === "/settings") {
    return (
      pathname.startsWith("/settings") &&
      !pathname.startsWith("/settings/alerts")
    );
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({
  userName,
  orgName,
}: {
  userName: string;
  orgName: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside
      className={`flex flex-col bg-sidebar-bg text-sidebar-text transition-all duration-200 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
          <Shield className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              Regultrack
            </p>
            <p className="truncate text-xs text-sidebar-text">{orgName}</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto text-sidebar-text hover:text-white transition-colors"
        >
          <ChevronLeft
            className={`h-4 w-4 transition-transform ${collapsed ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = isSidebarItemActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-sidebar-active text-white"
                  : "text-sidebar-text hover:bg-white/5 hover:text-white"
              }`}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-2 py-3">
        {!collapsed && (
          <p className="mb-2 truncate px-3 text-xs text-sidebar-text">
            {userName}
          </p>
        )}
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-text hover:bg-white/5 hover:text-white transition-colors"
          title="Déconnexion"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
}
