import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  colorClass?: string;
  className?: string;
}

export function ProgressBar({ value, colorClass = "bg-blue-600", className }: ProgressBarProps) {
  return (
    <div className={cn("w-full bg-slate-100 h-2 rounded-full overflow-hidden", className)}>
      <div
        className={cn("h-full rounded-full transition-all", colorClass)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
}
