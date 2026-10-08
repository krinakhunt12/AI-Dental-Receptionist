import { useNavigate } from 'react-router-dom';
import { useDashboardQuery } from './hooks/useDashboardQuery';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { type Status } from '../../api';
import {
  HiChartBarSquare,
  HiCalendarDays,
  HiUsers,
  HiChatBubbleLeftRight,
  HiBookmarkSquare,
  HiBookOpen,
  HiArrowRight,
  HiCheckCircle,
  HiClock,
  HiXCircle,
  HiUserGroup,
  HiSparkles,
  HiDocumentText,
  HiShieldCheck,
  HiCurrencyRupee,
} from 'react-icons/hi2';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { stats, recentAppointments, isLoading, updateStatus } = useDashboardQuery();

  if (isLoading) {
    return <LoadingSpinner message="Loading Dashboard Telemetry…" />;
  }

  const handleStatusChange = (id: string, newStatus: Status) => {
    updateStatus(id, newStatus);
  };

  return (
    <div className="max-w-7xl mx-auto w-full p-6 md:p-10 flex flex-col gap-8 font-sans text-slate-800">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <HiChartBarSquare className="text-teal-600 text-2xl" />
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              Clinic & Admin Dashboard
            </h1>
          </div>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Real-time operations telemetry, AI receptionist performance, and appointment status manager.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/chat')}
          >
            <HiChatBubbleLeftRight className="text-teal-400 text-base" />
            <span>Launch Patient AI</span>
          </button>

          <button
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/appointments')}
          >
            <HiCalendarDays className="text-base" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              Total Appointments
            </span>
            <span className="text-3xl font-extrabold text-slate-900 mt-1 font-heading">
              {stats?.totalAppointments ?? 0}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
              <HiCheckCircle />
              <span>{stats?.bookedAppointments ?? 0} Booked & Upcoming</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center text-2xl font-extrabold">
            <HiCalendarDays />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              Registered Patients
            </span>
            <span className="text-3xl font-extrabold text-slate-900 mt-1 font-heading">
              {stats?.totalPatients ?? 0}
            </span>
            <span className="text-[11px] text-teal-600 font-semibold mt-1 flex items-center gap-1">
              <HiUsers />
              <span>Active Clinic Profiles</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center text-2xl font-extrabold">
            <HiUsers />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              AI Conversations
            </span>
            <span className="text-3xl font-extrabold text-slate-900 mt-1 font-heading">
              {stats?.totalConversations ?? 0}
            </span>
            <span className="text-[11px] text-sky-600 font-semibold mt-1 flex items-center gap-1">
              <HiSparkles />
              <span>Voice & Web AI Agent</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center text-2xl font-extrabold">
            <HiChatBubbleLeftRight />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              Knowledge Documents
            </span>
            <span className="text-3xl font-extrabold text-slate-900 mt-1 font-heading">
              {stats?.totalDocuments ?? 0}
            </span>
            <span className="text-[11px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
              <HiBookOpen />
              <span>{stats?.totalPassages ?? 0} Indexed Passages</span>
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center text-2xl font-extrabold">
            <HiDocumentText />
          </div>
        </div>
      </div>

      {/* Recent Appointments & Quick Actions Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Appointments List */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 font-heading">Recent Appointments</h2>
            <button
              onClick={() => navigate('/appointments')}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View All</span>
              <HiArrowRight />
            </button>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {recentAppointments.map((a) => (
              <div key={a.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm shrink-0">
                    {a.patientName.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-slate-900">{a.patientName}</span>
                    <span className="text-xs text-slate-500">
                      {a.serviceName ?? 'Procedure'} • {a.date} ({a.start})
                    </span>
                  </div>
                </div>

                <select
                  value={a.status}
                  onChange={(e) => handleStatusChange(a.id, e.target.value as Status)}
                  className={`text-xs font-bold px-3 py-1 rounded-full border cursor-pointer ${
                    a.status === 'booked'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : a.status === 'completed'
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-rose-50 text-rose-800 border-rose-200'
                  }`}
                >
                  <option value="booked">Booked</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no_show">No-Show</option>
                </select>
              </div>
            ))}
            {recentAppointments.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400">
                No appointments booked yet.
              </div>
            )}
          </div>
        </div>

        {/* Quick Links Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <HiSparkles className="text-teal-400 text-xl" />
              <h3 className="font-extrabold text-lg font-heading">AI Receptionist Quick Tools</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Test patient speech recognition, manage RAG knowledge docs, or check doctor working hours.
            </p>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={() => navigate('/dentists')}
                className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-between transition"
              >
                <span className="flex items-center gap-2">
                  <HiUserGroup className="text-teal-400" />
                  <span>Dentist Working Hours</span>
                </span>
                <HiArrowRight />
              </button>

              <button
                onClick={() => navigate('/services')}
                className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-between transition"
              >
                <span className="flex items-center gap-2">
                  <HiBookmarkSquare className="text-teal-400" />
                  <span>Treatment Pricing List</span>
                </span>
                <HiArrowRight />
              </button>

              <button
                onClick={() => navigate('/conversations')}
                className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-between transition"
              >
                <span className="flex items-center gap-2">
                  <HiDocumentText className="text-teal-400" />
                  <span>AI Patient Call Summaries</span>
                </span>
                <HiArrowRight />
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <HiShieldCheck className="text-teal-400 text-base" />
            <span>HIPAA Compliant Data Handling</span>
          </div>
        </div>
      </div>
    </div>
  );
}
