import { useQuery } from '@tanstack/react-query';
import { api, queryKeys } from '../../../api';

export function useAnalyticsQuery() {
  const statsQuery = useQuery({
    queryKey: queryKeys.stats,
    queryFn: () => api.stats(),
  });

  return {
    stats: statsQuery.data ?? null,
    isLoading: statsQuery.isLoading,
  };
}
