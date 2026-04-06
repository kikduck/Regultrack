"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { Search, X, Calendar, Filter, ChevronDown, Check, Ban } from "lucide-react";
import { buildObligationsListHref, serializeMulti } from "@/lib/obligations-list-url";

type Props = {
  status?: string;
  selectedObligations: string[];
  selectedConcernes: string[];
  dueFrom: string;
  dueTo: string;
  dueNone: boolean;
  uniqueObligations: string[];
  uniqueEntities: string[];
};

/* ─── MultiCombobox ───────────────────────────────────────────────────── */
function MultiCombobox({
  id,
  values,
  onChange,
  options,
  placeholder,
  disabled,
}: {
  id: string;
  values: string[];
  onChange: (v: string[]) => void;
  options: string[];
  placeholder: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const filtered =
    query.trim() === ""
      ? options
      : options.filter((o) =>
          o.toLowerCase().includes(query.trim().toLowerCase())
        );

  const toggle = (opt: string) => {
    const next = values.includes(opt)
      ? values.filter((v) => v !== opt)
      : [...values, opt];
    onChange(next);
  };

  const remove = (opt: string) => onChange(values.filter((v) => v !== opt));

  const hasActive = values.length > 0;

  return (
    <div ref={containerRef} className="relative">
      {/* Hauteur fixe : pas de saut de ligne des chips → la barre de filtres ne bouge plus */}
      <div
        className={`flex h-[42px] w-full items-stretch overflow-hidden rounded-xl border bg-white transition-all ${
          open
            ? "border-primary ring-1 ring-primary/20"
            : "border-gray-200 hover:border-gray-300"
        } ${disabled ? "pointer-events-none opacity-60" : ""}`}
      >
        <div
          className="flex min-w-0 flex-1 cursor-text flex-nowrap items-center gap-1.5 overflow-x-auto overscroll-x-contain px-2.5 py-0 [scrollbar-width:thin]"
          onClick={() => {
            inputRef.current?.focus();
            setOpen(true);
          }}
        >
          {!hasActive && (
            <Search className="h-4 w-4 shrink-0 text-gray-400" aria-hidden />
          )}
          {values.map((v) => (
            <span
              key={v}
              className="inline-flex max-w-[200px] shrink-0 items-center gap-1 rounded-md bg-primary/10 py-0.5 pl-2 pr-1 text-xs font-medium text-primary"
            >
              <span className="truncate">{v}</span>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  remove(v);
                }}
                className="rounded p-0.5 hover:bg-primary/20 transition-colors"
                tabIndex={-1}
                aria-label={`Retirer ${v}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            id={id}
            type="text"
            value={query}
            autoComplete="off"
            spellCheck={false}
            placeholder={hasActive ? "Ajouter…" : placeholder}
            className="min-w-[4rem] flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
            onFocus={() => setOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setOpen(false);
                setQuery("");
                inputRef.current?.blur();
              }
              if (e.key === "Backspace" && query === "" && values.length > 0) {
                remove(values[values.length - 1]);
              }
            }}
          />
        </div>
        <button
          type="button"
          tabIndex={-1}
          className="flex shrink-0 items-center border-l border-gray-100 bg-gray-50/80 px-2.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          onMouseDown={(e) => {
            e.preventDefault();
            setOpen((o) => !o);
            inputRef.current?.focus();
          }}
          aria-expanded={open}
          aria-label="Ouvrir la liste"
        >
          <ChevronDown
            className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1.5 w-full rounded-xl border border-gray-200 bg-white shadow-lg shadow-gray-100/80">
          {filtered.length === 0 ? (
            <p className="px-3.5 py-3 text-sm text-gray-400">
              Aucun résultat.
            </p>
          ) : (
            <ul className="max-h-64 overflow-auto py-1">
              {filtered.map((opt) => {
                const selected = values.includes(opt);
                return (
                  <li key={opt}>
                    <button
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        toggle(opt);
                        setQuery("");
                        inputRef.current?.focus();
                      }}
                      className={`flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-sm transition-colors hover:bg-gray-50 ${
                        selected ? "text-primary" : "text-gray-700"
                      }`}
                    >
                      {/* Checkbox custom */}
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                          selected
                            ? "border-primary bg-primary"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {selected && (
                          <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                        )}
                      </span>
                      <span className="truncate">{opt}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
          {values.length > 0 && (
            <div className="border-t border-gray-100 px-3 py-2">
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange([]);
                  setQuery("");
                }}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                Tout désélectionner
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ─── Barre de filtres ────────────────────────────────────────────────── */
export function ObligationsColumnFilters({
  status,
  selectedObligations: oblInitial,
  selectedConcernes: concInitial,
  dueFrom: dueFromInitial,
  dueTo: dueToInitial,
  dueNone: dueNoneInitial,
  uniqueObligations,
  uniqueEntities,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [obligations, setObligations] = useState<string[]>(oblInitial);
  const [concernes, setConcernes] = useState<string[]>(concInitial);
  const [dueFrom, setDueFrom] = useState(dueFromInitial);
  const [dueTo, setDueTo] = useState(dueToInitial);
  const [dueNone, setDueNone] = useState(dueNoneInitial);

  useEffect(() => {
    setObligations(oblInitial);
    setConcernes(concInitial);
    setDueFrom(dueFromInitial);
    setDueTo(dueToInitial);
    setDueNone(dueNoneInitial);
  }, [
    // Use serialized form to avoid infinite loop on array identity
    // eslint-disable-next-line react-hooks/exhaustive-deps
    serializeMulti(oblInitial),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    serializeMulti(concInitial),
    dueFromInitial,
    dueToInitial,
    dueNoneInitial,
  ]);

  const replaceUrl = useCallback(
    (next: {
      obligations: string[];
      concernes: string[];
      dueFrom: string;
      dueTo: string;
      dueNone: boolean;
    }) => {
      const href = buildObligationsListHref({
        status,
        obligations: next.obligations,
        concernes: next.concernes,
        dueFrom: next.dueFrom,
        dueTo: next.dueTo,
        dueNone: next.dueNone,
      });
      startTransition(() => router.replace(href));
    },
    [router, status]
  );

  const hasColumnFilters =
    obligations.length > 0 ||
    concernes.length > 0 ||
    dueFrom !== "" ||
    dueTo !== "" ||
    dueNone;

  return (
    <div className="border-b border-gray-100 bg-white px-6 py-4">
      {/* En-tête */}
      <div className="mb-3 flex items-center gap-2">
        <Filter className="h-3.5 w-3.5 text-gray-400" />
        <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          Filtres
        </span>
        {hasColumnFilters && (
          <span className="ml-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            {obligations.length + concernes.length + (dueFrom || dueTo || dueNone ? 1 : 0)} actif
            {obligations.length + concernes.length + (dueFrom || dueTo || dueNone ? 1 : 0) > 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Obligation */}
        <div className="flex-1 min-w-0">
          <label
            htmlFor="filter-obligation"
            className="mb-1.5 block text-xs font-medium text-gray-500"
          >
            Obligation
          </label>
          <MultiCombobox
            id="filter-obligation"
            values={obligations}
            options={uniqueObligations}
            placeholder="Rechercher une obligation..."
            disabled={pending}
            onChange={(v) => {
              setObligations(v);
              replaceUrl({ obligations: v, concernes, dueFrom, dueTo, dueNone });
            }}
          />
        </div>

        {/* Concerne */}
        <div className="flex-1 min-w-0">
          <label
            htmlFor="filter-concerne"
            className="mb-1.5 block text-xs font-medium text-gray-500"
          >
            Concerne
          </label>
          <MultiCombobox
            id="filter-concerne"
            values={concernes}
            options={uniqueEntities}
            placeholder="Site, employé ou organisation..."
            disabled={pending}
            onChange={(v) => {
              setConcernes(v);
              replaceUrl({ obligations, concernes: v, dueFrom, dueTo, dueNone });
            }}
          />
        </div>

        {/* Échéance */}
        <div className="flex flex-col gap-2 w-full lg:w-auto">
          <span className="text-xs font-medium text-gray-500">Échéance</span>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                id="filter-due-from"
                value={dueFrom}
                disabled={pending || dueNone}
                max={dueTo || undefined}
                onChange={(e) => {
                  const v = e.target.value;
                  setDueFrom(v);
                  replaceUrl({ obligations, concernes, dueFrom: v, dueTo, dueNone });
                }}
                className="w-40 rounded-xl border border-gray-200 bg-white pl-9 pr-3 py-2.5 text-sm text-gray-700 focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>

            <span className="text-xs text-gray-400 shrink-0">→</span>

            <div className="relative">
              <Calendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                id="filter-due-to"
                value={dueTo}
                disabled={pending || dueNone}
                min={dueFrom || undefined}
                onChange={(e) => {
                  const v = e.target.value;
                  setDueTo(v);
                  replaceUrl({ obligations, concernes, dueFrom, dueTo: v, dueNone });
                }}
                className="w-40 rounded-xl border border-gray-200 bg-white pl-9 pr-3 py-2.5 text-sm text-gray-700 focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="button"
              disabled={pending}
              onClick={() => {
                const next = !dueNone;
                setDueNone(next);
                if (next) { setDueFrom(""); setDueTo(""); }
                replaceUrl({
                  obligations,
                  concernes,
                  dueFrom: next ? "" : dueFrom,
                  dueTo: next ? "" : dueTo,
                  dueNone: next,
                });
              }}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all shrink-0 ${
                dueNone
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              <Ban className="h-3.5 w-3.5" />
              Sans date
            </button>
          </div>
        </div>
      </div>

      {/* Réinitialiser : sous la barre de filtres, au-dessus du tableau — ne réduit plus la largeur des colonnes */}
      {hasColumnFilters && (
        <div className="mt-3 flex justify-end border-t border-gray-100 pt-2.5">
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              setObligations([]);
              setConcernes([]);
              setDueFrom("");
              setDueTo("");
              setDueNone(false);
              replaceUrl({
                obligations: [],
                concernes: [],
                dueFrom: "",
                dueTo: "",
                dueNone: false,
              });
            }}
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium text-gray-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
          >
            <X className="h-3 w-3 shrink-0" aria-hidden />
            Tout effacer
          </button>
        </div>
      )}
    </div>
  );
}
