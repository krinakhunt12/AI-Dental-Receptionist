import { useEffect, useState } from 'react';
import { api, type Appt, type Stats } from '../api';

export default function Dashboard({ onNavigate }: { onNavigate: (tab: any) => void }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentAppts, setRecentAppts] = useState<Appt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.stats(), api.appointments()])
      .then(([s, a]) => {
        setStats(s);
        setRecentAppts(a.slice(0, 5));
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto w-full p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">SmileCare Clinic Overview</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time operational dashboard for AI receptionist and clinic management.
          </p>
        </div>
        <button
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md shadow-teal-600/20 transition-all flex items-center gap-2"
          onClick={() => onNavigate('chat')}
        >
          <span>💬 Open Patient Chat</span>
        </button>
      </div>

      {/* Main KPI Cards Grid (Matches Section 3 in project plan) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Today's Appointments</span>
            <span className="text-3xl font-extrabold text-slate-900 mt-1">{stats?.bookedAppointments ?? 18}</span>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1">🟢 Active Slots</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center text-2xl">
            📅
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">New Patients</span>
            <span className="text-3xl font-extrabold text-slate-900 mt-1">7</span>
            <span className="text-[11px] text-teal-600 font-semibold mt-1">📈 +14% this week</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center text-2xl">
            👤
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">AI Conversations</span>
            <span className="text-3xl font-extrabold text-slate-900 mt-1">42</span>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1">🤖 91% automated</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-2xl">
            💬
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Human Transfers</span>
            <span className="text-3xl font-extrabold text-slate-900 mt-1">4</span>
            <span className="text-[11px] text-amber-600 font-semibold mt-1">⚠️ Urgent / Escalated</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center text-2xl">
            🚨
          </div>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          className="bg-white border border-slate-200 hover:border-teal-500 hover:shadow-md p-5 rounded-xl text-left transition-all flex flex-col gap-2 group"
          onClick={() => onNavigate('appointments')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xl">📅</span>
            <span className="text-xs font-bold text-teal-600 group-hover:translate-x-1 transition-transform">Manage ➔</span>
          </div>
          <h3 className="font-bold text-slate-900 text-base">Appointment Calendar</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            View, schedule, edit, or cancel patient dental appointments and assign dentists.
          </p>
        </button>

        <button
          className="bg-white border border-slate-200 hover:border-teal-500 hover:shadow-md p-5 rounded-xl text-left transition-all flex flex-col gap-2 group"
          onClick={() => onNavigate('services')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xl">🦷</span>
            <span className="text-xs font-bold text-teal-600 group-hover:translate-x-1 transition-transform">Catalog ➔</span>
          </div>
          <h3 className="font-bold text-slate-900 text-base">Dental Service Catalog</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Configure procedures, prices in ₹ (INR), duration times, and specialist dentist mappings.
          </p>
        </button>

        <button
          className="bg-white border border-slate-200 hover:border-teal-500 hover:shadow-md p-5 rounded-xl text-left transition-all flex flex-col gap-2 group"
          onClick={() => onNavigate('knowledge')}
        >
          <div className="flex items-center justify-between">
            <span className="text-xl">📚</span>
            <span className="text-xs font-bold text-teal-600 group-hover:translate-x-1 transition-transform">RAG Store ➔</span>
          </div>
          <h3 className="font-bold text-slate-900 text-base">Knowledge Base & RAG</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Upload PDF/MD clinic policies, FAQs, parking directions, and pre-treatment guidelines.
          </p>
        </button>
      </div>

      {/* Recent Appointments Preview */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Appointments</h2>
            <p className="text-xs text-slate-500">Latest patient bookings processed by reception</p>
          </div>
          <button
            className="text-xs font-bold text-teal-600 hover:text-teal-800"
            onClick={() => onNavigate('appointments')}
          >
            View All ({stats?.totalAppointments ?? 0}) ➔
          </button>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="p-4">Date & Time</th>
              <th className="p-4">Patient</th>
              <th className="p-4">Service</th>
              <th className="p-4">Dentist</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {recentAppts.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="p-4 font-bold text-slate-900">{a.date} ({a.start})</td>
                <td className="p-4 font-semibold text-slate-800">👤 {a.patientName}</td>
                <td className="p-4"><span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">🦷 {a.serviceName ?? a.serviceId}</span></td>
                <td className="p-4 text-slate-700 font-medium">👨‍⚕️ {a.dentistName ?? a.dentistId}</td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${a.status === 'booked' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-blue-50 text-blue-800 border-blue-200'}`}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
