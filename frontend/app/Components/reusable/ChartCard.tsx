import * as React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  header: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function ChartCard({ header, children, className, contentClassName }: ChartCardProps) {
  return (
    <Card className={cn("bg-white rounded-[24px] shadow-sm border border-slate-100 py-0", className)}>
      <CardHeader className="px-6 pt-6 pb-0">{header}</CardHeader>
      <CardContent className={cn("px-6 pb-6 pt-4", contentClassName)}>{children}</CardContent>
    </Card>
  );
}
