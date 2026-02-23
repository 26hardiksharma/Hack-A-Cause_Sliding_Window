'use client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Button } from "@/components/ui/button";
import { ChartCard } from "@/app/Components/reusable";
import { SectionHeader } from "@/app/Components/common";

const vwsiData = [
  { name: 'MON', value: 0.2 },
  { name: 'TUE', value: 0.3 },
  { name: 'WED', value: 0.4 },
  { name: 'THU', value: 0.45 },
  { name: 'FRI', value: 0.5 },
  { name: 'SAT', value: 0.52 },
  { name: 'SUN (PROJ)', value: 0.58 },
];

export function VWSITrends() {
  return (
    <ChartCard
      header={
        <SectionHeader
          title="VWSI Trends"
          action={
            <div className="flex gap-2">
              <Button size="sm" className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg h-auto hover:bg-blue-100">Weekly</Button>
              <Button variant="ghost" size="sm" className="px-3 py-1.5 text-xs font-medium text-slate-500 rounded-lg h-auto">Monthly</Button>
            </div>
          }
          className="mb-0"
        />
      }
    >
      <div className="h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={vwsiData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {vwsiData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === vwsiData.length - 1 ? '#e2e8f0' : index === vwsiData.length - 2 ? '#3b82f6' : '#bfdbfe'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
