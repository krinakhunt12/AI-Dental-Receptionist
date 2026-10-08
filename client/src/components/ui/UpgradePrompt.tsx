import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from './Button';

export interface UpgradePromptProps {
  featureName: string;
  requiredPlanName?: string;
  description?: string;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  featureName,
  requiredPlanName = 'Growth Pro',
  description = `This feature is available on our ${requiredPlanName} plan and above. Upgrade today to automate your clinic workflows.`,
}) => {
  const navigate = useNavigate();

  return (
    <div className="p-8 md:p-12 bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl border border-teal-500/20 shadow-2xl relative overflow-hidden my-6">
      {/* Glow decorative blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 max-w-xl text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>Premium Feature Locked</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            Unlock <span className="gradient-text-teal">{featureName}</span>
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">{description}</p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row gap-3">
          <Button
            size="lg"
            onClick={() => navigate('/app/billing')}
            icon={Sparkles}
            className="bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold shadow-lg shadow-teal-500/20"
          >
            Upgrade to {requiredPlanName}
          </Button>
          <Button
            size="lg"
            variant="ghost"
            onClick={() => navigate('/app')}
            icon={ArrowRight}
            className="text-slate-300 hover:text-white hover:bg-white/10"
          >
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
