import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
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
  HiAcademicCap,
  HiBuildingOffice2,
  HiCheckBadge,
  HiAdjustmentsHorizontal,
} from 'react-icons/hi2';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stats, recentAppointments, isLoading, updateStatus } = useDashboardQuery();

  if (isLoading) {
    return <LoadingSpinner message="Loading Role-Tailored Dashboard Telemetry…" />;
  }

  const handleStatusChange = (id: string, newStatus: Status) => {
    updateStatus(id, newStatus);
  };

  const role = user?.role ?? 'admin';
  const isDentist = role === 'dentist';
  const isAdmin = role === 'admin';
  const isReceptionist = role === 'receptionist';
  const isPatient = role === 'patient';

  // Dentist-specific filtered appointments (or mock matching for Dr. Mark Rivera / Dr. Sarah Jenkins / Dr. Priya Patel)
  const dentistAppointments = isDentist
    ? recentAppointments.filter(
      (a) =>
        !a.dentistName ||
        a.dentistName.toLowerCase().includes(user?.name.split(' ')[0].toLowerCase() || '') ||
        a.dentistName.toLowerCase().includes('rivera') ||
        a.dentistName.toLowerCase().includes('patel') ||
        a.dentistName.toLowerCase().includes('jenkins')
    )
    : recentAppointments;

  return (
    <div className="max-w-7xl mx-auto w-full p-6 md:p-10 flex flex-col gap-8 font-sans text-slate-800 animate-fade-in">
      {/* Dynamic Role Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/5 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-md shrink-0 ${isDentist
                ? 'bg-sky-500/15 text-sky-600 border border-sky-200'
                : isAdmin
                  ? 'bg-indigo-500/15 text-indigo-600 border border-indigo-200'
                  : isReceptionist
                    ? 'bg-teal-500/15 text-teal-600 border border-teal-200'
                    : 'bg-amber-500/15 text-amber-600 border border-amber-200'
              }`}
          >
            {isDentist ? '👨‍⚕️' : isAdmin ? '👑' : isReceptionist ? '👩‍💼' : '👤'}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
                {isDentist
                  ? `Dentist Clinical Workspace`
                  : isAdmin
                    ? `Clinic Administrator Dashboard`
                    : isReceptionist
                      ? `Front Desk Receptionist Hub`
                      : `Patient Care Portal`}
              </h1>
              <span
                className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${isDentist
                    ? 'bg-sky-50 text-sky-700 border-sky-200'
                    : isAdmin
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      : isReceptionist
                        ? 'bg-teal-50 text-teal-700 border-teal-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
              >
                {role} Mode
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-500 mt-1 font-medium">
              Welcome back, <strong className="text-slate-900">{user?.name ?? 'User'}</strong>!{' '}
              {isDentist
                ? 'View your assigned patient procedures, clinical schedule, and treatment status.'
                : isAdmin
                  ? 'Full clinic administration, staff roster management, telemetry & AI RAG controls.'
                  : isReceptionist
                    ? 'Manage real-time front-desk check-ins, AI voice call logs, and instant bookings.'
                    : 'Review your upcoming dental appointments and interact with our 24/7 AI Receptionist.'}
            </p>
          </div>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center gap-3 relative z-10">
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
            <span>{isDentist ? 'Schedule Visit' : 'Book Appointment'}</span>
          </button>
        </div>
      </div>

      {/* Role-Specific Metric Cards */}
      {isDentist ? (
        /* DENTIST DASHBOARD KPI METRICS */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                My Assigned Appointments
              </span>
              <span className="text-3xl font-extrabold text-slate-900 mt-1 font-heading">
                {dentistAppointments.length}
              </span>
              <span className="text-[11px] text-sky-600 font-semibold mt-1 flex items-center gap-1">
                <HiCheckCircle />
                <span>Today's Doctor Roster</span>
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center text-2xl font-extrabold">
              👨‍⚕️
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                Upcoming Procedures
              </span>
              <span className="text-3xl font-extrabold text-slate-900 mt-1 font-heading">
                {dentistAppointments.filter((a) => a.status === 'booked').length}
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <HiClock />
                <span>Confining Shift Hours</span>
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center text-2xl font-extrabold">
              📅
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                Completed Treatments
              </span>
              <span className="text-3xl font-extrabold text-slate-900 mt-1 font-heading">
                {dentistAppointments.filter((a) => a.status === 'completed').length}
              </span>
              <span className="text-[11px] text-teal-600 font-semibold mt-1 flex items-center gap-1">
                <HiCheckBadge />
                <span>Successful Care Visits</span>
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center text-2xl font-extrabold">
              ✔️
            </div>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                Dentist Rating
              </span>
              <span className="text-3xl font-extrabold text-slate-900 mt-1 font-heading">
                4.9 ★
              </span>
              <span className="text-[11px] text-amber-600 font-semibold mt-1 flex items-center gap-1">
                <HiSparkles />
                <span>Verified Patient Reviews</span>
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center text-2xl font-extrabold">
              ⭐
            </div>
          </div>
        </div>
      ) : (
        /* ADMIN & GENERAL DASHBOARD KPI METRICS */
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
                <span>{stats?.bookedAppointments ?? 0} Booked & Active</span>
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
                AI Voice & Web Logs
              </span>
              <span className="text-3xl font-extrabold text-slate-900 mt-1 font-heading">
                {stats?.totalConversations ?? 0}
              </span>
              <span className="text-[11px] text-sky-600 font-semibold mt-1 flex items-center gap-1">
                <HiSparkles />
                <span>Gemini Engine Active</span>
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
      )}

      {/* Main Appointments Table & Role Quick Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Appointments List for Current Role */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
              <span>{isDentist ? 'My Assigned Patient Schedule' : 'Recent Clinic Appointments'}</span>
              <span className="text-xs bg-slate-100 text-slate-600 font-semibold px-2 py-0.5 rounded-full border">
                {dentistAppointments.length} Items
              </span>
            </h2>
            <button
              onClick={() => navigate('/appointments')}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
            >
              <span>Manage All</span>
              <HiArrowRight />
            </button>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {dentistAppointments.map((a) => (
              <div key={a.id} className="py-3.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${isDentist
                        ? 'bg-sky-50 text-sky-700 border border-sky-100'
                        : 'bg-teal-50 text-teal-700 border border-teal-100'
                      }`}
                  >
                    {a.patientName.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm text-slate-900">{a.patientName}</span>
                    <span className="text-xs text-slate-500">
                      {a.serviceName ?? 'Procedure'} • {a.date} ({a.start})
                    </span>
                    {a.dentistName && (
                      <span className="text-[11px] text-teal-600 font-medium mt-0.5">
                        Assigned: {a.dentistName}
                      </span>
                    )}
                  </div>
                </div>

                <select
                  value={a.status}
                  onChange={(e) => handleStatusChange(a.id, e.target.value as Status)}
                  className={`text-xs font-bold px-3 py-1 rounded-full border cursor-pointer ${a.status === 'booked'
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

            {dentistAppointments.length === 0 && (
              <div className="py-8 text-center text-xs text-slate-400">
                No appointments currently assigned to your roster.
              </div>
            )}
          </div>
        </div>

        {/* Role Quick Tools Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-md flex flex-col justify-between">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <HiSparkles className="text-teal-400 text-xl" />
              <h3 className="font-extrabold text-lg font-heading">
                {isDentist
                  ? 'Dentist Clinical Actions'
                  : isAdmin
                    ? 'Admin Operations Controls'
                    : 'Front Desk Quick Tools'}
              </h3>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isDentist
                ? 'Review procedure rates catalog, check patient medical history, or consult AI receptionist triage.'
                : 'Manage dentist shift roster, edit procedure pricing, audit AI phone transcripts, or upload medical knowledge docs.'}
            </p>

            <div className="flex flex-col gap-2.5 pt-2">
              <button
                onClick={() => navigate('/clinic-settings')}
                className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-between transition cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <HiBuildingOffice2 className="text-teal-400" />
                  <span>Registered Clinic Profile & Setup</span>
                </span>
                <HiArrowRight />
              </button>

              <button
                onClick={() => navigate('/dentists')}
                className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-between transition cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <HiUserGroup className="text-teal-400" />
                  <span>Dentist Shift Roster</span>
                </span>
                <HiArrowRight />
              </button>

              <button
                onClick={() => navigate('/services')}
                className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-between transition cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <HiBookmarkSquare className="text-teal-400" />
                  <span>Procedure Rates Catalog</span>
                </span>
                <HiArrowRight />
              </button>

              <button
                onClick={() => navigate('/patients')}
                className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-between transition cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <HiUsers className="text-indigo-400" />
                  <span>Patient Medical Records</span>
                </span>
                <HiArrowRight />
              </button>

              {isAdmin && (
                <button
                  onClick={() => navigate('/knowledge')}
                  className="w-full text-left p-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-between transition cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <HiBookOpen className="text-amber-400" />
                    <span>RAG Knowledge Index</span>
                  </span>
                  <HiArrowRight />
                </button>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <HiShieldCheck className="text-teal-400 text-base" />
              <span>Role-Based Access Control</span>
            </span>
            <span className="font-mono text-[10px] text-slate-500 uppercase">{role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
