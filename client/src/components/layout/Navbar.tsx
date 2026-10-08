import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import Logo from '../common/Logo';
import {
  HiHome,
  HiBuildingOffice2,
  HiSparkles,
  HiBookmarkSquare,
  HiInformationCircle,
  HiPhone,
  HiChartBarSquare,
  HiArrowRightOnRectangle,
  HiBars3,
  HiXMark,
  HiLockClosed,
} from 'react-icons/hi2';

export default function Navbar() {
  const { user, health, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { to: '/', label: 'Home', icon: HiHome, end: true },
    { to: '/register-clinic', label: 'Register Clinic', icon: HiBuildingOffice2, highlight: true },
    { to: '/pricing', label: 'Pricing & Plans', icon: HiSparkles },
    { to: '/services', label: 'Services & Capabilities', icon: HiBookmarkSquare },
    { to: '/about', label: 'About Platform', icon: HiInformationCircle },
    { to: '/contact', label: 'Contact Sales', icon: HiPhone },
  ];

  return (
    <header className="sticky top-0 z-50 glass-dark-nav text-slate-100 shadow-2xl select-none transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo Component */}
        <NavLink to="/" className="shrink-0">
          <Logo variant="full" size="md" subtitle={health?.clinic ? `${health.clinic} Suite` : undefined} />
        </NavLink>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 ${isActive
                    ? item.highlight
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-600 text-slate-950 shadow-lg shadow-teal-500/20 font-bold'
                      : 'bg-slate-800/90 text-teal-300 border border-teal-500/40 shadow-sm font-semibold'
                    : item.highlight
                      ? 'text-teal-300 bg-teal-500/10 hover:bg-teal-500/20 border border-teal-500/30 font-medium hover:scale-[1.02]'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70 font-medium'
                  }`
                }
              >
                <Icon className="text-sm shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right Action Buttons */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          <button
            onClick={() => navigate('/register-clinic')}
            className="btn-shimmer px-3.5 py-2 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-600 text-slate-950 font-bold text-xs shadow-md transition-all duration-300 flex items-center gap-1.5 cursor-pointer hover:scale-[1.02]"
          >
            <HiBuildingOffice2 className="text-sm" />
            <span>Register Clinic</span>
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="btn-shimmer px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-600 hover:from-indigo-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
              >
                <HiChartBarSquare className="text-base text-indigo-200" />
                <span>Clinic Portal</span>
              </button>

              <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-xl">
                <div className="w-6 h-6 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xs font-heading">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs font-medium text-slate-200 max-w-[100px] truncate">
                  {user.name}
                </span>
                <button
                  onClick={() => logout()}
                  className="text-slate-400 hover:text-rose-400 p-1 transition cursor-pointer"
                  title="Sign out"
                >
                  <HiArrowRightOnRectangle className="text-sm" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
            >
              <HiLockClosed className="text-sm text-indigo-400" />
              <span>Portal Sign In</span>
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <HiXMark className="text-2xl" /> : <HiBars3 className="text-2xl" />}
        </button>
      </div>

      {/* Mobile Drawer Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0a0e1a]/98 border-b border-slate-800 px-4 pt-3 pb-6 flex flex-col gap-2 animate-fade-in">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-xl text-xs font-semibold transition-all flex items-center gap-3 ${isActive
                    ? 'bg-slate-800 text-teal-300 border border-teal-500/40 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70 font-normal'
                  }`
                }
              >
                <Icon className="text-base" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2 mt-2">
            <button
              onClick={() => {
                setMobileOpen(false);
                navigate('/register-clinic');
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md"
            >
              <HiBuildingOffice2 className="text-base" />
              <span>Register Your Clinic Now</span>
            </button>

            {user ? (
              <>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    navigate('/dashboard');
                  }}
                  className="w-full py-3 rounded-xl bg-indigo-600 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg"
                >
                  <HiChartBarSquare className="text-base" />
                  <span>Open Clinic Portal</span>
                </button>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="w-full py-2.5 rounded-xl bg-slate-800 text-rose-300 text-xs font-medium flex items-center justify-center gap-2"
                >
                  <HiArrowRightOnRectangle className="text-base" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate('/login');
                }}
                className="w-full py-3 rounded-xl bg-slate-800 text-white font-semibold text-xs flex items-center justify-center gap-2 border border-slate-700"
              >
                <HiLockClosed className="text-base text-indigo-400" />
                <span>Sign In to Portal</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
