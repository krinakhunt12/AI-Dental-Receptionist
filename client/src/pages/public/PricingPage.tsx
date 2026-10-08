import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PLANS } from '../../config/plans';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-16 animate-fade-in">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <Badge variant="teal" icon={<Sparkles className="w-3.5 h-3.5" />}>
          TRANSPARENT CLINIC PRICING
        </Badge>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          Choose the Perfect Plan for <span className="gradient-text-teal">Your Practice</span>
        </h1>
        <p className="text-slate-300 text-sm md:text-base">
          All plans include a 14-day free trial. No credit card required to get started.
        </p>

        {/* Toggle */}
        <div className="pt-4 inline-flex items-center p-1 bg-slate-900 border border-slate-800 rounded-2xl">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              billingCycle === 'monthly' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            Monthly Billing
          </button>
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              billingCycle === 'yearly' ? 'bg-teal-500 text-slate-950 font-bold' : 'text-slate-400'
            }`}
          >
            <span>Annual Billing</span>
            <span className="px-2 py-0.5 bg-emerald-400 text-slate-950 font-extrabold text-[10px] rounded-full">
              SAVE 20%
            </span>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {(Object.keys(PLANS) as ('STARTER' | 'GROWTH' | 'ENTERPRISE')[]).map((planKey) => {
          const plan = PLANS[planKey];
          const price = billingCycle === 'yearly' ? plan.priceYearly : plan.priceMonthly;

          return (
            <div
              key={planKey}
              className={`p-8 rounded-3xl border transition-all flex flex-col justify-between relative ${
                plan.popular
                  ? 'bg-gradient-to-b from-teal-950/40 via-slate-900 to-slate-900 border-teal-500/50 shadow-2xl ring-2 ring-teal-500/30'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3.5 right-6 px-3 py-1 rounded-full text-xs font-extrabold bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 shadow-md">
                  {plan.badge}
                </span>
              )}

              <div>
                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                <p className="text-xs text-slate-400 mt-1">{plan.description}</p>

                <div className="my-6">
                  <span className="text-4xl font-extrabold text-white">${price}</span>
                  <span className="text-xs text-slate-400"> / month</span>
                  {billingCycle === 'yearly' && (
                    <span className="block text-[11px] text-teal-400 font-semibold mt-1">
                      Billed annually (${price * 12}/year)
                    </span>
                  )}
                </div>

                <div className="space-y-3 border-t border-slate-800 pt-4">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Included Features:
                  </span>
                  <ul className="space-y-2.5 text-xs text-slate-300">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8">
                <Button
                  size="lg"
                  variant={plan.popular ? 'primary' : 'outline'}
                  onClick={() => navigate('/register')}
                  className="w-full justify-center"
                >
                  Start 14-Day Free Trial
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
