"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Upload, FileText, X } from "lucide-react";
import { statusFromDueDateAndAlerts } from "@/lib/obligation-status";
import { sha256HexFromFile } from "@/lib/hash-file";
import { ProofHistoryList } from "@/components/proof-history-list";
import {
  pickActiveProofId,
  sortProofsNewestFirst,
  type ProofForDisplay,
} from "@/lib/proof-display";
import { RequiredFieldMark } from "@/components/required-field-mark";

export default function UploadProofPage() {
  const { id: obligationId } = useParams<{ id: string }>();
  const [obligationTitle, setObligationTitle] = useState<string | null>(null);
  const [obligationDueDate, setObligationDueDate] = useState<string | null>(null);
  const [proofs, setProofs] = useState<ProofForDisplay[]>([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  const loadObligationAndProofs = useCallback(
    async (opts?: { background?: boolean }) => {
      if (!obligationId) return;
      const background = opts?.background === true;
      if (!background) {
        setPageLoading(true);
        setPageError(null);
      }
      const supabase = createClient();
      const { data, error: fetchError } = await supabase
        .from("obligations")
        .select(
          "due_date, obligation_templates(name), custom_obligation_templates(name), proofs(*, profiles(full_name))"
        )
        .eq("id", obligationId)
        .single();

      if (fetchError || !data) {
        if (!background) {
          setPageError(
            fetchError?.message ?? "Impossible de charger cette obligation."
          );
          setPageLoading(false);
        }
        return;
      }

      const standard = data.obligation_templates as
        | { name: string }
        | { name: string }[]
        | null;
      const custom = data.custom_obligation_templates as
        | { name: string }
        | { name: string }[]
        | null;
      const standardName = Array.isArray(standard)
        ? standard[0]?.name
        : standard?.name;
      const customName = Array.isArray(custom) ? custom[0]?.name : custom?.name;
      setObligationTitle(standardName ?? customName ?? "Obligation");
      setObligationDueDate(data.due_date);

      const raw = (data.proofs ?? []) as Array<{
        id: string;
        file_name: string;
        file_url: string;
        uploaded_at: string;
        valid_from: string | null;
        valid_until: string | null;
        file_hash: string | null;
        profiles?: { full_name: string } | null;
      }>;
      setProofs(
        raw.map((p) => ({
          id: p.id,
          file_name: p.file_name,
          file_url: p.file_url,
          uploaded_at: p.uploaded_at,
          valid_from: p.valid_from,
          valid_until: p.valid_until,
          file_hash: p.file_hash,
          profiles: p.profiles,
        }))
      );
      if (!background) setPageLoading(false);
    },
    [obligationId]
  );

  useEffect(() => {
    void loadObligationAndProofs();
  }, [loadObligationAndProofs]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      setSuccess(null);
      setFile(dropped);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Veuillez sélectionner un fichier.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    let fileHash: string;
    try {
      fileHash = await sha256HexFromFile(file);
    } catch {
      setError("Impossible de calculer l’empreinte du fichier. Réessayez.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const ext = file.name.split(".").pop();
    const filePath = `${user.id}/${obligationId}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("proofs")
      .upload(filePath, file);

    if (uploadError) {
      setError("Erreur d'upload : " + uploadError.message);
      setLoading(false);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("proofs").getPublicUrl(filePath);

    const { error: proofError } = await supabase.from("proofs").insert({
      obligation_id: obligationId,
      file_url: publicUrl,
      file_name: file.name,
      uploaded_by: user.id,
      valid_from: validFrom || null,
      valid_until: validUntil || null,
      file_hash: fileHash,
    });

    if (proofError) {
      setError("Erreur : " + proofError.message);
      setLoading(false);
      return;
    }

    const { data: obligationRow } = await supabase
      .from("obligations")
      .select("obligation_templates(alert_days), custom_obligation_templates(alert_days)")
      .eq("id", obligationId)
      .single();

    const template = (obligationRow?.obligation_templates || obligationRow?.custom_obligation_templates) as unknown as {
      alert_days: number[];
    } | null;

    const updateData: { status: string; due_date?: string } = {
      status: "valid",
    };
    if (validUntil) {
      updateData.due_date = validUntil;
      const todayIso = new Date().toISOString().split("T")[0];
      updateData.status = statusFromDueDateAndAlerts(
        validUntil,
        template?.alert_days,
        todayIso
      );
    }

    await supabase
      .from("obligations")
      .update(updateData)
      .eq("id", obligationId);

    setObligationDueDate(updateData.due_date ?? obligationDueDate);
    setFile(null);
    setValidFrom("");
    setValidUntil("");
    setSuccess("Preuve enregistrée. Elle apparaît ci-dessus avec la date de dépôt.");
    await loadObligationAndProofs({ background: true });
    router.refresh();
    setLoading(false);
  }

  const sortedProofs = sortProofsNewestFirst(proofs);
  const activeProofId = pickActiveProofId(proofs, obligationDueDate);

  return (
    <div className="p-6 lg:p-8 max-w-2xl">
      <button
        type="button"
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </button>

      <h1 className="text-2xl font-bold text-gray-900">
        Gérer les preuves
      </h1>
      {obligationTitle && (
        <p className="mt-1 text-sm font-medium text-gray-600">{obligationTitle}</p>
      )}
      <p className="text-sm text-gray-500 mt-4 mb-6">
        Les documents déjà déposés sont listés avec la{" "}
        <strong>date et l&apos;heure d&apos;upload</strong>, l&apos;auteur et les dates
        de validité. Pour un nouveau fichier, une empreinte{" "}
        <strong>SHA-256</strong> est calculée dans le navigateur (intégrité,
        traçabilité).
      </p>

      {pageError && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200 mb-6">
          {pageError}
        </div>
      )}

      {!pageError && (
        <section className="mb-8" aria-labelledby="proofs-existing-heading">
          <h2
            id="proofs-existing-heading"
            className="text-base font-semibold text-gray-900 mb-3"
          >
            Preuves enregistrées
          </h2>
          {pageLoading ? (
            <p className="text-sm text-gray-500">Chargement…</p>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <ProofHistoryList
                proofs={sortedProofs}
                activeProofId={activeProofId}
                variant="standalone"
              />
            </div>
          )}
        </section>
      )}

      {!pageError && (
      <form onSubmit={handleSubmit} className="space-y-5">
        <h2 className="text-base font-semibold text-gray-900">
          Ajouter une nouvelle preuve
        </h2>
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 border border-emerald-200">
            {success}
          </div>
        )}

        <div>
          <p className="block text-sm font-medium text-gray-700">
            Fichier
            <RequiredFieldMark />
          </p>
        </div>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative rounded-xl border-2 border-dashed border-gray-300 p-8 text-center hover:border-primary transition-colors"
        >
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(0)} Ko
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSuccess(null);
                  setFile(null);
                }}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-2 text-sm text-gray-600">
                Glissez un fichier ici ou{" "}
                <label className="font-medium text-primary cursor-pointer hover:text-primary-dark">
                  parcourir
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    onChange={(e) => {
                      setSuccess(null);
                      setFile(e.target.files?.[0] || null);
                    }}
                  />
                </label>
              </p>
              <p className="mt-1 text-xs text-gray-400">
                PDF, JPG, PNG — max 10 Mo
              </p>
            </>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date d&apos;obtention
          </label>
          <input
            type="date"
            value={validFrom}
            onChange={(e) => setValidFrom(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date d&apos;expiration
          </label>
          <input
            type="date"
            value={validUntil}
            onChange={(e) => setValidUntil(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm shadow-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !file}
          className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Upload en cours..." : "Enregistrer la preuve"}
        </button>
      </form>
      )}
    </div>
  );
}
