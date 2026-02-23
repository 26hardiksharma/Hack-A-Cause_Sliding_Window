import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusVariant = "active" | "inactive" | "critical" | "high" | "moderate" | "normal" | "sent" | "pending" | "info";

interface StatusBadgeProps {
  variant: StatusVariant;
  label?: string;
  className?: string;
}

const variantMap: Record<StatusVariant, { className: string; defaultLabel: string }> = {
  active:   { className: "text-emerald-600 bg-emerald-50 border-emerald-100", defaultLabel: "Active" },
  inactive: { className: "text-slate-500 bg-slate-100 border-slate-200", defaultLabel: "Inactive" },
  critical: { className: "text-red-600 bg-red-50 border-red-100", defaultLabel: "Critical" },
  high:     { className: "text-orange-500 bg-orange-50 border-orange-100", defaultLabel: "High" },
  moderate: { className: "text-yellow-600 bg-yellow-50 border-yellow-100", defaultLabel: "Moderate" },
  normal:   { className: "text-emerald-600 bg-emerald-50 border-emerald-100", defaultLabel: "Normal" },
  sent:     { className: "text-emerald-600 bg-emerald-50 border-emerald-100", defaultLabel: "Sent" },
  pending:  { className: "text-orange-500 bg-orange-50 border-orange-100", defaultLabel: "Pending" },
  info:     { className: "text-blue-600 bg-blue-50 border-blue-100", defaultLabel: "Info" },
};

export function StatusBadge({ variant, label, className }: StatusBadgeProps) {
  const { className: variantClass, defaultLabel } = variantMap[variant];
  return (
    <Badge className={cn("text-xs font-bold px-2 py-1 rounded-lg border", variantClass, className)}>
      {label ?? defaultLabel}
    </Badge>
  );
}
