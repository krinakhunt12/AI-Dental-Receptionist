import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from './components/Hero';
import {
  Bot,
  Calendar,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Building2,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  HelpCircle,
  Phone,
  ArrowRight,
  Star,
  Calculator,
  MessageSquare,
  Zap,
  Lock,
  Globe,
  Award
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  // Interactive ROI Calculator State
  const [missedCalls, setMissedCalls] = useState(25);
  const [avgProcedureValue, setAvgProcedureValue] = useState(4500); // INR or USD equivalent
  const conversionRate = 0.4; // 40% conversion rate of recovered calls to appointments

  const monthlyRecoveredCalls = Math.round(missedCalls * 4.33 * conversionRate);
  const monthlyRecoveredRevenue = monthlyRecoveredCalls * avgProcedureValue;
  const annualRecoveredRevenue = monthlyRecoveredRevenue * 12;

  // Interactive AI Demo State
  const [demoMessages, setDemoMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am Maya, the 24/7 AI Receptionist for SmileCare Dental Suite. How can I assist your dental care today?',
      time: 'Just now',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleDemoSend = (text: string) => {
    const userMessage = text || inputMsg;
    if (!userMessage.trim()) return;

    setDemoMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMessage, time: 'Just now' },
    ]);
    setInputMsg('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = 'I can help schedule your teeth cleaning or checkup with Dr. Krina Khunt! Would you prefer Friday afternoon or Saturday morning?';

      const lower = userMessage.toLowerCase();
      if (lower.includes('price') || lower.includes('cost') || lower.includes('cleaning')) {
        aiResponse = 'Our standard Dental Hygiene & Scaling is ₹1,500. Dental Implants start from ₹25,000. Would you like to view our full treatment price list or book a consultation?';
      } else if (lower.includes('emergency') || lower.includes('pain') || lower.includes('bleeding')) {
        aiResponse = '🚨 EMERGENCY NOTICE: For severe dental trauma or uncontrollable bleeding, please call our emergency line (+91 98765 00000) or visit the nearest emergency room immediately!';
      } else if (lower.includes('doctor') || lower.includes('dentist')) {
        aiResponse = 'Our roster includes Dr. Krina Khunt (Implantologist), Dr. Rajesh Mehta (Orthodontist), and Dr. Priya Verma (Pediatric Dentist). Who would you like to see?';
      }

      setDemoMessages((prev) => [
        ...prev,
        { sender: 'ai', text: aiResponse, time: 'Just now' },
      ]);
      setIsTyping(false);
    }, 900);
  };

  const BENTO_FEATURES = [
    {
      title: '24/7 AI Receptionist',
      desc: 'Never miss a patient call or chat again. Operates 24/7 on web, WhatsApp, and SMS.',
      icon: Bot,
      badge: '24/7 Active',
      colSpan: 'md:col-span-2',
      gradient: 'from-teal-500/10 via-teal-500/5 to-transparent',
    },
    {
      title: 'Smart Calendar Booking',
      desc: 'Direct sync with dentist rosters, slot availability, and instant reschedule/cancel.',
      icon: Calendar,
      badge: 'Direct Sync',
      colSpan: 'md:col-span-1',
      gradient: 'from-blue-500/10 to-transparent',
    },
    {
      title: '"Train Your AI" Knowledge Base',
      desc: 'Upload treatment rates, insurance policies, and FAQs. AI answers accurately from your docs.',
      icon: FileText,
      badge: 'PDF Indexing',
      colSpan: 'md:col-span-1',
      gradient: 'from-indigo-500/10 to-transparent',
    },
    {
      title: 'Emergency Detection & Handoff',
      desc: 'Intercepts urgent cases (severe pain, bleeding, trauma) and flags them for on-call dentists.',
      icon: AlertTriangle,
      badge: 'Medical Safety',
      colSpan: 'md:col-span-2',
      gradient: 'from-amber-500/10 via-rose-500/5 to-transparent',
    },
    {
      title: 'Automated Recall Campaigns',
      desc: 'Reduces no-shows with automated WhatsApp/SMS cleaning reminders every 6 months.',
      icon: Zap,
      badge: 'No-Show -65%',
      colSpan: 'md:col-span-1',
      gradient: 'from-emerald-500/10 to-transparent',
    },
    {
      title: 'Embeddable 1-Line Web Widget',
      desc: 'Copy one script tag onto your existing clinic website. Live in under 5 minutes.',
      icon: Globe,
      badge: 'Zero Code',
      colSpan: 'md:col-span-2',
      gradient: 'from-purple-500/10 to-transparent',
    },
  ];

  return (
    <main className="flex flex-col gap-20 pb-24 font-sans text-slate-100 bg-[#050811] overflow-hidden select-none">
      {/* Hero Section */}
      <Hero />

      {/* Social Proof Strip */}
      <section className="border-y border-white/10 bg-[#080d1d]/80 py-8 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-1 text-amber-400 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400" />
              ))}
              <span className="text-xs font-bold text-slate-300 ml-2">4.9 / 5.0 Rating</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Trusted by <strong className="text-white font-bold">250+ Premier Dental Clinics</strong> across the globe
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 opacity-70 grayscale hover:grayscale-0 transition-all">
            <span className="font-heading font-extrabold text-sm text-slate-300 tracking-wider flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-teal-400" /> SMILECARE DENTAL
            </span>
            <span className="font-heading font-extrabold text-sm text-slate-300 tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-400" /> APEX IMPLANTS
            </span>
            <span className="font-heading font-extrabold text-sm text-slate-300 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-teal-400" /> CITY ORTHODONTICS
            </span>
            <span className="font-heading font-extrabold text-sm text-slate-300 tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-teal-400" /> DENTAL EXCELLENCE
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-24 w-full">
        {/* 4 Stat Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-[#0a0f1d] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-teal-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Call Resolution</span>
              <Bot className="w-5 h-5 text-teal-400" />
            </div>
            <div className="text-4xl font-extrabold text-white font-heading mt-3">99.4%</div>
            <p className="text-xs text-slate-400 mt-1">Queries answered accurately by AI</p>
          </div>

          <div className="bg-[#0a0f1d] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-teal-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Response Speed</span>
              <Zap className="w-5 h-5 text-teal-400" />
            </div>
            <div className="text-4xl font-extrabold text-white font-heading mt-3">&lt; 1.8s</div>
            <p className="text-xs text-slate-400 mt-1">Instant patient response 24/7</p>
          </div>

          <div className="bg-[#0a0f1d] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-teal-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Booking Increase</span>
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-4xl font-extrabold text-emerald-400 font-heading mt-3">+40%</div>
            <p className="text-xs text-slate-400 mt-1">After-hours appointments booked</p>
          </div>

          <div className="bg-[#0a0f1d] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden group hover:border-teal-500/40 transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Average ROI</span>
              <Calculator className="w-5 h-5 text-teal-400" />
            </div>
            <div className="text-4xl font-extrabold text-white font-heading mt-3">4.2x</div>
            <p className="text-xs text-slate-400 mt-1">Revenue return on monthly plan</p>
          </div>
        </section>

        {/* Interactive AI Chat Demo Section */}
        <section className="bg-gradient-to-b from-[#0a0f22] to-[#070b16] border border-teal-500/30 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold px-3 py-1 rounded-full w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Live Demo</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-extrabold text-white font-heading">
              Test Your AI Receptionist Live Right Now
            </h2>

            <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
              Experience how Maya, our dental AI assistant, responds to patient inquiries about treatments, pricing, doctor availability, and emergencies in real-time.
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Try clicking a sample question:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleDemoSend('How much is a dental cleaning?')}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-teal-500/20 text-xs text-teal-300 border border-white/10 hover:border-teal-500/40 transition cursor-pointer"
                >
                  💰 How much is cleaning?
                </button>
                <button
                  onClick={() => handleDemoSend('Can I book an appointment with Dr. Patel?')}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-teal-500/20 text-xs text-teal-300 border border-white/10 hover:border-teal-500/40 transition cursor-pointer"
                >
                  📅 Book with Dr. Patel
                </button>
                <button
                  onClick={() => handleDemoSend('I have severe tooth pain and bleeding')}
                  className="px-3 py-1.5 rounded-lg bg-white/5 border border-rose-500/30 text-xs text-rose-300 hover:bg-rose-500/20 transition cursor-pointer"
                >
                  🚨 Severe Tooth Emergency
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-[#050811] border border-slate-800 rounded-2xl p-5 shadow-2xl flex flex-col h-[420px]">
            {/* Widget Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-xs font-heading">Maya — AI Receptionist</h3>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online & Ready 24/7
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                Clinic: SmileCare Dental
              </span>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3 pr-2 text-xs">
              {demoMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed ${msg.sender === 'user'
                        ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 font-medium rounded-br-none shadow-md'
                        : 'bg-[#0f172a] text-slate-200 border border-slate-800 rounded-bl-none shadow'
                      }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-slate-500 mt-1 px-1">{msg.time}</span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 bg-[#0f172a] border border-slate-800 rounded-xl px-4 py-2 text-xs text-slate-400 w-fit">
                  <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-ping" />
                  <span>Maya is drafting a response…</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleDemoSend(inputMsg);
              }}
              className="pt-3 border-t border-slate-800 flex items-center gap-2"
            >
              <input
                type="text"
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Ask Maya about services, rates, or bookings…"
                className="flex-1 bg-[#090e1a] border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500 transition"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition cursor-pointer flex items-center gap-1"
              >
                <span>Send</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </section>

        {/* ROI Calculator Section */}
        <section className="bg-[#080d1e] border border-white/10 rounded-3xl p-6 md:p-10 shadow-xl flex flex-col gap-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-teal-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Calculator className="w-4 h-4" />
                <span>Revenue Impact Simulator</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white font-heading">
                Calculate How Much Revenue Your Clinic is Losing to Missed Calls
              </h2>
            </div>
            <div className="text-xs text-slate-400 bg-slate-900 px-3.5 py-2 rounded-xl border border-slate-800 w-fit">
              Based on industry avg 40% conversion rate of recovered calls
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Controls */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-200">Missed Calls / Enquiries per Week:</label>
                  <span className="font-mono font-bold text-teal-400 bg-teal-950 px-2.5 py-1 rounded border border-teal-800">
                    {missedCalls} calls / week
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={missedCalls}
                  onChange={(e) => setMissedCalls(Number(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-bold text-slate-200">Average Treatment Procedure Value:</label>
                  <span className="font-mono font-bold text-teal-400 bg-teal-950 px-2.5 py-1 rounded border border-teal-800">
                    ₹{avgProcedureValue.toLocaleString()} / $150
                  </span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="25000"
                  step="500"
                  value={avgProcedureValue}
                  onChange={(e) => setAvgProcedureValue(Number(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Result Display Box */}
            <div className="lg:col-span-5 bg-gradient-to-br from-teal-950/80 via-slate-900 to-[#050811] border-2 border-teal-500/50 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 text-center">
              <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">
                Estimated Recovered Revenue
              </span>

              <div className="flex flex-col items-center">
                <div className="text-4xl md:text-5xl font-extrabold text-white font-heading tracking-tight">
                  ₹{monthlyRecoveredRevenue.toLocaleString()}
                </div>
                <span className="text-xs text-slate-400 mt-1">Per Month</span>
              </div>

              <div className="pt-3 border-t border-teal-500/30 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Annual Recovered Total:</span>
                <strong className="text-emerald-400 font-bold font-mono text-sm">
                  ₹{annualRecoveredRevenue.toLocaleString()}
                </strong>
              </div>

              <button
                onClick={() => navigate('/register-clinic')}
                className="btn-shimmer w-full py-3 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <span>Start Recovering Revenue Today</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* Bento Grid Features */}
        <section className="flex flex-col gap-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">SaaS Architecture</span>
            <h2 className="text-3xl font-extrabold text-white font-heading mt-1">
              Purpose-Built for Modern Dental Practices
            </h2>
            <p className="text-slate-300 text-xs md:text-sm mt-2">
              All the tools your clinic front desk needs to automate patient communication and scheduling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {BENTO_FEATURES.map((feat, i) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={i}
                  className={`${feat.colSpan} bg-gradient-to-b ${feat.gradient} bg-[#0a0f1d] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col justify-between gap-6 shadow-xl hover:border-teal-500/30 transition-all duration-300 group`}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-teal-950 text-teal-300 border border-teal-800">
                        {feat.badge}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white font-heading group-hover:text-teal-300 transition-colors">
                      {feat.title}
                    </h3>

                    <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-teal-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Learn feature specs <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3-Step Setup Section */}
        <section className="flex flex-col gap-8 bg-[#080d1e] border border-white/10 rounded-3xl p-8 md:p-12">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Fast Setup</span>
            <h2 className="text-3xl font-extrabold text-white font-heading mt-1">
              Go Live in 3 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-[#050811] border border-slate-800 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center text-base font-heading">
                1
              </div>
              <h3 className="font-bold text-white text-base font-heading">Register Your Clinic</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Provide clinic name, operating hours, doctors list, and pick a monthly or annual SaaS plan.
              </p>
            </div>

            <div className="bg-[#050811] border border-slate-800 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center text-base font-heading">
                2
              </div>
              <h3 className="font-bold text-white text-base font-heading">Train Your AI</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Upload your procedure price list PDF, insurance FAQs, and appointment guidelines.
              </p>
            </div>

            <div className="bg-[#050811] border border-slate-800 rounded-2xl p-6 flex flex-col gap-4 shadow-xl">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center text-base font-heading">
                3
              </div>
              <h3 className="font-bold text-white text-base font-heading">Embed Widget & Go Live</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Copy the 1-line script tag into your website. Your 24/7 AI receptionist is active immediately!
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
