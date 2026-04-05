import Link from "next/link";
import { Upload, Info, ExternalLink, FileText, Landmark, RefreshCcw } from "lucide-react";
import { StatusBadge } from "./status-badge";
import type { ObligationStatus } from "@/lib/types/database";

interface ObligationCardProps {
  obligation: {
    id: string;
    status: string;
    due_date: string | null;
    obligation_templates: {
      name: string;
      description: string;
      renewal_months: number;
      renewal_process: string | null;
      required_documents: string | null;
      competent_authority: string | null;
      official_url: string | null;
      legal_reference: string | null;
      help_text: string | null;
    } | null;
    proofs?: {
      id: string;
      file_name: string;
      file_url: string;
      uploaded_at: string;
    }[];
  };
}

export function ObligationCard({ obligation }: ObligationCardProps) {
  const template = obligation.obligation_templates;
  const proofs = obligation.proofs || [];

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-50 bg-white">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              {template?.name}
              {obligation.status === 'missing' && (
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  À compléter
                </span>
              )}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {template?.description}
            </p>
          </div>
          <StatusBadge status={obligation.status as ObligationStatus} />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          {obligation.due_date && (
            <div className="text-xs flex items-center gap-2">
              <span className="text-gray-500">Échéance :</span>
              <span className="font-semibold text-gray-900">{new Date(obligation.due_date).toLocaleDateString("fr-FR")}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                new Date(obligation.due_date) < new Date() 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-orange-100 text-orange-700'
              }`}>
                {(() => {
                  const diff = new Date(obligation.due_date).getTime() - new Date().getTime();
                  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
                  return days < 0 
                    ? `Expiré il y a ${Math.abs(days)} jours` 
                    : `Expire dans ${days} jours`;
                })()}
              </span>
            </div>
          )}
          <div className="text-xs text-gray-400">
            Fréquence : tous les {template?.renewal_months} mois
          </div>
        </div>
      </div>

      {/* Body / Contextual Help */}
      <div className="bg-gray-50/50 p-5 space-y-4">
        {template?.help_text && (
          <div className="flex gap-2 text-xs text-gray-600 bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
            <Info className="h-4 w-4 text-blue-500 shrink-0" />
            <p>{template.help_text}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {template?.renewal_process && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <RefreshCcw className="h-3 w-3" /> Procédure
              </p>
              <p className="text-xs text-gray-700 leading-relaxed">{template.renewal_process}</p>
            </div>
          )}
          {template?.required_documents && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <FileText className="h-3 w-3" /> Pièces requises
              </p>
              <p className="text-xs text-gray-700 leading-relaxed">{template.required_documents}</p>
            </div>
          )}
          {template?.competent_authority && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                <Landmark className="h-3 w-3" /> Organisme
              </p>
              <p className="text-xs text-gray-700 leading-relaxed">{template.competent_authority}</p>
            </div>
          )}
          {template?.legal_reference && (
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Référence légale</p>
              <p className="text-[10px] text-gray-500 italic">{template.legal_reference}</p>
            </div>
          )}
        </div>

        {template?.official_url && (
          <a
            href={template.official_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[10px] font-medium text-primary hover:underline"
          >
            Consulter le site officiel <ExternalLink className="h-2.5 w-2.5" />
          </a>
        )}
      </div>

      {/* Proofs Footer */}
      <div className="p-5 bg-white border-t border-gray-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          {proofs.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {proofs.map((proof) => (
                <a
                  key={proof.id}
                  href={proof.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gray-100 text-[11px] font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <FileText className="h-3.5 w-3.5 text-gray-400" />
                  {proof.file_name}
                </a>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-gray-400 italic">Aucun document rattaché</p>
          )}
        </div>

        <Link
          href={`/obligations/${obligation.id}/upload`}
          className={`shrink-0 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-xs font-bold transition-colors ${
            obligation.status === 'missing' || obligation.status === 'expired'
              ? 'bg-primary text-white hover:bg-primary-dark shadow-sm'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Upload className="h-3.5 w-3.5" />
          Ajouter une preuve
        </Link>
      </div>
    </div>
  );
}
