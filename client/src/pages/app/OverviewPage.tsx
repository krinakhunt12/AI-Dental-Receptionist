import React, { useState } from 'react';
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
import {
  useAppointmentsQuery,
  useConversationsQuery,
  useDoctorsQuery,
  useRescheduleAppointmentMutation,
  useUpdateAppointmentStatusMutation,
  useTakeoverConversationMutation,
} from '../../api/mockClient';
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

  // Queries
  const { data: appointments = [] } = useAppointmentsQuery();
  const { data: conversations = [] } = useConversationsQuery();
  const { data: doctors = [] } = useDoctorsQuery();

  // Mutations
  const updateStatusMut = useUpdateAppointmentStatusMutation();
  const rescheduleMut = useRescheduleAppointmentMutation();
  const takeoverMut = useTakeoverConversationMutation();

  // Drawers & Modals
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [rescheduleAptId, setRescheduleAptId] = useState<string | null>(null);
  const [newReschedDate, setNewReschedDate] = useState('2026-10-12');
  const [newReschedTime, setNewReschedTime] = useState('11:00');

  // Filter today's schedule
  const todayStr = '2026-10-08';
  const todaySchedule = appointments.slice(0, 5); // top 5 for timeline view

  // Filter emergency & human needed
  const emergencies = conversations.filter((c) => c.emergency || c.status === 'Emergency');
  const needsHuman = conversations.filter((c) => c.status === 'Needs Human');
  const unconfirmed = appointments.filter((a) => a.status === 'Pending');

  // Trend line chart data
  const trendData = [
    { day: 'Mon', aiResolved: 42, escalated: 3 },
    { day: 'Tue', aiResolved: 58, escalated: 5 },
    { day: 'Wed', aiResolved: 65, escalated: 4 },
    { day: 'Thu', aiResolved: 72, escalated: 2 },
    { day: 'Fri', aiResolved: 80, escalated: 6 },
    { day: 'Sat', aiResolved: 35, escalated: 1 },
    { day: 'Sun', aiResolved: 20, escalated: 0 },
  ];

  // Source donut chart data
  const sourceData = [
    { name: 'Website Widget', value: 45, color: '#0d9488' },
    { name: 'WhatsApp', value: 30, color: '#25D366' },
    { name: 'Phone Call', value: 15, color: '#6366f1' },
    { name: 'Walk-in', value: 10, color: '#f59e0b' },
  ];

  // Top questions bar list
  const topQuestions = [
    { question: 'What is the cost of Invisalign?', count: 142 },
    { question: 'Do you accept Delta Dental insurance?', count: 98 },
    { question: 'Do you have Saturday appointment slots?', count: 76 },
    { question: 'How long does a root canal procedure take?', count: 54 },
  ];

  // Heatmap peak hours
  const peakHours = [
    { time: '9 AM', intensity: 85 },
    { time: '11 AM', intensity: 95 },
    { time: '2 PM', intensity: 70 },
    { time: '4 PM', intensity: 90 },
    { time: '6 PM', intensity: 40 },
  ];

  // Selected conversation object
  const selectedConv = conversations.find((c) => c.id === selectedConvId);

  const handleRescheduleSubmit = () => {
    if (!rescheduleAptId) return;
    rescheduleMut.mutate(
      { id: rescheduleAptId, newDate: newReschedDate, newTime: newReschedTime },
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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ROW 1: GREETING & CONTROLS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Good morning, {user?.name || 'Dr. Krina Mehta'} 👋
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Here is your clinic’s AI receptionist overview for today ({todayStr}).
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

      {/* ROW 2: 4 KPI STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Appointments Booked"
          value={appointments.length}
          subtitle="Direct & AI confirmed"
          icon={Calendar}
          iconColor="text-teal-600 bg-teal-50"
          delta={{ value: '+18.4%', isPositive: true }}
        />
        <StatCard
          title="AI Conversations"
          value={tenant.usage.conversationsUsed}
          subtitle={`Max limit: ${tenant.usage.conversationsMax}`}
          icon={MessageSquare}
          iconColor="text-sky-600 bg-sky-50"
          delta={{ value: '+24.1%', isPositive: true }}
        />
        <StatCard
          title="Missed Calls Recovered"
          value="48"
          subtitle="Converted to chats"
          icon={PhoneCall}
          iconColor="text-purple-600 bg-purple-50"
          delta={{ value: '+12.5%', isPositive: true }}
        />
        <StatCard
          title="Est. Revenue Generated"
          value="$14,250"
          subtitle="Based on bookings"
          icon={DollarSign}
          iconColor="text-emerald-600 bg-emerald-50"
          delta={{ value: '+32.0%', isPositive: true }}
        />
      </div>

      {/* ROW 3: TODAY'S SCHEDULE (8) & NEEDS ATTENTION (4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Today's Schedule Timeline */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Today’s Appointment Schedule</h3>
              <p className="text-xs text-slate-500">Live roster by time slot and dentist</p>
            </div>
            <Badge variant="teal" icon={<Clock className="w-3.5 h-3.5" />}>
              5 Slots Today
            </Badge>
          </div>

          <div className="divide-y divide-slate-100">
            {todaySchedule.map((apt) => (
              <div key={apt.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 rounded-xl px-2 transition-colors">
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

                  {/* Actions */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      updateStatusMut.mutate({ id: apt.id, status: 'Confirmed' })
                    }
                  >
                    Confirm
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setRescheduleAptId(apt.id)}
                  >
                    Reschedule
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Needs Attention Panel */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Needs Attention
            </h3>
            <Badge variant="danger">{emergencies.length + needsHuman.length} Action Items</Badge>
          </div>

          <div className="space-y-3">
            {/* Emergencies Top */}
            {emergencies.map((conv) => (
              <div
                key={conv.id}
                className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-rose-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
                    EMERGENCY ALERT
                  </span>
                  <span className="text-[10px] text-rose-600 font-semibold">{conv.lastMessageTime}</span>
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
            {needsHuman.map((conv) => (
              <div
                key={conv.id}
                className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1"
              >
                <div className="flex items-center justify-between text-xs font-bold text-amber-900">
                  <span>Escalated to Human</span>
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

      {/* ROW 4: CONVERSATIONS TREND LINE & BOOKINGS DONUT (6/6 SPLIT) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <ChartCard
          title="AI Resolution vs Escalation Trend"
          subtitle="Daily volume over the selected period"
          className="lg:col-span-6"
        >
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="aiResolved" stroke="#0d9488" strokeWidth={3} name="AI Resolved" />
                <Line type="monotone" dataKey="escalated" stroke="#f43f5e" strokeWidth={2} name="Escalated" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Bookings by Acquisition Source"
          subtitle="Channel breakdown"
          className="lg:col-span-6"
        >
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={sourceData} innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value">
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 text-xs">
              {sourceData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-slate-700">{item.name}:</span>
                  <span className="font-bold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* ROW 5: LIVE CONVERSATION FEED (8) & SETUP CHECKLIST (4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Conversation Feed */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">Live Conversation Feed</h3>
              <p className="text-xs text-slate-500">Refreshes automatically every 15s</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => navigate('/app/conversations')}>
              Open Full Inbox
            </Button>
          </div>

          <div className="divide-y divide-slate-100">
            {conversations.slice(0, 5).map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                className="py-3 flex items-center justify-between gap-4 hover:bg-teal-50/50 p-2 rounded-xl cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0">
                    {conv.patientName[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{conv.patientName}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{conv.lastMessage}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Badge
                    variant={
                      conv.status === 'Emergency'
                        ? 'danger'
                        : conv.status === 'Needs Human'
                          ? 'warning'
                          : 'teal'
                    }
                  >
                    {conv.status}
                  </Badge>
                  <span className="text-[11px] text-slate-400">{conv.lastMessageTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Setup Checklist Progress Card */}
        <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 to-teal-950 text-white rounded-2xl p-6 shadow-xl space-y-4 border border-teal-500/20">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-teal-400" />
              Setup Checklist
            </h3>
            <span className="text-xs font-extrabold text-teal-300">80% Done</span>
          </div>

          <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
            <div className="bg-teal-400 h-full w-[80%]" />
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Add Doctor Rosters & Hours
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Upload Knowledge Base Fee Guide
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Connect Google Calendar Sync
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" /> Customize Chat Widget Colors
            </div>
            <div className="flex items-center gap-2 text-slate-400">
              <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
              Install Widget on Clinic Website
            </div>
          </div>
        </div>
      </div>

      {/* ROW 6: TOP PATIENT QUESTIONS & PEAK HOURS & USAGE METERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <ChartCard
          title="Top Patient Questions Asked to AI"
          subtitle="Frequency breakdown"
          className="lg:col-span-6"
        >
          <div className="space-y-3 pt-2">
            {topQuestions.map((q, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-800">
                  <span className="line-clamp-1">{q.question}</span>
                  <span className="font-bold text-teal-600">{q.count} times</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-600 rounded-full"
                    style={{ width: `${(q.count / 150) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Usage Meters Card */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Current Subscription Usage Meters</h3>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-800 mb-1">
                <span>AI Conversations</span>
                <span className="text-teal-600">
                  {tenant.usage.conversationsUsed} / {tenant.usage.conversationsMax}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-600" style={{ width: '64%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-800 mb-1">
                <span>Doctor Profiles</span>
                <span className="text-teal-600">
                  {tenant.usage.doctorsUsed} / {tenant.usage.doctorsMax}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-600" style={{ width: '60%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-800 mb-1">
                <span>SMS / WhatsApp Reminders</span>
                <span className="text-teal-600">
                  {tenant.usage.smsUsed} / {tenant.usage.smsMax}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-600" style={{ width: '26%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TRANSCRIPT DRAWER */}
      <Drawer
        isOpen={!!selectedConvId}
        onClose={() => setSelectedConvId(null)}
        title={selectedConv ? `Transcript: ${selectedConv.patientName}` : 'Conversation Detail'}
        description={`Channel: ${selectedConv?.channel || 'Widget'} • Phone: ${selectedConv?.patientPhone}`}
      >
        {selectedConv && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-500 font-semibold block">AI Status</span>
                <Badge variant={selectedConv.emergency ? 'danger' : 'teal'}>
                  {selectedConv.status}
                </Badge>
              </div>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  takeoverMut.mutate({ convId: selectedConv.id, staffMessage: 'Staff has joined the chat.' });
                  addToast({ type: 'success', title: 'Conversation Taken Over!' });
                }}
              >
                Take Over Chat
              </Button>
            </div>

            {/* Messages */}
            <div className="space-y-3 max-h-[50vh] overflow-y-auto p-2">
              {selectedConv.messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'patient' ? 'items-start' : 'items-end'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs ${m.sender === 'patient'
                        ? 'bg-slate-100 text-slate-800 rounded-bl-none'
                        : m.sender === 'staff'
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-teal-600 text-white rounded-br-none'
                      }`}
                  >
                    <div className="font-bold text-[10px] opacity-80 mb-0.5">
                      {m.sender.toUpperCase()}
                    </div>
                    {m.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">{m.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Drawer>

      {/* RESCHEDULE MODAL */}
      <Modal
        isOpen={!!rescheduleAptId}
        onClose={() => setRescheduleAptId(null)}
        title="Reschedule Appointment"
        description="Pick a new date and time slot for the patient."
      >
        <div className="space-y-4">
          <input
            type="date"
            value={newReschedDate}
            onChange={(e) => setNewReschedDate(e.target.value)}
            className="w-full text-sm p-2.5 rounded-xl border border-slate-200"
          />
          <input
            type="time"
            value={newReschedTime}
            onChange={(e) => setNewReschedTime(e.target.value)}
            className="w-full text-sm p-2.5 rounded-xl border border-slate-200"
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setRescheduleAptId(null)}>
              Cancel
            </Button>
            <Button onClick={handleRescheduleSubmit}>Save Reschedule</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
