"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, Filter, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useDebounce } from "@/lib/hooks/use-debounce";

export function DashboardFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "all");
  
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const urlQ = searchParams.get("q") || "";
    const urlStatus = searchParams.get("status") || "all";

    // Si les valeurs n'ont pas changé par rapport à l'URL, on ne fait rien
    if (debouncedSearch === urlQ && status === urlStatus) {
      return;
    }

    const params = new URLSearchParams(searchParams.toString());
    if (debouncedSearch) {
      params.set("q", debouncedSearch);
    } else {
      params.delete("q");
    }
    
    if (status && status !== "all") {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    
    router.replace(`/dashboard?${params.toString()}`, { scroll: false });
  }, [debouncedSearch, status, router, searchParams]);

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un site..."
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button 
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-400" />
        <select
          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">Tous les statuts</option>
          <option value="expired">Expirés (Rouge)</option>
          <option value="expiring_soon">Bientôt (Orange)</option>
          <option value="missing">Manquants (Bleu)</option>
        </select>
      </div>
    </div>
  );
}
