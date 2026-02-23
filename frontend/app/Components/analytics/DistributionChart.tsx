'use client';
import { BarChart2, Calendar, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Button } from "@/components/ui/button";
import { ChartCard } from "@/app/Components/reusable";
import { SectionHeader } from "@/app/Components/common";

const distributionData = [
  { name: 'Jan', allocated: 400, delivered: 380 },
  { name: 'Feb', allocated: 450, delivered: 420 },
  { name: 'Mar', allocated: 600, delivered: 550 },
  { name: 'Apr', allocated: 800, delivered: 750 },
  { name: 'May', allocated: 1000, delivered: 920 },
  { name: 'Jun', allocated: 1200, delivered: 1100 },
];

export function DistributionChart() {
  return (
    <ChartCard
      header={
        <SectionHeader
          title={<><BarChart2 className="w-5 h-5 text-blue-600" /> Water Distribution Trends</>}
          description="Allocated vs Delivered volume (in '000 Liters)"
          action={
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-xs font-medium text-slate-600 rounded-lg h-auto px-3 py-1.5">
                <Calendar className="w-3 h-3" /> This Year
              </Button>
              <Button variant="outline" size="sm" className="text-xs font-medium text-slate-600 rounded-lg h-auto px-3 py-1.5">
                <Filter className="w-3 h-3" /> Filter
              </Button>
            </div>
          }
          className="mb-0"
        />
      }
    >
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={distributionData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
            <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} itemStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
            <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
            <Bar dataKey="allocated" name="Allocated" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={24} />
            <Bar dataKey="delivered" name="Delivered" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
