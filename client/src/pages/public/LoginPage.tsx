import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../app/AuthProvider';
import { UserRole } from '../../config/permissions';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useUIStore } from '../../store/useUIStore';
import { Lock, Mail, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get('next') || '/app';

  const { login } = useAuth();
  const { addToast } = useUIStore();

  const [email, setEmail] = useState('krina@smilecare.ai');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    await login(email, 'OWNER');
    setIsLoading(false);
    addToast({ type: 'success', title: 'Welcome back!', message: 'Signed in successfully.' });
    navigate(next);
  };

  const handleRoleQuickLogin = async (role: UserRole, demoEmail: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 300));
    await login(demoEmail, role);
    setIsLoading(false);
    addToast({ type: 'info', title: `Logged in as ${role}`, message: `Testing role permissions for ${role}.` });
    if (role === 'SUPER_ADMIN') navigate('/admin');
    else navigate('/app');
  };

  return (
    <div className="min-h-screen theme-dark bg-[#050811] text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow blobs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-teal-500 text-slate-950 font-bold flex items-center justify-center text-lg">
              S
            </div>
            <span className="text-xl font-bold text-white">SmileCare AI</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Sign in to your Clinic</h1>
          <p className="text-xs text-slate-400">Enter your credentials or click a role shortcut below.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-300 uppercase">Password</span>
              <Link to="/forgot-password" className="text-teal-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" isLoading={isLoading} className="w-full justify-center text-sm py-3" icon={ArrowRight}>
            Sign In to Dashboard
          </Button>
        </form>

        {/* DEMO FAST ROLE SWITCHING SHORTCUTS */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            ⚡ Quick Demo Logins (Click to Test):
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleRoleQuickLogin('OWNER', 'krina@smilecare.ai')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-teal-300 text-left cursor-pointer transition-colors"
            >
              👑 Owner (Krina)
            </button>
            <button
              onClick={() => handleRoleQuickLogin('ADMIN', 'admin@smilecare.ai')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-sky-300 text-left cursor-pointer transition-colors"
            >
              💼 Clinic Admin
            </button>
            <button
              onClick={() => handleRoleQuickLogin('RECEPTIONIST', 'reception@smilecare.ai')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-300 text-left cursor-pointer transition-colors"
            >
              📞 Receptionist
            </button>
            <button
              onClick={() => handleRoleQuickLogin('DENTIST', 'dentist@smilecare.ai')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-purple-300 text-left cursor-pointer transition-colors"
            >
              🦷 Dentist
            </button>
            <button
              onClick={() => handleRoleQuickLogin('SUPER_ADMIN', 'platform@smilecare.ai')}
              className="col-span-2 px-2.5 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/60 border border-rose-800/60 text-xs font-semibold text-rose-300 text-center cursor-pointer transition-colors"
            >
              🚀 Super Admin Platform
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          Don't have a clinic account?{' '}
          <Link to="/register" className="text-teal-400 font-bold hover:underline">
            Register Clinic Wizard
          </Link>
        </p>
      </div>
    </div>
  );
};
