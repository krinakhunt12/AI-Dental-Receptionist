import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Stepper } from '../../components/ui/Stepper';
import { Button } from '../../components/ui/Button';
import { Sparkles, Building2, Brain, Code2, Calendar } from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    {
      num: '01',
      icon: Building2,
      title: 'Register Your Dental Practice',
      desc: 'Create your clinic account, set up doctor profiles, specializations, and working hours.',
    },
    {
      num: '02',
      icon: Brain,
      title: 'Train Your AI Knowledge Base',
      desc: 'Upload your dental fee guide, insurance acceptance rules, and FAQs. The AI learns your rules in seconds.',
    },
    {
      num: '03',
      icon: Code2,
      title: 'Install Chat Widget or Connect WhatsApp',
      desc: 'Paste a single line of script on your website or link your clinic WhatsApp Business line.',
    },
    {
      num: '04',
      icon: Calendar,
      title: 'Sit Back & Watch Bookings Flow In',
      desc: 'SmileCare AI handles inquiries 24/7, books appointments into your calendar, and alerts staff on emergencies.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-16 animate-fade-in">
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
          How <span className="gradient-text-teal">SmileCare AI</span> Operates
        </h1>
        <p className="text-slate-300 text-sm md:text-base">
          From setup to autonomous 24/7 patient booking in 4 simple steps.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {steps.map((s, idx) => (
          <div
            key={idx}
            className="p-8 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-4 relative overflow-hidden"
          >
            <span className="text-5xl font-extrabold text-slate-800 absolute top-4 right-6 pointer-events-none">
              {s.num}
            </span>
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
              <s.icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">{s.title}</h3>
            <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center pt-8">
        <Button size="lg" onClick={() => navigate('/register')} icon={Sparkles}>
          Get Started in 3 Minutes
        </Button>
      </div>
    </div>
  );
};
