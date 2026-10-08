import { useEffect, useState } from 'react';
import { api, type Appt, type Status } from '../api';

const STATUSES: { v: Status; label: string }[] = [
  { v: 'booked', label: 'Booked' },
  { v: 'completed', label: 'Completed' },
  { v: 'cancelled', label: 'Cancelled' },
  { v: 'no_show', label: 'No-show' },
];

export default function Appointments() {
  const [rows, setRows] = useState<Appt[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const load = () => {
    setLoading(true);
    api.appointments()
      .then(setRows)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const totalBooked = rows.filter((r) => r.status === 'booked').length;
  const totalCompleted = rows.filter((r) => r.status === 'completed').length;
  const totalCancelled = rows.filter((r) => r.status === 'cancelled' || r.status === 'no_show').length;

  const filteredRows = rows.filter((r) => {
    const matchesStatus = filter === 'all' || r.status === filter;
    const searchLower = search.toLowerCase();
    const matchesSearch =
      !search ||
      r.patientName.toLowerCase().includes(searchLower) ||
      (r.serviceName ?? '').toLowerCase().includes(searchLower) ||
      (r.dentistName ?? '').toLowerCase().includes(searchLower) ||
      r.patientPhone.includes(search);
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'booked':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'completed':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      case 'no_show':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full p-8 flex flex-col gap-6">
      {/* View Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Appointments Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Real-time view of all appointments scheduled by the AI receptionist or clinic front-desk staff.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center text-xl shrink-0">
            📅
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-slate-900 leading-tight">{rows.length}</span>
            <span className="text-xs text-slate-500 font-medium">Total Appointments</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center text-xl shrink-0">
            🟢
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-slate-900 leading-tight">{totalBooked}</span>
            <span className="text-xs text-slate-500 font-medium">Upcoming / Booked</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center text-xl shrink-0">
            ✔️
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-slate-900 leading-tight">{totalCompleted}</span>
            <span className="text-xs text-slate-500 font-medium">Completed Visits</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-700 border border-rose-100 flex items-center justify-center text-xl shrink-0">
            ❌
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-slate-900 leading-tight">{totalCancelled}</span>
            <span className="text-xs text-slate-500 font-medium">Cancelled / No-Show</span>
          </div>
        </div>
      </div>

      {/* Filter & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 bg-white border border-slate-200 focus-within:border-teal-500 focus-within:ring-3 focus-within:ring-teal-500/15 rounded-xl p-2.5 shadow-xs transition-all flex-1 min-w-[260px]">
          <span className="text-base text-slate-400 pl-1">🔍</span>
          <input
            className="flex-1 bg-transparent text-sm text-slate-900 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by patient, service, or dentist name…"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            className="bg-white border border-slate-200 text-slate-800 text-xs font-semibold px-3 py-2.5 rounded-xl shadow-xs focus:outline-none focus:border-teal-500 cursor-pointer"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Statuses ({rows.length})</option>
            <option value="booked">Booked ({totalBooked})</option>
            <option value="completed">Completed ({totalCompleted})</option>
            <option value="cancelled">Cancelled</option>
            <option value="no_show">No-Show</option>
          </select>

          <button
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50"
            onClick={load}
            disabled={loading}
          >
            <span>{loading ? 'Refreshing…' : '🔄 Refresh'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-sm font-medium" role="alert">
          {error}
        </div>
      )}

      {/* Appointments Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="p-4">Date & Time</th>
              <th className="p-4">Patient Information</th>
              <th className="p-4">Requested Service</th>
              <th className="p-4">Assigned Dentist</th>
              <th className="p-4">Appointment Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {filteredRows.map((a) => (
              <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="p-4">
                  <div className="font-bold text-slate-900">{a.date}</div>
                  <div className="text-xs text-slate-500 mt-0.5">🕒 {a.start} - {a.end}</div>
                </td>
                <td className="p-4">
                  <div className="font-semibold text-slate-900">👤 {a.patientName}</div>
                  <div className="text-xs text-slate-500 mt-0.5">📞 {a.patientPhone}</div>
                </td>
                <td className="p-4">
                  <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200">
                    🦷 {a.serviceName ?? 'General Dental Service'}
                  </span>
                </td>
                <td className="p-4 font-medium text-slate-800">
                  👨‍⚕️ {a.dentistName ?? 'Staff Dentist'}
                </td>
                <td className="p-4">
                  <select
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer outline-none transition-all ${getStatusColor(a.status)}`}
                    value={a.status}
                    onChange={(e) => api.setStatus(a.id, e.target.value as Status).then(load)}
                    aria-label={`Status for ${a.patientName}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s.v} value={s.v}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {filteredRows.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-8 text-slate-400 text-sm">
                  {rows.length === 0
                    ? 'No appointments booked yet. Try booking one in the Patient Chat tab!'
                    : 'No appointments matched your search or status filter.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
