import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../app/AuthProvider';
import { queryKeys } from '../../../lib/queryKeys';
import { ApiError } from '../../../lib/apiClient';
import {
  cancelAppointment,
  createAppointment,
  getAppointment,
  getAppointments,
  updateAppointment,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from './appointmentsApi';
import { Appointment, AppointmentFilters } from '../../../types';

export function useAppointments(filters?: AppointmentFilters) {
  const { user, isHydrated } = useAuth();
  const clinicId = user?.clinicId;
  const isEnabled = Boolean(isHydrated && clinicId);

  return useQuery<Appointment[]>({
    queryKey: queryKeys.appointments(clinicId || '', filters),
    queryFn: () => getAppointments(clinicId!, filters),
    enabled: isEnabled,
  });
}

export function useAppointment(id: string) {
  const { user, isHydrated } = useAuth();
  const clinicId = user?.clinicId;
  const isEnabled = Boolean(isHydrated && clinicId && id);

  return useQuery<Appointment>({
    queryKey: queryKeys.appointment(clinicId || '', id),
    queryFn: () => getAppointment(clinicId!, id),
    enabled: isEnabled,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const clinicId = user?.clinicId;

  return useMutation({
    mutationFn: (data: CreateAppointmentInput) => {
      if (!clinicId) throw new Error('Clinic context is required to create an appointment.');
      return createAppointment(clinicId, data);
    },
    onSuccess: (newAppt) => {
      if (clinicId) {
        queryClient.invalidateQueries({ queryKey: [clinicId, 'appointments'] });
        queryClient.invalidateQueries({
          queryKey: queryKeys.slots(clinicId, newAppt.doctorId, newAppt.date),
        });
      }
    },
    onError: (error: unknown, variables) => {
      if (clinicId) {
        const isConflict =
          (error instanceof ApiError && error.status === 409) ||
          (error && typeof error === 'object' && 'status' in error && (error as { status: number }).status === 409);
        if (isConflict) {
          queryClient.invalidateQueries({
            queryKey: queryKeys.slots(clinicId, variables.doctorId, variables.date),
          });
          queryClient.invalidateQueries({ queryKey: [clinicId, 'appointments'] });
        }
      }
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const clinicId = user?.clinicId;

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAppointmentInput }) => {
      if (!clinicId) throw new Error('Clinic context is required to update an appointment.');
      return updateAppointment(clinicId, id, data);
    },
    onSuccess: (updatedAppt, variables) => {
      if (clinicId) {
        queryClient.invalidateQueries({ queryKey: [clinicId, 'appointments'] });
        queryClient.invalidateQueries({ queryKey: queryKeys.appointment(clinicId, variables.id) });
        if (updatedAppt.doctorId && updatedAppt.date) {
          queryClient.invalidateQueries({
            queryKey: queryKeys.slots(clinicId, updatedAppt.doctorId, updatedAppt.date),
          });
        }
      }
    },
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const clinicId = user?.clinicId;

  return useMutation({
    mutationFn: (id: string) => {
      if (!clinicId) throw new Error('Clinic context is required to cancel an appointment.');
      return cancelAppointment(clinicId, id);
    },
    onMutate: async (id: string) => {
      if (!clinicId) return;

      // Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: [clinicId, 'appointments'] });

      // Snapshot current cache states
      const previousAppointments = queryClient.getQueriesData<Appointment[]>({
        queryKey: [clinicId, 'appointments'],
      });
      const previousAppointment = queryClient.getQueryData<Appointment>(
        queryKeys.appointment(clinicId, id)
      );

      // Optimistically mark appointment as Cancelled in all cached lists
      queryClient.setQueriesData<Appointment[]>(
        { queryKey: [clinicId, 'appointments'] },
        (old) => {
          if (!old) return old;
          return old.map((appt) =>
            appt.id === id ? { ...appt, status: 'Cancelled' as const } : appt
          );
        }
      );

      // Optimistically mark appointment as Cancelled in detail cache
      queryClient.setQueryData<Appointment>(
        queryKeys.appointment(clinicId, id),
        (old) => {
          if (!old) return old;
          return { ...old, status: 'Cancelled' as const };
        }
      );

      return { previousAppointments, previousAppointment, id };
    },
    onError: (_err, id, context) => {
      // Rollback to previous state on error
      if (context?.previousAppointments) {
        context.previousAppointments.forEach(([key, data]) => {
          queryClient.setQueryData(key, data);
        });
      }
      if (context?.previousAppointment && clinicId) {
        queryClient.setQueryData(
          queryKeys.appointment(clinicId, id),
          context.previousAppointment
        );
      }
    },
    onSettled: (data, _err, id, context) => {
      // Invalidate queries to sync with source of truth
      if (clinicId) {
        queryClient.invalidateQueries({ queryKey: [clinicId, 'appointments'] });
        queryClient.invalidateQueries({ queryKey: queryKeys.appointment(clinicId, id) });

        const doctorId = data?.doctorId || context?.previousAppointment?.doctorId;
        const date = data?.date || context?.previousAppointment?.date;
        if (doctorId && date) {
          queryClient.invalidateQueries({
            queryKey: queryKeys.slots(clinicId, doctorId, date),
          });
        } else {
          queryClient.invalidateQueries({ queryKey: [clinicId, 'slots'] });
        }
      }
    },
  });
}
