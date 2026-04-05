"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit, Archive, Trash2 } from "lucide-react";

export function EmployeeActions({ employeeId }: { employeeId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleArchive() {
    if (!confirm("Voulez-vous vraiment archiver cet employé ? Il n'apparaîtra plus dans les listes actives.")) return;
    
    setLoading(true);
    const supabase = createClient();
    
    await supabase
      .from("employees")
      .update({ active: false })
      .eq("id", employeeId);
      
    router.push("/employees");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/employees/${employeeId}/edit`}
        className="inline-flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
      >
        <Edit className="h-4 w-4" />
        Modifier
      </Link>
      <button
        onClick={handleArchive}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-lg bg-white border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 shadow-sm hover:bg-red-50 disabled:opacity-50 transition-colors"
      >
        <Archive className="h-4 w-4" />
        {loading ? "Archivage..." : "Archiver"}
      </button>
    </div>
  );
}
