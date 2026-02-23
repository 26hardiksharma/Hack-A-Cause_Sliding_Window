'use client';
import { useEffect, useState, useRef } from 'react';
import {
  Send, Users, MapPin, FileText, Clock,
  CheckCircle2, AlertCircle, Loader2,
} from 'lucide-react';
import { api, type SMSCampaign } from '@/lib/api';

const DISTRICT_OPTIONS = [
  { id: 1,  name: 'Beed' },       { id: 2,  name: 'Latur' },
  { id: 3,  name: 'Osmanabad' },  { id: 4,  name: 'Solapur' },
  { id: 5,  name: 'Aurangabad' }, { id: 6,  name: 'Nanded' },
  { id: 7,  name: 'Jalgaon' },    { id: 8,  name: 'Buldhana' },
  { id: 9,  name: 'Washim' },     { id: 10, name: 'Yavatmal' },
];

const TEMPLATES: Record<string, string> = {
  'Weather Warning (Heatwave)':
    'ALERT: Severe heatwave expected in next 48 hrs. Please delay sowing activities and ensure adequate hydration for livestock. - AquaGov',
  'Water Conservation Advisory':
    'ADVISORY: Water scarcity predicted. Please use water sparingly and report any leaks to the nearest block office. - AquaGov',
  'Tanker Schedule Update':
    'UPDATE: Water tanker will arrive at your village between 2PM-5PM today. Ensure containers ready. - AquaGov',
  'Custom Message': '',
};

function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-100 rounded-lg ${className}`} />;
}

export function AlertsPageContent() {
  const [campaigns,    setCampaigns]    = useState<SMSCampaign[]>([]);
  const [loadingCamps, setLoadingCamps] = useState(true);
  const [sending,      setSending]      = useState(false);
  const [toast,        setToast]        = useState<{ ok: boolean; msg: string } | null>(null);

  const [target,   setTarget]   = useState<'farmers' | 'authorities' | 'all'>('farmers');
  const [district, setDistrict] = useState('0');
  const [template, setTemplate] = useState(Object.keys(TEMPLATES)[0]);
  const [message,  setMessage]  = useState(TEMPLATES[Object.keys(TEMPLATES)[0]]);
  const msgRef = useRef(message);
  msgRef.current = message;

  useEffect(() => {
    api.sms.campaigns()
      .then(r => setCampaigns(r.campaigns))
      .catch(() => setCampaigns([]))
      .finally(() => setLoadingCamps(false));
  }, []);

  function handleTemplateChange(tmpl: string) {
    setTemplate(tmpl);
    if (TEMPLATES[tmpl]) setMessage(TEMPLATES[tmpl]);
  }

  async function handleSend() {
    if (!message.trim()) return;
    setSending(true);
    try {
      const districtIds = district === '0'
        ? DISTRICT_OPTIONS.map(d => d.id)
        : [parseInt(district)];

      const res = await api.sms.send({ district_ids: districtIds, target_group: target, message });

      const fresh = await api.sms.campaigns();
      setCampaigns(fresh.campaigns);

      setToast({
        ok: true,
        msg: `✅ ${res.sent} messages sent (${res.failed} failed). Campaign: ${res.campaign_id.slice(0, 8)}…`,
      });
    } catch (e: unknown) {
      const errMsg = e instanceof Error ? e.message : 'Failed to send SMS.';
      setToast({ ok: false, msg: `❌ ${errMsg}` });
    } finally {
      setSending(false);
      setTimeout(() => setToast(null), 5000);
    }
  }

  return (
    <div className="grid grid-cols-12 gap-6 h-full pb-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-5 py-4 rounded-2xl shadow-lg text-sm font-medium text-white max-w-sm ${toast.ok ? 'bg-emerald-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}

      {/* Left Column — Create Alert */}
      <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
        <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100 flex-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800">Create New Advisory</h2>
            <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-lg">
              {message.length}/160 chars
            </span>
          </div>

          <div className="space-y-6">
            {/* Target Group */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Target Group</label>
              <div className="grid grid-cols-3 gap-3">
                {(['farmers', 'authorities', 'all'] as const).map(g => (
                  <label key={g} className="cursor-pointer">
                    <input
                      type="radio"
                      name="target"
                      className="peer sr-only"
                      checked={target === g}
                      onChange={() => setTarget(g)}
                    />
                    <div className="p-3 rounded-xl border border-slate-200 text-center hover:bg-slate-50 peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:text-blue-700 transition-all">
                      <Users className="w-5 h-5 mx-auto mb-1 opacity-70" />
                      <span className="text-sm font-medium capitalize">
                        {g === 'all' ? 'All Users' : g.charAt(0).toUpperCase() + g.slice(1)}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Region */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Select District</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 appearance-none"
                  value={district}
                  onChange={e => setDistrict(e.target.value)}
                >
                  <option value="0">All Districts</option>
                  {DISTRICT_OPTIONS.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Template */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Message Template</label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <select
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 appearance-none"
                  value={template}
                  onChange={e => handleTemplateChange(e.target.value)}
                >
                  {Object.keys(TEMPLATES).map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-slate-700">Message Content</label>
                <span className={`text-xs ${message.length > 160 ? 'text-red-500 font-bold' : 'text-slate-400'}`}>
                  {message.length}/160
                </span>
              </div>
              <textarea
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 resize-none h-32"
                value={message}
                onChange={e => setMessage(e.target.value)}
                maxLength={160}
              />
            </div>

            {/* Action */}
            <div className="pt-2">
              <button
                type="button"
                disabled={sending || !message.trim()}
                onClick={handleSend}
                className="w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                {sending ? 'Sending…' : 'Send Alert Now'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column — Recent Broadcasts */}
      <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
        <div className="bg-white rounded-[24px] shadow-sm p-6 border border-slate-100 flex-1 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Recent Broadcasts</h3>
            <button className="text-xs font-medium text-blue-600 hover:text-blue-700">View All</button>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto">
            {loadingCamps ? (
              [1, 2].map(i => <Skeleton key={i} className="h-28 rounded-2xl" />)
            ) : campaigns.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-12">No campaigns sent yet.</p>
            ) : campaigns.map(c => (
              <div key={c.id} className="p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 capitalize">{c.target_group} Advisory</h4>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {new Date(c.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Sent
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-3 line-clamp-2">{c.message}</p>

                <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Recipients</p>
                    <p className="text-sm font-bold text-slate-800">
                      {c.recipients.toLocaleString()}{' '}
                      <span className="text-[10px] font-normal text-slate-500">{c.target_group}</span>
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold">Delivery Rate</p>
                    <p className="text-sm font-bold text-emerald-600">{c.delivery_rate}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
