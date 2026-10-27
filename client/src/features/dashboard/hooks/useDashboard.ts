import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../app/AuthProvider';
import { queryKeys } from '../../../lib/queryKeys';
import {
  getDashboardSummary,
  getAppointmentsTrend,
  getTreatmentsBreakdown,
  getDentistUtilization,
  getAiReceptionistMetrics,
  DashboardSummary,
  AppointmentTrendItem,
  TreatmentBreakdownItem,
  DentistUtilizationItem,
  AiReceptionistMetrics,
} from '../api/dashboardApi';

export function useDashboardSummary(range?: { from?: string; to?: string }) {
  const { user, isHydrated } = useAuth();
  const clinicId = user?.clinicId;
  const isEnabled = Boolean(isHydrated && clinicId);

  return useQuery<DashboardSummary>({
    queryKey: queryKeys.dashboardSummary(clinicId || '', range),
    queryFn: () => getDashboardSummary(clinicId!, range),
    enabled: isEnabled,
    staleTime: 30_000,
    refetchInterval: 60_000, // 60s auto-refresh
    refetchIntervalInBackground: false, // Paused when tab hidden
  });
}

export function useAppointmentsTrend(range?: { from?: string; to?: string; interval?: 'day' | 'week' }) {
  const { user, isHydrated } = useAuth();
  const clinicId = user?.clinicId;
  const isEnabled = Boolean(isHydrated && clinicId);

  return useQuery<AppointmentTrendItem[]>({
    queryKey: queryKeys.appointmentsTrend(clinicId || '', range),
    queryFn: () => getAppointmentsTrend(clinicId!, range),
    enabled: isEnabled,
    staleTime: 60_000,
  });
}

export function useTreatmentsBreakdown(range?: { from?: string; to?: string }) {
  const { user, isHydrated } = useAuth();
  const clinicId = user?.clinicId;
  const isEnabled = Boolean(isHydrated && clinicId);

  return useQuery<TreatmentBreakdownItem[]>({
    queryKey: queryKeys.treatmentsBreakdown(clinicId || '', range),
    queryFn: () => getTreatmentsBreakdown(clinicId!, range),
    enabled: isEnabled,
    staleTime: 60_000,
  });
}

export function useDentistUtilization(range?: { from?: string; to?: string }) {
  const { user, isHydrated } = useAuth();
  const clinicId = user?.clinicId;
  const isEnabled = Boolean(isHydrated && clinicId);

  return useQuery<DentistUtilizationItem[]>({
    queryKey: queryKeys.dentistUtilization(clinicId || '', range),
    queryFn: () => getDentistUtilization(clinicId!, range),
    enabled: isEnabled,
    staleTime: 60_000,
  });
}

export function useAiReceptionist(range?: { from?: string; to?: string }) {
  const { user, isHydrated } = useAuth();
  const clinicId = user?.clinicId;
  const isEnabled = Boolean(isHydrated && clinicId);

  return useQuery<AiReceptionistMetrics>({
    queryKey: queryKeys.aiReceptionist(clinicId || '', range),
    queryFn: () => getAiReceptionistMetrics(clinicId!, range),
    enabled: isEnabled,
    staleTime: 60_000,
  });
}
