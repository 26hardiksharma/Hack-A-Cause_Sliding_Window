'use client';
import { AlertTriangle, Truck, MessageSquare } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertItem } from "@/app/Components/common";

export function CriticalAlerts() {
  return (
    <Card className="bg-white rounded-[24px] shadow-sm border border-slate-100 py-0 flex-1">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800">Critical Alerts</h2>
          <Badge className="text-xs font-bold text-red-600 bg-red-50 border-red-100 px-2 py-1 rounded-lg h-auto">3 New</Badge>
        </div>
        <div className="space-y-4">
          <AlertItem
            icon={<AlertTriangle className="w-5 h-5" />}
            iconBg="bg-red-50 text-red-500"
            title="VWSI Escalation"
            time="12m"
            description={<>Khamgaon village VWSI jumped to <span className="font-bold text-red-500">0.63</span>.</>}
            action={<Button variant="link" className="text-xs font-medium text-blue-600 p-0 h-auto">Acknowledge</Button>}
          />
          <AlertItem
            icon={<Truck className="w-5 h-5" />}
            iconBg="bg-orange-50 text-orange-500"
            title="Tanker Breakdown"
            time="45m"
            description="MH-14-AB-1234 halted on Route R-07."
            action={<Button variant="link" className="text-xs font-medium text-blue-600 p-0 h-auto">Re-optimize</Button>}
          />
          <AlertItem
            icon={<MessageSquare className="w-5 h-5" />}
            iconBg="bg-yellow-50 text-yellow-600"
            title="SMS Failure"
            time="2h"
            description="3 villages failed to receive advisory."
          />
        </div>
      </CardContent>
    </Card>
  );
}
