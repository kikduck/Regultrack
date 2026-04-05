"use client";

import { useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Upload, FileText, X } from "lucide-react";
import { statusFromDueDateAndAlerts } from "@/lib/obligation-status";

export default function UploadProofPage() {
  const { id: obligationId } = useParams<{ id: string }>();
  const [file, setFile] = useState<File | null>(null);
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError("Veuillez sélectionner un fichier.");
      return;
    }
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

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
    });

    if (proofError) {
      setError("Erreur : " + proofError.message);
      setLoading(false);
      return;
    }

    const { data: obligationRow } = await supabase
      .from("obligations")
      .select("obligation_templates(alert_days)")
      .eq("id", obligationId)
      .single();

    const template = obligationRow?.obligation_templates as unknown as {
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

    router.back();
  }

  return (
    <div className="p-6 lg:p-8 max-w-xl">
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </button>

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Ajouter une preuve
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

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
                onClick={() => setFile(null)}
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
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
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
    </div>
  );
}
