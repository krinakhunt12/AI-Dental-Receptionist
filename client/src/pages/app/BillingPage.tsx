import React, { useState } from 'react';
import { useTenant } from '../../app/TenantProvider';
import { PLANS } from '../../config/plans';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useInvoicesQuery } from '../../api/mockClient';
import { useUIStore } from '../../store/useUIStore';
import { CreditCard, Sparkles, Download, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export const BillingPage: React.FC = () => {
  const { tenant, plan, updatePlan } = useTenant();
  const { data: invoices = [] } = useInvoicesQuery();
  const { addToast } = useUIStore();

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const usagePercentage = Math.round(
    (tenant.usage.conversationsUsed / tenant.usage.conversationsMax) * 100
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-teal-600" />
            Billing & Subscription Management
          </h1>
          <p className="text-xs text-slate-500">Manage your subscription plan, usage limits, payment methods, and invoices.</p>
        </div>

        <Button icon={Sparkles} onClick={() => setIsUpgradeModalOpen(true)}>
          Change Subscription Plan
        </Button>
      </div>

      {/* Current Plan Card & Usage */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Active Plan</span>
            <Badge variant="success">{tenant.status}</Badge>
          </div>

          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-extrabold text-slate-900">{plan.name}</h2>
            <span className="text-sm font-semibold text-slate-500">${plan.priceMonthly}/mo</span>
          </div>

          <p className="text-xs text-slate-500">{plan.description}</p>

          <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
            <span className="text-slate-500">Next Billing Date: Nov 1, 2026</span>
            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="text-rose-600 font-bold hover:underline cursor-pointer"
            >
              Cancel Subscription
            </button>
          </div>
        </div>

        {/* Usage Meters */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Plan Capability Limits</h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-800 mb-1">
                <span>AI Chats ({usagePercentage}%)</span>
                <span className="text-teal-600">
                  {tenant.usage.conversationsUsed} / {tenant.usage.conversationsMax}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-600" style={{ width: `${usagePercentage}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-800 mb-1">
                <span>Doctors Roster</span>
                <span className="text-teal-600">
                  {tenant.usage.doctorsUsed} / {tenant.usage.doctorsMax}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-600" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-sm text-slate-900">
          Payment History & Invoices
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase">
            <tr>
              <th className="p-4">Invoice #</th>
              <th className="p-4">Date</th>
              <th className="p-4">Plan</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">PDF Download</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-900">{inv.number}</td>
                <td className="p-4 text-slate-600">{inv.date}</td>
                <td className="p-4 text-slate-600">{inv.planName}</td>
                <td className="p-4 font-bold text-slate-900">${inv.amount}</td>
                <td className="p-4">
                  <Badge variant={inv.status === 'Paid' ? 'success' : 'warning'}>{inv.status}</Badge>
                </td>
                <td className="p-4 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={Download}
                    onClick={() => addToast({ type: 'success', title: 'Downloading PDF Invoice...' })}
                  >
                    Download
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upgrade Plan Modal */}
      <Modal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        title="Upgrade Your Subscription"
        description="Select a plan below. Proration preview will be calculated automatically."
        size="xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
          {(Object.keys(PLANS) as ('STARTER' | 'GROWTH' | 'ENTERPRISE')[]).map((pKey) => {
            const p = PLANS[pKey];
            const isCurrent = tenant.planId === pKey;
            return (
              <div
                key={pKey}
                className={`p-4 rounded-xl border space-y-3 ${
                  isCurrent ? 'bg-teal-50 border-teal-400' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <h4 className="font-bold text-sm">{p.name}</h4>
                <div className="text-xl font-extrabold">${p.priceMonthly}/mo</div>
                <Button
                  size="sm"
                  variant={isCurrent ? 'outline' : 'primary'}
                  disabled={isCurrent}
                  onClick={() => {
                    updatePlan(pKey);
                    setIsUpgradeModalOpen(false);
                    addToast({ type: 'success', title: `Upgraded to ${p.name}!` });
                  }}
                  className="w-full justify-center text-xs"
                >
                  {isCurrent ? 'Current Plan' : 'Switch Plan'}
                </Button>
              </div>
            );
          })}
        </div>
      </Modal>

      {/* Cancel Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Pause or Cancel Subscription"
        description="Would you like to pause your subscription for 1-3 months instead?"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Pausing retains all your clinic AI knowledge base documents and patient transcripts intact.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsCancelModalOpen(false)}>
              Keep My Plan
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setIsCancelModalOpen(false);
                addToast({ type: 'info', title: 'Subscription Paused' });
              }}
            >
              Pause Subscription
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
