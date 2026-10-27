import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../app/AuthProvider';
import { queryKeys } from '../../../lib/queryKeys';
import {
  getAppointmentReminders,
  getReminderJobs,
  retryReminderJob,
  updateNotificationConsent,
} from '../api/remindersApi';
import {
  ConsentStatus,
  NotificationChannel,
  NotificationConsent,
  ReminderJob,
} from '../../../types';

/**
 * Hook to fetch all care reminder jobs for an appointment (WhatsApp/SMS).
 */
export function useAppointmentReminders(appointmentId: string) {
  const { user, isHydrated } = useAuth();
  const clinicId = user?.clinicId || 'clinic_smilecare_01';
  const isEnabled = Boolean(isHydrated && appointmentId);

  return useQuery<ReminderJob[]>({
    queryKey: queryKeys.appointmentReminders(clinicId, appointmentId),
    queryFn: () => getAppointmentReminders(clinicId, appointmentId),
    enabled: isEnabled,
    staleTime: 15_000, // 15 seconds fresh
    refetchInterval: 30_000, // poll status updates every 30s
  });
}

/**
 * Hook to retry a FAILED reminder job (Staff only).
 */
export function useRetryReminder() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const clinicId = user?.clinicId || 'clinic_smilecare_01';

  return useMutation({
    mutationFn: (jobId: string) => {
      return retryReminderJob(clinicId, jobId);
    },
    onSuccess: (updatedJob: ReminderJob) => {
      // Invalidate reminders for this appointment
      if (updatedJob.appointmentId) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.appointmentReminders(clinicId, updatedJob.appointmentId),
        });
      }
    },
  });
}

/**
 * Hook to update patient notification consent (OPTED_IN / OPTED_OUT).
 */
export function useUpdateConsent() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const clinicId = user?.clinicId || 'clinic_smilecare_01';

  return useMutation({
    mutationFn: ({
      patientId,
      channel,
      status,
      source,
    }: {
      patientId: string;
      channel: NotificationChannel;
      status: ConsentStatus;
      source?: string;
    }) => {
      return updateNotificationConsent(clinicId, patientId, { channel, status, source });
    },
    onSuccess: (consent: NotificationConsent) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.patientConsent(clinicId, consent.patientId),
      });
      // Invalidate all appointment reminders for this clinic as consent affects pending jobs
      queryClient.invalidateQueries({
        queryKey: [clinicId, 'appointments'],
      });
    },
  });
}

/**
 * Hook to fetch paginated reminder jobs for the entire clinic.
 */
export function useReminderJobs(filters?: { status?: string; page?: number; limit?: number }) {
  const { user, isHydrated } = useAuth();
  const clinicId = user?.clinicId || 'clinic_smilecare_01';
  const isEnabled = Boolean(isHydrated && clinicId);

  return useQuery<{ jobs: ReminderJob[]; total: number; page: number; limit: number }>({
    queryKey: queryKeys.reminderJobs(clinicId, filters),
    queryFn: () => getReminderJobs(clinicId, filters),
    enabled: isEnabled,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}

