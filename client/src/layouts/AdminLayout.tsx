import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Users, CreditCard, Activity, ArrowLeft, LogOut } from 'lucide-react';
import { useAuth } from '../app/AuthProvider';
import { ToastContainer } from '../components/ui/Toast';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { label: 'Platform Overview', path: '/admin', icon: Activity },
    { label: 'Clinics & Tenants', path: '/admin/tenants', icon: Users },
    { label: 'Plans & Coupons', path: '/admin/plans', icon: CreditCard },
    { label: 'System Health', path: '/admin/health', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen theme-dark bg-slate-950 text-white font-sans flex flex-col">
      <ToastContainer />

      {/* SUPER ADMIN PERSISTENT WARNING BAR */}
      <div className="bg-rose-950 border-b border-rose-800 text-rose-200 text-xs px-4 py-2 flex items-center justify-between font-mono font-bold z-50">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>SUPER ADMIN PLATFORM CONSOLE — Logged in as {user?.email}</span>
        </div>
        <button
          onClick={() => navigate('/app')}
          className="text-xs text-rose-300 hover:text-white flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Clinic App
        </button>
      </div>

      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-600 font-bold flex items-center justify-center">
                SA
              </div>
              <span className="font-bold text-sm text-white">SmileCare Admin</span>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isActive ? 'bg-rose-900/40 text-rose-300 border border-rose-800' : 'text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white"
          >
            <LogOut className="w-4 h-4" /> Exit Admin
          </button>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
