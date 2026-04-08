"use client";

import { FileText, Copy, Check } from "lucide-react";
import { useState } from "react";
import {
  type ProofForDisplay,
  isProofValidityExpired,
  todayLocalIso,
} from "@/lib/proof-display";

function shortHash(hex: string | null): string | null {
  if (!hex || hex.length < 16) return null;
  return `${hex.slice(0, 8)}…${hex.slice(-6)}`;
}

export function ProofHistoryList({
  proofs,
  activeProofId,
  variant = "inline",
}: {
  proofs: ProofForDisplay[];
  activeProofId: string | null;
  /** inline = cartes dashboard ; standalone = page « Gérer les preuves » */
  variant?: "inline" | "standalone";
}) {
  const body = variant === "standalone" ? "text-sm" : "text-[11px]";
  const badge = variant === "standalone" ? "text-xs" : "text-[10px]";
  const hashRow = variant === "standalone" ? "text-xs" : "text-[10px]";
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const today = todayLocalIso();

  async function copyHash(id: string, hash: string) {
    try {
      await navigator.clipboard.writeText(hash);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* ignore */
    }
  }

  if (proofs.length === 0) {
    return (
      <p className={`${body} text-gray-400 italic`}>
        Aucun document rattaché
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {proofs.map((proof) => {
        const isActive = proof.id === activeProofId;
        const expired = isProofValidityExpired(proof.valid_until, today);
        const uploader =
          proof.profiles?.full_name?.trim() || "Utilisateur inconnu";

        return (
          <li
            key={proof.id}
            className={`rounded-lg border px-3 py-2.5 ${body} ${
              isActive
                ? "border-emerald-200 bg-emerald-50/80"
                : "border-gray-100 bg-gray-50/50"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <a
                    href={proof.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-semibold text-gray-900 hover:text-primary"
                  >
                    <FileText className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                    <span className="truncate">{proof.file_name}</span>
                  </a>
                  {isActive ? (
                    <span
                      className={`rounded-full bg-emerald-600/10 px-2 py-0.5 ${badge} font-bold text-emerald-800`}
                    >
                      Preuve actuelle
                    </span>
                  ) : (
                    <span
                      className={`rounded-full bg-gray-200/80 px-2 py-0.5 ${badge} font-medium text-gray-600`}
                    >
                      Historique
                    </span>
                  )}
                  {expired && (
                    <span
                      className={`rounded-full bg-red-100 px-2 py-0.5 ${badge} font-bold text-red-800`}
                    >
                      Périmée
                    </span>
                  )}
                </div>
                <p className="mt-1 text-gray-500">
                  Déposé le{" "}
                  {new Date(proof.uploaded_at).toLocaleString("fr-FR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}{" "}
                  · {uploader}
                </p>
                <p className="mt-0.5 text-gray-500">
                  Validité :{" "}
                  {proof.valid_from
                    ? new Date(proof.valid_from).toLocaleDateString("fr-FR")
                    : "—"}{" "}
                  →{" "}
                  {proof.valid_until
                    ? new Date(proof.valid_until).toLocaleDateString("fr-FR")
                    : "—"}
                </p>
                {proof.file_hash ? (
                  <div
                    className={`mt-1.5 flex flex-wrap items-center gap-2 font-mono ${hashRow} text-gray-600`}
                  >
                    <span title={proof.file_hash}>
                      SHA-256 {shortHash(proof.file_hash)}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyHash(proof.id, proof.file_hash!)}
                      className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-1.5 py-0.5 text-gray-700 hover:bg-gray-50"
                    >
                      {copiedId === proof.id ? (
                        <Check className="h-3 w-3 text-emerald-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      Copier
                    </button>
                  </div>
                ) : (
                  <p className={`mt-1 ${hashRow} text-amber-700`}>
                    Pas d’empreinte (fichier déposé avant l’ajout SHA-256).
                  </p>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
