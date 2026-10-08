import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MailCheck, ArrowRight } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const VerifyEmailPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6 animate-fade-in">
      <div className="w-16 h-16 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto">
        <MailCheck className="w-8 h-8" />
      </div>

      <h1 className="text-2xl font-bold text-white">Check Your Email Inbox</h1>

      <p className="text-xs text-slate-300 leading-relaxed">
        We sent a verification link to <strong>krina@smilecare.ai</strong>. Click the link in the email to activate your account.
      </p>

      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-400">
        Demo shortcut: Click below to simulate email verified and jump straight into your setup checklist!
      </div>

      <Button
        onClick={() => navigate('/app/onboarding')}
        icon={ArrowRight}
        className="w-full justify-center"
      >
        Verified! Proceed to Onboarding
      </Button>
    </div>
  );
};
