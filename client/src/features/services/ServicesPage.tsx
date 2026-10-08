import { useServicesQuery } from './hooks/useServicesQuery';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  HiBookmarkSquare,
  HiClock,
  HiUserGroup,
  HiSparkles,
} from 'react-icons/hi2';

export default function ServicesPage() {
  const { services, isLoading } = useServicesQuery();

  if (isLoading) {
    return <LoadingSpinner message="Loading Services Catalog & Pricing…" />;
  }

  return (
    <div className="max-w-6xl mx-auto w-full p-6 md:p-10 flex flex-col gap-8 font-sans text-slate-100 bg-[#070a12] min-h-screen">
      {/* View Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl flex flex-col gap-3 relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center gap-2">
          <HiBookmarkSquare className="text-teal-400 text-3xl" />
          <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight font-heading">
            Dental Services & Transparent Pricing Catalog
          </h1>
        </div>
        <p className="text-xs md:text-sm text-slate-300 max-w-2xl leading-relaxed">
          Catalog of dental treatments, standard prices in ₹ (INR), slot duration times, and assigned specialist mappings.
        </p>
      </div>

      {/* Services Dark Table Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl animate-fade-in-delayed">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-teal-400">
                <th className="p-4">Service Procedure</th>
                <th className="p-4">Standard Price (INR)</th>
                <th className="p-4">Slot Duration</th>
                <th className="p-4">Assigned Specialist(s)</th>
                <th className="p-4">Pricing Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-xs md:text-sm">
              {services.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/50 transition-colors duration-200">
                  <td className="p-4 font-bold text-white flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center font-bold text-sm shrink-0">
                      <HiBookmarkSquare />
                    </div>
                    <span className="font-heading text-base">{s.name}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-extrabold text-emerald-300 bg-emerald-950/70 border border-emerald-700/80 px-3.5 py-1 rounded-full text-xs inline-flex items-center gap-0.5 font-mono shadow-sm">
                      ₹{s.priceInr.toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 font-medium">
                    <span className="flex items-center gap-1.5">
                      <HiClock className="text-teal-400" />
                      <span>{s.durationMin} min</span>
                    </span>
                  </td>
                  <td className="p-4 text-slate-300 text-xs font-semibold">
                    <span className="flex items-center gap-1.5">
                      <HiUserGroup className="text-indigo-400" />
                      <span>
                        {s.dentistIds
                          .map((id) => (id === 'patel' ? 'Dr. Patel' : id === 'shah' ? 'Dr. Shah' : id))
                          .join(', ')}
                      </span>
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-400 max-w-xs">
                    {s.priceNote || 'Standard fixed clinic procedure rate.'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
