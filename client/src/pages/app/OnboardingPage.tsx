import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { CheckCircle2, ArrowRight, Sparkles, UserCheck, Brain, Code2 } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    { title: 'Add Doctor Profiles', path: '/app/doctors', done: true },
    { title: 'Upload Knowledge Base Fee Guide', path: '/app/knowledge-base', done: true },
    { title: 'Sync Google Calendar / PMS', path: '/app/appointments', done: true },
    { title: 'Customize Chat Widget', path: '/app/widget', done: true },
    { title: 'Test Live AI Simulator', path: '/app/ai-settings', done: false },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in py-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Welcome to SmileCare AI!</h1>
        <p className="text-xs text-slate-500">Complete your onboarding checklist to launch your AI receptionist.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-4">
        {steps.map((s, i) => (
          <div
            key={i}
            onClick={() => navigate(s.path)}
            className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between cursor-pointer hover:bg-teal-50/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <CheckCircle2 className={`w-5 h-5 ${s.done ? 'text-teal-600' : 'text-slate-300'}`} />
              <span className="text-sm font-bold text-slate-900">{s.title}</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </div>
        ))}

        <div className="pt-4">
          <Button size="lg" onClick={() => navigate('/app')} icon={Sparkles} className="w-full justify-center">
            Go to Overview Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
