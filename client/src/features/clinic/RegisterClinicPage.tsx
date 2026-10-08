import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import {
  HiBuildingOffice2,
  HiUser,
  HiEnvelope,
  HiPhone,
  HiMapPin,
  HiSparkles,
  HiCheckCircle,
  HiArrowRight,
  HiShieldCheck,
  HiCheck,
  HiCodeBracket,
  HiClock,
  HiClipboardDocumentCheck,
} from 'react-icons/hi2';

export default function RegisterClinicPage() {
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedPlan, setSelectedPlan] = useState<'starter' | 'pro' | 'enterprise'>('pro');
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
      id: 'pro',
      name: 'Professional Suite',
      price: '₹6,999',
      period: '/month',
      desc: 'For multi-doctor clinics seeking 24/7 AI receptionist & document RAG.',
      badge: 'Most Popular ⭐',
      highlighted: true,
      features: [
        'Unlimited AI Bookings',
        'Up to 10 Dentists Roster',
        'Custom AI Receptionist Persona',
        'PDF/Doc RAG Medical Uploads',
        'SMS & WhatsApp Notifications',
        'Emergency Patient Escalation',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise Premium',
      price: '₹14,999',
      period: '/month',
      desc: 'For multi-location clinic chains requiring voice calls & custom LLM.',
      badge: 'Full Automation',
      features: [
        'Everything in Professional',
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
  src="https://cdn.ai-dental-receptionist.com/widget.js" 
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
    <div className="min-h-screen bg-[#050811] text-slate-100 font-sans p-4 md:p-10 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Light Orbs */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-4xl w-full flex flex-col gap-8 relative z-10">
        {/* Header Title */}
        <div className="text-center flex flex-col items-center gap-3">
          <Logo variant="full" size="lg" subtitle="Clinic Onboarding & Registration Suite" />
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight font-heading mt-2">
            Register Your Dental Clinic
          </h1>
          <p className="text-slate-300 text-xs md:text-sm max-w-xl leading-relaxed">
            Deploy a 24/7 AI Receptionist, automate patient appointment bookings, manage doctor shifts, and scale your dental practice.
          </p>
        </div>

        {/* Multi-Step Wizard Progress */}
        <div className="bg-[#0a0f1e]/80 border border-slate-800 rounded-2xl p-4 flex items-center justify-between shadow-xl">
          {[
            { num: 1, title: 'Clinic Info' },
            { num: 2, title: 'Select SaaS Plan' },
            { num: 3, title: 'AI Assistant Setup' },
            { num: 4, title: 'Activation' },
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold font-heading transition-all ${
                  step === s.num
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md shadow-teal-500/30'
                    : step > s.num
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                {step > s.num ? <HiCheck /> : s.num}
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
        <div className="bg-[#0b1120]/95 border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-xl">
          {/* STEP 1: Clinic Profile Details */}
          {step === 1 && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="border-b border-slate-800/80 pb-4">
                <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                  <HiBuildingOffice2 className="text-teal-400" />
                  <span>Step 1: Dental Clinic Profile & Contact</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your practice details to set up your dedicated clinic workspace.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Clinic Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={clinicData.clinicName}
                      onChange={(e) => handleInputChange('clinicName', e.target.value)}
                      placeholder="e.g. Apex Dental Care & Implant Center"
                      className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500 transition"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Lead Doctor / Clinic Director *
                  </label>
                  <input
                    type="text"
                    value={clinicData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    placeholder="e.g. Dr. Krina Khunt"
                    className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500 transition"
                    required
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
                    placeholder="reception@clinic.com"
                    className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500 transition font-mono"
                    required
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
                    placeholder="+91 9876543210"
                    className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500 transition font-mono"
                    required
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
                    Number of Dentists
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

              <div className="flex items-center justify-end pt-4 border-t border-slate-800/80 mt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="btn-shimmer px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-500/20"
                >
                  <span>Continue to SaaS Subscription Plan</span>
                  <HiArrowRight />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Select SaaS Subscription Tier */}
          {step === 2 && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="border-b border-slate-800/80 pb-4">
                <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                  <HiSparkles className="text-teal-400" />
                  <span>Step 2: Choose SaaS Premium Plan for Your Clinic</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Select a subscription tier tailored to your dental clinic size and automation needs.
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
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
                      }`}
                    >
                      {p.highlighted && (
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md">
                          {p.badge}
                        </span>
                      )}

                      <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-extrabold text-base text-white font-heading">{p.name}</h3>
                          {isSelected && <HiCheckCircle className="text-teal-400 text-xl" />}
                        </div>

                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-extrabold text-white font-heading">{p.price}</span>
                          <span className="text-xs text-slate-400 font-medium">{p.period}</span>
                        </div>

                        <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                      </div>

                      <div className="border-t border-slate-800/80 pt-4 flex flex-col gap-2">
                        {p.features.map((feat, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                            <HiCheck className="text-teal-400 text-sm shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 mt-2">
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
                  className="btn-shimmer px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-teal-500/20"
                >
                  <span>Configure AI Assistant</span>
                  <HiArrowRight />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: AI Assistant & Persona Setup */}
          {step === 3 && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div className="border-b border-slate-800/80 pb-4">
                <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
                  <HiSparkles className="text-teal-400" />
                  <span>Step 3: Customize AI Receptionist & Handoff</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Configure your clinic's AI receptionist assistant persona, working hours, and emergency numbers.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    AI Assistant Name & Persona
                  </label>
                  <input
                    type="text"
                    value={clinicData.assistantName}
                    onChange={(e) => handleInputChange('assistantName', e.target.value)}
                    placeholder="e.g. Maya - AI Receptionist"
                    className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500 transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Emergency Escalation Phone Line *
                  </label>
                  <input
                    type="tel"
                    value={clinicData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                    placeholder="+91 98765 00000"
                    className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500 transition font-mono"
                  />
                  <span className="text-[11px] text-amber-400 mt-1 block font-medium">
                    🚨 Severe dental trauma or bleeding queries will automatically trigger emergency instructions to call this number.
                  </span>
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Clinic Operating Schedule
                  </label>
                  <input
                    type="text"
                    value={clinicData.operatingHours}
                    onChange={(e) => handleInputChange('operatingHours', e.target.value)}
                    placeholder="e.g. Mon-Sat: 9:00 AM - 8:00 PM, Sun: Closed"
                    className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-teal-500 transition"
                  />
                </div>
              </div>

              {/* Summary Preview Box */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 text-xs flex flex-col gap-3">
                <span className="font-bold text-teal-300 uppercase tracking-wider text-[11px] font-heading flex items-center gap-2">
                  <HiShieldCheck className="text-teal-400 text-base" />
                  <span>Clinic Registration Summary</span>
                </span>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-slate-300 border-t border-slate-800 pt-3">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Clinic:</span>
                    <strong className="text-white text-xs">{clinicData.clinicName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Director:</span>
                    <strong className="text-white text-xs">{clinicData.ownerName}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Plan:</span>
                    <strong className="text-teal-300 text-xs uppercase">{selectedPlan} Plan</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Assistant:</span>
                    <strong className="text-white text-xs">{clinicData.assistantName}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 mt-2">
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
                  className="btn-shimmer px-7 py-3 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xl shadow-teal-500/25"
                >
                  <HiCheckCircle className="text-base" />
                  <span>Complete Registration & Activate</span>
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
                  Clinic Successfully Registered!
                </h2>
                <p className="text-xs md:text-sm text-slate-300 mt-2 max-w-lg mx-auto">
                  Your clinic account <strong className="text-teal-300">{clinicData.clinicName}</strong> has been registered with the <span className="uppercase text-emerald-400 font-bold">{selectedPlan} Plan</span>.
                </p>
              </div>

              {/* Widget Code Box */}
              <div className="w-full bg-[#050811] border border-slate-800 rounded-2xl p-5 text-left flex flex-col gap-3 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-300 flex items-center gap-2 font-heading">
                    <HiCodeBracket className="text-base" />
                    <span>AI Receptionist Website Embed Script</span>
                  </span>
                  <button
                    onClick={copyWidgetScript}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 transition cursor-pointer flex items-center gap-1.5"
                  >
                    <HiClipboardDocumentCheck />
                    <span>{copiedScript ? 'Copied to Clipboard!' : 'Copy Script Code'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">
                  Paste this 1-line HTML snippet into your dental clinic website header/footer to instantly enable 24/7 AI Receptionist chat & booking:
                </p>
                <pre className="bg-[#0a0f1d] p-3 rounded-xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto select-all">
                  {widgetScript}
                </pre>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="btn-shimmer px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 text-slate-950 font-bold text-xs shadow-xl shadow-teal-500/25 transition cursor-pointer hover:scale-[1.02] flex items-center gap-2"
                >
                  <span>Open Clinic Staff Portal Dashboard</span>
                  <HiArrowRight className="text-base" />
                </button>

                <button
                  onClick={() => navigate('/pricing')}
                  className="px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition cursor-pointer"
                >
                  View Subscription Details
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
