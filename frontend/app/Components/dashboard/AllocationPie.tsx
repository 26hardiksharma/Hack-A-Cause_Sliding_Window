'use client';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/app/Components/common";

const allocationData = [
  { name: 'Allocated', value: 24 },
  { name: 'Pending', value: 12 },
];
const COLORS = ['#10B981', '#EF4444'];

export function AllocationPie() {
  return (
    <Card className="bg-white rounded-[24px] shadow-sm border border-slate-100 py-0">
      <CardContent className="p-6">
        <SectionHeader title="Allocation" className="mb-4" />
        <div className="flex items-center justify-center relative h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={allocationData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-slate-800">24</span>
            <span className="text-xs text-slate-500">Allocated</span>
          </div>
        </div>
        <div className="space-y-3 mt-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-600">Allocated</span>
            </div>
            <span className="font-bold text-slate-800">24</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-slate-600">Pending</span>
            </div>
            <span className="font-bold text-slate-800">0.36L</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
