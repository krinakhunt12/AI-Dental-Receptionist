import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, queryKeys, type Status } from '../../../api';

export function useDashboardQuery() {
  const queryClient = useQueryClient();

  const statsQuery = useQuery({
    queryKey: queryKeys.stats,
    queryFn: () => api.stats(),
  });

  const appointmentsQuery = useQuery({
    queryKey: queryKeys.appointments,
    queryFn: () => api.appointments(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Status }) => api.setStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats });
    },
  });

  return {
    stats: statsQuery.data ?? null,
    recentAppointments: (appointmentsQuery.data ?? []).slice(0, 6),
    isLoading: statsQuery.isLoading || appointmentsQuery.isLoading,
    isError: statsQuery.isError || appointmentsQuery.isError,
    updateStatus: (id: string, status: Status) => updateStatusMutation.mutateAsync({ id, status }),
  };
}
