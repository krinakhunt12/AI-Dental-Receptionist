import React, { useState } from 'react';
import {
  useSubscription,
  useInvoices,
  useUpdateSubscriptionPlan,
  useCancelSubscription,
} from '../../features/subscriptions/hooks/useSubscriptions';
import { PLANS } from '../../config/plans';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { useUIStore } from '../../store/useUIStore';
import { CreditCard, Sparkles, Download, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

export const BillingPage: React.FC = () => {
  const { data: subscription, isLoading: isLoadingSub, isError: isErrorSub, refetch: refetchSub } = useSubscription();
  const { data: invoices = [], isLoading: isLoadingInvoices } = useInvoices();
  const updatePlanMut = useUpdateSubscriptionPlan();
  const cancelSubMut = useCancelSubscription();
  const { addToast } = useUIStore();

  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const planName = subscription?.plan?.name || 'Pro Plan';
  const planPrice = subscription?.plan?.priceMonthly ?? 99;
  const status = subscription?.status || 'ACTIVE';

  const handleSelectPlan = async (code: string) => {
    try {
      await updatePlanMut.mutateAsync({ planCode: code });
      setIsUpgradeModalOpen(false);
      addToast({ type: 'success', title: 'Plan updated!', message: `Switched subscription to ${code}.` });
    } catch {
      addToast({ type: 'error', title: 'Update failed', message: 'Could not change subscription plan.' });
    }
  };

  const handleCancel = async () => {
    try {
      await cancelSubMut.mutateAsync();
      setIsCancelModalOpen(false);
      addToast({ type: 'info', title: 'Subscription cancelled', message: 'Access will remain active until end of billing cycle.' });
    } catch {
      addToast({ type: 'error', title: 'Cancellation failed', message: 'Could not cancel subscription.' });
    }
  };

  if (isLoadingSub) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Billing & Subscription Management</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (isErrorSub) {
    return (
      <div className="p-6">
        <ErrorState
          title="Failed to load subscription details"
          message="Could not load clinic subscription and billing profile."
          onRetry={() => refetchSub()}
        />
      </div>
    );
  }

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
            <Badge variant={status === 'ACTIVE' ? 'success' : 'warning'}>{status}</Badge>
          </div>

          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-extrabold text-slate-900">{planName}</h2>
            <span className="text-sm font-semibold text-slate-500">${planPrice}/mo</span>
          </div>

          <p className="text-xs text-slate-500">
            {subscription?.plan?.code === 'PRO'
              ? 'Comprehensive AI receptionist with voice call handling, unlimited triage escalation, and multi-dentist coordination.'
              : 'Standard automated dental reception and appointment scheduling.'}
          </p>

          <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
            <span className="text-slate-500">
              Billing Period: {subscription?.billingPeriod || 'MONTHLY'} • Current Cycle Ends:{' '}
              {subscription?.currentPeriodEnd ? new Date(subscription.currentPeriodEnd).toLocaleDateString() : 'N/A'}
            </span>
            {status !== 'CANCELLED' && (
              <button
                onClick={() => setIsCancelModalOpen(true)}
                className="text-rose-600 font-bold hover:underline cursor-pointer"
              >
                Cancel Subscription
              </button>
            )}
          </div>
        </div>

        {/* Usage Limits */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Plan Capability Limits</h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-800 mb-1">
                <span>Monthly AI Conversations</span>
                <span className="text-teal-600">
                  Included up to {subscription?.plan?.maxAiCallsPerMonth ?? 5000} calls/mo
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-600" style={{ width: '45%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-800 mb-1">
                <span>Doctors Roster Capacity</span>
                <span className="text-teal-600">
                  Up to {subscription?.plan?.maxDoctors ?? 15} doctors
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-600" style={{ width: '30%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-800 mb-1">
                <span>Appointments Booking Engine</span>
                <span className="text-teal-600">
                  Up to {subscription?.plan?.maxAppointmentsPerMonth ?? 2000} bookings/mo
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-600" style={{ width: '25%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden h-[380px] flex flex-col">
        <div className="p-4 border-b border-slate-100 font-bold text-sm text-slate-900 shrink-0">
          Payment History & Invoices ({invoices.length})
        </div>

        <div className="flex-1 overflow-y-auto">
          {invoices.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={CreditCard}
                title="No invoices yet"
                description="Your clinic invoice receipts and automated monthly payment statements will be shown here."
              />
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead className="bg-slate-50/75 sticky top-0 border-b border-slate-200">
                <tr>
                  <th className="p-3 text-slate-500 font-semibold">Invoice ID</th>
                  <th className="p-3 text-slate-500 font-semibold">Date</th>
                  <th className="p-3 text-slate-500 font-semibold">Amount</th>
                  <th className="p-3 text-slate-500 font-semibold">Status</th>
                  <th className="p-3 text-slate-500 font-semibold text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50">
                    <td className="p-3 font-mono font-bold text-slate-900">{inv.number || inv.id.slice(0, 8)}</td>
                    <td className="p-3 text-slate-600">
                      {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : 'Recent'}
                    </td>
                    <td className="p-3 font-bold text-slate-900">${inv.amount}</td>
                    <td className="p-3">
                      <Badge variant={String(inv.status).toLowerCase() === 'paid' ? 'success' : 'warning'}>
                        {inv.status}
                      </Badge>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => addToast({ type: 'info', title: 'Invoice Receipt', message: 'Downloading invoice statement...' })}
                        className="inline-flex items-center gap-1 text-teal-600 hover:text-teal-700 font-bold cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>PDF</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Upgrade Plan Modal */}
      <Modal isOpen={isUpgradeModalOpen} onClose={() => setIsUpgradeModalOpen(false)} title="Select Subscription Plan">
        <div className="space-y-4">
          <p className="text-xs text-slate-500">Choose the optimal tier for your dental practice volume.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { code: 'FREE_TRIAL', name: 'Free Trial', price: 0, desc: '50 appointments/mo, 2 doctors' },
              { code: 'BASIC', name: 'Basic Plan', price: 49, desc: '300 appointments/mo, 5 doctors' },
              { code: 'PRO', name: 'Pro Plan', price: 99, desc: '2000 appointments/mo, 15 doctors' },
            ].map((p) => (
              <div
                key={p.code}
                onClick={() => handleSelectPlan(p.code)}
                className="p-4 rounded-xl border border-slate-200 hover:border-teal-500 cursor-pointer space-y-2 transition-all hover:shadow-xs"
              >
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                  <span className="text-xs font-bold text-teal-600">${p.price}/mo</span>
                </div>
                <p className="text-[11px] text-slate-500">{p.desc}</p>
                <Button size="sm" variant="outline" className="w-full justify-center text-xs mt-2" isLoading={updatePlanMut.isPending}>
                  Select Tier
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Cancel Modal */}
      <Modal isOpen={isCancelModalOpen} onClose={() => setIsCancelModalOpen(false)} title="Cancel Subscription">
        <div className="space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Are you sure you want to cancel your SmileCare AI subscription? Your AI receptionist will continue to handle appointments until the current billing period expires.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsCancelModalOpen(false)}>
              Keep Subscription
            </Button>
            <Button variant="danger" size="sm" onClick={handleCancel} isLoading={cancelSubMut.isPending}>
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
