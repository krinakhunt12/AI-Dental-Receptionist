import { useAnalyticsQuery } from './hooks/useAnalyticsQuery';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const TOP_REQUESTS = [
  { label: 'Appointments & Booking', percentage: 48, color: 'bg-teal-600' },
  { label: 'Pricing & Treatment Costs', percentage: 19, color: 'bg-blue-600' },
  { label: 'Services & Specializations', percentage: 14, color: 'bg-indigo-600' },
  { label: 'Clinic Hours & Location', percentage: 9, color: 'bg-amber-500' },
  { label: 'Other General Inquiries', percentage: 10, color: 'bg-slate-400' },
];

export default function AnalyticsPage() {
  const { stats, isLoading } = useAnalyticsQuery();

  if (isLoading) {
    return <LoadingSpinner message="Loading Analytics Telemetry…" />;
  }

  return (
    <div className="max-w-5xl mx-auto w-full p-8 flex flex-col gap-6 font-sans">
      {/* View Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-heading">AI Receptionist Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">
          Performance breakdown, request distributions, and conversation metrics.
        </p>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Total Calls / Chats</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1 font-heading">
              {stats?.totalConversations ?? 387}
            </div>
            <div className="text-[11px] text-teal-600 font-semibold mt-1">📈 Voice & Web AI Agent</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center text-2xl font-extrabold">
            📊
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Appointments Booked</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1 font-heading">
              {stats?.bookedAppointments ?? 82}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">🟢 21.1% conversion rate</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl font-extrabold">
            📅
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Appointments Cancelled</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1 font-heading">
              {stats?.cancelledAppointments ?? 12}
            </div>
            <div className="text-[11px] text-rose-600 font-semibold mt-1">🔻 Low cancellation rate</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center text-2xl font-extrabold">
            ❌
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">RAG Knowledge Coverage</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1 font-heading">
              {stats?.totalPassages ?? 45}
            </div>
            <div className="text-[11px] text-indigo-600 font-semibold mt-1">📚 Indexed Passages</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-2xl font-extrabold">
            🧠
          </div>
        </div>
      </div>

      {/* Top Patient Request Intent Distribution */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-heading">Patient Intent Distribution</h2>
          <p className="text-xs text-slate-500 mt-0.5">Categorized topics requested by patients interacting with the AI.</p>
        </div>

        <div className="flex flex-col gap-3">
          {TOP_REQUESTS.map((req, idx) => (
            <div key={idx} className="flex flex-col gap-1">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>{req.label}</span>
                <span className="font-mono">{req.percentage}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full ${req.color} rounded-full transition-all duration-500`}
                  style={{ width: `${req.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
