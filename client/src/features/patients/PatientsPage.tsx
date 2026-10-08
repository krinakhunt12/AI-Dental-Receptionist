import { useState } from 'react';
import { usePatientsQuery } from './hooks/usePatientsQuery';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  HiUsers,
  HiMagnifyingGlass,
  HiPhone,
  HiEnvelope,
  HiUserGroup,
} from 'react-icons/hi2';

export default function PatientsPage() {
  const { patients: list, isLoading } = usePatientsQuery();
  const [search, setSearch] = useState('');

  if (isLoading) {
    return <LoadingSpinner message="Loading Patient Directory…" />;
  }

  const filtered = list.filter((p) => {
    const q = search.toLowerCase();
    return !q || p.name.toLowerCase().includes(q) || p.phone.includes(q) || p.email.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-6xl mx-auto w-full p-6 md:p-10 flex flex-col gap-6 font-sans text-slate-800">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <HiUsers className="text-teal-600 text-2xl" />
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            Patient Directory
          </h1>
        </div>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Registered patient profiles, contact details, preferred dentist mappings, and visit history.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 bg-white border border-slate-200 focus-within:border-teal-500 focus-within:ring-3 focus-within:ring-teal-500/15 rounded-xl p-3 shadow-xs transition-all max-w-md">
        <HiMagnifyingGlass className="text-base text-slate-400 pl-1 shrink-0" />
        <input
          className="flex-1 bg-transparent text-xs md:text-sm text-slate-900 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by patient name, phone, or email…"
        />
      </div>

      {/* Patients Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="p-4">Patient Name</th>
                <th className="p-4">Contact Phone</th>
                <th className="p-4">Email Address</th>
                <th className="p-4">Preferred Dentist</th>
                <th className="p-4">Total Appointments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs md:text-sm">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xs shrink-0 font-heading">
                      {p.name.charAt(0)}
                    </div>
                    <span>{p.name}</span>
                  </td>
                  <td className="p-4 text-slate-700 font-mono font-medium">
                    <span className="flex items-center gap-1.5">
                      <HiPhone className="text-slate-400" />
                      <span>{p.phone}</span>
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 font-mono text-xs">
                    <span className="flex items-center gap-1.5">
                      <HiEnvelope className="text-slate-400" />
                      <span>{p.email}</span>
                    </span>
                  </td>
                  <td className="p-4 text-xs font-semibold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <HiUserGroup className="text-indigo-500" />
                      <span>
                        {p.preferredDentist === 'patel'
                          ? 'Dr. Patel'
                          : p.preferredDentist === 'shah'
                            ? 'Dr. Shah'
                            : 'Staff Dentist'}
                      </span>
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold px-3 py-1 rounded-full">
                      {p.totalAppointments} visit(s)
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
    </div>
  );
}
