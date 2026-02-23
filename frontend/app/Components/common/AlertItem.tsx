import * as React from "react";
import { cn } from "@/lib/utils";

interface AlertItemProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  time: string;
  description: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export function AlertItem({ icon, iconBg, title, time, description, action, className }: AlertItemProps) {
  return (
    <div className={cn("flex gap-4", className)}>
      <div className={cn("w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0", iconBg)}>
        {icon}
      </div>
      <div>
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-bold text-slate-800">{title}</h4>
          <span className="text-xs text-slate-400">{time}</span>
        </div>
        <p className="text-xs text-slate-500 mt-1 mb-2">{description}</p>
        {action}
      </div>
    </div>
  );
}
