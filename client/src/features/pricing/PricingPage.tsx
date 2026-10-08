import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  X,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  Building2,
  Lock,
  MessageCircle,
  Zap,
  Users,
  Star
} from 'lucide-react';

export default function PricingPage() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const discountMultiplier = billingCycle === 'yearly' ? 0.8 : 1; // 20% discount for annual

  const PLANS = [
    {
      id: 'starter',
      name: 'Starter Practice',
      monthlyPrice: 2999,
      yearlyPrice: 2399,
      period: '/month',
      desc: 'Perfect for single-dentist practices starting with automated AI scheduling.',
      badge: 'Starter',
      cta: 'Start 14-Day Free Trial',
      popular: false,
      features: [
        { name: '24/7 AI Receptionist Chat', included: true },
        { name: 'Monthly AI Conversations', detail: '300 Chats / Mo' },
        { name: 'Doctor Roster Seats', detail: '1 Dentist' },
        { name: 'Treatment Rates Catalog', detail: 'Up to 10 Services' },
        { name: '"Train Your AI" Documents', detail: '2 PDF Uploads' },
        { name: 'Emergency Trauma Escalation', included: true },
        { name: 'SMS & WhatsApp Alerts', included: false },
        { name: 'Custom Domain & Branding', included: false },
        { name: 'Dedicated Account Manager', included: false },
      ],
    },
    {
      id: 'growth',
      name: 'Growth Suite',
      monthlyPrice: 6999,
      yearlyPrice: 5599,
      period: '/month',
      desc: 'Full-featured AI Receptionist for growing practices and multi-doctor teams.',
      badge: 'Most Popular ⭐',
      cta: 'Start 14-Day Free Trial',
      popular: true,
      features: [
        { name: '24/7 AI Receptionist Chat', included: true },
        { name: 'Monthly AI Conversations', detail: '1,000 Chats / Mo' },
        { name: 'Doctor Roster Seats', detail: 'Up to 5 Dentists' },
        { name: 'Treatment Rates Catalog', detail: 'Unlimited Services' },
        { name: '"Train Your AI" Documents', detail: 'Unlimited PDFs' },
        { name: 'Emergency Trauma Escalation', included: true },
        { name: 'SMS & WhatsApp Alerts', included: true },
        { name: 'Custom Domain & Branding', detail: 'Teal/Custom Theme' },
        { name: 'Dedicated Account Manager', included: false },
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise Chain',
      monthlyPrice: 14999,
      yearlyPrice: 11999,
      period: '/month',
      desc: 'For multi-location clinic chains requiring AI phone receptionist & custom LLM.',
      badge: 'Full Automation',
      cta: 'Contact Enterprise Sales',
      popular: false,
      features: [
        { name: '24/7 AI Web & Phone Voice', included: true },
        { name: 'Monthly AI Conversations', detail: 'Unlimited Chats' },
        { name: 'Doctor Roster Seats', detail: 'Unlimited Dentists' },
        { name: 'Treatment Rates Catalog', detail: 'Multi-Location' },
        { name: '"Train Your AI" Documents', detail: 'Enterprise Vector DB' },
        { name: 'Emergency Trauma Escalation', included: true },
        { name: 'SMS & WhatsApp Alerts', included: true },
        { name: 'Custom Domain & Branding', detail: 'Full White-Label' },
        { name: 'Dedicated Account Manager', detail: '24/7 Priority SLA' },
      ],
    },
  ];

  const ADDONS = [
    {
      name: 'WhatsApp Business Integration',
      price: '₹1,499 / mo',
      desc: 'Connect your clinic official WhatsApp Business number for instant AI patient chats.',
      icon: MessageCircle,
    },
    {
      name: 'Extra 500 AI Conversations',
      price: '₹999 / pack',
      desc: 'Top up your monthly conversation volume without changing subscription tier.',
      icon: Zap,
    },
    {
      name: 'Additional Doctor Roster Seat',
      price: '₹499 / doctor / mo',
      desc: 'Add individual specialist shift schedules and calendar sync for extra practitioners.',
      icon: Users,
    },
  ];

  const FAQS = [
    {
      q: 'Do I need a credit card to sign up for the 14-day free trial?',
      a: 'No credit card is required! You get full access to the Growth Plan features for 14 days. If you decide to stay after 14 days, you can choose a subscription plan and enter payment details.',
    },
    {
      q: 'How does the AI Receptionist integrate with our clinic website?',
      a: 'After completing clinic registration, you receive a 1-line script tag. Simply copy and paste it into your clinic website header or footer. Your AI receptionist will immediately begin handling patient queries 24/7.',
    },
    {
      q: 'Can our clinic upload procedure price lists and insurance guidelines?',
      a: 'Yes! Under the "Train Your AI" section in your clinic dashboard, you can upload PDFs or text price lists. The AI uses this exact information to answer patient inquiries accurately.',
    },
    {
      q: 'What happens when a patient reports an urgent dental emergency?',
      a: 'Our Emergency Detection engine recognizes urgent keywords (e.g. severe pain, trauma, uncontrolled bleeding) and immediately provides emergency instructions and directs the patient to call your on-call phone line.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 font-sans pb-24 select-none">
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-[#080d1e] via-[#0b1329] to-[#050811] border-b border-white/10 pt-16 pb-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-4 relative z-10">
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>14-Day Free Trial • No Credit Card Required</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-heading">
            Simple, Transparent Subscription Plans for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
              Your Dental Clinic
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Boost patient bookings by 40%, eliminate missed calls, and deploy an intelligent 24/7 AI front desk receptionist.
          </p>

          {/* Billing Cycle Switcher */}
          <div className="mt-8 inline-flex items-center gap-3 bg-[#0a0f1d] border border-slate-800 p-1.5 rounded-2xl shadow-xl">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-slate-800 text-teal-300 border border-teal-500/30 shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                billingCycle === 'yearly'
                  ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 shadow-md font-extrabold'
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
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan) => {
            const displayPrice = billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
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

                <div className="flex flex-col gap-5">
                  <div>
                    <h2 className="text-xl font-bold text-white font-heading">{plan.name}</h2>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{plan.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-1 pt-3 border-t border-slate-800">
                    <span className="text-4xl font-extrabold text-white font-heading">
                      ₹{displayPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{plan.period}</span>
                    {billingCycle === 'yearly' && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded ml-auto">
                        Save 20%
                      </span>
                    )}
                  </div>

                  {/* Included Features List */}
                  <div className="flex flex-col gap-3 pt-4 border-t border-slate-800">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Included Capabilities:
                    </span>
                    {plan.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-2 text-slate-300">
                          {feat.included !== false ? (
                            <Check className="w-4 h-4 text-teal-400 shrink-0" />
                          ) : (
                            <X className="w-4 h-4 text-slate-600 shrink-0" />
                          )}
                          <span className={feat.included === false ? 'text-slate-500 line-through' : ''}>
                            {feat.name}
                          </span>
                        </span>
                        {feat.detail && (
                          <span className="text-[10px] font-bold text-teal-300 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800">
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
                      ? 'bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 shadow-teal-500/25'
                      : 'bg-slate-800 hover:bg-teal-500 hover:text-slate-950 text-white'
                  }`}
                >
                  <span>{plan.cta}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Add-on Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 flex flex-col gap-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Flexible Scaling</span>
          <h2 className="text-3xl font-extrabold text-white font-heading mt-1">Optional SaaS Add-ons</h2>
          <p className="text-xs text-slate-400 mt-1">Customize your subscription with extra capacity when needed.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ADDONS.map((addon, idx) => {
            const AddonIcon = addon.icon;
            return (
              <div
                key={idx}
                className="bg-[#090e1a] border border-slate-800 rounded-2xl p-6 flex flex-col justify-between gap-4 shadow-lg hover:border-teal-500/30 transition"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 flex items-center justify-center">
                      <AddonIcon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-teal-300 font-mono bg-teal-950 px-2.5 py-1 rounded border border-teal-800">
                      {addon.price}
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-sm font-heading">{addon.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{addon.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 mt-24 flex flex-col gap-8">
        <div className="text-center">
          <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Got Questions?</span>
          <h2 className="text-3xl font-extrabold text-white font-heading mt-1">Frequently Asked Questions</h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="bg-[#090d1a] border border-slate-800 rounded-2xl p-6 flex flex-col gap-2 shadow-lg"
            >
              <h3 className="font-bold text-white text-sm font-heading flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed pl-6 font-normal">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
