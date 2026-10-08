import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, ArrowRight, PhoneCall, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const MarketingLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { label: 'Features', path: '/features' },
    { label: 'How It Works', path: '/how-it-works' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'Live AI Demo', path: '/demo' },
    { label: 'FAQ', path: '/faq' },
  ];

  return (
    <div className="min-h-screen theme-dark bg-[#050811] text-slate-100 font-sans flex flex-col relative overflow-x-hidden selection:bg-teal-500 selection:text-slate-950">
      {/* Background Decorative Glow Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-teal-500/15 via-indigo-500/10 to-transparent rounded-full blur-3xl pointer-events-none z-0" />

      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-dark-nav transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 text-slate-950 font-bold flex items-center justify-center text-xl shadow-lg shadow-teal-500/20 group-hover:scale-105 transition-transform">
              S
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white block">
                SmileCare <span className="gradient-text-teal font-extrabold">AI</span>
              </span>
              <span className="text-[10px] text-teal-400 font-semibold tracking-wider block -mt-1">
                24/7 DENTAL RECEPTIONIST
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-semibold transition-colors duration-150 ${isActive ? 'text-teal-400 font-bold' : 'text-slate-300 hover:text-white'
                    }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-300 hover:text-white px-3 py-2 transition-colors"
            >
              Log In
            </Link>
            <Button
              size="md"
              onClick={() => navigate('/register')}
              icon={Sparkles}
              className="bg-gradient-to-r from-teal-400 to-teal-500 text-slate-950 font-bold shadow-lg shadow-teal-500/25 hover:brightness-110"
            >
              Start 14-Day Free Trial
            </Button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 pt-24 pb-16 relative z-10">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-[#03050c] text-slate-400 text-xs py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-500 text-slate-950 font-bold flex items-center justify-center">
                S
              </div>
              <span className="font-bold text-white text-base">SmileCare AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Autonomous AI Receptionist & Booking Platform built exclusively for dental practices and DSO groups.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-3">Product</h4>
            <ul className="space-y-2">
              <li><Link to="/features" className="hover:text-teal-400">AI Chat & Voice</Link></li>
              <li><Link to="/pricing" className="hover:text-teal-400">Pricing & Plans</Link></li>
              <li><Link to="/demo" className="hover:text-teal-400">Interactive Demo</Link></li>
              <li><Link to="/how-it-works" className="hover:text-teal-400">How It Works</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/contact" className="hover:text-teal-400">Book Demo</Link></li>
              <li><Link to="/faq" className="hover:text-teal-400">FAQ</Link></li>
              <li><a href="#" className="hover:text-teal-400">HIPAA Compliance</a></li>
              <li><a href="#" className="hover:text-teal-400">Security & Privacy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-xs tracking-wider mb-3">Contact Support</h4>
            <p className="text-slate-400 leading-relaxed mb-2">
              24/7 Clinic Concierge line & AI emergency escalation.
            </p>
            <p className="text-teal-400 font-bold flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4" /> +1 (800) 555-SMILE
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-slate-500 text-[11px]">
          <p>© 2026 SmileCare AI Platform, Inc. All rights reserved.</p>
          <p>Built with React 18, TypeScript, Tailwind CSS, TanStack Query & MSW.</p>
        </div>
      </footer>
    </div>
  );
};
