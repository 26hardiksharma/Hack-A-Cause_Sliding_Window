'use client';
import { FileText, Download } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SectionHeader } from "@/app/Components/common";

export function GenerateReportForm() {
  return (
    <Card className="bg-white rounded-[24px] shadow-sm border border-slate-100 py-0 flex-1">
      <CardContent className="p-6 flex flex-col h-full">
        <SectionHeader
          title={<><FileText className="w-5 h-5 text-blue-600" /> Generate Report</>}
          className="mb-6"
        />
        <form className="space-y-4 flex-1 flex flex-col">
          <div>
            <Label className="text-xs font-medium text-slate-500 mb-1.5 block">Report Type</Label>
            <Select defaultValue="comprehensive">
              <SelectTrigger className="w-full bg-slate-50 border-slate-200 rounded-xl h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comprehensive">Comprehensive District Report</SelectItem>
                <SelectItem value="tanker">Tanker Operations Summary</SelectItem>
                <SelectItem value="financial">Financial Utilization</SelectItem>
                <SelectItem value="vwsi">VWSI Trend Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-xs font-medium text-slate-500 mb-1.5 block">Date Range</Label>
            <div className="grid grid-cols-2 gap-2">
              <Input type="date" className="bg-slate-50 border-slate-200 rounded-xl text-xs h-10" />
              <Input type="date" className="bg-slate-50 border-slate-200 rounded-xl text-xs h-10" />
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium text-slate-500 mb-1.5 block">Format</Label>
            <div className="flex gap-3">
              {["PDF", "Excel"].map((fmt) => (
                <label key={fmt} className="flex-1 cursor-pointer">
                  <input type="radio" name="format" className="peer sr-only" defaultChecked={fmt === "PDF"} />
                  <div className="py-2 text-center rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 transition-all">
                    {fmt}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-4">
            <Button type="button" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 h-auto shadow-sm">
              <Download className="w-4 h-4" />
              Download Report
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
