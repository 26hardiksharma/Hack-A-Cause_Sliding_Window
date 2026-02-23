'use client';
import { Sparkles } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ChartCard } from "@/app/Components/reusable";
import { SectionHeader } from "@/app/Components/common";

const forecastData = [
  { name: '1 May',  value: 0.45, historical: 0.40 },
  { name: '5 May',  value: 0.48, historical: 0.42 },
  { name: '10 May', value: 0.52, historical: 0.43 },
  { name: '15 May', value: 0.58, historical: 0.45 },
  { name: '20 May', value: 0.65, historical: 0.48 },
  { name: '25 May', value: 0.72, historical: 0.50 },
  { name: '30 May', value: 0.78, historical: 0.52 },
];

export function ForecastChart() {
  return (
    <ChartCard
      header={
        <SectionHeader
          title={<><Sparkles className="w-5 h-5 text-blue-600" /> Drought Risk Forecast (30 Days)</>}
          description="Predicted VWSI based on current trends and historical data."
          action={
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Predicted
              </span>
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" /> Historical Avg
              </span>
            </div>
          }
          className="mb-0"
        />
      }
    >
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={forecastData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              labelStyle={{ fontSize: '10px', color: '#64748b', marginBottom: '4px' }}
            />
            <ReferenceLine y={0.6} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Critical Threshold', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
            <Area type="monotone" dataKey="historical" stroke="#cbd5e1" strokeWidth={2} fill="none" strokeDasharray="5 5" />
            <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
