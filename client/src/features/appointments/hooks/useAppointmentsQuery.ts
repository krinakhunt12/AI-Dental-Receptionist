import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, queryKeys, type Status } from '../../../api';

export function useAppointmentsQuery() {
  const queryClient = useQueryClient();

  const apptsQuery = useQuery({
    queryKey: queryKeys.appointments,
    queryFn: () => api.appointments(),
  });

  const servicesQuery = useQuery({
    queryKey: queryKeys.services,
    queryFn: () => api.services(),
  });

  const dentistsQuery = useQuery({
    queryKey: queryKeys.dentists,
    queryFn: () => api.dentists(),
  });

  const createMutation = useMutation({
    mutationFn: (data: { serviceId: string; dentistId: string; date: string; time: string; patientName: string; patientPhone: string }) =>
      api.createAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Status }) => api.setStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats });
    },
  });

  return {
    appointments: apptsQuery.data ?? [],
    services: servicesQuery.data ?? [],
    dentists: dentistsQuery.data ?? [],
    isLoading: apptsQuery.isLoading || servicesQuery.isLoading || dentistsQuery.isLoading,
    isRefetching: apptsQuery.isRefetching,
    refetch: () => apptsQuery.refetch(),
    createAppointment: (data: { serviceId: string; dentistId: string; date: string; time: string; patientName: string; patientPhone: string }) =>
      createMutation.mutateAsync(data),
    updateStatus: (id: string, status: Status) => updateStatusMutation.mutateAsync({ id, status }),
    deleteAppointment: (id: string) => deleteMutation.mutateAsync(id),
  };
}
