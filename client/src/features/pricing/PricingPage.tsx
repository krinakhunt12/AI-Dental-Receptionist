import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../components/common/Logo';
import {
  HiCheck,
  HiSparkles,
  HiShieldCheck,
  HiArrowRight,
  HiQuestionMarkCircle,
  HiBuildingOffice2,
  HiCheckCircle,
  HiXMark,
} from 'react-icons/hi2';

export default function PricingPage() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const discountMultiplier = billingCycle === 'yearly' ? 0.8 : 1; // 20% discount for annual

  const PLANS = [
    {
      id: 'starter',
      name: 'Starter Practice',
      monthlyPrice: 2999,
      period: '/month',
      desc: 'Perfect for single-dentist practices seeking automated booking & triage.',
      badge: 'Starter',
      cta: 'Register Starter Clinic',
      popular: false,
      features: [
        { name: 'AI Receptionist Chat', included: true },
        { name: 'Monthly AI Bookings', detail: '300 Bookings' },
        { name: 'Dentist Seats Roster', detail: '1 Doctor' },
        { name: 'Services Catalog', detail: 'Up to 10 Services' },
        { name: 'RAG Knowledge Documents', detail: '2 PDF Uploads' },
        { name: 'Custom AI Voice Persona', included: false },
        { name: 'Emergency Escalation Handoff', included: true },
        { name: 'SMS / WhatsApp Alerts', included: false },
        { name: 'Dedicated SLA Support', included: false },
      ],
    },
    {
      id: 'pro',
      name: 'Professional Suite',
      monthlyPrice: 6999,
      period: '/month',
      desc: 'Full-featured AI Receptionist suite for growing dental clinics and teams.',
      badge: 'Most Popular ⭐',
      cta: 'Register Pro Clinic',
      popular: true,
      features: [
        { name: 'AI Receptionist Chat', included: true },
        { name: 'Monthly AI Bookings', detail: 'Unlimited' },
        { name: 'Dentist Seats Roster', detail: 'Up to 10 Doctors' },
        { name: 'Services Catalog', detail: 'Unlimited Services' },
        { name: 'RAG Knowledge Documents', detail: 'Unlimited PDFs' },
        { name: 'Custom AI Voice Persona', included: true },
        { name: 'Emergency Escalation Handoff', included: true },
        { name: 'SMS / WhatsApp Alerts', included: true },
        { name: 'Dedicated SLA Support', detail: 'Priority 24/7' },
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise Chain',
      monthlyPrice: 14999,
      period: '/month',
      desc: 'For multi-location clinic chains requiring telephony AI voice receptionist & API.',
      badge: 'Full Automation',
      cta: 'Contact Enterprise Sales',
      popular: false,
      features: [
        { name: 'AI Receptionist Chat & Voice Call', included: true },
        { name: 'Monthly AI Bookings', detail: 'Unlimited Multi-Clinic' },
        { name: 'Dentist Seats Roster', detail: 'Unlimited Doctors' },
        { name: 'Services Catalog', detail: 'Unlimited Multi-Tier' },
        { name: 'RAG Knowledge Documents', detail: 'Enterprise Vector DB' },
        { name: 'Custom AI Voice Persona', included: true },
        { name: 'Emergency Escalation Handoff', included: true },
        { name: 'SMS / WhatsApp Alerts', included: true },
        { name: 'Dedicated SLA Support', detail: '99.9% SLA & Manager' },
      ],
    },
  ];

  const FAQS = [
    {
      q: 'How does the Dental Clinic AI Receptionist integrate with our clinic website?',
      a: 'After registering your clinic, you receive a simple 1-line JavaScript code. Simply paste it into your clinic website header or footer. The AI widget will instantly start handling patient questions and appointment bookings 24/7.',
    },
    {
      q: 'Can our clinic configure custom procedure rates and dentist schedules?',
      a: 'Yes! Inside the Clinic Staff Portal, clinic admins can add/edit dentist rosters, shift timings, treatment pricing, and upload clinic documentation (PDFs, FAQs) to train your AI receptionist.',
    },
    {
      q: 'What happens if a patient reports severe dental trauma or emergency pain?',
      a: 'Our built-in Emergency Intent Detector instantly intercepts urgent medical complaints (e.g. severe bleeding, facial trauma) and directs the patient to seek urgent emergency care or call your configured emergency telephone line.',
    },
    {
      q: 'Can I upgrade or downgrade our subscription plan anytime?',
      a: 'Absolutely. You can change your plan at any time in the Clinic Settings section of your dashboard. Upgrades take effect immediately.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 font-sans pb-20">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#080d1e] via-[#0b1329] to-[#050811] border-b border-slate-800/80 pt-12 pb-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg">
            <HiSparkles className="text-teal-400" />
            <span>SaaS Pricing & Plans for Dental Clinics</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-heading">
            Simple, Transparent Subscription Plans for{' '}
            <span className="gradient-text-teal">Your Dental Practice</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Boost patient bookings by 40%, eliminate missed calls, and deliver 24/7 intelligent AI front desk reception for your registered clinic.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="mt-6 inline-flex items-center gap-3 bg-[#0a0f1d] border border-slate-800 p-1.5 rounded-2xl shadow-xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-slate-800 text-teal-300 border border-teal-500/30 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-md font-extrabold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>Annual Billing</span>
              <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => {
            const finalPrice = Math.round(plan.monthlyPrice * discountMultiplier);
            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-8 flex flex-col justify-between gap-8 transition-all duration-300 relative ${
                  plan.popular
                    ? 'bg-gradient-to-b from-teal-950/90 via-slate-900 to-[#0b1122] border-2 border-teal-500 shadow-2xl shadow-teal-500/20 scale-[1.02]'
                    : 'bg-[#0a0e1c] border border-slate-800 hover:border-slate-700 shadow-xl'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs font-extrabold uppercase tracking-wider px-4 py-1 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 shadow-lg">
                    {plan.badge}
                  </span>
                )}

                <div className="flex flex-col gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white font-heading">{plan.name}</h2>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{plan.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-1 pt-2 border-t border-slate-800/80">
                    <span className="text-4xl font-extrabold text-white font-heading">
                      ₹{finalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{plan.period}</span>
                    {billingCycle === 'yearly' && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-md ml-auto">
                        Billed Annually
                      </span>
                    )}
                  </div>

                  {/* Features List */}
                  <div className="flex flex-col gap-3 pt-4 border-t border-slate-800/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Included Capabilities:
                    </span>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2 text-slate-300">
                          {feat.included !== false ? (
                            <HiCheck className="text-teal-400 text-base shrink-0" />
                          ) : (
                            <HiXMark className="text-slate-600 text-base shrink-0" />
                          )}
                          <span className={feat.included === false ? 'text-slate-500 line-through' : ''}>
                            {feat.name}
                          </span>
                        </span>
                        {feat.detail && (
                          <span className="text-[11px] font-bold text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/60">
                            {feat.detail}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => navigate('/register-clinic')}
                  className={`btn-shimmer w-full py-3.5 rounded-2xl font-bold text-xs shadow-lg transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-teal-500 via-emerald-500 to-teal-400 hover:from-teal-400 hover:to-emerald-400 text-slate-950 shadow-teal-500/25'
                      : 'bg-slate-800 hover:bg-teal-600 hover:text-slate-950 text-white'
                  }`}
                >
                  <span>{plan.cta}</span>
                  <HiArrowRight />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 mt-24 flex flex-col gap-8">
        <div className="text-center">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Got Questions?</span>
          <h2 className="text-3xl font-bold text-white font-heading mt-1">Frequently Asked Questions</h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#090d1a] border border-slate-800/90 rounded-2xl p-6 flex flex-col gap-2 shadow-lg"
            >
              <h3 className="font-bold text-white text-base font-heading flex items-center gap-2">
                <HiQuestionMarkCircle className="text-teal-400 text-lg shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed pl-7 font-normal">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
