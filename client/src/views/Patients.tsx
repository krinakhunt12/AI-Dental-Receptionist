import { useEffect, useState } from 'react';
import { api, type Patient } from '../api';

export default function Patients() {
  const [list, setList] = useState<Patient[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.patients()
      .then(setList)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const filtered = list.filter((p) => {
    const q = search.toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || p.phone.includes(q) || p.email.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-5xl mx-auto w-full p-8 flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Directory</h1>
        <p className="text-sm text-slate-500 mt-1">
          Registered patient profiles, contact details, preferred dentist, and appointment history (Section 11 of Project Plan).
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 bg-white border border-slate-200 focus-within:border-teal-500 focus-within:ring-3 focus-within:ring-teal-500/15 rounded-xl p-2.5 shadow-xs transition-all max-w-md">
        <span className="text-base text-slate-400 pl-1">🔍</span>
        <input
          className="flex-1 bg-transparent text-sm text-slate-900 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by patient name, phone, or email…"
        />
      </div>

      {/* Patients Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="p-4">Patient Name</th>
              <th className="p-4">Contact Phone</th>
              <th className="p-4">Email Address</th>
              <th className="p-4">Preferred Dentist</th>
              <th className="p-4">Visits Booked</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                  <span>👤</span>
                  <span>{p.name}</span>
                </td>
                <td className="p-4 text-slate-700 font-medium">📞 {p.phone}</td>
                <td className="p-4 text-slate-500 text-xs">✉️ {p.email}</td>
                <td className="p-4 text-xs font-semibold text-slate-800">
                  👨‍⚕️ {p.preferredDentist === 'patel' ? 'Dr. Patel' : p.preferredDentist === 'shah' ? 'Dr. Shah' : 'Staff Dentist'}
                </td>
                <td className="p-4">
                  <span className="bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold px-2.5 py-1 rounded-full">
                    {p.totalAppointments} appointment(s)
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-8 text-slate-400 text-sm">
                  No patients found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
