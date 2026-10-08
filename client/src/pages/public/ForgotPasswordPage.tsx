import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useUIStore();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    addToast({ type: 'success', title: 'Reset Link Sent', message: 'Check your email inbox.' });
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white">Reset Your Password</h1>
      <p className="text-xs text-slate-400">Enter your clinic email to receive a password reset link.</p>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-left space-y-4">
        {sent ? (
          <div className="text-center py-4 space-y-4">
            <p className="text-xs text-emerald-400 font-semibold">
              Password reset link sent to {email}!
            </p>
            <Button size="sm" onClick={() => navigate('/reset-password')} className="w-full justify-center">
              Go to Reset Password (Demo)
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Work Email"
              type="email"
              icon={Mail}
              placeholder="krina@smilecare.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" icon={Send} className="w-full justify-center">
              Send Reset Link
            </Button>
          </form>
        )}
      </div>

      <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white">
        <ArrowLeft className="w-4 h-4" /> Back to Login
      </Link>
    </div>
  );
};
