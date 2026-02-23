'use client';
import { TrendingUp, Map as MapIcon, Truck } from 'lucide-react';
import { StatCard } from "@/app/Components/common";

export function DashboardStats() {
  return (
    <div className="xl:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard
        label="District VWSI"
        value="0.52"
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        }
        trend={{ value: "+0.08", label: "vs last month", variant: "negative" }}
      />
      <StatCard
        label="Villages Under Stress"
        value="127"
        icon={<MapIcon className="w-5 h-5" />}
        trend={{ value: "12", label: "added this week", variant: "neutral" }}
      />
      <StatCard
        label="Active Tankers"
        value={<>18 <span className="text-lg font-normal text-slate-400">/ 24</span></>}
        icon={<Truck className="w-5 h-5" />}
        trend={{ value: "On Route", label: "6 Loading", variant: "positive" }}
      />
    </div>
  );
}
