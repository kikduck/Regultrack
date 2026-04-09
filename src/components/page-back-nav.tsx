import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const linkClass =
  "inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700";

/** Lien « Retour au tableau de bord » — à n’utiliser que sur les pages d’entrée de section listées en produit. */
export function PageBackNav({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Link href="/dashboard" className={linkClass}>
        <ArrowLeft className="h-4 w-4 shrink-0" />
        Retour au tableau de bord
      </Link>
    </div>
  );
}
