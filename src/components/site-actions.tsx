"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";

export function SiteActions({ siteId, employeesCount }: { siteId: string, employeesCount: number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (employeesCount > 0) {
      alert("Impossible de supprimer ce site car il contient des employés actifs. Archivez ou déplacez les employés d'abord.");
      return;
    }

    if (!confirm("Voulez-vous vraiment supprimer ce site définitivement ?")) return;
    
    setLoading(true);
    const supabase = createClient();
    
    await supabase
      .from("sites")
      .delete()
      .eq("id", siteId);
      
    router.push("/sites");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/sites/${siteId}/edit`}
        className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
      >
        <Edit className="h-4 w-4" />
        Modifier
      </Link>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg bg-white border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50 disabled:opacity-50 transition-colors"
      >
        <Trash2 className="h-4 w-4" />
        {loading ? "Suppression..." : "Supprimer"}
      </button>
    </div>
  );
}
