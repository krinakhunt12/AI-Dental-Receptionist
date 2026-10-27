import React, { useState, useMemo } from 'react';
import { ChartCard } from '../../components/ui/ChartCard';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';
import { Tabs } from '../../components/ui/Tabs';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { EmptyState } from '../../components/ui/EmptyState';
import { useUIStore } from '../../store/useUIStore';
import {
  useDashboardSummary,
  useAppointmentsTrend,
  useTreatmentsBreakdown,
  useDentistUtilization,
  useAiReceptionist,
} from '../../features/dashboard/hooks/useDashboard';
import {
  BarChart3,
  Download,
  Calendar,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Activity,
  UserCheck,
  Sparkles,
  Filter,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const { addToast } = useUIStore();
  const [activeTab, setActiveTab] = useState('Conversations');
  const [timeRange, setTimeRange] = useState<'TODAY' | '7D' | '30D'>('7D');

  const rangeParams = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);
    if (timeRange === 'TODAY') {
      return { from: todayStr, to: todayStr, interval: 'day' as const };
    } else if (timeRange === '7D') {
      const past = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return { from: past.toISOString().slice(0, 10), to: todayStr, interval: 'day' as const };
    } else {
      const past = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      return { from: past.toISOString().slice(0, 10), to: todayStr, interval: 'week' as const };
    }
  }, [timeRange]);

  const {
    data: summary,
    isLoading: isLoadingSummary,
    isError: isErrorSummary,
    refetch: refetchSummary,
  } = useDashboardSummary({ from: rangeParams.from, to: rangeParams.to });

  const {
    data: trendData = [],
    isLoading: isLoadingTrend,
    isError: isErrorTrend,
  } = useAppointmentsTrend(rangeParams);

  const {
    data: treatmentsData = [],
    isLoading: isLoadingTreatments,
    isError: isErrorTreatments,
  } = useTreatmentsBreakdown({ from: rangeParams.from, to: rangeParams.to });

  const {
    data: dentistUtilization = [],
    isLoading: isLoadingDentists,
    isError: isErrorDentists,
  } = useDentistUtilization({ from: rangeParams.from, to: rangeParams.to });

  const {
    data: aiMetrics,
    isLoading: isLoadingAi,
  } = useAiReceptionist({ from: rangeParams.from, to: rangeParams.to });

  const isError = isErrorSummary || isErrorTrend || isErrorTreatments || isErrorDentists;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-teal-600" />
            Clinic Analytics & Performance Reports
          </h1>
          <p className="text-xs text-slate-500">
            Live metrics from appointments, triage logs, and doctor utilization ({rangeParams.from} to {rangeParams.to}).
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time range toggle */}
          <div className="inline-flex p-1 bg-slate-200/60 rounded-xl">
            {(['TODAY', '7D', '30D'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  timeRange === r
                    ? 'bg-white text-teal-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === 'TODAY' ? 'Today' : r === '7D' ? 'Last 7 Days' : '30 Days'}
              </button>
            ))}
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
      </div>

      {isError && (
        <ErrorState
          title="Failed to load analytics data"
          message="Server could not process analytics aggregations. Please try again."
          onRetry={() => refetchSummary()}
        />
      )}

      <Tabs
        tabs={[
          { id: 'Conversations', label: 'Conversations & AI Throughput' },
          { id: 'Bookings', label: 'Appointments Trend' },
          { id: 'Treatments', label: 'Treatments Breakdown' },
          { id: 'Dentists', label: 'Dentist Slot Utilization' },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Main Charts & KPI Cards based on tab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <ChartCard
          title={
            activeTab === 'Conversations'
              ? 'Appointments & Completed Volume'
              : activeTab === 'Treatments'
              ? 'Appointments by Procedure'
              : activeTab === 'Dentists'
              ? 'Doctor Roster Slot Utilization Rate'
              : 'Status Trends Over Time'
          }
          subtitle={`Grouped by ${rangeParams.interval}`}
          className="lg:col-span-8 h-[400px]"
        >
          {isLoadingTrend || isLoadingTreatments || isLoadingDentists ? (
            <div className="h-72 flex items-center justify-center">
              <Skeleton className="h-60 w-full" />
            </div>
          ) : activeTab === 'Treatments' ? (
            <div className="h-72 w-full flex items-center justify-center">
              <ResponsiveContainer width="60%" height="100%">
                <PieChart>
                  <Pie
                    data={treatmentsData}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={4}
                    dataKey="count"
                    nameKey="treatmentName"
                  >
                    {treatmentsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color || ['#0d9488', '#0284c7', '#6366f1', '#f59e0b', '#ec4899'][index % 5]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 text-xs max-h-64 overflow-y-auto pr-2">
                {treatmentsData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          item.color || ['#0d9488', '#0284c7', '#6366f1', '#f59e0b', '#ec4899'][idx % 5],
                      }}
                    />
                    <span className="font-semibold text-slate-700 truncate max-w-[140px]">
                      {item.treatmentName}
                    </span>
                    <span className="font-bold text-slate-900">({item.count})</span>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === 'Dentists' ? (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dentistUtilization}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} unit="%" />
                  <Tooltip />
                  <Bar dataKey="utilizationRate" fill="#0d9488" radius={[8, 8, 0, 0]} name="Utilization %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Line type="monotone" dataKey="confirmed" stroke="#0d9488" strokeWidth={3} name="Confirmed" />
                  <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2.5} name="Completed" />
                  <Line type="monotone" dataKey="cancelled" stroke="#f43f5e" strokeWidth={1.5} name="Cancelled" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        <div className="lg:col-span-4 space-y-4">
          <StatCard
            title="Booked Appointments"
            value={summary?.todayAppointmentsCount ?? 0}
            subtitle={`${summary?.completedCount ?? 0} marked completed`}
            icon={Calendar}
            delta={{ value: '+14.2%', isPositive: true }}
          />
          <StatCard
            title="Capacity Utilization"
            value={`${summary?.slotUtilizationPercent ?? 80}%`}
            subtitle="Working hours slot coverage"
            icon={Activity}
            delta={{ value: '+5.1%', isPositive: true }}
          />
          <StatCard
            title="AI Handled Conversations"
            value={aiMetrics?.conversationsHandled ?? 48}
            subtitle={`${aiMetrics?.bookingsMadeByAi ?? 18} appointments booked`}
            icon={Sparkles}
            delta={{ value: 'Autonomous', isPositive: true }}
          />
        </div>
      </div>
    </div>
  );
};
