import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../app/AuthProvider';
import { useTenant } from '../app/TenantProvider';
import { useUIStore } from '../store/useUIStore';
import { APP_NAV_GROUPS } from '../config/nav';
import { hasPermission, UserRole } from '../config/permissions';
import { CommandPalette } from '../components/ui/CommandPalette';
import { ToastContainer } from '../components/ui/Toast';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';
import { useAddAppointmentMutation, useDoctorsQuery, usePatientsQuery } from '../api/mockClient';
import {
  LayoutDashboard,
  MessageSquare,
  Calendar,
  Users,
  UserCheck,
  Brain,
  Megaphone,
  BarChart3,
  Code2,
  Sliders,
  CreditCard,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  Bell,
  Sparkles,
  Lock,
  LogOut,
  User,
  AlertTriangle,
  Menu,
  X,
  HelpCircle,
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  MessageSquare,
  Calendar,
  Users,
  UserCheck,
  Brain,
  Megaphone,
  BarChart3,
  Code2,
  Sliders,
  CreditCard,
  ShieldCheck,
  Settings,
};

export const AppLayout: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const { tenant, plan } = useTenant();
  const {
    sidebarCollapsed,
    toggleSidebar,
    mobileDrawerOpen,
    setMobileDrawerOpen,
    setCommandPaletteOpen,
    addToast,
  } = useUIStore();

  const location = useLocation();
  const navigate = useNavigate();

  const [isQuickAptOpen, setIsQuickAptOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Quick Appointment Modal Form state
  const { data: doctors = [] } = useDoctorsQuery();
  const { data: patients = [] } = usePatientsQuery();
  const addAptMutation = useAddAppointmentMutation();

  const [aptPatientId, setAptPatientId] = useState('');
  const [aptDoctorId, setAptDoctorId] = useState(doctors[0]?.id || 'doc_1');
  const [aptTreatment, setAptTreatment] = useState('Routine Checkup & Teeth Cleaning');
  const [aptDate, setAptDate] = useState('2026-10-10');
  const [aptTime, setAptTime] = useState('10:00');

  const handleQuickAptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selPat = patients.find((p) => p.id === aptPatientId) || patients[0];
    const selDoc = doctors.find((d) => d.id === aptDoctorId) || doctors[0];

    addAptMutation.mutate(
      {
        patientId: selPat.id,
        patientName: selPat.name,
        patientPhone: selPat.phone,
        doctorId: selDoc.id,
        doctorName: selDoc.name,
        treatment: aptTreatment,
        date: aptDate,
        time: aptTime,
        durationMins: 45,
        status: 'Confirmed',
        source: 'Website Widget',
      },
      {
        onSuccess: () => {
          addToast({
            type: 'success',
            title: 'Appointment Created!',
            message: `Booked for ${selPat.name} on ${aptDate} at ${aptTime}.`,
          });
          setIsQuickAptOpen(false);
        },
      }
    );
  };

  // Usage meter calculations
  const usagePercentage = Math.round(
    (tenant.usage.conversationsUsed / tenant.usage.conversationsMax) * 100
  );

  return (
    <div className="min-h-screen theme-light bg-slate-50 text-slate-900 flex flex-col font-sans">
      <CommandPalette />
      <ToastContainer />

      {/* STICKY TOP BANNERS (Trial, Usage Warning) */}
      {tenant.status === 'TRIAL' && tenant.trialDaysLeft !== undefined && (
        <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-indigo-900 text-white text-xs px-4 py-2 flex items-center justify-between shadow-xs border-b border-teal-600/30 z-30">
          <div className="flex items-center gap-2 font-medium">
            <Sparkles className="w-4 h-4 text-teal-300 animate-pulse" />
            <span>
              <strong>SmileCare Free Trial:</strong> You have <strong>{tenant.trialDaysLeft} days left</strong> on your Growth Pro trial.
            </span>
          </div>
          <button
            onClick={() => navigate('/app/billing')}
            className="underline font-bold text-teal-200 hover:text-white cursor-pointer ml-4"
          >
            Upgrade Now →
          </button>
        </div>
      )}

      {usagePercentage >= 80 && (
        <div className="bg-amber-500 text-slate-950 text-xs px-4 py-1.5 flex items-center justify-between font-semibold border-b border-amber-600 z-30">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-slate-950 shrink-0" />
            <span>
              High AI Usage Notice: You have used <strong>{usagePercentage}%</strong> ({tenant.usage.conversationsUsed} / {tenant.usage.conversationsMax}) of your monthly AI conversations.
            </span>
          </div>
          <button
            onClick={() => navigate('/app/billing')}
            className="bg-slate-950 text-white px-2.5 py-0.5 rounded-md text-[11px] hover:bg-slate-900 cursor-pointer"
          >
            Upgrade Plan
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden relative">
        {/* DESKTOP LEFT SIDEBAR */}
        <aside
          className={`hidden md:flex flex-col bg-white border-r border-slate-200 transition-all duration-300 z-20 shrink-0 ${sidebarCollapsed ? 'w-[72px]' : 'w-[240px]'
            }`}
        >
          {/* Clinic Brand Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
            <div className="flex items-center gap-3 overflow-hidden">
              <div
                className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-xs"
                style={{ backgroundColor: tenant.brandColor || '#0d9488' }}
              >
                S
              </div>
              {!sidebarCollapsed && (
                <div className="min-w-0">
                  <h1 className="text-sm font-bold text-slate-900 truncate tracking-tight">{tenant.name}</h1>
                  <span className="text-[11px] font-semibold text-teal-600 uppercase tracking-wider block">
                    {plan.name}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={toggleSidebar}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Grouped Navigation */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {APP_NAV_GROUPS.map((group) => {
              // Filter items user role has permission for
              const allowedItems = group.items.filter(
                (item) => !item.permission || (user && hasPermission(user.role, item.permission))
              );

              if (allowedItems.length === 0) return null;

              return (
                <div key={group.id} className="space-y-1">
                  {!sidebarCollapsed && (
                    <h3 className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      {group.groupLabel}
                    </h3>
                  )}

                  {allowedItems.map((item) => {
                    const IconComponent = ICON_MAP[item.iconName] || LayoutDashboard;
                    const isActive = location.pathname === item.path;
                    const isFeatureLocked = item.requiredFeature && !plan.limits[item.requiredFeature];

                    return (
                      <Link
                        key={item.id}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 relative group ${isActive
                            ? 'bg-teal-50 text-teal-700 font-bold dark:bg-teal-950/40 dark:text-teal-300'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                          }`}
                        title={sidebarCollapsed ? item.label : undefined}
                      >
                        {/* Active Accent Bar */}
                        {isActive && (
                          <div className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-md bg-teal-600" />
                        )}

                        <IconComponent
                          className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'
                            }`}
                        />

                        {!sidebarCollapsed && <span className="flex-1 truncate">{item.label}</span>}

                        {/* Badges / Locks */}
                        {!sidebarCollapsed && isFeatureLocked && (
                          <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        )}

                        {!sidebarCollapsed && item.id === 'conversations' && (
                          <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-rose-500 text-white font-bold">
                            2
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Bottom Sidebar Usage / Plan Card */}
          {!sidebarCollapsed && (
            <div className="p-3 border-t border-slate-100">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>{plan.name}</span>
                  <span className="text-[11px] text-teal-600 font-semibold">{usagePercentage}% Used</span>
                </div>

                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${usagePercentage >= 80 ? 'bg-amber-500' : 'bg-teal-600'
                      }`}
                    style={{ width: `${Math.min(100, usagePercentage)}%` }}
                  />
                </div>

                <p className="text-[10px] text-slate-500">
                  {tenant.usage.conversationsUsed} / {tenant.usage.conversationsMax} AI chats
                </p>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => navigate('/app/billing')}
                  className="w-full text-xs py-1.5 justify-center bg-white"
                >
                  Upgrade Plan
                </Button>
              </div>
            </div>
          )}
        </aside>

        {/* MOBILE DRAWER BACKDROP & SIDEBAR */}
        {mobileDrawerOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <div className="relative w-72 bg-white h-full flex flex-col z-10 shadow-2xl p-4">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-teal-600 text-white font-bold flex items-center justify-center">
                    S
                  </div>
                  <span className="font-bold text-sm text-slate-900">{tenant.name}</span>
                </div>
                <button onClick={() => setMobileDrawerOpen(false)} className="p-1 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4 space-y-4">
                {APP_NAV_GROUPS.map((group) => (
                  <div key={group.id} className="space-y-1">
                    <h4 className="text-[10px] font-bold uppercase text-slate-400 px-2">
                      {group.groupLabel}
                    </h4>
                    {group.items.map((item) => {
                      const IconC = ICON_MAP[item.iconName] || LayoutDashboard;
                      return (
                        <Link
                          key={item.id}
                          to={item.path}
                          onClick={() => setMobileDrawerOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          <IconC className="w-4 h-4 text-teal-600" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* TOPBAR */}
          <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-8 flex items-center justify-between sticky top-0 z-10">
            {/* Mobile hamburger button */}
            <div className="flex items-center gap-3 md:gap-4">
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Breadcrumb / Title */}
              <div>
                <h2 className="text-base font-bold text-slate-900 capitalize tracking-tight">
                  {location.pathname.replace('/app/', '').replace('/app', 'Overview') || 'Overview'}
                </h2>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  SmileCare AI Receptionist Portal
                </span>
              </div>
            </div>

            {/* Right Actions: Cmd+K, New Appointment, Notifications, Profile */}
            <div className="flex items-center gap-3">
              {/* Cmd+K Search trigger */}
              <button
                onClick={() => setCommandPaletteOpen(true)}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-xs hover:border-slate-300 transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search patients, appointments...</span>
                <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white border border-slate-200 text-slate-500 shadow-2xs">
                  ⌘K
                </kbd>
              </button>

              {/* Quick Action Button */}
              <Button
                size="sm"
                icon={Plus}
                onClick={() => setIsQuickAptOpen(true)}
                className="shadow-xs text-xs"
              >
                <span className="hidden sm:inline">New Appointment</span>
                <span className="sm:hidden">New</span>
              </Button>

              {/* Emergency Bell Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 relative transition-colors cursor-pointer"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-fade-in space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-900">Notifications & Alerts</span>
                      <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                        2 Emergency
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div
                        onClick={() => {
                          setIsNotifOpen(false);
                          navigate('/app/conversations');
                        }}
                        className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 hover:bg-rose-100/70 cursor-pointer space-y-1"
                      >
                        <div className="flex items-center justify-between font-bold text-rose-800">
                          <span>Emergency Toothache Alert</span>
                          <span className="text-[10px] text-rose-600">5m ago</span>
                        </div>
                        <p className="text-slate-600 text-[11px] line-clamp-2">
                          Priya Sharma reported severe throbbing pain on right jaw!
                        </p>
                      </div>

                      <div
                        onClick={() => {
                          setIsNotifOpen(false);
                          navigate('/app/appointments');
                        }}
                        className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 cursor-pointer space-y-1"
                      >
                        <div className="flex items-center justify-between font-bold text-slate-800">
                          <span>Unconfirmed Appointment</span>
                          <span className="text-[10px] text-slate-400">1h ago</span>
                        </div>
                        <p className="text-slate-500 text-[11px]">
                          Rahul Verma slot tomorrow 11:00 AM needs staff confirmation.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile / Role Switcher Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <img
                    src={user?.avatarUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80'}
                    alt={user?.name || 'User'}
                    className="w-8 h-8 rounded-lg object-cover ring-2 ring-teal-500/20"
                  />
                  <div className="hidden lg:block text-left">
                    <span className="block text-xs font-bold text-slate-800 line-clamp-1">{user?.name}</span>
                    <span className="block text-[10px] text-slate-400 font-semibold uppercase">{user?.role}</span>
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-fade-in space-y-3">
                    <div className="px-2 py-1.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user?.name}</p>
                      <p className="text-[11px] text-slate-400">{user?.email}</p>
                    </div>

                    {/* Role Switcher for Testing */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-slate-400 px-2">
                        Fast Role Switch (Testing):
                      </span>
                      {(['OWNER', 'ADMIN', 'RECEPTIONIST', 'DENTIST', 'SUPER_ADMIN'] as UserRole[]).map((r) => (
                        <button
                          key={r}
                          onClick={() => {
                            switchRole(r);
                            setIsProfileOpen(false);
                            addToast({ type: 'info', title: `Switched Role to ${r}` });
                          }}
                          className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between ${user?.role === r ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                          <span>{r}</span>
                          {user?.role === r && <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          logout();
                          navigate('/login');
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* PAGE CONTENT CONTAINER */}
          <main className="flex-1 p-4 md:p-8 max-w-[1440px] w-full mx-auto pb-24 md:pb-12">
            <Outlet />
          </main>
        </div>
      </div>

      {/* MOBILE BOTTOM NAVIGATION TAB BAR */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 flex items-center justify-around z-40 px-2 shadow-lg">
        <Link
          to="/app"
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold ${location.pathname === '/app' ? 'text-teal-600' : 'text-slate-400'
            }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Overview</span>
        </Link>
        <Link
          to="/app/conversations"
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold ${location.pathname === '/app/conversations' ? 'text-teal-600' : 'text-slate-400'
            }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>Inbox</span>
        </Link>
        <Link
          to="/app/appointments"
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold ${location.pathname === '/app/appointments' ? 'text-teal-600' : 'text-slate-400'
            }`}
        >
          <Calendar className="w-5 h-5" />
          <span>Calendar</span>
        </Link>
        <Link
          to="/app/patients"
          className={`flex flex-col items-center gap-1 text-[11px] font-semibold ${location.pathname === '/app/patients' ? 'text-teal-600' : 'text-slate-400'
            }`}
        >
          <Users className="w-5 h-5" />
          <span>Patients</span>
        </Link>
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="flex flex-col items-center gap-1 text-[11px] font-semibold text-slate-400"
        >
          <Menu className="w-5 h-5" />
          <span>More</span>
        </button>
      </div>

      {/* QUICK APPOINTMENT MODAL */}
      <Modal
        isOpen={isQuickAptOpen}
        onClose={() => setIsQuickAptOpen(false)}
        title="Schedule New Appointment"
        description="Book a patient into a dentist's calendar slot."
      >
        <form onSubmit={handleQuickAptSubmit} className="space-y-4">
          <Select
            label="Select Patient"
            value={aptPatientId}
            onChange={(e) => setAptPatientId(e.target.value)}
            options={patients.map((p) => ({ value: p.id, label: `${p.name} (${p.phone})` }))}
          />

          <Select
            label="Select Doctor"
            value={aptDoctorId}
            onChange={(e) => setAptDoctorId(e.target.value)}
            options={doctors.map((d) => ({ value: d.id, label: `${d.name} (${d.specialty})` }))}
          />

          <Input
            label="Treatment"
            value={aptTreatment}
            onChange={(e) => setAptTreatment(e.target.value)}
            placeholder="e.g. Root Canal Treatment"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              type="date"
              label="Date"
              value={aptDate}
              onChange={(e) => setAptDate(e.target.value)}
            />
            <Input
              type="time"
              label="Time Slot"
              value={aptTime}
              onChange={(e) => setAptTime(e.target.value)}
            />
          </div>

          <div className="pt-3 flex justify-end gap-3">
            <Button variant="outline" type="button" onClick={() => setIsQuickAptOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={addAptMutation.isPending}>
              Confirm Booking
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
