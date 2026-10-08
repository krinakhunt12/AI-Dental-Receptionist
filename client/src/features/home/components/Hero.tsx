import { useNavigate } from 'react-router-dom';
import { HiArrowRight, HiBuildingOffice2, HiCheckCircle } from 'react-icons/hi2';
import StatsStrip from './StatsStrip';
import ChatDemoCard from './ChatDemoCard';

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full bg-[#050811] text-slate-100 overflow-hidden pt-8 sm:pt-12 lg:pt-16 pb-16 lg:pb-24">
      {/* Background Subtle Gradient Mesh & Faint Grid */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(13,148,136,0.15),rgba(255,255,255,0))]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* HERO LEFT COLUMN (Span 7) */}
          <div className="lg:col-span-7 flex flex-col gap-6 animate-fade-in motion-reduce:animate-none">
            {/* Social-Proof Pill */}
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 w-fit shadow-sm">
              <HiBuildingOffice2 className="text-teal-400 text-sm" />
              <span>Trusted by 250+ dental clinics</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-white tracking-[-0.02em] leading-[1.1] font-heading">
              Never miss a patient call again.{' '}
              <span className="bg-gradient-to-r from-teal-400 via-emerald-400 to-teal-300 bg-clip-text text-transparent block mt-1">
                24/7 AI Receptionist
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-slate-300 text-base sm:text-lg leading-[1.6] max-w-[560px] font-normal tracking-normal">
              Book appointments, answer patient questions and route emergencies automatically, directly into your clinic calendar.
            </p>

            {/* Primary & Secondary CTA Hierarchy */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => navigate('/register-clinic')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 active:scale-[0.98] text-slate-950 font-bold text-sm shadow-[0_4px_20px_-4px_rgba(45,212,191,0.35)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
              >
                <span>Register your clinic</span>
                <HiArrowRight className="text-base" />
              </button>

              <button
                onClick={() => navigate('/pricing')}
                className="px-6 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 active:scale-[0.98] text-slate-200 font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
              >
                <span>View pricing</span>
              </button>
            </div>

            {/* Trust Row */}
            <div className="flex items-center gap-2 text-xs text-slate-400 font-normal pt-1">
              <HiCheckCircle className="text-teal-400 text-sm shrink-0" />
              <span>No setup fee · Live in 24 hours · Cancel anytime</span>
            </div>

            {/* Stats Strip */}
            <StatsStrip />
          </div>

          {/* HERO RIGHT COLUMN (Span 5 - Vertically Centered Chat Demo Card) */}
          <div className="lg:col-span-5 flex items-center justify-center animate-fade-in motion-reduce:animate-none">
            <ChatDemoCard />
          </div>
        </div>
      </div>
    </section>
  );
}
