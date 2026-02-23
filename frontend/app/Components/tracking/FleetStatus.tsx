'use client';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FleetStatusProps {
  tankers: { status: string }[];
  efficiency: number;
}

export function FleetStatus({ tankers, efficiency }: FleetStatusProps) {
  const active = tankers.filter(t => t.status === 'active').length;
  const loading = tankers.filter(t => t.status === 'loading').length;
  const maintenance = tankers.filter(t => t.status === 'maintenance').length;
  const total = tankers.length || 1;

  const rows = [
    { label: 'On Time (Active)',    color: 'bg-emerald-500', count: active,      pct: Math.round((active / total) * 100) },
    { label: 'Loading / En Route',  color: 'bg-orange-400',  count: loading,     pct: Math.round((loading / total) * 100) },
    { label: 'Issues / Maintenance',color: 'bg-red-500',     count: maintenance, pct: Math.round((maintenance / total) * 100) },
  ];

  return (
    <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800">Fleet Status</h3>
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 h-8 w-8">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex justify-center mb-8 relative">
        <div className="w-48 h-48 rounded-full border-[12px] border-l-emerald-500 border-t-emerald-500 border-r-orange-400 border-b-red-500 rotate-45 transform flex items-center justify-center relative">
          <div className="text-center transform -rotate-45">
            <p className="text-xs text-slate-400 font-medium">Efficiency</p>
            <p className="text-3xl font-bold text-slate-800">{efficiency}%</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {rows.map(row => (
          <div key={row.label}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className={`w-3 h-3 rounded-full ${row.color}`} />
                <span className="text-sm font-medium text-slate-600">{row.label}</span>
              </div>
              <span className="text-sm font-bold text-slate-800">{row.count} tankers</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div
                className={`${row.color} h-full rounded-full transition-all duration-700`}
                style={{ width: `${row.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
