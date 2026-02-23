import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  trend?: {
    value: string;
    label: string;
    variant?: "positive" | "negative" | "neutral" | "info";
  };
  className?: string;
}

const trendVariantStyles: Record<string, string> = {
  positive: "text-green-600 bg-green-50",
  negative: "text-red-500 bg-red-50",
  neutral: "text-orange-500 bg-orange-50",
  info: "text-blue-600 bg-blue-50",
};

export function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  return (
    <Card className={cn("bg-white rounded-[24px] shadow-sm border border-slate-100 py-0", className)}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">{value}</h3>
          </div>
          <div className="p-2 bg-slate-50 text-slate-400 rounded-lg">{icon}</div>
        </div>
        {trend && (
          <div className="flex items-center gap-2 text-xs">
            <span
              className={cn(
                "font-bold px-1.5 py-0.5 rounded flex items-center gap-1",
                trendVariantStyles[trend.variant ?? "neutral"]
              )}
            >
              <TrendingUp className="w-3 h-3" />
              {trend.value}
            </span>
            <span className="text-slate-400">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
