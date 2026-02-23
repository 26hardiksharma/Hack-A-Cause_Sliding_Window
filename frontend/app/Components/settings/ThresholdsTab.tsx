'use client';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

const THRESHOLDS = [
  { label: 'Normal', colorDot: 'bg-emerald-500', range: '0.00 - 0.25', rangeClass: 'text-emerald-600 bg-emerald-50', defaultValue: 25, accent: 'accent-emerald-500' },
  { label: 'Moderate', colorDot: 'bg-yellow-500', range: '0.26 - 0.45', rangeClass: 'text-yellow-600 bg-yellow-50', defaultValue: 45, accent: 'accent-yellow-500' },
  { label: 'High', colorDot: 'bg-orange-500', range: '0.46 - 0.60', rangeClass: 'text-orange-600 bg-orange-50', defaultValue: 60, accent: 'accent-orange-500' },
  { label: 'Critical', colorDot: 'bg-red-500', range: '> 0.60', rangeClass: 'text-red-600 bg-red-50', defaultValue: 100, accent: 'accent-red-500' },
];

export function ThresholdsTab() {
  return (
    <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100">
      <div className="flex justify-between items-center mb-6 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-800">VWSI Threshold Configuration</h2>
          <p className="text-sm text-slate-500 mt-1">Define the index ranges that trigger different drought severity levels.</p>
        </div>
        <Button className="bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 flex items-center gap-2">
          <Save className="w-4 h-4" /> Save Changes
        </Button>
      </div>

      <div className="space-y-8">
        {THRESHOLDS.map(({ label, colorDot, range, rangeClass, defaultValue, accent }) => (
          <div key={label}>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${colorDot}`} /> {label}
              </label>
              <span className={`text-sm font-bold px-2 py-1 rounded-lg ${rangeClass}`}>{range}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              defaultValue={defaultValue}
              className={`w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer ${accent}`}
            />
            <div className="flex justify-between text-xs text-slate-400 mt-2">
              <span>0.00</span>
              <span>1.00</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
