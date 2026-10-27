import { apiClient } from '../../../lib/apiClient';
import { mockDb } from '../../../mocks/mockDb';

export interface DashboardSummary {
  todayAppointmentsCount: number;
  upcomingCount: number;
  newPatientsCount: number;
  cancellationsCount: number;
  noShowsCount: number;
  completedCount: number;
  slotUtilizationPercent: number;
  pendingRemindersCount: number;
  failedRemindersCount: number;
  openEscalationsCount: number;
}

export interface AppointmentTrendItem {
  date: string;
  confirmed: number;
  completed: number;
  cancelled: number;
  noShow: number;
  total: number;
}

export interface TreatmentBreakdownItem {
  treatmentName: string;
  count: number;
  color?: string;
}

export interface DentistUtilizationItem {
  dentistId: string;
  name: string;
  specialty?: string;
  bookedSlots: number;
  availableSlots: number;
  utilizationRate: number;
}

export interface AiReceptionistMetrics {
  conversationsHandled: number;
  bookingsMadeByAi: number;
  escalationsCount: number;
  triageUrgencyCounts: Record<string, number>;
}

export async function getDashboardSummary(
  clinicId: string,
  range?: { from?: string; to?: string }
): Promise<DashboardSummary> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    return mockDb.getDashboardSummary(clinicId, range);
  }
  const res = await apiClient.get<any>('/api/dashboard/summary', { params: range });
  return res?.data ?? res;
}

export async function getAppointmentsTrend(
  clinicId: string,
  range?: { from?: string; to?: string; interval?: 'day' | 'week' }
): Promise<AppointmentTrendItem[]> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    return mockDb.getAppointmentsTrend(clinicId, range);
  }
  const res = await apiClient.get<any>('/api/dashboard/appointments-trend', { params: range });
  return res?.data ?? res;
}

export async function getTreatmentsBreakdown(
  clinicId: string,
  range?: { from?: string; to?: string }
): Promise<TreatmentBreakdownItem[]> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    return mockDb.getTreatmentsBreakdown(clinicId, range);
  }
  const res = await apiClient.get<any>('/api/dashboard/treatments-breakdown', { params: range });
  return res?.data ?? res;
}

export async function getDentistUtilization(
  clinicId: string,
  range?: { from?: string; to?: string }
): Promise<DentistUtilizationItem[]> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    return mockDb.getDentistUtilization(clinicId, range);
  }
  const res = await apiClient.get<any>('/api/dashboard/dentist-utilization', { params: range });
  return res?.data ?? res;
}

export async function getAiReceptionistMetrics(
  clinicId: string,
  range?: { from?: string; to?: string }
): Promise<AiReceptionistMetrics> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    return mockDb.getAiReceptionistMetrics(clinicId, range);
  }
  const res = await apiClient.get<any>('/api/dashboard/ai-receptionist', { params: range });
  return res?.data ?? res;
}
