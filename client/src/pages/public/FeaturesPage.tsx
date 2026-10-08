import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Calendar, ShieldCheck, Sparkles, Brain, Megaphone, PhoneCall, Code2, Sliders } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MessageSquare,
      title: '24/7 AI Chat & Voice Receptionist',
      description: 'Handles incoming website queries, WhatsApp messages, and phone calls autonomously without staff intervention.',
    },
    {
      icon: Calendar,
      title: 'Smart PMS & Calendar Booking',
      description: 'Reads dentist availability and schedules appointments directly into Google Calendar, Dentrix, or Open Dental.',
    },
    {
      icon: Brain,
      title: 'Knowledge Base PDF Training',
      description: 'Upload your clinic price lists, insurance plans, and FAQs. The AI trains instantly on your practice data.',
    },
    {
      icon: ShieldCheck,
      title: 'Emergency Triage & Escalation',
      description: 'Detects severe pain, swelling, or post-surgery trauma and alerts on-call dentists via SMS & push notification.',
    },
    {
      icon: Megaphone,
      title: 'Automated SMS & WhatsApp Campaigns',
      description: 'Triggers 24-hour appointment reminders, no-show follow-ups, and 6-month hygiene recall messages.',
    },
    {
      icon: Code2,
      title: '1-Click Embed Widget Studio',
      description: 'Customizable chat widget matching your clinic brand colors. Drop onto WordPress, Wix, or custom HTML.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-16 animate-fade-in">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          Everything Your Clinic Needs for <span className="gradient-text-teal">AI Reception</span>
        </h1>
        <p className="text-slate-300 text-sm md:text-base">
          Built specifically for dental practices to eliminate missed calls, reduce front-desk burnout, and boost bookings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((f, idx) => (
          <div
            key={idx}
            className="p-6 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-4 hover:border-teal-500/40 transition-colors"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <f.icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">{f.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{f.description}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button size="lg" onClick={() => navigate('/register')} icon={Sparkles}>
          Start 14-Day Free Trial
        </Button>
      </div>
    </div>
  );
};
