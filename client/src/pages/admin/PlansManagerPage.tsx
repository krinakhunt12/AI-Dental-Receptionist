import React from 'react';
import { PLANS } from '../../config/plans';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { CreditCard, Edit3 } from 'lucide-react';

export const PlansManagerPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">SaaS Plans & Coupon Manager</h1>
        <p className="text-xs text-slate-400">Configure pricing tiers, limit caps, and feature flags across plans.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {(Object.keys(PLANS) as ('STARTER' | 'GROWTH' | 'ENTERPRISE')[]).map((pK) => {
          const p = PLANS[pK];
          return (
            <div key={pK} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">{p.name}</h3>
                <Badge variant="teal">${p.priceMonthly}/mo</Badge>
              </div>
              <p className="text-xs text-slate-400">{p.description}</p>
              <Button size="sm" variant="outline" icon={Edit3} className="w-full justify-center">
                Edit Limits & Pricing
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
