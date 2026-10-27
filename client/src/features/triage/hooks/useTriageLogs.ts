import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../app/AuthProvider';
import { queryKeys } from '../../../lib/queryKeys';
import { getTriageLogs, TriageLogItem } from '../api/triageLogsApi';

export function useTriageLogs(filters?: { urgency?: string; page?: number; limit?: number }) {
  const { user, isHydrated } = useAuth();
  const clinicId = user?.clinicId;
  const isEnabled = Boolean(isHydrated && clinicId);

  return useQuery<{ logs: TriageLogItem[]; total: number; page: number; limit: number }>({
    queryKey: queryKeys.triageLogs(clinicId || '', filters),
    queryFn: () => getTriageLogs(clinicId!, filters),
    enabled: isEnabled,
    staleTime: 30_000,
  });
}
