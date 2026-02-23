'use client';
import { Send, Users, MapPin, FileText, AlertCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function CreateAdvisoryForm() {
  return (
    <Card className="bg-white rounded-[24px] shadow-sm border border-slate-100 py-0 flex-1">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-slate-800">Create New Advisory</h2>
          <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">Est. Reach: 15,000+</span>
        </div>

        <form className="space-y-6">
          {/* Target Group */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">Target Group</Label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Users className="w-5 h-5 mx-auto mb-1 opacity-70" />, label: "Farmers", defaultChecked: true },
                { icon: <AlertCircle className="w-5 h-5 mx-auto mb-1 opacity-70" />, label: "Authorities" },
                { icon: <Users className="w-5 h-5 mx-auto mb-1 opacity-70" />, label: "All Users" },
              ].map((opt) => (
                <label key={opt.label} className="cursor-pointer">
                  <input type="radio" name="target" className="peer sr-only" defaultChecked={opt.defaultChecked} />
                  <div className="p-3 rounded-xl border border-slate-200 text-center hover:bg-slate-50 peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 transition-all">
                    {opt.icon}
                    <span className="text-sm font-medium">{opt.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Region */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">Select Region</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none z-10" />
              <Select defaultValue="all">
                <SelectTrigger className="w-full pl-10 bg-slate-50 border-slate-200 rounded-xl h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Talukas</SelectItem>
                  <SelectItem value="khamgaon">Khamgaon</SelectItem>
                  <SelectItem value="selu">Selu</SelectItem>
                  <SelectItem value="manwat">Manwat</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Template */}
          <div>
            <Label className="text-sm font-medium text-slate-700 mb-2 block">Message Template</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none z-10" />
              <Select defaultValue="heatwave">
                <SelectTrigger className="w-full pl-10 bg-slate-50 border-slate-200 rounded-xl h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="heatwave">Weather Warning (Heatwave)</SelectItem>
                  <SelectItem value="conservation">Water Conservation Advisory</SelectItem>
                  <SelectItem value="schedule">Tanker Schedule Update</SelectItem>
                  <SelectItem value="custom">Custom Message</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Message Body */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <Label className="text-sm font-medium text-slate-700">Message Content (Marathi/English)</Label>
              <span className="text-xs text-slate-400">124/160 chars</span>
            </div>
            <Textarea
              className="w-full bg-slate-50 border-slate-200 rounded-xl text-sm h-32 resize-none"
              defaultValue="ALERT: Severe heatwave expected in next 48 hrs. Please delay sowing activities and ensure adequate hydration for livestock. - Dist. Admin"
            />
          </div>

          <Button type="button" className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 h-auto shadow-sm">
            <Send className="w-5 h-5" />
            Send Alert Now
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
