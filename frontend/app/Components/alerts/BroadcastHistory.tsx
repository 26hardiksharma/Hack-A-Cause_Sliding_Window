'use client';
import { AlertCircle, FileText } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BroadcastCard } from "@/app/Components/reusable";

export function BroadcastHistory() {
  return (
    <Card className="bg-white rounded-[24px] shadow-sm border border-slate-100 py-0 flex-1">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800">Recent Broadcasts</h3>
          <Button variant="link" className="text-xs font-medium text-blue-600 p-0 h-auto">View All</Button>
        </div>
        <div className="space-y-4 flex-1">
          <BroadcastCard
            icon={<AlertCircle className="w-4 h-4" />}
            iconBg="bg-orange-50 text-orange-500"
            title="Heatwave Warning"
            time="Today, 09:30 AM"
            preview="ALERT: Severe heatwave expected in next 48 hrs. Please delay sowing activities..."
            recipientsCount="12.4k"
            recipientsLabel="Farmers"
            deliveryRate="98.2%"
            status="sent"
          />
          <BroadcastCard
            icon={<FileText className="w-4 h-4" />}
            iconBg="bg-blue-50 text-blue-500"
            title="Water Supply Schedule"
            time="Yesterday, 14:15 PM"
            preview="Tanker schedule updated for Selu taluka. Expected arrival between 2PM-4PM."
            recipientsCount="5.2k"
            recipientsLabel="All"
            deliveryRate="95.4%"
            status="sent"
          />
        </div>
      </CardContent>
    </Card>
  );
}
