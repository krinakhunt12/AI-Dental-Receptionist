import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import {
  HiSparkles,
  HiChatBubbleLeftRight,
  HiCalendarDays,
  HiUserGroup,
  HiShieldCheck,
  HiBookOpen,
  HiArrowRight,
  HiPhone,
  HiCheckCircle,
  HiClock,
  HiMapPin,
  HiStar,
  HiHeart,
  HiLockClosed,
  HiPaperAirplane,
} from 'react-icons/hi2';

export default function HomePage() {
  const navigate = useNavigate();
  const [quickQuestion, setQuickQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const QUICK_PROMPTS = [
    'How much does teeth whitening cost?',
    'Is Dr. Patel available this Friday?',
    'What is included in a root canal treatment?',
    'What are your clinic operating hours?',
  ];

  const handleQuickQuestionSubmit = (qText: string) => {
    setQuickQuestion(qText);
    setAiLoading(true);
    setAiResponse(null);

    setTimeout(() => {
      let reply = 'SmileCare Dental Clinic offers 24/7 AI-assisted booking and clinical information.';
      const lower = qText.toLowerCase();
      if (lower.includes('whitening')) {
        reply =
          'Laser Teeth Whitening costs ₹4,500 at SmileCare. The procedure takes approximately 45 minutes and delivers up to 8 shades whiter teeth in one visit!';
      } else if (lower.includes('patel') || lower.includes('friday') || lower.includes('available')) {
        reply =
          'Dr. Priya Patel is available Monday through Saturday from 9:00 AM to 5:00 PM for General Dentistry and Laser Whitening. Would you like to book a slot?';
      } else if (lower.includes('root canal')) {
        reply =
          'Single-visit painless Root Canal Treatment costs ₹6,500. It includes digital X-ray diagnostics, rotary endodontics, and temporary capping.';
      } else if (lower.includes('hours') || lower.includes('open')) {
        reply =
          'SmileCare Clinic is open Mon-Sat from 9:00 AM to 8:00 PM. Our AI Receptionist is available online 24 hours a day to handle bookings!';
      } else {
        reply = `Thank you for asking about "${qText}". Our AI Receptionist can instantly schedule your visit or search our medical database. Click below to launch live chat!`;
      }

      setAiResponse(reply);
      setAiLoading(false);
    }, 700);
  };

  const DENTAL_SERVICES = [
    {
      title: 'Laser Teeth Whitening',
      price: '₹4,500',
      duration: '45 mins',
      doctor: 'Dr. Priya Patel',
      desc: 'Advanced single-session whitening treatment removing deep stains and discoloration.',
      icon: '✨',
      badge: 'Popular',
    },
    {
      title: 'Single-Visit Root Canal',
      price: '₹6,500',
      duration: '60 mins',
      doctor: 'Dr. Sarah Jenkins',
      desc: 'Painless rotary endodontics with 3D apex locator and composite sealing.',
      icon: '🛡️',
      badge: 'Painless',
    },
    {
      title: 'Dental Implant & Crown',
      price: '₹28,000',
      duration: '90 mins',
      doctor: 'Dr. Mark Rivera',
      desc: 'Titanium root replacement with custom zirconium porcelain crown.',
      icon: '💎',
      badge: 'Lifetime Warranty',
    },
    {
      title: 'Clear Invisible Aligners',
      price: '₹45,000',
      duration: '30 mins (Eval)',
      doctor: 'Dr. Mark Rivera',
      desc: '3D digital smile simulation and customized transparent teeth straighteners.',
      icon: '😁',
      badge: '3D Simulated',
    },
  ];

  const CLINIC_STATS = [
    { value: '5,000+', label: 'Happy Patients', icon: '😄' },
    { value: '24 / 7', label: 'AI Voice Reception', icon: '🤖' },
    { value: '< 2 Sec', label: 'Booking Speed', icon: '⚡' },
    { value: '4.9 ★', label: 'Patient Rating', icon: '⭐' },
  ];

  const TESTIMONIALS = [
    {
      name: 'Rohan Sharma',
      treatment: 'Teeth Whitening & Cleaning',
      rating: 5,
      comment:
        'I booked my slot at 11 PM using the AI Assistant! The treatment by Dr. Patel was completely pain-free and super professional.',
    },
    {
      name: 'Ananya Mehta',
      treatment: 'Root Canal Treatment',
      rating: 5,
      comment:
        'I was terrified of root canals, but Dr. Jenkins made it so smooth. Highly recommend SmileCare for any dental needs!',
    },
    {
      name: 'Vikram Joshi',
      treatment: 'Clear Aligners Consultation',
      rating: 5,
      comment:
        'Transparent pricing, clear explanations from the AI receptionist, and zero waiting time at the clinic. 10/10 experience!',
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
            <div className="inline-flex items-center gap-3 bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-medium px-4 py-2 rounded-full w-fit shadow-lg shadow-teal-500/10">
              <Logo variant="icon" size="sm" animated={true} />
              <span className="font-semibold">SmileCare AI Receptionist & Front Desk</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight font-heading">
              Modern Pain-Free Dental Care &{' '}
              <span className="gradient-text-teal">24/7 AI Receptionist</span>
            </h1>

            <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl font-normal">
              Instant appointment scheduling, transparent procedure rates in ₹ (INR), intelligent clinical Q&A, and certified dental specialists at your service.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate('/chat')}
                className="btn-shimmer px-7 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-semibold text-sm shadow-xl shadow-teal-500/25 transition-all duration-300 flex items-center gap-2.5 cursor-pointer hover:scale-[1.02]"
              >
                <HiChatBubbleLeftRight className="text-lg" />
                <span>Talk to AI Receptionist</span>
                <HiArrowRight className="text-base" />
              </button>

              <button
                onClick={() => navigate('/appointments')}
                className="px-6 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-100 font-semibold text-sm transition-all duration-300 flex items-center gap-2 cursor-pointer hover:border-teal-500/50 hover:scale-[1.02] shadow-md"
              >
                <HiCalendarDays className="text-lg text-teal-400" />
                <span>Book Appointment</span>
              </button>

              <button
                onClick={() => navigate('/login')}
                className="px-4 py-3.5 rounded-2xl bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-700/50 text-indigo-200 font-medium text-xs transition-all duration-300 flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] ml-auto"
              >
                <HiLockClosed className="text-sm text-indigo-400" />
                <span>Portal Sign In</span>
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

          {/* Right Hero Interactive AI Demo Widget */}
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
                    Try Live AI Dental Receptionist
                  </h3>
                  <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Gemini AI Engine Active</span>
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-teal-300 bg-teal-950/80 px-2.5 py-0.5 rounded-full border border-teal-800/80">
                Live Demo
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Select a sample prompt below to experience instant real-time AI responses:
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
                placeholder="Ask about procedure cost, dentists, or appointments..."
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
                <span>Searching clinical database…</span>
              </div>
            ) : aiResponse ? (
              <div className="bg-teal-950/50 border border-teal-700/60 rounded-2xl p-4 text-xs text-teal-200 flex flex-col gap-2.5 animate-fade-in shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-teal-300 flex items-center gap-1.5">
                    <HiSparkles className="text-teal-400 text-sm animate-pulse" />
                    <span>AI Assistant Response:</span>
                  </span>
                  <button
                    onClick={() => navigate('/chat')}
                    className="text-[10px] font-semibold text-teal-400 hover:text-teal-200 hover:underline cursor-pointer"
                  >
                    Open Live AI Chat →
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
        {/* Featured Dental Services & Rates */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-teal-400 font-semibold text-xs uppercase tracking-wider">
                <HiShieldCheck className="text-base text-teal-400" />
                <span>Transparent Procedure Costs</span>
              </div>
              <h2 className="text-3xl font-bold text-white tracking-tight font-heading mt-1">
                Featured Dental Treatments & Pricing
              </h2>
            </div>
            <button
              onClick={() => navigate('/services')}
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 cursor-pointer transition-transform hover:translate-x-1"
            >
              <span>Explore Full Rates Catalog</span>
              <HiArrowRight />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {DENTAL_SERVICES.map((srv, idx) => (
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

                <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-normal">{srv.duration}</span>
                    <span className="font-bold text-lg text-teal-400 font-mono">
                      {srv.price}
                    </span>
                  </div>

                  <button
                    onClick={() => navigate('/appointments')}
                    className="btn-shimmer w-full py-2.5 rounded-xl bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-white font-semibold text-xs transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>Book Procedure</span>
                    <HiArrowRight />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose SmileCare Dark Card Grid */}
        <section className="bg-gradient-to-br from-[#0c1222] via-[#090e1b] to-[#0d1629] text-white rounded-3xl p-8 md:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col gap-8">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
                The SmileCare Advantage
              </span>
              <h2 className="text-3xl font-bold text-white tracking-tight font-heading mt-1">
                Pioneering Dental Excellence & Smart AI
              </h2>
              <p className="text-slate-300 text-sm mt-1 leading-relaxed font-normal">
                Combining high-precision digital dentistry with seamless 24/7 AI scheduling and clear procedure rates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col gap-3 hover:border-teal-500/40 transition-all duration-300">
                <div className="w-11 h-11 rounded-2xl bg-teal-500/15 text-teal-300 border border-teal-500/25 flex items-center justify-center text-xl shadow-inner">
                  ⚡
                </div>
                <h3 className="font-bold text-white text-base font-heading">
                  24/7 AI Voice & Text Scheduling
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  Book or reschedule anytime. Our AI front desk understands speech, answers procedure costs, and manages dentist slots.
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col gap-3 hover:border-teal-500/40 transition-all duration-300">
                <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 flex items-center justify-center text-xl shadow-inner">
                  🩺
                </div>
                <h3 className="font-bold text-white text-base font-heading">
                  Painless Precision Dentistry
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  State-of-the-art rotary endodontics, 3D intraoral scanners, and laser whitening for painless patient care.
                </p>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 flex flex-col gap-3 hover:border-teal-500/40 transition-all duration-300">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-300 border border-amber-500/25 flex items-center justify-center text-xl shadow-inner">
                  💎
                </div>
                <h3 className="font-bold text-white text-base font-heading">
                  100% Transparent Price List
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  No hidden fees or surprise invoices. Review itemized treatment rates in advance online before stepping into the clinic.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Patient Reviews & Testimonials */}
        <section className="flex flex-col gap-8">
          <div>
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              Verified Patient Feedback
            </span>
            <h2 className="text-3xl font-bold text-white tracking-tight font-heading mt-1">
              What Our Patients Say
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
                  <span className="text-[11px] text-teal-400 font-medium">{t.treatment}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Clinic Location & Hours Dark Banner */}
        <section className="bg-gradient-to-r from-teal-950 via-slate-900 to-slate-950 text-white rounded-3xl p-8 md:p-10 border border-teal-800/60 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col gap-4">
            <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
              Visit Us Today
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white font-heading">
              Ready for a Brighter, Healthier Smile?
            </h2>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-normal">
              Book your appointment online, or connect directly with our 24/7 AI Receptionist.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigate('/appointments')}
                className="btn-shimmer px-6 py-3 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-slate-950 font-semibold text-xs rounded-xl shadow-lg transition cursor-pointer"
              >
                Book Appointment Now
              </button>
              <button
                onClick={() => navigate('/contact')}
                className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs rounded-xl border border-slate-700 transition cursor-pointer"
              >
                Contact Clinic
              </button>
            </div>
          </div>

          <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-6 flex flex-col gap-4 text-xs">
            <div className="flex items-start gap-3">
              <HiMapPin className="text-teal-400 text-lg shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block text-sm">Clinic Address</span>
                <span className="text-slate-300 font-normal">
                  SmileCare Tower, Suite 402, Medical Enclave, Ring Road, Ahmedabad - 380015
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-slate-800 pt-3">
              <HiClock className="text-teal-400 text-lg shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block text-sm">Operating Hours</span>
                <span className="text-slate-300 block font-normal">Mon - Sat: 9:00 AM - 8:00 PM</span>
                <span className="text-teal-400 font-medium mt-0.5 block">
                  🤖 AI Voice Assistant: 24 Hours / 7 Days Live
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-slate-800 pt-3">
              <HiPhone className="text-teal-400 text-lg shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-white block text-sm">Phone Line</span>
                <span className="text-slate-300 font-mono">+91 98765-43210 / (079) 2684-9000</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
