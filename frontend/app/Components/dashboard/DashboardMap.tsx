'use client';
import { MapCard, MapToggleButton } from "@/app/Components/reusable";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/app/Components/common";

export function DashboardMap() {
  return (
    <MapCard
      title="District Overview Map"
      minHeight="min-h-[400px]"
      actions={
        <>
          <MapToggleButton label="Map" active />
          <MapToggleButton label="Satellite" />
        </>
      }
    >
      <div className="absolute inset-0 bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
        <div className="w-full h-full bg-[url('https://picsum.photos/seed/map/800/400')] bg-cover bg-center opacity-20" />
        {/* Map Pin & Tooltip */}
        <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-md animate-pulse" />
          <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white p-4 rounded-xl shadow-lg border border-slate-100 w-64 z-10">
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-bold text-slate-800">Khamgaon</h4>
              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded uppercase">SEVERE</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-slate-500">VWSI Index</span>
              <span className="font-bold text-slate-800">0.58</span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span className="text-slate-500">Tankers En Route</span>
              <span className="font-bold text-slate-800">2</span>
            </div>
            <ProgressBar value={80} colorClass="bg-red-500" className="mb-4" />
            <Button className="w-full py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 h-auto">
              View Details
            </Button>
          </div>
        </div>
      </div>
    </MapCard>
  );
}
