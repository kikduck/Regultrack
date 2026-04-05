"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { buildObligationsListHref } from "@/lib/obligations-list-url";

type Props = {
  status?: string;
  obligation: string;
  concerne: string;
  due: string;
};

export function ObligationsColumnFilters({
  status,
  obligation: obligationInitial,
  concerne: concerneInitial,
  due: dueInitial,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [obligation, setObligation] = useState(obligationInitial);
  const [concerne, setConcerne] = useState(concerneInitial);
  const [due, setDue] = useState(dueInitial);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setObligation(obligationInitial);
    setConcerne(concerneInitial);
    setDue(dueInitial);
  }, [obligationInitial, concerneInitial, dueInitial]);

  const replaceUrl = useCallback(
    (next: { obligation: string; concerne: string; due: string }) => {
      const href = buildObligationsListHref({
        status,
        obligation: next.obligation,
        concerne: next.concerne,
        due: next.due,
      });
      startTransition(() => router.replace(href));
    },
    [router, status]
  );

  const scheduleTextReplace = useCallback(
    (nextObl: string, nextConc: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        debounceRef.current = null;
        replaceUrl({ obligation: nextObl, concerne: nextConc, due });
      }, 350);
    },
    [due, replaceUrl]
  );

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  const inputClass =
    "w-full min-w-0 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60";

  const hasColumnFilters =
    obligation.trim() !== "" ||
    concerne.trim() !== "" ||
    due === "none" ||
    due === "set";

  return (
    <div className="border-b border-gray-200 bg-gray-50/80 px-5 py-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:gap-4">
        <div className="min-w-[140px] flex-1 sm:max-w-xs">
          <label
            htmlFor="filter-obligation"
            className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-500"
          >
            Obligation
          </label>
          <input
            id="filter-obligation"
            type="search"
            value={obligation}
            disabled={pending}
            onChange={(e) => {
              const v = e.target.value;
              setObligation(v);
              scheduleTextReplace(v, concerne);
            }}
            placeholder="Rechercher…"
            className={inputClass}
            autoComplete="off"
          />
        </div>
        <div className="min-w-[140px] flex-1 sm:max-w-xs">
          <label
            htmlFor="filter-concerne"
            className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-500"
          >
            Concerne
          </label>
          <input
            id="filter-concerne"
            type="search"
            value={concerne}
            disabled={pending}
            onChange={(e) => {
              const v = e.target.value;
              setConcerne(v);
              scheduleTextReplace(obligation, v);
            }}
            placeholder="Site, employé, organisation…"
            className={inputClass}
            autoComplete="off"
          />
        </div>
        <div className="min-w-[160px] sm:w-44">
          <label
            htmlFor="filter-due"
            className="mb-1 block text-[10px] font-semibold uppercase tracking-wide text-gray-500"
          >
            Échéance
          </label>
          <select
            id="filter-due"
            value={due}
            disabled={pending}
            onChange={(e) => {
              const v = e.target.value;
              setDue(v);
              if (debounceRef.current) {
                clearTimeout(debounceRef.current);
                debounceRef.current = null;
              }
              replaceUrl({ obligation, concerne, due: v });
            }}
            className={inputClass}
          >
            <option value="">Toutes</option>
            <option value="set">Avec date</option>
            <option value="none">Sans date</option>
          </select>
        </div>
        {hasColumnFilters && (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (debounceRef.current) {
                clearTimeout(debounceRef.current);
                debounceRef.current = null;
              }
              setObligation("");
              setConcerne("");
              setDue("");
              replaceUrl({ obligation: "", concerne: "", due: "" });
            }}
            className="shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-60"
          >
            Réinitialiser les colonnes
          </button>
        )}
      </div>
    </div>
  );
}
