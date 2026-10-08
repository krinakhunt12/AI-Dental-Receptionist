import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import {
  Calendar,
  Users,
  MessageSquare,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  Search,
  Bell,
  Building2,
  Lock,
  CreditCard,
  Download,
  Bot,
  Sliders,
  TrendingUp,
  DollarSign,
  UserCheck,
  Shield,
  Layers,
  ArrowRight,
  RefreshCw,
  Eye,
  Plus
} from 'lucide-react';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<
    'overview' | 'conversations' | 'appointments' | 'ai-settings' | 'billing' | 'super-admin'
  >('overview');

  // Tenant Theming Engine State
  const [tenantBrandColor, setTenantBrandColor] = useState('#0d9488'); // Default Teal
  const [isImpersonating, setIsImpersonating] = useState(false);
  const [impersonatedClinic, setImpersonatedClinic] = useState('SmileCare Dental Suite');

  // Command Palette Search State
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Upgrade Modal State
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Takeover State for Conversations
  const [takeoverId, setTakeoverId] = useState<string | null>(null);

  // Live AI Test Chat State
  const [testMessages, setTestMessages] = useState([
    { sender: 'ai', text: 'Hello! I am Maya. How can I help you today?' },
  ]);
  const [testInput, setTestInput] = useState('');

  // Mock Tenant List for Super Admin
  const [tenants, setTenants] = useState([
    { id: '1', name: 'SmileCare Dental Suite', plan: 'Growth', status: 'Active', mrr: '₹6,999', chats: '640 / 1000', owner: 'Dr. Krina Khunt' },
    { id: '2', name: 'Apex Implant & Orthodontics', plan: 'Enterprise', status: 'Active', mrr: '₹14,999', chats: '2,450 / 5000', owner: 'Dr. Rajesh Mehta' },
    { id: '3', name: 'City Dental Care', plan: 'Starter', status: 'Trial', mrr: '₹0 (Trial)', chats: '180 / 300', owner: 'Priya Verma' },
    { id: '4', name: 'Metro Tooth Studio', plan: 'Growth', status: 'Past Due', mrr: '₹6,999', chats: '890 / 1000', owner: 'Dr. Anita Roy' },
  ]);

  const handleTestChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testInput.trim()) return;

    setTestMessages((prev) => [...prev, { sender: 'user', text: testInput }]);
    const currentInput = testInput;
    setTestInput('');

    setTimeout(() => {
      setTestMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: `[Trained AI Test]: Responding based on uploaded price list & FAQs to: "${currentInput}". Teeth scaling is ₹1,500 and slots are open Friday 3 PM.`,
        },
      ]);
    }, 700);
  };

  return (
    <div
      className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col select-none"
      style={{ '--tenant-primary': tenantBrandColor } as React.CSSProperties}
    >
      {/* Impersonation Audit Banner if Active */}
      {isImpersonating && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>SUPER ADMIN IMPERSONATION MODE — Currently inspecting workspace: <strong>{impersonatedClinic}</strong></span>
          </div>
          <button
            onClick={() => setIsImpersonating(false)}
            className="px-3 py-1 rounded bg-slate-950 text-white hover:bg-slate-800 transition cursor-pointer text-[11px]"
          >
            Exit Impersonation Mode
          </button>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            {/* Clinic Switcher */}
            <select
              value={impersonatedClinic}
              onChange={(e) => setImpersonatedClinic(e.target.value)}
              className="font-extrabold text-sm text-slate-900 bg-transparent border-none outline-none cursor-pointer hover:text-teal-700"
            >
              <option value="SmileCare Dental Suite">SmileCare Dental Suite</option>
              <option value="Apex Implant & Orthodontics">Apex Implant & Orthodontics</option>
              <option value="City Dental Care">City Dental Care</option>
            </select>
          </div>

          <span className="text-xs bg-teal-50 text-teal-700 border border-teal-200 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Growth Plan
          </span>
        </div>

        {/* Global Controls: Search Cmd+K, Notifications, Color Picker */}
        <div className="flex items-center gap-4">
          {/* Quick Search */}
          <button
            onClick={() => setShowSearchModal(true)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 text-xs px-3.5 py-1.5 rounded-xl transition cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search patients, appointments…</span>
            <kbd className="bg-white px-1.5 py-0.5 text-[10px] rounded font-mono border text-slate-400">Cmd+K</kbd>
          </button>

          {/* Theme Accent Picker Demo */}
          <div className="flex items-center gap-1.5 border-l border-slate-200 pl-3">
            <span className="text-[11px] text-slate-400 font-medium hidden md:inline">Brand Theme:</span>
            <button
              onClick={() => setTenantBrandColor('#0d9488')}
              className={`w-5 h-5 rounded-full bg-teal-600 border-2 ${tenantBrandColor === '#0d9488' ? 'border-slate-900 scale-110' : 'border-transparent'}`}
              title="Teal Theme"
            />
            <button
              onClick={() => setTenantBrandColor('#2563eb')}
              className={`w-5 h-5 rounded-full bg-blue-600 border-2 ${tenantBrandColor === '#2563eb' ? 'border-slate-900 scale-110' : 'border-transparent'}`}
              title="Blue Theme"
            />
            <button
              onClick={() => setTenantBrandColor('#7c3aed')}
              className={`w-5 h-5 rounded-full bg-purple-600 border-2 ${tenantBrandColor === '#7c3aed' ? 'border-slate-900 scale-110' : 'border-transparent'}`}
              title="Purple Theme"
            />
          </div>

          <button className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition relative">
            <Bell className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
          </button>

          <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
            <div className="w-8 h-8 rounded-full bg-teal-100 border border-teal-300 text-teal-800 font-bold text-xs flex items-center justify-center">
              KK
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900">Dr. Krina Khunt</span>
              <span className="text-[10px] text-slate-500">Clinic Owner</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout with Left Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <aside className="w-60 bg-white border-r border-slate-200 p-4 flex flex-col justify-between shrink-0">
          <nav className="flex flex-col gap-1">
            {[
              { id: 'overview', label: 'Overview', icon: LayoutDashboardIcon },
              { id: 'conversations', label: 'Conversations Inbox', icon: MessageSquare, badge: '3' },
              { id: 'appointments', label: 'Appointments Calendar', icon: Calendar },
              { id: 'ai-settings', label: 'Train Your AI', icon: Bot },
              { id: 'billing', label: 'Billing & Usage', icon: CreditCard, alert: true },
              { id: 'super-admin', label: 'Super Admin Center', icon: Shield, super: true },
            ].map((item) => {
              const IconComp = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${isActive
                      ? 'bg-teal-50 text-teal-800 border border-teal-200 font-bold'
                      : item.super
                        ? 'text-purple-700 hover:bg-purple-50'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  <div className="flex items-center gap-2.5">
                    <IconComp className={`w-4 h-4 ${isActive ? 'text-teal-600' : item.super ? 'text-purple-600' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-bold bg-teal-600 text-white px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                  {item.alert && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Usage Meter Widget in Sidebar */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
              <span>AI Chats Used:</span>
              <span className="text-teal-700 font-mono">640 / 1,000</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-teal-600 rounded-full" style={{ width: '64%' }} />
            </div>
            <button
              onClick={() => setActiveTab('billing')}
              className="text-[11px] font-bold text-teal-700 hover:text-teal-800 flex items-center justify-between pt-1 cursor-pointer"
            >
              <span>Manage Plan</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </aside>

        {/* Dynamic Tab Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50/50">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-8 max-w-7xl mx-auto animate-fade-in">
              {/* Setup Checklist Progress Ring Card */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  {/* Completion Ring */}
                  <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeWidth="3.8"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-teal-600"
                        strokeDasharray="80, 100"
                        strokeWidth="3.8"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute font-extrabold text-slate-900 text-sm font-heading">80%</span>
                  </div>

                  <div className="flex flex-col">
                    <h2 className="text-lg font-extrabold text-slate-900 font-heading">
                      Clinic Setup Checklist (4 of 5 Done)
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Complete all setup tasks to maximize AI appointment bookings and revenue recovery.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Doctor Roster Added
                  </span>
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Price List Uploaded
                  </span>
                  <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Install Website Widget
                  </span>
                </div>
              </div>

              {/* 4 KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Appointments Today</span>
                    <div className="text-3xl font-extrabold text-slate-900 font-heading mt-1">12</div>
                    <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">9 Confirmed • 3 Pending</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center">
                    <Calendar className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">New Patient Leads</span>
                    <div className="text-3xl font-extrabold text-slate-900 font-heading mt-1">28</div>
                    <span className="text-[11px] text-teal-600 font-semibold mt-1 block">+15% from last week</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center">
                    <Users className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">AI Resolved Chats</span>
                    <div className="text-3xl font-extrabold text-slate-900 font-heading mt-1">640</div>
                    <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">99.4% resolution rate</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Emergencies Flagged</span>
                    <div className="text-3xl font-extrabold text-rose-600 font-heading mt-1">3</div>
                    <span className="text-[11px] text-rose-600 font-semibold mt-1 block">Routed to on-call phone</span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                </div>
              </div>

              {/* Today's Schedule Timeline & Recent Live Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h3 className="font-extrabold text-base text-slate-900 font-heading">Today's Appointment Roster</h3>
                    <button onClick={() => setActiveTab('appointments')} className="text-xs font-bold text-teal-700 flex items-center gap-1 cursor-pointer">
                      <span>View Full Calendar</span> <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-col divide-y divide-slate-100">
                    {[
                      { time: '09:30 AM', patient: 'Rahul Sharma', service: 'Teeth Cleaning & Scaling', doctor: 'Dr. Krina Khunt', status: 'Confirmed' },
                      { time: '11:00 AM', patient: 'Ananya Iyer', service: 'Orthodontic Alignment Check', doctor: 'Dr. Rajesh Mehta', status: 'Confirmed' },
                      { time: '02:15 PM', patient: 'Vikram Patel', service: 'Dental Implant Consultation', doctor: 'Dr. Krina Khunt', status: 'Pending' },
                      { time: '04:30 PM', patient: 'Neha Gupta', service: 'Pediatric Fluoride Cavity Fill', doctor: 'Dr. Priya Verma', status: 'Confirmed' },
                    ].map((appt, i) => (
                      <div key={i} className="py-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                            {appt.time}
                          </span>
                          <div className="flex flex-col">
                            <strong className="text-slate-900 font-bold">{appt.patient}</strong>
                            <span className="text-slate-500">{appt.service} • {appt.doctor}</span>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${appt.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-800 border-amber-200'}`}>
                          {appt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                  <h3 className="font-extrabold text-base text-slate-900 font-heading">Live AI Chat Activity</h3>
                  <div className="flex flex-col gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span className="font-bold text-teal-700">Patient #9042</span>
                        <span>2 mins ago</span>
                      </div>
                      <p className="text-slate-700 font-medium">"Booked scaling procedure for Friday 4 PM with Dr. Khunt."</p>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex flex-col gap-1">
                      <div className="flex justify-between items-center text-[10px] text-rose-500 font-bold">
                        <span>🚨 EMERGENCY INTERCEPT</span>
                        <span>12 mins ago</span>
                      </div>
                      <p className="text-rose-900 font-medium">"Patient reported severe bleeding after wisdom tooth pain."</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONVERSATIONS INBOX */}
          {activeTab === 'conversations' && (
            <div className="flex flex-col gap-6 max-w-7xl mx-auto animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 font-heading">Conversations Inbox</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Filter AI chats, review transcripts, or take over live patient communication.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
                    All (42)
                  </button>
                  <button className="px-3.5 py-2 rounded-xl bg-teal-50 border border-teal-200 text-xs font-bold text-teal-700 shadow-sm">
                    AI Handled (36)
                  </button>
                  <button className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800 shadow-sm">
                    Needs Human (4)
                  </button>
                  <button className="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700 shadow-sm">
                    Emergency (2)
                  </button>
                </div>
              </div>

              {/* Split Screen Inbox & Transcript */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden h-[600px]">
                {/* Conversations List */}
                <div className="lg:col-span-5 border-r border-slate-200 flex flex-col divide-y divide-slate-100 overflow-y-auto">
                  {[
                    { id: 'c1', name: 'Rahul Sharma', time: '10:14 AM', preview: 'Can I reschedule my teeth cleaning?', tag: 'Needs Human', sentiment: 'Inquiring' },
                    { id: 'c2', name: 'Emergency Case #41', time: '09:50 AM', preview: 'Severe tooth pain and facial swelling', tag: 'Emergency', sentiment: 'Urgent' },
                    { id: 'c3', name: 'Priya Mehta', time: 'Yesterday', preview: 'How much is full dental scaling?', tag: 'AI Handled', sentiment: 'Satisfied' },
                  ].map((conv) => (
                    <div key={conv.id} className="p-4 hover:bg-slate-50 transition cursor-pointer flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <strong className="text-xs font-bold text-slate-900">{conv.name}</strong>
                        <span className="text-[10px] text-slate-400">{conv.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1">{conv.preview}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${conv.tag === 'Emergency' ? 'bg-rose-100 text-rose-700' : conv.tag === 'Needs Human' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'}`}>
                          {conv.tag}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono bg-slate-100 px-2 py-0.5 rounded">
                          {conv.sentiment}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Transcript Detail & Takeover Panel */}
                <div className="lg:col-span-7 p-6 flex flex-col justify-between bg-slate-50/50">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900">Transcript: Rahul Sharma</h3>
                      <span className="text-[11px] text-slate-500">Phone: +91 98765 11111 • Lead Source: Clinic Website Chat</span>
                    </div>

                    <button
                      onClick={() => setTakeoverId(takeoverId ? null : 'c1')}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-sm ${takeoverId ? 'bg-rose-600 text-white' : 'bg-teal-600 hover:bg-teal-700 text-white'
                        }`}
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>{takeoverId ? 'Release Back to AI' : 'Take Over Chat'}</span>
                    </button>
                  </div>

                  {/* Transcript Content */}
                  <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3 text-xs">
                    <div className="bg-white border border-slate-200 rounded-2xl p-3.5 max-w-[80%]">
                      <span className="text-[10px] font-bold text-slate-400 block mb-1">Patient</span>
                      "Hello, I need to reschedule my appointment with Dr. Khunt on Friday."
                    </div>
                    <div className="bg-teal-50 border border-teal-200 text-teal-900 rounded-2xl p-3.5 max-w-[80%] self-end">
                      <span className="text-[10px] font-bold text-teal-700 block mb-1">Maya (AI Receptionist)</span>
                      "Certainly! Dr. Khunt has open slots on Saturday at 11:00 AM or Monday at 03:00 PM. Which works best for you?"
                    </div>
                    {takeoverId && (
                      <div className="bg-amber-100 border border-amber-300 text-amber-900 p-2 rounded-xl text-center text-[11px] font-bold">
                        ⚠️ Staff Receptionist (Dr. Krina Khunt) took over this conversation.
                      </div>
                    )}
                  </div>

                  {/* Reply Input Box */}
                  <div className="pt-3 border-t border-slate-200 flex items-center gap-2">
                    <input
                      type="text"
                      placeholder={takeoverId ? 'Type direct human receptionist message…' : 'AI is handling. Click Take Over to type…'}
                      disabled={!takeoverId}
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none disabled:bg-slate-100 disabled:cursor-not-allowed"
                    />
                    <button disabled={!takeoverId} className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold disabled:opacity-50">
                      Send Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: APPOINTMENTS CALENDAR */}
          {activeTab === 'appointments' && (
            <div className="flex flex-col gap-6 max-w-7xl mx-auto animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 font-heading">Appointments Calendar</h2>
                  <p className="text-xs text-slate-500">Manage doctor rosters, shift slots, and appointment status.</p>
                </div>
                <button className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  <Plus className="w-4 h-4" /> <span>Add New Booking</span>
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base text-slate-900">October 2026</span>
                    <span className="text-xs text-slate-400">Week 41</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-teal-500" /> <span className="text-xs text-slate-600 mr-3">Dr. Khunt</span>
                    <span className="w-3 h-3 rounded-full bg-blue-500" /> <span className="text-xs text-slate-600 mr-3">Dr. Mehta</span>
                    <span className="w-3 h-3 rounded-full bg-purple-500" /> <span className="text-xs text-slate-600">Dr. Verma</span>
                  </div>
                </div>

                {/* Day Calendar Grid */}
                <div className="grid grid-cols-5 gap-4">
                  {['Mon 20', 'Tue 21', 'Wed 22', 'Thu 23', 'Fri 24'].map((day, idx) => (
                    <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col gap-3 min-h-[300px]">
                      <span className="font-bold text-xs text-slate-700 border-b border-slate-200 pb-2">{day}</span>
                      <div className="bg-teal-100 border-l-4 border-teal-600 p-2.5 rounded-xl text-[11px] flex flex-col gap-1">
                        <strong className="text-teal-900">Rahul Sharma</strong>
                        <span className="text-teal-700">09:30 AM • Scaling</span>
                      </div>
                      {idx === 1 && (
                        <div className="bg-blue-100 border-l-4 border-blue-600 p-2.5 rounded-xl text-[11px] flex flex-col gap-1">
                          <strong className="text-blue-900">Ananya Iyer</strong>
                          <span className="text-blue-700">11:00 AM • Braces</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: AI SETTINGS & "TRAIN YOUR AI" */}
          {activeTab === 'ai-settings' && (
            <div className="flex flex-col gap-6 max-w-7xl mx-auto animate-fade-in">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 font-heading">Train Your AI & Persona Settings</h2>
                <p className="text-xs text-slate-500 mt-0.5">Upload clinic documentation (price lists, FAQs) and test AI responses in real-time.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Settings Form */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
                  <div className="flex flex-col gap-4 border-b border-slate-100 pb-6">
                    <h3 className="font-extrabold text-sm text-slate-900 font-heading flex items-center gap-2">
                      <FileText className="w-4 h-4 text-teal-600" />
                      <span>1. Knowledge Base Documents ("Train Your AI")</span>
                    </h3>
                    <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:border-teal-500 transition cursor-pointer">
                      <p className="text-xs text-slate-600 font-bold">Drag & Drop Price List PDFs or FAQ files here</p>
                      <span className="text-[10px] text-slate-400">Supports PDF, DOCX, TXT up to 10MB</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-xs font-bold text-slate-700">Indexed Files:</span>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border text-xs">
                        <span className="font-medium text-slate-800">SmileCare_Procedure_Rates_2026.pdf</span>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">Indexed</span>
                      </div>
                    </div>
                  </div>

                  {/* Persona Controls */}
                  <div className="flex flex-col gap-4">
                    <h3 className="font-extrabold text-sm text-slate-900 font-heading flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-teal-600" />
                      <span>2. Persona Tone & Greeting</span>
                    </h3>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">Custom Welcome Greeting:</label>
                      <input
                        type="text"
                        defaultValue="Hello! I am Maya, the 24/7 AI Receptionist for SmileCare Dental Suite."
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-teal-600"
                      />
                    </div>
                  </div>
                </div>

                {/* Live Test Panel */}
                <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between h-[520px]">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <span className="font-bold text-xs text-teal-400 flex items-center gap-2">
                      <Bot className="w-4 h-4" /> Live AI Simulator (Testing Mode)
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">Trained on 1 PDF</span>
                  </div>

                  <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3 text-xs">
                    {testMessages.map((m, i) => (
                      <div key={i} className={`p-3 rounded-2xl max-w-[85%] ${m.sender === 'user' ? 'bg-teal-500 text-slate-950 font-bold self-end' : 'bg-slate-800 text-slate-200 self-start'}`}>
                        {m.text}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleTestChat} className="pt-3 border-t border-slate-800 flex items-center gap-2">
                    <input
                      type="text"
                      value={testInput}
                      onChange={(e) => setTestInput(e.target.value)}
                      placeholder="Ask a test question about rates or slots…"
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-teal-400"
                    />
                    <button type="submit" className="px-4 py-2 rounded-xl bg-teal-400 text-slate-950 font-bold text-xs">
                      Test
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BILLING & USAGE */}
          {activeTab === 'billing' && (
            <div className="flex flex-col gap-8 max-w-7xl mx-auto animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 font-heading">Billing & Subscription Management</h2>
                  <p className="text-xs text-slate-500">View current plan, usage limits, invoices, and proration upgrades.</p>
                </div>
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md cursor-pointer"
                >
                  Upgrade to Enterprise Plan
                </button>
              </div>

              {/* Current Plan Card */}
              <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-[#0b1329] text-white rounded-3xl p-6 md:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-700">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wider">Active Subscription</span>
                  <h3 className="text-3xl font-extrabold font-heading">Growth Suite Plan</h3>
                  <p className="text-xs text-slate-300">Renews on Nov 08, 2026 • ₹6,999 / month</p>
                </div>

                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <div className="flex justify-between items-center text-xs text-slate-300">
                    <span>AI Conversations (64%):</span>
                    <strong className="text-teal-300 font-mono">640 / 1,000</strong>
                  </div>
                  <div className="w-full md:w-64 h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                    <div className="h-full bg-teal-400 rounded-full" style={{ width: '64%' }} />
                  </div>
                </div>
              </div>

              {/* Invoices Table */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <h3 className="font-extrabold text-base text-slate-900 font-heading">Invoice History</h3>
                <div className="divide-y divide-slate-100">
                  {[
                    { id: 'INV-2026-001', date: 'Oct 08, 2026', amount: '₹6,999', status: 'Paid' },
                    { id: 'INV-2026-002', date: 'Sep 08, 2026', amount: '₹6,999', status: 'Paid' },
                  ].map((inv) => (
                    <div key={inv.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-slate-900">{inv.id}</strong>
                        <span className="text-slate-400 ml-2">{inv.date}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-mono font-bold text-slate-900">{inv.amount}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {inv.status}
                        </span>
                        <button className="text-teal-700 hover:text-teal-800 font-bold flex items-center gap-1 cursor-pointer">
                          <Download className="w-3.5 h-3.5" /> PDF
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SUPER ADMIN PANEL */}
          {activeTab === 'super-admin' && (
            <div className="flex flex-col gap-8 max-w-7xl mx-auto animate-fade-in">
              <div className="flex items-center justify-between bg-purple-900 text-white p-6 rounded-3xl shadow-xl">
                <div>
                  <div className="inline-flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider mb-1">
                    <Shield className="w-4 h-4" /> Internal Control Center
                  </div>
                  <h2 className="text-3xl font-extrabold font-heading">Platform Super Admin Dashboard</h2>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[10px] text-purple-300 block">Total Platform MRR</span>
                    <strong className="text-2xl font-extrabold font-mono text-emerald-400">₹2,84,500</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-purple-300 block">Active Clinics</span>
                    <strong className="text-2xl font-extrabold font-mono text-white">254</strong>
                  </div>
                </div>
              </div>

              {/* Tenants Table */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-extrabold text-base text-slate-900 font-heading">Registered Clinic Tenants</h3>
                  <span className="text-xs text-slate-500 font-mono">Total 254 Clinics</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Clinic Name</th>
                        <th className="py-3 px-4">SaaS Plan</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">MRR</th>
                        <th className="py-3 px-4">AI Usage</th>
                        <th className="py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {tenants.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50 transition">
                          <td className="py-3.5 px-4 font-bold text-slate-900">{t.name}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border">
                              {t.plan}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${t.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : t.status === 'Trial' ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'}`}>
                              {t.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{t.mrr}</td>
                          <td className="py-3.5 px-4 font-mono text-slate-600">{t.chats}</td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => {
                                setImpersonatedClinic(t.name);
                                setIsImpersonating(true);
                                setActiveTab('overview');
                              }}
                              className="px-3 py-1 rounded-lg bg-purple-100 text-purple-800 hover:bg-purple-200 font-bold text-[11px] transition cursor-pointer flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> Impersonate
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-lg text-slate-900 font-heading">Upgrade to Enterprise Plan</h3>
              <button onClick={() => setShowUpgradeModal(false)} className="text-slate-400 hover:text-slate-600 text-lg">✕</button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Get unlimited AI conversations, unlimited doctor roster seats, 24/7 AI phone voice call reception, and white-label custom domain support.
            </p>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col gap-2 text-xs">
              <div className="flex justify-between"><span>New Plan:</span><strong className="text-slate-900">Enterprise Chain (₹14,999 / mo)</strong></div>
              <div className="flex justify-between"><span>Current Plan Credit (Prorated):</span><strong className="text-emerald-700">-₹2,100</strong></div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-sm text-slate-900">
                <span>Due Today:</span>
                <span className="font-mono text-teal-700">₹12,899</span>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowUpgradeModal(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs">Cancel</button>
              <button onClick={() => setShowUpgradeModal(false)} className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold text-xs">Confirm Upgrade</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LayoutDashboardIcon(props: any) {
  return <Layers {...props} />;
}
