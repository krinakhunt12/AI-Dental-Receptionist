import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import {
  HiSparkles,
  HiChatBubbleLeftRight,
  HiCalendarDays,
  HiBuildingOffice2,
  HiShieldCheck,
  HiBookOpen,
  HiArrowRight,
  HiPhone,
  HiCheckCircle,
  HiClock,
  HiMapPin,
  HiStar,
  HiLockClosed,
  HiPaperAirplane,
  HiCodeBracket,
  HiUserGroup,
} from 'react-icons/hi2';

export default function HomePage() {
  const navigate = useNavigate();
  const [quickQuestion, setQuickQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const QUICK_PROMPTS = [
    'How much does teeth whitening cost at our clinic?',
    'Is Dr. Patel available this Friday for root canal?',
    'How does AI Receptionist handle emergency toothache?',
    'Can AI schedule appointments directly into our calendar?',
  ];

  const handleQuickQuestionSubmit = (qText: string) => {
    setQuickQuestion(qText);
    setAiLoading(true);
    setAiResponse(null);

    setTimeout(() => {
      let reply = 'AI Receptionist handles 24/7 patient queries, appointment bookings, and clinical information.';
      const lower = qText.toLowerCase();
      if (lower.includes('whitening')) {
        reply =
          'Laser Teeth Whitening is configured at ₹4,500. The AI receptionist explains treatment details, verifies dentist schedules, and books patient slots automatically!';
      } else if (lower.includes('patel') || lower.includes('friday') || lower.includes('available')) {
        reply =
          'Dr. Priya Patel is available Mon-Sat from 9:00 AM to 5:00 PM. The AI assistant verifies real-time dentist roster slots before confirming patient appointments.';
      } else if (lower.includes('emergency')) {
        reply =
          'For emergency dental pain or trauma, the AI assistant detects emergency intent and immediately transfers the patient to your clinic emergency escalation line!';
      } else if (lower.includes('calendar') || lower.includes('schedule')) {
        reply =
          'Yes! The AI assistant connects directly with your clinic database to verify dentist availability and lock in confirmed appointment slots 24/7.';
      } else {
        reply = `Thank you for testing "${qText}". Our AI Receptionist engine instantly answers patient queries, manages procedure rates, and logs conversations in your clinic portal!`;
      }

      setAiResponse(reply);
      setAiLoading(false);
    }, 700);
  };

  const SAAS_FEATURES = [
    {
      title: '24/7 AI Receptionist & Booking',
      desc: 'Never miss a patient call or chat. Automated scheduling operates round-the-clock.',
      icon: '🤖',
      badge: '24/7 Active',
    },
    {
      title: 'Multi-Dentist Roster Management',
      desc: 'Assign doctors, shift timings, specializations, and working days per practitioner.',
      icon: '👨‍⚕️',
      badge: 'Multi-Doctor',
    },
    {
      title: 'RAG Knowledge Uploads (PDFs)',
      desc: 'Upload clinic PDFs, price lists, and insurance guidelines for instant AI retrieval.',
      icon: '📚',
      badge: 'RAG Search',
    },
    {
      title: 'Emergency Patient Escalation',
      desc: 'Detects severe dental trauma, bleeding, or pain and directs to emergency lines.',
      icon: '🚨',
      badge: 'Medical Safety',
    },
  ];

  const CLINIC_STATS = [
    { value: '250+', label: 'Registered Clinics', icon: '🏥' },
    { value: '24 / 7', label: 'AI Reception Uptime', icon: '🤖' },
    { value: '40%+', label: 'Booking Growth', icon: '📈' },
    { value: '< 2 Sec', label: 'Response Speed', icon: '⚡' },
  ];

  const TESTIMONIALS = [
    {
      name: 'Dr. Krina Khunt',
      clinic: 'SmileCare Dental Suite',
      rating: 5,
      comment:
        'Registering our clinic on this platform transformed our front desk! Our AI Receptionist handles over 150 bookings a month after hours without any staff overhead.',
    },
    {
      name: 'Dr. Rajesh Mehta',
      clinic: 'Apex Implant & Orthodontics',
      rating: 5,
      comment:
        'The multi-dentist roster feature allows patients to pick specific specialists like our orthodontist or endodontist. Highly recommended SaaS tool!',
    },
    {
      name: 'Priya Verma',
      clinic: 'City Dental Care',
      rating: 5,
      comment:
        'Uploading our treatment price list PDF into the RAG knowledge base took 2 minutes. Now patients get accurate quotes in seconds.',
    },
  ];

  return (
    <div className="flex flex-col gap-16 pb-20 font-sans text-slate-100 bg-[#050811] overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-[#080d1e] via-[#0b1329] to-[#050811] border-b border-slate-800/80 pt-12 pb-20 md:pt-20 md:pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Light Orbs */}
        <div className="absolute top-10 right-1/4 w-[550px] h-[550px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none animate-float" />
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-float-reverse" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center relative z-10">
          {/* Left Hero Main Copy */}
          <div className="flex flex-col gap-6 animate-fade-in">
            <div className="inline-flex items-center gap-3 bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold px-4 py-2 rounded-full w-fit shadow-lg shadow-teal-500/10">
              <Logo variant="icon" size="sm" animated={true} />
              <span>AI Receptionist SaaS Platform for Dental Clinics</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight font-heading">
              Automate Your Dental Clinic Front Desk with{' '}
              <span className="gradient-text-teal">24/7 AI Receptionist</span>
            </h1>

            <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl font-normal">
              Register your dental practice on our premium platform. Automate 24/7 appointment scheduling, dentist rosters, medical RAG knowledge, and emergency patient handoff.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate('/register-clinic')}
                className="btn-shimmer px-7 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-teal-500/25 transition-all duration-300 flex items-center gap-2.5 cursor-pointer hover:scale-[1.02]"
              >
                <HiBuildingOffice2 className="text-lg" />
                <span>Register Your Clinic Now</span>
                <HiArrowRight className="text-base" />
              </button>

              <button
                onClick={() => navigate('/pricing')}
                className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-100 font-semibold text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer hover:border-teal-500/50 hover:scale-[1.02] shadow-md"
              >
                <HiSparkles className="text-lg text-teal-400" />
                <span>View Premium Plans</span>
              </button>

              <button
                onClick={() => navigate('/login')}
                className="px-4 py-3.5 rounded-2xl bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/50 text-indigo-200 font-medium text-xs transition-all duration-300 flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] ml-auto"
              >
                <HiLockClosed className="text-sm text-indigo-400" />
                <span>Clinic Portal Sign In</span>
              </button>
            </div>

            {/* Micro Stats Counter */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80 mt-2">
              {CLINIC_STATS.map((s, idx) => (
                <div
                  key={idx}
                  className="flex flex-col p-3 rounded-2xl bg-slate-900/40 border border-slate-800/60 hover:border-teal-500/30 transition-all duration-300"
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{s.icon}</span>
                    <span className="text-lg font-bold text-white font-heading">{s.value}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-normal mt-0.5">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Hero Interactive AI Demo Widget Sandbox */}
          <div className="gradient-border-card p-6 shadow-2xl backdrop-blur-2xl flex flex-col gap-4 animate-fade-in-delayed relative">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center font-bold text-lg shadow-inner">
                    🤖
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900 animate-ripple" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base font-heading">
                    Embedded AI Receptionist Sandbox Demo
                  </h3>
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Gemini AI Engine Active</span>
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-300 bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-800/80">
                Clinic Demo
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Test how your registered clinic's AI Receptionist responds to real patient questions:
            </p>

            {/* Quick Prompt Chips */}
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestionSubmit(prompt)}
                  className="text-left text-xs bg-slate-800/70 hover:bg-teal-950/60 text-teal-300 border border-slate-700 hover:border-teal-500/50 px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer font-normal"
                >
                  💬 "{prompt}"
                </button>
              ))}
            </div>

            {/* Ask Box */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (quickQuestion.trim()) handleQuickQuestionSubmit(quickQuestion);
              }}
              className="flex items-center gap-2 bg-[#090d19] border border-slate-700/80 rounded-2xl p-2 focus-within:border-teal-500 transition-colors shadow-inner"
            >
              <input
                type="text"
                value={quickQuestion}
                onChange={(e) => setQuickQuestion(e.target.value)}
                placeholder="Ask about procedure cost, doctor roster, or emergency..."
                className="w-full bg-transparent px-3 py-2 text-xs text-slate-100 placeholder-slate-500 outline-none font-normal"
              />
              <button
                type="submit"
                className="btn-shimmer bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 p-2 rounded-xl font-bold transition cursor-pointer shrink-0 shadow-md"
              >
                <HiPaperAirplane className="text-sm" />
              </button>
            </form>

            {/* AI Response Display Box */}
            {aiLoading ? (
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 text-xs text-teal-400 flex items-center justify-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-typing-1" />
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-typing-2" />
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-typing-3" />
                </div>
                <span>Searching clinic database…</span>
              </div>
            ) : aiResponse ? (
              <div className="bg-teal-950/50 border border-teal-700/60 rounded-2xl p-4 text-xs text-teal-200 flex flex-col gap-2.5 animate-fade-in shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-teal-300 flex items-center gap-1.5">
                    <HiSparkles className="text-teal-400 text-sm animate-pulse" />
                    <span>AI Assistant Response:</span>
                  </span>
                  <button
                    onClick={() => navigate('/register-clinic')}
                    className="text-[10px] font-semibold text-teal-400 hover:text-teal-200 hover:underline cursor-pointer"
                  >
                    Register Your Clinic →
                  </button>
                </div>
                <p className="leading-relaxed text-slate-200 font-normal">{aiResponse}</p>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-20">
        {/* 3-Step Setup Section */}
        <section className="flex flex-col gap-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Simple Onboarding</span>
            <h2 className="text-3xl font-bold text-white tracking-tight font-heading mt-1">
              How Dental Clinics Deploy in 3 Simple Steps
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-2">
              Get your clinic registered and operating with an AI receptionist in less than 5 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#0a0e1c] border border-slate-800 rounded-3xl p-6 flex flex-col gap-4 shadow-xl hover:border-teal-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 text-teal-300 flex items-center justify-center font-extrabold text-xl font-heading shadow-inner">
                1
              </div>
              <h3 className="font-bold text-white text-lg font-heading">Register Your Clinic</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Fill in clinic name, address, doctor roster, and choose your SaaS subscription plan.
              </p>
            </div>

            <div className="bg-[#0a0e1c] border border-slate-800 rounded-3xl p-6 flex flex-col gap-4 shadow-xl hover:border-teal-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-extrabold text-xl font-heading shadow-inner">
                2
              </div>
              <h3 className="font-bold text-white text-lg font-heading">Upload RAG Docs & Rates</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Upload treatment price lists (PDFs), insurance guidelines, FAQs, and dentist shift schedules.
              </p>
            </div>

            <div className="bg-[#0a0e1c] border border-slate-800 rounded-3xl p-6 flex flex-col gap-4 shadow-xl hover:border-teal-500/40 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 flex items-center justify-center font-extrabold text-xl font-heading shadow-inner">
                3
              </div>
              <h3 className="font-bold text-white text-lg font-heading">Embed Widget Snippet</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                Paste the 1-line JavaScript snippet into your clinic site. Your AI receptionist is live 24/7!
              </p>
            </div>
          </div>
        </section>

        {/* Featured SaaS Capabilities */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs uppercase tracking-wider">
                <HiShieldCheck className="text-base text-teal-400" />
                <span>Complete Clinic Suite</span>
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight font-heading mt-1">
                Core Capabilities Built for Dental Clinics
              </h2>
            </div>
            <button
              onClick={() => navigate('/services')}
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer transition-transform hover:translate-x-1"
            >
              <span>Explore Full Platform Features</span>
              <HiArrowRight />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SAAS_FEATURES.map((srv, idx) => (
              <div
                key={idx}
                className="gradient-border-card p-6 shadow-xl flex flex-col justify-between gap-5 group transition-all duration-300 hover:-translate-y-1.5"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl p-3 bg-slate-800/80 rounded-2xl border border-slate-700/80 group-hover:scale-105 transition-transform duration-300">
                      {srv.icon}
                    </span>
                    <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-700/80">
                      {srv.badge}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-lg font-heading group-hover:text-teal-300 transition-colors">
                    {srv.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed font-normal">{srv.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <button
                    onClick={() => navigate('/register-clinic')}
                    className="btn-shimmer w-full py-2.5 rounded-xl bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-white font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>Register Clinic</span>
                    <HiArrowRight />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="flex flex-col gap-8">
          <div>
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              Verified Dental Practices
            </span>
            <h2 className="text-3xl font-bold text-white tracking-tight font-heading mt-1">
              Trusted by Dental Clinic Owners & Practitioners
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="bg-slate-900/80 border border-slate-800/90 rounded-2xl p-6 shadow-xl flex flex-col justify-between gap-4 hover:border-teal-500/40 transition-all duration-300"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <HiStar key={i} className="text-base" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed italic font-normal">"{t.comment}"</p>
                </div>

                <div className="pt-3 border-t border-slate-800 flex flex-col">
                  <span className="font-semibold text-white text-sm font-heading">{t.name}</span>
                  <span className="text-[11px] text-teal-400 font-medium">{t.clinic}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-950 text-white rounded-3xl p-8 md:p-10 border border-teal-800/60 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              Get Started Today
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-heading">
              Ready to Upgrade Your Clinic's Front Desk?
            </h2>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-normal">
              Register your dental clinic today and deploy your 24/7 AI Receptionist assistant in minutes.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigate('/register-clinic')}
                className="btn-shimmer px-6 py-3 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition cursor-pointer"
              >
                Register Your Clinic Now
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-xl border border-slate-700 transition cursor-pointer"
              >
                View Premium Plans
              </button>
            </div>
          </div>

          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4 text-xs">
            <div className="flex items-start gap-3">
              <HiBuildingOffice2 className="text-teal-400 text-lg shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block text-sm">Register Clinic Tool</span>
                <span className="text-slate-300 font-normal">
                  Multi-doctor roster, customized AI persona, custom operating hours, and RAG knowledge uploads.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-slate-800 pt-3">
              <HiSparkles className="text-teal-400 text-lg shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block text-sm">Subscription Tier</span>
                <span className="text-slate-300 font-normal">
                  Flexible plans: Starter, Professional (Recommended), Enterprise.
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
