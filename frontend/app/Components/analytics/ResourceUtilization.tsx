'use client';
import { PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/app/Components/common";

const utilizationData = [
  { name: 'Tankers', value: 85 },
  { name: 'Funds',   value: 65 },
  { name: 'Manpower', value: 70 },
];
const COLORS = ['#3b82f6', '#10b981', '#f59e0b'];

export function ResourceUtilization() {
  return (
    <Card className="bg-white rounded-[24px] shadow-sm border border-slate-100 py-0">
      <CardContent className="p-6">
        <SectionHeader
          title={<><PieChartIcon className="w-5 h-5 text-blue-600" /> Resource Utilization</>}
          className="mb-6"
        />
        <div className="flex items-center justify-center relative h-48 mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={utilizationData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                {utilizationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} itemStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-slate-800">73%</span>
            <span className="text-xs text-slate-500">Avg. Used</span>
          </div>
        </div>
        <div className="space-y-3">
          {utilizationData.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span className="text-slate-600">{item.name}</span>
              </div>
              <span className="font-bold text-slate-800">{item.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
