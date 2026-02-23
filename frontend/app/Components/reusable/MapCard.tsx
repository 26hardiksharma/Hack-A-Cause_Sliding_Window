import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MapCardProps {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  minHeight?: string;
}

export function MapCard({ title, actions, children, className, minHeight = "min-h-[400px]" }: MapCardProps) {
  return (
    <Card className={cn("bg-white rounded-[24px] shadow-sm border border-slate-100 py-0 flex flex-col relative", minHeight, className)}>
      <CardContent className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-800">{title}</h2>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
        <div className="flex-1 relative">{children}</div>
      </CardContent>
    </Card>
  );
}

interface MapToggleButtonProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export function MapToggleButton({ label, active, onClick }: MapToggleButtonProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 text-xs font-medium rounded-lg h-auto",
        active
          ? "text-white bg-blue-600 hover:bg-blue-700"
          : "text-slate-500 bg-slate-50 hover:bg-slate-100"
      )}
    >
      {label}
    </Button>
  );
}
