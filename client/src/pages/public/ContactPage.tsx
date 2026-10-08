import React, { useState } from 'react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useUIStore } from '../../store/useUIStore';
import { Mail, Phone, Calendar, Send } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { addToast } = useUIStore();
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    addToast({ type: 'success', title: 'Demo Requested!', message: 'Our clinic specialist will contact you within 1 hour.' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Book a Personalized Demo</h1>
        <p className="text-xs text-slate-400">See how SmileCare AI fits into your existing clinic workflow.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        {submitted ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">Demo Request Received!</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Thank you! Our AI implementation team will reach out to schedule your 1-on-1 walkthrough.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Your Name" placeholder="Dr. Krina Mehta" required />
              <Input label="Work Email" type="email" placeholder="krina@smilecare.ai" required />
              <Input label="Clinic Name" placeholder="SmileCare Dental Studio" required />
              <Input label="Phone Number" placeholder="+1 (555) 000-0000" required />
            </div>
            <div className="pt-2">
              <Button type="submit" size="lg" icon={Send} className="w-full justify-center">
                Request 1-on-1 Walkthrough
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
