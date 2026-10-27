import { apiClient } from '../../../lib/apiClient';

export interface DashboardSummary {
  todayAppointmentsCount: number;
  totalAppointmentsCount: number;
  newPatientsCount: number;
  activePatientsCount: number;
  estimatedRevenue: number;
  slotUtilizationPercentage: number;
  slotUtilizationPercent?: number;
  emergencyAlertsCount: number;
  pendingRemindersCount: number;
  aiHandledCallsCount: number;
  upcomingCount?: number;
  completedCount?: number;
  openEscalationsCount?: number;
  failedRemindersCount?: number;
}

export interface AppointmentTrendItem {
  date: string;
  total: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

export interface TreatmentBreakdownItem {
  name: string;
  treatmentName?: string;
  count: number;
  revenue: number;
  color?: string;
}

export interface DentistUtilizationItem {
  dentistId: string;
  dentistName: string;
  bookedSlots: number;
  totalSlots: number;
  utilizationRate: number;
}

export interface AiReceptionistMetrics {
  totalCalls: number;
  conversationsHandled?: number;
  appointmentsBookedByAi: number;
  bookingsMadeByAi?: number;
  escalatedToStaffCount: number;
  escalationsCount?: number;
  topQuestions: Array<{ question: string; count: number }>;
  triageUrgencyCounts: Record<string, number>;
}

const PALETTE = ['#0d9488', '#0284c7', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];

export async function getDashboardSummary(
  clinicId: string,
  range?: { from?: string; to?: string }
): Promise<DashboardSummary> {
  const res = await apiClient<{ success?: boolean; data?: any } | any>('/dashboard/summary', { params: range });
  const d = (res as any)?.data ?? res;
  return {
    ...d,
    slotUtilizationPercent: d.slotUtilizationPercent ?? d.slotUtilizationPercentage ?? 0,
    upcomingCount: d.upcomingCount ?? d.todayAppointmentsCount ?? 0,
    completedCount: d.completedCount ?? Math.max(0, (d.totalAppointmentsCount || 0) - (d.todayAppointmentsCount || 0)),
    openEscalationsCount: d.openEscalationsCount ?? d.emergencyAlertsCount ?? 0,
    failedRemindersCount: d.failedRemindersCount ?? 0,
  };
}

export async function getAppointmentsTrend(
  clinicId: string,
  range?: { from?: string; to?: string; interval?: 'day' | 'week' }
): Promise<AppointmentTrendItem[]> {
  const res = await apiClient<{ success?: boolean; data?: any } | any>('/dashboard/appointments-trend', { params: range });
  return (res as any)?.data ?? res;
}

export async function getTreatmentsBreakdown(
  clinicId: string,
  range?: { from?: string; to?: string }
): Promise<TreatmentBreakdownItem[]> {
  const res = await apiClient<{ success?: boolean; data?: any } | any>('/dashboard/treatments-breakdown', { params: range });
  const rawList = Array.isArray(res) ? res : ((res as any)?.data || []);
  return rawList.map((item: any, i: number) => ({
    ...item,
    treatmentName: item.treatmentName || item.name,
    color: item.color || PALETTE[i % PALETTE.length],
  }));
}

export async function getDentistUtilization(
  clinicId: string,
  range?: { from?: string; to?: string }
): Promise<DentistUtilizationItem[]> {
  const res = await apiClient<{ success?: boolean; data?: any } | any>('/dashboard/dentist-utilization', { params: range });
  return (res as any)?.data ?? res;
}

export async function getAiReceptionistMetrics(
  clinicId: string,
  range?: { from?: string; to?: string }
): Promise<AiReceptionistMetrics> {
  const res = await apiClient<{ success?: boolean; data?: any } | any>('/dashboard/ai-receptionist', { params: range });
  const d = (res as any)?.data ?? res;
  return {
    ...d,
    conversationsHandled: d.conversationsHandled ?? d.totalCalls ?? 0,
    bookingsMadeByAi: d.bookingsMadeByAi ?? d.appointmentsBookedByAi ?? 0,
    escalationsCount: d.escalationsCount ?? d.escalatedToStaffCount ?? 0,
  };
}
