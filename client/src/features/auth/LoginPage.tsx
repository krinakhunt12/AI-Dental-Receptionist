import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { type UserRole } from '../../api';
import Logo from '../../components/common/Logo';

export default function LoginPage() {
  const { login, register, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('receptionist');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  if (user) {
    navigate(from, { replace: true });
  }

  const DEMO_ACCOUNTS = [
    {
      title: 'Lead Receptionist',
      name: 'Krina Khunt',
      email: 'receptionist@smilecare.com',
      password: 'reception123',
      role: 'receptionist',
      badge: 'bg-teal-500/10 text-teal-700 border-teal-200',
      icon: '👩‍💼',
    },
    {
      title: 'Clinic Admin',
      name: 'Dr. Sarah Jenkins',
      email: 'admin@smilecare.com',
      password: 'admin123',
      role: 'admin',
      badge: 'bg-indigo-500/10 text-indigo-700 border-indigo-200',
      icon: '👑',
    },
    {
      title: 'Senior Dentist',
      name: 'Dr. Mark Rivera',
      email: 'dentist@smilecare.com',
      password: 'dentist123',
      role: 'dentist',
      badge: 'bg-sky-500/10 text-sky-700 border-sky-200',
      icon: '👨‍⚕️',
    },
    {
      title: 'Patient Account',
      name: 'Ananya Sharma',
      email: 'patient@smilecare.com',
      password: 'patient123',
      role: 'patient',
      badge: 'bg-amber-500/10 text-amber-700 border-amber-200',
      icon: '👤',
    },
  ];

  const handleQuickLogin = async (accEmail: string, accPass: string) => {
    setError(null);
    setLoading(true);
    try {
      await login(accEmail, accPass);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register({ name, email, password, role, phone });
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-[#050811] flex items-center justify-center p-4 font-sans text-slate-100 relative overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[130px] pointer-events-none animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[130px] pointer-events-none animate-float-reverse" />

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-[#0a0f1d]/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative z-10 backdrop-blur-xl">
        {/* Left Side: Brand & Quick Demo Logins */}
        <div className="bg-slate-950/80 p-6 md:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800/80">
          <div>
            <div className="mb-6">
              <Logo variant="full" size="lg" subtitle="Multi-Role Access Suite" />
            </div>

            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Select a pre-configured demo persona to immediately test role-based access, appointment scheduling, and patient AI receptionist controls.
            </p>

            <div className="flex flex-col gap-2.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                ⚡ One-Click Quick Logins
              </span>
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickLogin(acc.email, acc.password)}
                  disabled={loading}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 transition text-left cursor-pointer group disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{acc.icon}</span>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-teal-300 transition">
                        {acc.title}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{acc.email}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${acc.badge}`}>
                    Click
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 text-center">
            🔐 Protected by JWT Token Authentication & Role RBAC
          </div>
        </div>

        {/* Right Side: Manual Form */}
        <div className="p-6 md:p-8 flex flex-col justify-center bg-slate-900/60">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-white font-heading">
              {mode === 'login' ? 'Sign In to Portal' : 'Create Account'}
            </h2>
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                type="button"
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  mode === 'login' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
              >
                Login
              </button>
              <button
                type="button"
                className={`px-3 py-1 rounded-lg font-semibold transition ${
                  mode === 'register' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
              >
                Register
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3 rounded-xl text-xs font-semibold flex items-center gap-2" role="alert">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'register' && (
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-3.5 py-2.5 mt-1 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Krina Khunt"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-3.5 py-2.5 mt-1 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition font-mono"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@smilecare.com"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3.5 py-2.5 mt-1 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-teal-500 transition font-mono"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                    Assign Role
                  </label>
                  <select
                    className="w-full px-3.5 py-2.5 mt-1 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 outline-none focus:border-teal-500 cursor-pointer"
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                  >
                    <option value="receptionist">Lead Receptionist</option>
                    <option value="admin">Clinic Admin</option>
                    <option value="dentist">Senior Dentist</option>
                    <option value="patient">Patient</option>
                  </select>
                </div>
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-teal-900/30 transition cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Authenticating…' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
