import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import Logo from '../common/Logo';
import { HiBars3, HiXMark, HiArrowRight } from 'react-icons/hi2';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Exactly 5 navigation links as requested
  const navItems = [
    { to: '/', label: 'Product', end: true },
    { to: '/pricing', label: 'Pricing' },
    { to: '/services', label: 'Capabilities' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#050811]/85 backdrop-blur-md border-b border-white/10 transition-colors duration-200 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <NavLink
          to="/"
          className="shrink-0 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none rounded-lg"
          aria-label="SmileCare AI Home"
        >
          <Logo variant="full" size="md" subtitle="AI Receptionist" />
        </NavLink>

        {/* Desktop 5 Navigation Links (Single line, no wrap) */}
        <nav
          className="hidden lg:flex items-center gap-1"
          aria-label="Main Navigation"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `px-3.5 py-2 text-sm font-medium transition-all rounded-lg cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none ${
                  isActive
                    ? 'text-teal-400 font-semibold border-b-2 border-teal-400 rounded-b-none bg-teal-500/5'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Right Actions: Text Link "Sign in" + Primary Button "Register your clinic" */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 px-3 py-2 rounded-lg transition cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
              >
                Clinic Portal
              </button>
              <button
                onClick={() => logout()}
                className="text-xs text-slate-400 hover:text-rose-400 transition cursor-pointer"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 px-3.5 py-2 rounded-lg transition cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
            >
              Sign in
            </button>
          )}

          <button
            onClick={() => navigate('/register-clinic')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 active:scale-[0.98] text-slate-950 font-semibold text-sm shadow-[0_4px_20px_-4px_rgba(45,212,191,0.35)] transition-all duration-200 flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
          >
            <span>Register your clinic</span>
            <HiArrowRight className="text-sm" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
          aria-label={mobileOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
        >
          {mobileOpen ? <HiXMark className="text-2xl" /> : <HiBars3 className="text-2xl" />}
        </button>
      </div>

      {/* Mobile Drawer Dropdown (<1024px) */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#050811]/98 border-b border-white/10 px-4 pt-3 pb-6 flex flex-col gap-2 animate-fade-in">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-between ${
                  isActive
                    ? 'bg-teal-500/10 text-teal-400 font-semibold border-l-2 border-teal-400'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <span>{item.label}</span>
            </NavLink>
          ))}

          <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-2.5">
            {user ? (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate('/dashboard');
                }}
                className="w-full py-2.5 rounded-lg bg-slate-800 text-slate-200 text-sm font-medium flex items-center justify-center gap-2"
              >
                Go to Clinic Portal
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate('/login');
                }}
                className="w-full py-2.5 rounded-lg text-slate-300 hover:bg-white/5 text-sm font-medium flex items-center justify-center border border-white/10"
              >
                Sign in
              </button>
            )}

            <button
              onClick={() => {
                setMobileOpen(false);
                navigate('/register-clinic');
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-semibold text-sm flex items-center justify-center gap-2 shadow-md active:scale-[0.98]"
            >
              <span>Register your clinic</span>
              <HiArrowRight className="text-sm" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
