import type { ObligationStatus } from "@/lib/types/database";

const statusConfig: Record<
  ObligationStatus,
  { label: string; className: string }
> = {
  valid: {
    label: "En règle",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  expiring_soon: {
    label: "Expire bientôt",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  expired: {
    label: "Expiré",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  missing: {
    label: "Manquant",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
};

export function StatusBadge({ status }: { status: ObligationStatus }) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export function StatusDot({ status }: { status: ObligationStatus }) {
  const colorMap: Record<ObligationStatus, string> = {
    valid: "bg-status-valid",
    expiring_soon: "bg-status-expiring",
    expired: "bg-status-expired",
    missing: "bg-status-missing",
  };

  return (
    <span className={`inline-block h-2.5 w-2.5 rounded-full ${colorMap[status]}`} />
  );
}
