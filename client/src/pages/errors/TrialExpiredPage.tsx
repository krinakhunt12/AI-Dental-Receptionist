import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, CreditCard } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const TrialExpiredPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen theme-light bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Your 14-Day Free Trial Expired</h1>
        <p className="text-xs text-slate-500">
          Upgrade your subscription plan to continue using your AI receptionist and calendar booking features.
        </p>
        <Button onClick={() => navigate('/app/billing')} icon={CreditCard} className="w-full justify-center">
          Go to Billing & Choose Plan
        </Button>
      </div>
    </div>
  );
};
