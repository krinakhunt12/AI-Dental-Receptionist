import { NavLink } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import Logo from '../common/Logo';
import {
  HiGlobeAlt,
  HiChartBarSquare,
  HiBuildingOffice2,
  HiUserGroup,
  HiUsers,
  HiDocumentText,
  HiBookOpen,
  HiPresentationChartLine,
  HiSparkles,
  HiInformationCircle,
  HiPhone,
  HiArrowRightOnRectangle,
  HiBookmarkSquare,
} from 'react-icons/hi2';

export default function Sidebar() {
  const { user, health, offline, logout } = useAuth();

  const roleColors: Record<string, string> = {
    admin: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    receptionist: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
    dentist: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    patient: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  };

  const roleLabels: Record<string, string> = {
    admin: 'Clinic Admin',
    receptionist: 'Lead Receptionist',
    dentist: 'Dentist',
    patient: 'Patient',
  };

  const portalNavItems = [
    { to: '/dashboard', label: 'Portal Dashboard', icon: HiChartBarSquare },
    { to: '/clinic-settings', label: 'Registered Clinic Setup', icon: HiBuildingOffice2 },
    { to: '/dentists', label: 'Dentists Roster', icon: HiUserGroup },
    { to: '/patients', label: 'Patient Directory', icon: HiUsers },
    { to: '/conversations', label: 'AI Call & Chat Logs', icon: HiDocumentText },
    { to: '/knowledge', label: 'RAG Knowledge Index', icon: HiBookOpen },
    { to: '/analytics', label: 'Analytics & Telemetry', icon: HiPresentationChartLine },
  ];

  const websiteNavItems = [
    { to: '/', label: 'SaaS Platform Home', icon: HiGlobeAlt, end: true },
    { to: '/register-clinic', label: 'Register Clinic Tool', icon: HiBuildingOffice2, highlight: true },
    { to: '/pricing', label: 'Pricing & Premium Plans', icon: HiSparkles },
    { to: '/services', label: 'Capabilities Catalog', icon: HiBookmarkSquare },
    { to: '/about', label: 'About Platform', icon: HiInformationCircle },
    { to: '/contact', label: 'Contact Sales', icon: HiPhone },
  ];

  return (
    <aside className="bg-[#090d1a] text-slate-300 p-4 flex flex-col gap-4 border-r border-slate-800/90 select-none overflow-y-auto h-full">
      {/* Brand Header */}
      <NavLink to="/" className="px-1 py-1">
        <Logo variant="full" size="md" subtitle="AI Dental SaaS Suite" />
      </NavLink>

      {/* User Persona Badge */}
      {user && (
        <div className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700/60 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center font-bold text-sm shrink-0 font-heading">
              {user.name.charAt(0)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-slate-200 truncate">{user.name}</span>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border w-fit capitalize mt-0.5 ${roleColors[user.role] || 'bg-slate-700 text-slate-300'
                  }`}
              >
                {roleLabels[user.role] ?? user.role}
              </span>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 rounded-xl transition cursor-pointer"
            title="Sign out"
          >
            <HiArrowRightOnRectangle className="text-lg" />
          </button>
        </div>
      )}

      {/* Navigation Sections */}
      <nav className="flex flex-col gap-4 flex-1">
        {/* Portal Operations Group */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest px-3 mb-1 font-heading">
            Clinic Staff Portal
          </span>
          {portalNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all ${isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-900/40 font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`
                }
              >
                <Icon className="text-lg shrink-0 text-indigo-400" />
                <span className="truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer System Status */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
        <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <span
              className={`w-2 h-2 rounded-full ${offline ? 'bg-rose-500' : 'bg-emerald-500 animate-pulse'
                }`}
            />
            <span>{offline ? 'Backend Offline' : 'AI Engine Live'}</span>
          </span>
          <span className="font-mono text-[10px] text-slate-500 uppercase">
            {health?.llm ?? 'Gemini AI'}
          </span>
        </div>
      </div>
    </aside>
  );
}
