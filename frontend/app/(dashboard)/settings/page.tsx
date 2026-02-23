'use client';
import { useState } from 'react';
import { SettingsNav, ThresholdsTab, UserAccessTab } from '@/app/Components/settings';
import type { SettingsTab } from '@/app/Components/settings';
import { Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('thresholds');

  return (
    <div className="grid grid-cols-12 gap-6 h-full pb-8">
      <div className="col-span-12 lg:col-span-3">
        <SettingsNav activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
        {activeTab === 'thresholds' && <ThresholdsTab />}
        {activeTab === 'users' && <UserAccessTab />}
        {(activeTab === 'notifications' || activeTab === 'system') && (
          <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100 flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <SettingsIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-800">Coming Soon</h3>
              <p className="text-sm text-slate-500 mt-2">This configuration section is under development.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
