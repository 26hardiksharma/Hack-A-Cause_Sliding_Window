import * as React from "react";
import { cn } from "@/lib/utils";

type RecommendationVariant = "critical" | "warning" | "info";

interface RecommendationCardProps {
  variant: RecommendationVariant;
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel: string;
  actionMeta: string;
  onAction?: () => void;
  className?: string;
}

const variantStyles: Record<RecommendationVariant, { border: string; bg: string; bar: string; actionClass: string }> = {
  critical: {
    border: "border-red-100",
    bg: "bg-red-50/30",
    bar: "bg-red-500",
    actionClass: "text-white bg-red-600 hover:bg-red-700",
  },
  warning: {
    border: "border-orange-100",
    bg: "bg-orange-50/30",
    bar: "bg-orange-500",
    actionClass: "text-white bg-orange-500 hover:bg-orange-600",
  },
  info: {
    border: "border-blue-100",
    bg: "bg-blue-50/30",
    bar: "bg-blue-500",
    actionClass: "text-blue-600 bg-blue-50 hover:bg-blue-100",
  },
};

const iconBgMap: Record<RecommendationVariant, string> = {
  critical: "bg-red-100 text-red-600",
  warning:  "bg-orange-100 text-orange-600",
  info:     "bg-blue-100 text-blue-600",
};

export function RecommendationCard({
  variant, icon, title, description, actionLabel, actionMeta, onAction, className,
}: RecommendationCardProps) {
  const s = variantStyles[variant];
  return (
    <div className={cn("p-4 rounded-2xl border relative overflow-hidden", s.border, s.bg, className)}>
      <div className={cn("absolute top-0 left-0 w-1 h-full", s.bar)} />
      <div className="flex gap-3 mb-3">
        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", iconBgMap[variant])}>
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-800">{title}</h4>
          <p className="text-xs text-slate-600 mt-1">{description}</p>
        </div>
      </div>
      <div className="bg-white rounded-xl p-3 border flex justify-between items-center" style={{ borderColor: "inherit" }}>
        <span className="text-xs font-medium text-slate-700">{actionMeta}</span>
        <button
          onClick={onAction}
          className={cn("text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1", s.actionClass)}
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}
