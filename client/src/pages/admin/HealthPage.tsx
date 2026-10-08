import React from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { Activity, Cpu, ShieldCheck } from 'lucide-react';

export const HealthPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Health & AI Unit Economics</h1>
        <p className="text-xs text-slate-400">Monitor AI API token costs vs subscription margin and error rates.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="AI API Cost per Clinic" value="$12.40/mo" subtitle="Avg LLM token cost" />
        <StatCard title="Gross Margin %" value="88.4%" subtitle="After AI & Infrastructure" />
        <StatCard title="API Error Rate" value="0.02%" subtitle="99.98% Uptime" />
      </div>
    </div>
  );
};
