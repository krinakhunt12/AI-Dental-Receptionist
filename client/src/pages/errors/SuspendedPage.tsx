import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CreditCard } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const SuspendedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen theme-light bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <Lock className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Clinic Account Suspended</h1>
        <p className="text-xs text-slate-500">
          Payment failed for your current subscription cycle. Please update your payment method in billing.
        </p>
        <Button onClick={() => navigate('/app/billing')} icon={CreditCard} className="w-full justify-center">
          Update Payment Method
        </Button>
      </div>
    </div>
  );
};
