import { useEffect, useState } from 'react';
import { api, type Service } from '../api';

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.services()
      .then(setServices)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto w-full p-8 flex flex-col gap-6">
      {/* View Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dental Service Database</h1>
        <p className="text-sm text-slate-500 mt-1">
          Structured catalog of dental treatments, standard pricing in ₹ (INR), duration times, and dentist mappings (Section 7 of Project Plan).
        </p>
      </div>

      {/* Services Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="p-4">Service Procedure</th>
              <th className="p-4">Standard Price (INR)</th>
              <th className="p-4">Estimated Duration</th>
              <th className="p-4">Assigned Specialist(s)</th>
              <th className="p-4">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {services.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                  <span>🦷</span>
                  <span>{s.name}</span>
                </td>
                <td className="p-4">
                  <span className="font-extrabold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full text-xs">
                    ₹{s.priceInr.toLocaleString('en-IN')}
                  </span>
                </td>
                <td className="p-4 text-slate-700 font-medium">
                  🕒 {s.durationMin} min
                </td>
                <td className="p-4 text-slate-700 text-xs font-semibold">
                  {s.dentistIds.map((id) => (id === 'patel' ? 'Dr. Patel' : id === 'shah' ? 'Dr. Shah' : id)).join(', ')}
                </td>
                <td className="p-4 text-xs text-slate-500 max-w-xs">
                  {s.priceNote || 'Standard fixed clinic rate.'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
