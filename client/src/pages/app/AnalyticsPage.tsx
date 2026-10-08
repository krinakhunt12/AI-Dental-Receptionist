import React, { useState } from 'react';
import { ChartCard } from '../../components/ui/ChartCard';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { useUIStore } from '../../store/useUIStore';
import { BarChart3, Download, Calendar, MessageSquare, DollarSign, TrendingUp } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { addToast } = useUIStore();
  const [activeTab, setActiveTab] = useState('Conversations');

  const monthlyVolume = [
    { month: 'May', volume: 240, revenue: 8400 },
    { month: 'Jun', volume: 320, revenue: 11200 },
    { month: 'Jul', volume: 450, revenue: 15800 },
    { month: 'Aug', volume: 510, revenue: 17800 },
    { month: 'Sep', volume: 640, revenue: 22400 },
    { month: 'Oct', volume: 720, revenue: 25200 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-teal-600" />
            Clinic Analytics & Performance Reports
          </h1>
          <p className="text-xs text-slate-500">Track AI conversion rates, revenue impact, and peak hours.</p>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={Download}
          onClick={() => addToast({ type: 'success', title: 'PDF Report Exported!' })}
        >
          Export Report PDF
        </Button>
      </div>

      <Tabs
        tabs={[
          { id: 'Conversations', label: 'Conversations & AI' },
          { id: 'Bookings', label: 'Bookings & Slots' },
          { id: 'Revenue', label: 'Revenue ROI' },
          { id: 'Channels', label: 'Acquisition Channels' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <ChartCard
          title="Monthly AI Conversation Growth"
          subtitle="6-month trend"
          className="lg:col-span-8"
        >
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyVolume}>
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="volume" fill="#0d9488" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <div className="lg:col-span-4 space-y-4">
          <StatCard title="AI Conversion Rate" value="94.2%" delta={{ value: '+4.1%', isPositive: true }} />
          <StatCard title="Average Response Speed" value="0.8s" delta={{ value: '-0.3s', isPositive: true }} />
          <StatCard title="Total Revenue Impact" value="$25,200" delta={{ value: '+28%', isPositive: true }} />
        </div>
      </div>
    </div>
  );
};
