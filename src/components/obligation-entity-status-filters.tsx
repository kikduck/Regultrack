import Link from "next/link";
import {
  ENTITY_OBLIGATION_STATUS_FILTERS,
  buildEntityObligationListHref,
  type EntityObligationStatusFilter,
} from "@/lib/obligation-entity-filters";
import type { ObligationCounts } from "@/lib/compliance-score";

export function ObligationEntityStatusFilters({
  basePath,
  counts,
  statusFilter,
}: {
  basePath: string;
  counts: ObligationCounts;
  statusFilter: EntityObligationStatusFilter | undefined;
}) {
  return (
    <div className="flex gap-2 mb-6 flex-wrap">
      {ENTITY_OBLIGATION_STATUS_FILTERS.map((f) => {
        const isActive =
          f.key === statusFilter || (!statusFilter && f.key === undefined);
        const count = f.key !== undefined ? counts[f.key] : counts.total;
        const href = buildEntityObligationListHref(basePath, f.key);
        return (
          <Link
            key={f.label}
            href={href}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              isActive
                ? "bg-gray-900 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-xs font-semibold ${
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
