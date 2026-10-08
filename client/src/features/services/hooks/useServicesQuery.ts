import { useQuery } from '@tanstack/react-query';
import { api, queryKeys } from '../../../api';

export function useServicesQuery() {
  const query = useQuery({
    queryKey: queryKeys.services,
    queryFn: () => api.services(),
  });

  return {
    services: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
