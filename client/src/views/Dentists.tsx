import { useEffect, useState } from 'react';
import { api, type Dentist } from '../api';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function Dentists() {
  const [list, setList] = useState<Dentist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.dentists()
      .then(setList)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto w-full p-8 flex flex-col gap-6">
      {/* View Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dentist Directory & Working Hours</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage dentists, specializations, and weekly available shift hours (Matches Section 5 of Project Plan).
        </p>
      </div>

      {/* Dentists Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {list.map((d) => (
          <div key={d.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 text-teal-800 font-extrabold text-xl flex items-center justify-center">
                  👨‍⚕️
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">{d.name}</h3>
                  <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/60 inline-block mt-0.5">
                    {d.specialization}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                Active Staff
              </span>
            </div>

            <div className="border-t border-slate-100 pt-4 flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Operating Hours:</span>
                <span className="font-bold text-slate-900">🕒 {d.start} - {d.end}</span>
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Available Working Days:</span>
                <span className="font-semibold text-slate-800">
                  {d.days.map((dayIndex) => DAY_NAMES[dayIndex].slice(0, 3)).join(', ')}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3 text-xs text-slate-600">
              💡 <strong>AI Capability:</strong> When a patient requests an appointment for <em>{d.specialization}</em>, the AI automatically checks {d.name}'s schedule and suggests available timeslots.
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
