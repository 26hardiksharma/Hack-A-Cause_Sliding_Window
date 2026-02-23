'use client';
import { Sparkles, AlertTriangle, CloudRain, Droplets, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RecommendationCard } from "@/app/Components/reusable";

export function RecommendationsPanel() {
  return (
    <Card className="bg-white rounded-[24px] shadow-sm border border-slate-100 py-0 flex-1">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" /> AI Recommendations
          </h3>
          <Badge className="text-xs font-bold text-blue-600 bg-blue-50 border-blue-100 px-2 py-1 rounded-lg h-auto">3 Actions</Badge>
        </div>

        <div className="space-y-4 flex-1">
          <RecommendationCard
            variant="critical"
            icon={<AlertTriangle className="w-4 h-4" />}
            title="Increase Tanker Allocation"
            description="Khamgaon and Selu clusters are predicted to cross critical VWSI threshold (0.6) in 5 days."
            actionLabel="Approve Allocation"
            actionMeta="+4 Tankers required"
          />
          <RecommendationCard
            variant="warning"
            icon={<CloudRain className="w-4 h-4" />}
            title="Send Conservation Advisory"
            description="Heatwave predicted. Advise farmers in eastern talukas to delay sowing by 1 week."
            actionLabel="Draft SMS"
            actionMeta="Target: 12,400 Farmers"
          />
          <RecommendationCard
            variant="info"
            icon={<Droplets className="w-4 h-4" />}
            title="Prepare Emergency Reservoir"
            description="Current depletion rate suggests primary reservoir will hit dead storage in 18 days."
            actionLabel={<>View Plan <ArrowRight className="w-3 h-3" /></>  as unknown as string}
            actionMeta="Action: Start pumping"
          />
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Last updated 10 mins ago
        </div>
      </CardContent>
    </Card>
  );
}
