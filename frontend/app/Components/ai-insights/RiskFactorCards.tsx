'use client';
import { TrendingUp, CloudRain, Droplets, Thermometer } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const riskFactors = [
  {
    icon: <CloudRain className="w-5 h-5" />,
    iconBg: "bg-blue-50 text-blue-600",
    risk: "High Risk",
    riskClass: "text-red-500 bg-red-50",
    label: "Rainfall Deficit",
    value: "-42%",
    unit: "vs normal",
    detail: "Monsoon delayed by 14 days in eastern talukas.",
  },
  {
    icon: <Droplets className="w-5 h-5" />,
    iconBg: "bg-orange-50 text-orange-600",
    risk: "Med Risk",
    riskClass: "text-orange-500 bg-orange-50",
    label: "Soil Moisture",
    value: "18%",
    unit: "avg",
    detail: "Rapid depletion in topsoil across 45 villages.",
  },
  {
    icon: <Thermometer className="w-5 h-5" />,
    iconBg: "bg-red-50 text-red-600",
    risk: "High Risk",
    riskClass: "text-red-500 bg-red-50",
    label: "Temp Anomaly",
    value: "+2.4°C",
    unit: "avg",
    detail: "Prolonged heatwave expected next week.",
  },
];

export function RiskFactorCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {riskFactors.map((factor) => (
        <Card key={factor.label} className="bg-white rounded-[24px] shadow-sm border border-slate-100 py-0">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg ${factor.iconBg}`}>{factor.icon}</div>
              <Badge className={`${factor.riskClass} font-bold text-xs px-2 py-0.5 rounded h-auto flex items-center gap-1 border-0`}>
                <TrendingUp className="w-3 h-3" /> {factor.risk}
              </Badge>
            </div>
            <h3 className="text-sm font-medium text-slate-500 mb-1">{factor.label}</h3>
            <p className="text-2xl font-bold text-slate-800">
              {factor.value} <span className="text-sm font-normal text-slate-400">{factor.unit}</span>
            </p>
            <p className="text-xs text-slate-500 mt-3">{factor.detail}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
