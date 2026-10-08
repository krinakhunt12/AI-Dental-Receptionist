import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Check,
  Code2,
  Clock,
  ClipboardCheck,
  Bot,
  AlertTriangle
} from 'lucide-react';

export default function RegisterClinicPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'growth' | 'enterprise'>('growth');
  const [copiedScript, setCopiedScript] = useState(false);

  // Clinic Registration Form State
  const [clinicData, setClinicData] = useState({
    clinicName: 'SmileCare Dental Suite',
    ownerName: 'Dr. Krina Khunt',
    email: 'contact@smilecaredental.com',
    phone: '+91 98765 43210',
    city: 'Ahmedabad',
    address: 'Suite 402, Ring Road, Medical Enclave',
    dentistCount: '3-5 Dentists',
    assistantName: 'Maya - AI Receptionist',
    emergencyPhone: '+91 98765 00000',
    operatingHours: 'Mon-Sat: 9:00 AM - 8:00 PM',
  });

  const PLANS = [
    {
      id: 'starter',
      name: 'Starter Clinic',
      price: '₹2,999',
      period: '/month',
      desc: 'Ideal for single-dentist practices starting with AI receptionist automation.',
      badge: 'Basic',
      features: [
        'Up to 300 AI Bookings / Mo',
        'Single Dentist Roster',
        'Standard Web Chat Widget',
        'Basic Dental Knowledge Base',
        'Email Appointment Alerts',
      ],
    },
    {
      id: 'growth',
      name: 'Growth Suite',
      price: '₹6,999',
      period: '/month',
      desc: 'For multi-doctor clinics seeking 24/7 AI receptionist & document indexing.',
      badge: 'Most Popular ⭐',
      highlighted: true,
      features: [
        '1,000 AI Conversations / Mo',
        'Up to 5 Dentists Roster',
        'Custom AI Receptionist Persona',
        'PDF/Doc Medical Uploads',
        'SMS & WhatsApp Notifications',
        'Emergency Patient Escalation',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise Premium',
      price: '₹14,999',
      period: '/month',
      desc: 'For multi-location clinic chains requiring phone voice call AI & custom LLM.',
      badge: 'Full Automation',
      features: [
        'Unlimited AI Conversations',
        'Unlimited Dentists & Staff',
        '24/7 AI Voice Phone Receptionist',
        'Custom CRM & EMR Integration',
        'Dedicated Account Manager',
        '99.9% Uptime SLA',
      ],
    },
  ];

  const handleInputChange = (field: string, val: string) => {
    setClinicData((prev) => ({ ...prev, [field]: val }));
  };

  const widgetScript = `<script 
  src="https://cdn.smilecare.ai/widget.js" 
  data-clinic-id="cln_${Math.random().toString(36).substring(2, 9)}" 
  data-assistant-name="${clinicData.assistantName}"
  async>
</script>`;

  const copyWidgetScript = () => {
    navigator.clipboard.writeText(widgetScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 font-sans p-4 md:p-10 flex flex-col items-center justify-center relative overflow-hidden select-none">
      <div className="max-w-4xl w-full flex flex-col gap-8 relative z-10">
        {/* Header Title */}
        <div className="text-center flex flex-col items-center gap-3">
          <Logo variant="full" size="lg" subtitle="Clinic Registration Wizard" />
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-heading mt-1">
            Register Your Dental Practice
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl leading-relaxed">
            Deploy your 24/7 AI Receptionist, manage doctor rosters, and start your 14-day free trial in 4 steps.
          </p>
        </div>

        {/* Multi-Step Wizard Progress */}
        <div className="bg-[#0a0f1e] border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-xl">
          {[
            { num: 1, title: 'Clinic & Admin' },
            { num: 2, title: 'Choose Plan' },
            { num: 3, title: 'Configure AI' },
            { num: 4, title: 'Activation' },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold font-heading transition-all ${
                  step === s.num
                    ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 shadow-md shadow-teal-500/30'
                    : step > s.num
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                {step > s.num ? <Check className="w-4 h-4" /> : s.num}
              </div>
              <span
                className={`text-xs font-semibold hidden sm:inline ${
                  step === s.num ? 'text-teal-300' : step > s.num ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {s.title}
              </span>
              {s.num < 4 && <span className="text-slate-700 hidden md:inline ml-2">→</span>}
            </div>
          ))}
        </div>

        {/* Step Container Card */}
        <div className="bg-[#0b1120] border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-xl">
          {/* STEP 1: Clinic Profile Details */}
          {step === 1 && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-teal-400" />
                  <span>Step 1: Clinic Profile & Contact Details</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your practice details to isolate your dedicated clinic workspace.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Clinic Name *
                  </label>
                  <input
                    type="text"
                    value={clinicData.clinicName}
                    onChange={(e) => handleInputChange('clinicName', e.target.value)}
                    placeholder="e.g. SmileCare Dental Suite"
                    className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500 transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Lead Doctor / Owner *
                  </label>
                  <input
                    type="text"
                    value={clinicData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    placeholder="e.g. Dr. Krina Khunt"
                    className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500 transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Official Email *
                  </label>
                  <input
                    type="email"
                    value={clinicData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="contact@smilecaredental.com"
                    className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500 transition font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Clinic Contact Phone *
                  </label>
                  <input
                    type="tel"
                    value={clinicData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500 transition font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={clinicData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="e.g. Ahmedabad, Gujarat"
                    className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500 transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Doctor Team Size
                  </label>
                  <select
                    value={clinicData.dentistCount}
                    onChange={(e) => handleInputChange('dentistCount', e.target.value)}
                    className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-teal-500 cursor-pointer"
                  >
                    <option value="1 Solo Dentist">1 Solo Dentist</option>
                    <option value="2-3 Dentists">2-3 Dentists</option>
                    <option value="3-5 Dentists">3-5 Dentists</option>
                    <option value="6+ Multi-Specialty Team">6+ Multi-Specialty Team</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end pt-4 border-t border-slate-800 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-shimmer px-6 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-500/20"
                >
                  <span>Select SaaS Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Choose SaaS Plan */}
          {step === 2 && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-400" />
                  <span>Step 2: Choose Plan (14-Day Trial Included)</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Select a subscription tier. No credit card required to start your trial.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {PLANS.map((p) => {
                  const isSelected = selectedPlan === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedPlan(p.id as any)}
                      className={`p-6 rounded-2xl border flex flex-col justify-between gap-5 cursor-pointer transition-all duration-300 relative ${
                        isSelected
                          ? 'bg-gradient-to-b from-teal-950/70 via-slate-900 to-slate-950 border-teal-500 shadow-xl shadow-teal-500/20 ring-2 ring-teal-500/40 scale-[1.02]'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {p.highlighted && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 shadow-md">
                          {p.badge}
                        </span>
                      )}

                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-extrabold text-base text-white font-heading">{p.name}</h3>
                          {isSelected && <CheckCircle2 className="w-5 h-5 text-teal-400" />}
                        </div>

                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-extrabold text-white font-heading">{p.price}</span>
                          <span className="text-xs text-slate-400 font-medium">{p.period}</span>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                      </div>

                      <div className="border-t border-slate-800 pt-4 flex flex-col gap-2">
                        {p.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                            <Check className="w-4 h-4 text-teal-400 shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs transition cursor-pointer"
                >
                  ← Back to Clinic Info
                </button>

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="btn-shimmer px-6 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-500/20"
                >
                  <span>Configure AI Assistant</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Configure AI Assistant */}
          {step === 3 && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="border-b border-slate-800 pb-4">
                <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                  <Bot className="w-5 h-5 text-teal-400" />
                  <span>Step 3: Customize AI Receptionist Persona</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Configure how your AI receptionist greets patients and handles emergency escalations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    AI Assistant Name
                  </label>
                  <input
                    type="text"
                    value={clinicData.assistantName}
                    onChange={(e) => handleInputChange('assistantName', e.target.value)}
                    placeholder="e.g. Maya - AI Receptionist"
                    className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-teal-500 transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Emergency On-Call Line *
                  </label>
                  <input
                    type="tel"
                    value={clinicData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-teal-500 transition font-mono"
                  />
                  <span className="text-[11px] text-amber-400 mt-1 block font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> Severe trauma queries automatically route here.
                  </span>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Clinic Operating Hours
                  </label>
                  <input
                    type="text"
                    value={clinicData.operatingHours}
                    onChange={(e) => handleInputChange('operatingHours', e.target.value)}
                    placeholder="e.g. Mon-Sat: 9:00 AM - 8:00 PM, Sun: Closed"
                    className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-teal-500 transition"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-xs transition cursor-pointer"
                >
                  ← Back to Plans
                </button>

                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="btn-shimmer px-7 py-3 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xl shadow-teal-500/25"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Activate 14-Day Free Trial</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Activation & Widget Code Generator */}
          {step === 4 && (
            <div className="flex flex-col gap-6 animate-fade-in text-center items-center">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center justify-center text-3xl font-bold shadow-xl shadow-emerald-500/20 animate-bounce">
                🎉
              </div>

              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white font-heading">
                  Clinic Workspace Active!
                </h2>
                <p className="text-xs md:text-sm text-slate-300 mt-2 max-w-lg mx-auto">
                  Your clinic <strong className="text-teal-300">{clinicData.clinicName}</strong> is registered on the <span className="uppercase text-emerald-400 font-bold">{selectedPlan} Plan</span> (14-Day Free Trial).
                </p>
              </div>

              {/* Widget Code Box */}
              <div className="w-full bg-[#050811] border border-slate-800 rounded-2xl p-5 text-left flex flex-col gap-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-300 flex items-center gap-2 font-heading">
                    <Code2 className="w-4 h-4" />
                    <span>AI Receptionist Website Embed Script</span>
                  </span>
                  <button
                    onClick={copyWidgetScript}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <ClipboardCheck className="w-3.5 h-3.5" />
                    <span>{copiedScript ? 'Copied!' : 'Copy Script Tag'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Paste this 1-line script tag into your clinic website HTML header or footer to activate your 24/7 AI Receptionist:
                </p>
                <pre className="bg-[#0a0f1d] p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto select-all">
                  {widgetScript}
                </pre>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn-shimmer px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 font-bold text-xs shadow-xl shadow-teal-500/25 transition cursor-pointer flex items-center gap-2"
                >
                  <span>Open Clinic Staff Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
