import { useDentistsQuery } from './hooks/useDentistsQuery';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  HiUserGroup,
  HiClock,
  HiCalendarDays,
  HiSparkles,
  HiCheckCircle,
} from 'react-icons/hi2';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function DentistsPage() {
  const { dentists: list, isLoading } = useDentistsQuery();

  if (isLoading) {
    return <LoadingSpinner message="Loading Dentist Roster…" />;
  }

  return (
    <div className="max-w-6xl mx-auto w-full p-6 md:p-10 flex flex-col gap-8 font-sans text-slate-100 bg-[#070a12] min-h-screen">
      {/* View Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl flex flex-col gap-3 relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-2">
          <HiUserGroup className="text-teal-400 text-3xl" />
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight font-heading">
            Dentist Roster & Shift Schedules
          </h1>
        </div>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Manage certified dentist profiles, clinical specializations, shift timings, and active working days.
        </p>
      </div>

      {/* Dentists Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-delayed">
        {list.map((d) => (
          <div
            key={d.id}
            className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-5 hover:border-teal-500/40 transition-all duration-300 hover:-translate-y-1"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/30 text-teal-300 font-extrabold text-xl flex items-center justify-center shrink-0 font-heading shadow-inner">
                  <HiUserGroup />
                </div>
                <div>
                  <h3 className="font-extrabold text-xl text-white font-heading">{d.name}</h3>
                  <span className="text-xs font-bold text-teal-300 bg-teal-950 px-3 py-0.5 rounded-full border border-teal-800/80 inline-block mt-1">
                    {d.specialization}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-extrabold text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <HiCheckCircle className="text-emerald-400" />
                <span>Active Shift</span>
              </span>
            </div>

            <div className="border-t border-slate-800/80 pt-4 flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <HiClock className="text-teal-400 text-sm" />
                  <span>Shift Timings:</span>
                </span>
                <span className="font-bold text-white font-mono text-xs">
                  {d.start} - {d.end}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium flex items-center gap-1.5">
                  <HiCalendarDays className="text-indigo-400 text-sm" />
                  <span>Available Days:</span>
                </span>
                <span className="font-semibold text-slate-200">
                  {d.days.map((dayIndex) => DAY_NAMES[dayIndex].slice(0, 3)).join(', ')}
                </span>
              </div>
            </div>

            <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 text-xs text-slate-300 flex items-start gap-2.5">
              <HiSparkles className="text-teal-400 text-base shrink-0 mt-0.5 animate-pulse" />
              <span>
                <strong className="text-teal-300">AI Scheduling Logic:</strong> When a patient requests an appointment for{' '}
                <em>{d.specialization}</em>, the AI receptionist verifies {d.name}'s shift roster and reserves available slots.
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
