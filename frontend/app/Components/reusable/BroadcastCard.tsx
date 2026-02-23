import * as React from "react";
import { Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BroadcastCardProps {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  time: string;
  preview: string;
  recipientsCount: string;
  recipientsLabel: string;
  deliveryRate: string;
  status?: "sent" | "failed" | "pending";
  className?: string;
}

export function BroadcastCard({
  icon, iconBg, title, time, preview,
  recipientsCount, recipientsLabel, deliveryRate,
  status = "sent", className,
}: BroadcastCardProps) {
  return (
    <Card className={cn("border border-slate-100 hover:bg-slate-50 transition-colors rounded-2xl shadow-none py-0", className)}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", iconBg)}>
              {icon}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-800">{title}</h4>
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {time}
              </span>
            </div>
          </div>
          {status === "sent" && (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Sent
            </span>
          )}
        </div>
        <p className="text-xs text-slate-600 mb-3 line-clamp-2">{preview}</p>
        <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100">
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Recipients</p>
            <p className="text-sm font-bold text-slate-800">
              {recipientsCount} <span className="text-[10px] font-normal text-slate-500">{recipientsLabel}</span>
            </p>
          </div>
          <div>
            <p className="text-[10px] text-slate-400 uppercase font-bold">Delivery Rate</p>
            <p className="text-sm font-bold text-emerald-600">{deliveryRate}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
