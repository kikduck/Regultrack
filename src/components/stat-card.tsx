import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  variant?: "default" | "success" | "warning" | "danger";
}

const variantStyles = {
  default: "bg-white border-gray-200",
  success: "bg-green-50 border-green-200",
  warning: "bg-amber-50 border-amber-200",
  danger: "bg-red-50 border-red-200",
};

const iconVariantStyles = {
  default: "text-gray-500",
  success: "text-green-600",
  warning: "text-amber-600",
  danger: "text-red-600",
};

export function StatCard({
  title,
  value,
  icon: Icon,
  variant = "default",
}: StatCardProps) {
  return (
    <div
      className={`rounded-xl border px-5 py-4 shadow-sm ${variantStyles[variant]}`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
        </div>
        <Icon className={`h-8 w-8 ${iconVariantStyles[variant]}`} />
      </div>
    </div>
  );
}
