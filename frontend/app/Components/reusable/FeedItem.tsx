import * as React from "react";
import { cn } from "@/lib/utils";

interface FeedItemProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  time: string;
  description: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "default" | "alert";
  className?: string;
}

export function FeedItem({ icon, iconBg, title, time, description, footer, variant = "default", className }: FeedItemProps) {
  return (
    <div
      className={cn(
        "p-3 rounded-2xl transition-colors cursor-pointer group mb-2",
        variant === "alert"
          ? "bg-red-50/50 border border-red-100 hover:bg-red-50"
          : "hover:bg-slate-50",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", iconBg)}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-0.5">
            <h4 className="text-sm font-bold text-slate-800 truncate">{title}</h4>
            <span
              className={cn(
                "text-[10px] whitespace-nowrap",
                variant === "alert" ? "text-red-500 font-medium" : "text-slate-400"
              )}
            >
              {time}
            </span>
          </div>
          <div className="text-xs text-slate-500 mb-2">{description}</div>
          {footer && <div>{footer}</div>}
        </div>
      </div>
    </div>
  );
}
