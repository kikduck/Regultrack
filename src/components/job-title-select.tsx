"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Plus, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobTitle {
  id: string;
  name: string;
}

interface JobTitleSelectProps {
  value: string; // This will be the name (for fallback) or ID
  jobTitleId: string | null;
  onChange: (name: string, id: string | null) => void;
  orgId: string;
  /** Libellé quand aucun poste n’est sélectionné (ex. adapté au secteur). */
  emptyLabel?: string;
}

export function JobTitleSelect({
  value,
  jobTitleId,
  onChange,
  orgId,
  emptyLabel = "Sélectionner un poste…",
}: JobTitleSelectProps) {
  const [open, setOpen] = useState(false);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  const closePanel = useCallback(() => {
    setOpen(false);
    setSearchTerm("");
  }, []);

  useEffect(() => {
    if (!open) return;
    function onPointerDownOutside(e: PointerEvent) {
      const root = rootRef.current;
      if (!root || root.contains(e.target as Node)) return;
      closePanel();
    }
    document.addEventListener("pointerdown", onPointerDownOutside);
    return () => document.removeEventListener("pointerdown", onPointerDownOutside);
  }, [open, closePanel]);

  useEffect(() => {
    async function loadJobTitles() {
      setLoading(true);
      const { data } = await supabase
        .from("job_titles")
        .select("id, name")
        .eq("org_id", orgId)
        .order("name");

      if (data) {
        setJobTitles(data);
      }
      setLoading(false);
    }

    if (orgId) {
      loadJobTitles();
    }
  }, [orgId, supabase]);

  const filteredTitles = jobTitles.filter((jt) =>
    jt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNew = async () => {
    if (!searchTerm.trim()) return;
    setCreating(true);
    const { data, error } = await supabase
      .from("job_titles")
      .insert({ org_id: orgId, name: searchTerm.trim() })
      .select()
      .single();

    if (data && !error) {
      setJobTitles((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      onChange(data.name, data.id);
      closePanel();
    }
    setCreating(false);
  };

  return (
    <div ref={rootRef} className="relative">
      <div className="relative">
        <button
          type="button"
          onClick={() => (open ? closePanel() : setOpen(true))}
          className="flex h-10 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="truncate text-left">
            {jobTitleId
              ? jobTitles.find((jt) => jt.id === jobTitleId)?.name || value
              : value || emptyLabel}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </button>
      </div>

      {open && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          <div className="sticky top-0 z-10 bg-white px-2 py-1.5">
            <input
              type="text"
              className="block w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Rechercher ou créer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          <div className="px-1 py-1">
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            ) : (
              <>
                {filteredTitles.map((jt) => (
                  <button
                    key={jt.id}
                    type="button"
                    onClick={() => {
                      onChange(jt.name, jt.id);
                      closePanel();
                    }}
                    className={cn(
                      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100",
                      jobTitleId === jt.id && "bg-gray-50 text-primary"
                    )}
                  >
                    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                      {jobTitleId === jt.id && <Check className="h-4 w-4" />}
                    </span>
                    <span className="truncate">{jt.name}</span>
                  </button>
                ))}

                {searchTerm.trim() &&
                  !jobTitles.some(
                    (jt) => jt.name.toLowerCase() === searchTerm.toLowerCase()
                  ) && (
                    <button
                      type="button"
                      onClick={handleCreateNew}
                      disabled={creating}
                      className="relative flex w-full cursor-default select-none items-center rounded-sm py-2 pl-8 pr-2 text-sm font-medium text-primary outline-none hover:bg-primary/5"
                    >
                      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                        {creating ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </span>
                      <span className="truncate">Créer &quot;{searchTerm}&quot;</span>
                    </button>
                  )}

                {!loading && filteredTitles.length === 0 && !searchTerm.trim() && (
                  <div className="py-4 text-center text-sm text-gray-500">
                    Aucun poste trouvé.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
