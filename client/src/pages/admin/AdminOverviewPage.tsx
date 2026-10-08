import React from 'react';
import { StatCard } from '../../components/ui/StatCard';
import { ChartCard } from '../../components/ui/ChartCard';
import { DollarSign, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';

export const AdminOverviewPage: React.FC = () => {
  const mrrData = [
    { month: 'May', mrr: 28000 },
    { month: 'Jun', mrr: 32000 },
    { month: 'Jul', mrr: 36000 },
    { month: 'Aug', mrr: 39000 },
    { month: 'Sep', mrr: 41200 },
    { month: 'Oct', mrr: 42500 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-white">Platform SaaS Revenue Overview</h1>
        <p className="text-xs text-slate-400">MRR, ARR, active clinic subscriptions, and churn rates.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Monthly Recurring (MRR)" value="$42,500" delta={{ value: '+14.2%', isPositive: true }} />
        <StatCard title="Annual Recurring (ARR)" value="$510,000" delta={{ value: '+22.5%', isPositive: true }} />
        <StatCard title="Active Subscribed Clinics" value="142" delta={{ value: '+12 clinics', isPositive: true }} />
        <StatCard title="Platform Churn Rate" value="1.8%" delta={{ value: '-0.4%', isPositive: true }} />
      </div>

      <ChartCard title="MRR Growth Trajectory" subtitle="Last 6 months">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mrrData}>
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Line type="monotone" dataKey="mrr" stroke="#f43f5e" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
};
