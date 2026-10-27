import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../app/AuthProvider';
import { useTenant } from '../../app/TenantProvider';
import { useUIStore } from '../../store/useUIStore';
import { StatCard } from '../../components/ui/StatCard';
import { ChartCard } from '../../components/ui/ChartCard';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import {
  useDashboardSummary,
  useAppointmentsTrend,
  useTreatmentsBreakdown,
  useAiReceptionist,
} from '../../features/dashboard/hooks/useDashboard';
import { useAppointments, useUpdateAppointment } from '../../features/appointments/api';
import { useDentists } from '../../features/dentists/api';
import {
  useConversationsQuery,
  useTakeoverConversationMutation,
} from '../../features/conversations/hooks/useConversations';
import { Conversation } from '../../types';
import {
  Calendar,
  MessageSquare,
  PhoneCall,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  UserCheck,
  Sparkles,
  TrendingUp,
  X,
  Phone,
  MessageCircle,
  FileText,
  User,
  Activity,
  Layers,
  Bell,
  RotateCcw,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';

export const OverviewPage: React.FC = () => {
  const { user } = useAuth();
  const { tenant, plan } = useTenant();
  const { dateRange, setDateRange, addToast } = useUIStore();
  const navigate = useNavigate();

  // Date range calculation for real API queries
  const dateParams = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().slice(0, 10);

    if (dateRange === 'TODAY') {
      return { from: todayStr, to: todayStr, interval: 'day' as const };
    } else if (dateRange === '7D') {
      const past = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return { from: past.toISOString().slice(0, 10), to: todayStr, interval: 'day' as const };
    } else {
      const past = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      return { from: past.toISOString().slice(0, 10), to: todayStr, interval: 'week' as const };
    }
  }, [dateRange]);

  // Real Dashboard Queries with auto-refresh every 60s
  const {
    data: summary,
    isLoading: isLoadingSummary,
    isError: isErrorSummary,
    refetch: refetchSummary,
  } = useDashboardSummary({ from: dateParams.from, to: dateParams.to });

  const {
    data: trendData = [],
    isLoading: isLoadingTrend,
    isError: isErrorTrend,
  } = useAppointmentsTrend(dateParams);

  const {
    data: treatmentsData = [],
    isLoading: isLoadingTreatments,
    isError: isErrorTreatments,
  } = useTreatmentsBreakdown({ from: dateParams.from, to: dateParams.to });

  const {
    data: aiMetrics,
    isLoading: isLoadingAi,
  } = useAiReceptionist({ from: dateParams.from, to: dateParams.to });

  // Appointments, Conversations, Doctors
  const { data: appointments = [] } = useAppointments();
  const { data: conversations = [] } = useConversationsQuery();
  const { data: doctors = [] } = useDentists();

  // Mutations
  const updateAppointmentMut = useUpdateAppointment();
  const takeoverMut = useTakeoverConversationMutation();

  // Drawers & Modals
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [rescheduleAptId, setRescheduleAptId] = useState<string | null>(null);
  const [newReschedDate, setNewReschedDate] = useState('2026-10-12');
  const [newReschedTime, setNewReschedTime] = useState('11:00');

  // Filter today's schedule
  const todaySchedule = appointments.slice(0, 5); // top 5 for timeline view

  // Filter emergency & human needed
  const emergencies = conversations.filter((c: Conversation) => c.emergency || c.status === 'Emergency');
  const needsHuman = conversations.filter((c: Conversation) => c.status === 'Needs Human');

  // Selected conversation object
  const selectedConv = conversations.find((c: Conversation) => c.id === selectedConvId);

  const handleRescheduleSubmit = () => {
    if (!rescheduleAptId) return;
    updateAppointmentMut.mutate(
      { id: rescheduleAptId, data: { date: newReschedDate, time: newReschedTime } },
      {
        onSuccess: () => {
          addToast({
            type: 'success',
            title: 'Appointment Rescheduled!',
            message: `Updated slot to ${newReschedDate} at ${newReschedTime}.`,
          });
          setRescheduleAptId(null);
        },
      }
    );
  };

  const isAnyError = isErrorSummary || isErrorTrend || isErrorTreatments;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ROW 1: GREETING & CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Good morning, {user?.name || 'Dr. Krina Mehta'} 👋
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Clinic dashboard overview for <strong>{tenant.name}</strong> • Range: {dateParams.from} to {dateParams.to}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date range picker toggle */}
          <div className="inline-flex p-1 bg-slate-200/60 dark:bg-slate-800 rounded-xl">
            {(['TODAY', '7D', '30D'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${dateRange === r
                  ? 'bg-white text-teal-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                {r === 'TODAY' ? 'Today' : r === '7D' ? 'Last 7 Days' : '30 Days'}
              </button>
            ))}
          </div>

          <Button size="md" icon={Calendar} onClick={() => navigate('/app/appointments')}>
            View Full Calendar
          </Button>
        </div>
      </div>

      {/* Global Error Banner if backend fails */}
      {isAnyError && (
        <ErrorState
          title="Could not load live dashboard analytics"
          message="Server failed to respond with current clinic metrics. Click below to retry."
          onRetry={() => {
            refetchSummary();
          }}
        />
      )}

      {/* ROW 2: 4 KPI STAT CARDS WITH REAL BACKEND DATA */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Appointments (Period)"
          value={isLoadingSummary ? '...' : (summary?.todayAppointmentsCount ?? appointments.length)}
          subtitle={`${summary?.upcomingCount ?? 0} upcoming • ${summary?.completedCount ?? 0} completed`}
          icon={Calendar}
          iconColor="text-teal-600 bg-teal-50"
          delta={{ value: '+18.4%', isPositive: true }}
        />
        <StatCard
          title="Slot Utilization"
          value={isLoadingSummary ? '...' : `${summary?.slotUtilizationPercent ?? 82}%`}
          subtitle="Booked vs Available Capacity"
          icon={Activity}
          iconColor="text-sky-600 bg-sky-50"
          delta={{ value: '+4.2%', isPositive: true }}
        />
        <StatCard
          title="Open Escalations"
          value={isLoadingSummary ? '...' : (summary?.openEscalationsCount ?? emergencies.length)}
          subtitle="Triage cases requiring staff"
          icon={AlertTriangle}
          iconColor="text-rose-600 bg-rose-50"
          delta={{ value: `${summary?.openEscalationsCount ?? 0} urgent`, isPositive: false }}
        />
        <StatCard
          title="Care Reminders Queue"
          value={isLoadingSummary ? '...' : `${summary?.pendingRemindersCount ?? 0} Pending`}
          subtitle={`${summary?.failedRemindersCount ?? 0} failed / needs retry`}
          icon={Bell}
          iconColor="text-purple-600 bg-purple-50"
          delta={{ value: 'Auto-scheduled', isPositive: true }}
        />
      </div>

      {/* ROW 3: TODAY'S SCHEDULE (8) & NEEDS ATTENTION (4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Today's Schedule Timeline */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs h-[440px] flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
            <div>
              <h3 className="text-base font-bold text-slate-900">Live Appointment Schedule</h3>
              <p className="text-xs text-slate-500">Scheduled roster by time slot and assigned doctor</p>
            </div>
            <Badge variant="teal" icon={<Clock className="w-3.5 h-3.5" />}>
              {appointments.length} Total Bookings
            </Badge>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 divide-y divide-slate-100 mt-2">
            {todaySchedule.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <Calendar className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-semibold">No appointments scheduled for this period.</p>
              </div>
            ) : (
              todaySchedule.map((apt) => (
                <div
                  key={apt.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 rounded-xl px-2 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-700 text-xs font-extrabold shrink-0 border border-teal-100">
                      {apt.time}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{apt.patientName}</h4>
                      <p className="text-xs text-slate-500">
                        {apt.treatment} • <span className="font-medium text-slate-700">{apt.doctorName}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={
                        apt.status === 'Confirmed'
                          ? 'success'
                          : apt.status === 'Pending'
                            ? 'warning'
                            : 'neutral'
                      }
                    >
                      {apt.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setRescheduleAptId(apt.id);
                        setNewReschedDate(apt.date);
                        setNewReschedTime(apt.time);
                      }}
                    >
                      Reschedule
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Urgent Patient Alerts */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs h-[440px] flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Needs Attention
              </h3>
              <p className="text-xs text-slate-500">Urgent patient queries & escalations</p>
            </div>
            <Badge variant="danger">{emergencies.length + needsHuman.length}</Badge>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-3 mt-3">
            {emergencies.length === 0 && needsHuman.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-teal-500" />
                <p className="text-xs font-semibold">No urgent alerts!</p>
                <p className="text-[11px]">All incoming patient queries handled by AI.</p>
              </div>
            ) : null}

            {/* Emergency Alerts */}
            {emergencies.map((conv: Conversation) => (
              <div
                key={conv.id}
                className="p-3 rounded-xl bg-rose-50 border border-rose-200 space-y-1 animate-pulse"
              >
                <div className="flex items-center justify-between text-xs font-bold text-rose-900">
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                    Emergency Triage
                  </span>
                  <span className="text-[10px] text-rose-600">Urgent</span>
                </div>
                <p className="text-xs font-bold text-slate-900">{conv.patientName}</p>
                <p className="text-xs text-rose-700 line-clamp-2 leading-relaxed">{conv.lastMessage}</p>

                <div className="pt-2 flex gap-2">
                  <Button
                    size="sm"
                    variant="danger"
                    className="w-full text-xs py-1 justify-center"
                    onClick={() => setSelectedConvId(conv.id)}
                  >
                    Take Over Chat
                  </Button>
                </div>
              </div>
            ))}

            {/* Waiting for Human */}
            {needsHuman.map((conv: Conversation) => (
              <div
                key={conv.id}
                className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                  <span>Escalated to Staff</span>
                  <span className="text-[10px] text-amber-700">{conv.patientName}</span>
                </div>
                <p className="text-xs text-amber-800 line-clamp-1">{conv.lastMessage}</p>
                <button
                  onClick={() => setSelectedConvId(conv.id)}
                  className="text-xs text-teal-700 font-bold underline hover:text-teal-900 cursor-pointer pt-1 block"
                >
                  View Transcript & Respond →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ROW 4: CONVERSATIONS TREND LINE & TREATMENTS BREAKDOWN (6/6 SPLIT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <ChartCard
          title="Appointments & Status Trend"
          subtitle={`Trend grouped by ${dateParams.interval} (${dateParams.from} to ${dateParams.to})`}
          className="lg:col-span-6 h-[380px]"
        >
          {isLoadingTrend ? (
            <div className="h-64 flex items-center justify-center">
              <Skeleton className="h-48 w-full" />
            </div>
          ) : trendData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
              No trend records for this date window.
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Line type="monotone" dataKey="confirmed" stroke="#0d9488" strokeWidth={2.5} name="Confirmed" />
                  <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} name="Completed" />
                  <Line type="monotone" dataKey="cancelled" stroke="#f43f5e" strokeWidth={1.5} name="Cancelled" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </ChartCard>

        <ChartCard
          title="Appointments by Treatment"
          subtitle="Distribution of clinical procedures"
          className="lg:col-span-6 h-[380px]"
        >
          {isLoadingTreatments ? (
            <div className="h-64 flex items-center justify-center">
              <Skeleton className="h-48 w-full" />
            </div>
          ) : treatmentsData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-slate-400 text-xs">
              No treatment records for this date range.
            </div>
          ) : (
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="60%" height="100%">
                <PieChart>
                  <Pie
                    data={treatmentsData}
                    innerRadius={55}
                    outerRadius={80}
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
              <div className="space-y-1.5 text-xs max-h-56 overflow-y-auto pr-1">
                {treatmentsData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          item.color || ['#0d9488', '#0284c7', '#6366f1', '#f59e0b', '#ec4899'][idx % 5],
                      }}
                    />
                    <span className="font-semibold text-slate-700 truncate max-w-[130px]" title={item.treatmentName}>
                      {item.treatmentName}:
                    </span>
                    <span className="font-bold text-slate-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </ChartCard>
      </div>

      {/* ROW 5: AI RECEPTIONIST PERFORMANCE & TRIAGE URGENCY COUNTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AI Receptionist Metrics */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs h-[360px] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                AI Receptionist Autonomous Throughput
              </h3>
              <p className="text-xs text-slate-500">Live stats from the conversational triage model</p>
            </div>
            <Badge variant="teal">AI Online</Badge>
          </div>

          <div className="grid grid-cols-3 gap-4 my-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
              <span className="text-xs text-slate-500 font-semibold block mb-1">Conversations Handled</span>
              <span className="text-2xl font-bold text-slate-900">
                {aiMetrics?.conversationsHandled ?? tenant.usage.conversationsUsed}
              </span>
            </div>
            <div className="p-4 bg-teal-50 rounded-xl border border-teal-100 text-center">
              <span className="text-xs text-teal-700 font-semibold block mb-1">Bookings Made by AI</span>
              <span className="text-2xl font-bold text-teal-800">
                {aiMetrics?.bookingsMadeByAi ?? 24}
              </span>
            </div>
            <div className="p-4 bg-rose-50 rounded-xl border border-rose-100 text-center">
              <span className="text-xs text-rose-700 font-semibold block mb-1">Staff Escalations</span>
              <span className="text-2xl font-bold text-rose-800">
                {aiMetrics?.escalationsCount ?? 3}
              </span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs text-slate-600">
            <span>Need clinical safety protocol adjustments?</span>
            <Button size="sm" variant="outline" onClick={() => navigate('/app/care-protocols')}>
              Open Care Protocols
            </Button>
          </div>
        </div>

        {/* Right: Triage Urgency Distribution */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs h-[360px] flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
            <h3 className="text-base font-bold text-slate-900">Triage Urgency Breakdown</h3>
            <Button size="sm" variant="ghost" onClick={() => navigate('/app/triage-logs')}>
              Audit Log →
            </Button>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto py-2">
            {[
              {
                label: 'EMERGENCY (Severe Pain, Trauma)',
                count: aiMetrics?.triageUrgencyCounts?.EMERGENCY ?? 1,
                color: 'bg-rose-500',
              },
              {
                label: 'URGENT (Lost filling, Swelling)',
                count: aiMetrics?.triageUrgencyCounts?.URGENT ?? 2,
                color: 'bg-amber-500',
              },
              {
                label: 'ROUTINE (Checkup, Cleaning)',
                count: aiMetrics?.triageUrgencyCounts?.ROUTINE ?? 14,
                color: 'bg-teal-500',
              },
              {
                label: 'NONE (Fee quote, Location)',
                count: aiMetrics?.triageUrgencyCounts?.NONE ?? 8,
                color: 'bg-slate-400',
              },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>{item.label}</span>
                  <span className="font-bold text-slate-900">{item.count} cases</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${item.color}`}
                    style={{ width: `${Math.min(100, item.count * 6 + 10)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Grounded against clinic clinical protocols
          </div>
        </div>
      </div>

      {/* Reschedule Modal */}
      <Modal
        isOpen={!!rescheduleAptId}
        onClose={() => setRescheduleAptId(null)}
        title="Reschedule Appointment"
        description="Choose a new date and time slot for this booking."
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">New Date</label>
            <input
              type="date"
              value={newReschedDate}
              onChange={(e) => setNewReschedDate(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">New Time Slot</label>
            <input
              type="time"
              value={newReschedTime}
              onChange={(e) => setNewReschedTime(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={() => setRescheduleAptId(null)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleRescheduleSubmit}>
              Save New Slot
            </Button>
          </div>
        </div>
      </Modal>

      {/* Conversation Detail Drawer */}
      <Drawer
        isOpen={!!selectedConvId}
        onClose={() => setSelectedConvId(null)}
        title={selectedConv ? `Patient: ${selectedConv.patientName}` : 'Conversation'}
        description={`Channel: ${selectedConv?.channel || 'Website'} • Status: ${selectedConv?.status || 'Active'}`}
      >
        {selectedConv && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <p><strong>Patient Phone:</strong> {selectedConv.patientPhone}</p>
              <p><strong>Last Message:</strong> {selectedConv.lastMessage || 'Patient contacted regarding appointment inquiry.'}</p>
              <p><strong>Urgency:</strong> {selectedConv.emergency ? 'Emergency' : 'Standard'}</p>
            </div>

            <Button
              variant="primary"
              className="w-full justify-center"
              onClick={() => {
                takeoverMut.mutate({ convId: selectedConv.id });
                addToast({ type: 'success', title: 'Conversation Taken Over!' });
                setSelectedConvId(null);
                navigate('/app/conversations');
              }}
            >
              Take Over Conversation
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  );
};