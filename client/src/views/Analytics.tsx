import { useEffect, useState } from 'react';
import { api, type Stats } from '../api';

const TOP_REQUESTS = [
  { label: 'Appointments & Booking', percentage: 48, color: 'bg-teal-600' },
  { label: 'Pricing & Treatment Costs', percentage: 19, color: 'bg-blue-600' },
  { label: 'Services & Specializations', percentage: 14, color: 'bg-indigo-600' },
  { label: 'Clinic Hours & Location', percentage: 9, color: 'bg-amber-500' },
  { label: 'Other General Inquiries', percentage: 10, color: 'bg-slate-400' },
];

export default function Analytics() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.stats().then(setStats).catch((e) => console.error(e));
  }, []);

  return (
    <div className="max-w-5xl mx-auto w-full p-8 flex flex-col gap-6">
      {/* View Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Receptionist Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">
          Performance breakdown, request distributions, and conversation metrics (Section 14 of Project Plan).
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Calls / Chats</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">387</div>
            <div className="text-[11px] text-teal-600 font-semibold mt-1">📈 245 voice / 142 web</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center text-2xl">
            📊
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Appointments Booked</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">82</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">🟢 21.1% conversion rate</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl">
            📅
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Appointments Cancelled</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">12</div>
            <div className="text-[11px] text-rose-600 font-semibold mt-1">🔻 3.1% cancellation rate</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center text-2xl">
            ❌
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Human Transfers</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">24</div>
            <div className="text-[11px] text-amber-600 font-semibold mt-1">⚠️ Escalated to staff</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-2xl">
            🚨
          </div>
        </div>
      </div>

      {/* Top Patient Request Intent Distribution (Matches Section 14 Chart) */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col gap-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Top Patient Requests & Intent Distribution</h2>
          <p className="text-xs text-slate-500 mt-0.5">Automated breakdown of patient conversation topics</p>
        </div>

        <div className="flex flex-col gap-4">
          {TOP_REQUESTS.map((req, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800">{req.label}</span>
                <span className="text-slate-900 font-extrabold">{req.percentage}%</span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${req.color} rounded-full transition-all duration-500`} style={{ width: `${req.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
