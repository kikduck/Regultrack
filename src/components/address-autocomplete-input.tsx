"use client";

import { useState, useEffect, useRef, useId } from "react";
import {
  fetchAddressSuggestions,
  type AddressSuggestion,
} from "@/lib/address-search-client";
import { Loader2, MapPin } from "lucide-react";

const inputClassName =
  "block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none";

type Props = {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
};

/** Adresse FR — suggestions BAN (API route). */
export function AddressAutocompleteInput({
  id: propId,
  label,
  value,
  onChange,
  placeholder = "Commencez à saisir une adresse en France…",
  required = false,
}: Props) {
  const reactId = useId();
  const inputId = propId ?? `address-${reactId}`;
  const listId = `${inputId}-suggestions`;

  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const q = value.trim();
    if (q.length < 3) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const ac = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      setHighlight(-1);
      try {
        const next = await fetchAddressSuggestions(q, ac.signal);
        setSuggestions(next);
      } catch {
        if (!ac.signal.aborted) {
          setSuggestions([]);
        }
      } finally {
        if (!ac.signal.aborted) {
          setLoading(false);
        }
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      ac.abort();
    };
  }, [value]);

  function clearBlurTimeout() {
    if (blurTimeout.current) {
      clearTimeout(blurTimeout.current);
      blurTimeout.current = null;
    }
  }

  function handleFocus() {
    clearBlurTimeout();
    setFocused(true);
  }

  function handleBlur() {
    blurTimeout.current = setTimeout(() => {
      setFocused(false);
      setHighlight(-1);
    }, 180);
  }

  function pick(s: AddressSuggestion) {
    clearBlurTimeout();
    onChange(s.label);
    setSuggestions([]);
    setFocused(false);
    setHighlight(-1);
    inputRef.current?.blur();
  }

  const showList =
    focused &&
    value.trim().length >= 3 &&
    (loading || suggestions.length > 0);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showList && e.key !== "Escape") return;

    if (e.key === "Escape") {
      setFocused(false);
      setHighlight(-1);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (suggestions.length === 0) return;
      setHighlight((h) => (h + 1) % suggestions.length);
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (suggestions.length === 0) return;
      setHighlight((h) => (h <= 0 ? suggestions.length - 1 : h - 1));
      return;
    }

    if (e.key === "Enter" && highlight >= 0 && suggestions[highlight]) {
      e.preventDefault();
      pick(suggestions[highlight]);
    }
  }

  return (
    <div className="relative">
      <label htmlFor={inputId} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-1">
        <MapPin
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          aria-hidden
        />
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          required={required}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
          autoComplete="street-address"
          placeholder={placeholder}
          role="combobox"
          aria-expanded={showList}
          aria-controls={showList ? listId : undefined}
          aria-autocomplete="list"
          aria-busy={loading}
          className={`${inputClassName} pl-9`}
        />
        {loading && (
          <Loader2
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-gray-400"
            aria-hidden
          />
        )}
      </div>

      {showList && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-200 bg-white py-1 text-sm shadow-lg"
        >
          {loading && suggestions.length === 0 ? (
            <li className="px-3 py-2 text-gray-500">Recherche…</li>
          ) : (
            suggestions.map((s, i) => (
              <li key={s.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={i === highlight}
                  className={`flex w-full cursor-pointer px-3 py-2.5 text-left hover:bg-gray-50 ${
                    i === highlight ? "bg-primary/5 text-primary" : "text-gray-900"
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(s)}
                  onMouseEnter={() => setHighlight(i)}
                >
                  {s.label}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
