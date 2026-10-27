import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../app/AuthProvider';
import { queryKeys } from '../../../lib/queryKeys';
import {
  getStaffNotifications,
  acknowledgeStaffNotification,
  StaffNotificationItem,
} from '../api/notificationsApi';

export function useStaffNotifications(unreadOnly?: boolean) {
  const { user, isHydrated } = useAuth();
  const clinicId = user?.clinicId;
  const isEnabled = Boolean(isHydrated && clinicId);

  return useQuery<StaffNotificationItem[]>({
    queryKey: queryKeys.staffNotifications(clinicId || '', unreadOnly),
    queryFn: () => getStaffNotifications(clinicId!, unreadOnly),
    enabled: isEnabled,
    staleTime: 15_000,
    refetchInterval: 30_000, // Auto-refresh staff notifications every 30s
    refetchIntervalInBackground: false, // Paused when tab is hidden
  });
}

export function useAcknowledgeStaffNotification() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const clinicId = user?.clinicId;

  return useMutation({
    mutationFn: (id: string) => {
      if (!clinicId) throw new Error('Clinic context required');
      return acknowledgeStaffNotification(clinicId, id);
    },
    onSuccess: () => {
      if (clinicId) {
        queryClient.invalidateQueries({ queryKey: [clinicId, 'notifications'] });
        queryClient.invalidateQueries({ queryKey: [clinicId, 'dashboard', 'summary'] });
      }
    },
  });
}
