'use client';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/app/Components/common";
import { ProgressBar } from "@/app/Components/common";

const stressData = [
  { name: 'Khamgaon', label: 'Critical (0.68)', colorClass: 'bg-red-500', labelClass: 'text-red-600', value: 85 },
  { name: 'Selu',     label: 'High (0.52)',     colorClass: 'bg-orange-500', labelClass: 'text-orange-500', value: 65 },
  { name: 'Manwat',   label: 'Moderate (0.35)', colorClass: 'bg-yellow-500', labelClass: 'text-yellow-500', value: 45 },
  { name: 'Pathri',   label: 'Normal (0.15)',   colorClass: 'bg-emerald-500', labelClass: 'text-emerald-500', value: 20 },
];

export function TalukaStressPanel() {
  return (
    <Card className="bg-white rounded-[24px] shadow-sm border border-slate-100 py-0 flex-1">
      <CardContent className="p-6">
        <SectionHeader
          title={<><TrendingUp className="w-5 h-5 text-red-500" /> Taluka-wise Stress Level</>}
          action={<Button variant="link" className="text-xs font-medium text-blue-600 p-0 h-auto">View Map</Button>}
          className="mb-6"
        />
        <div className="space-y-5">
          {stressData.map((item) => (
            <div key={item.name}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-bold text-slate-800">{item.name}</span>
                <span className={`text-xs font-bold ${item.labelClass}`}>{item.label}</span>
              </div>
              <ProgressBar value={item.value} colorClass={item.colorClass} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
