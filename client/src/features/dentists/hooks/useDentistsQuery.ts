import { useQuery } from '@tanstack/react-query';
import { api, queryKeys } from '../../../api';

export function useDentistsQuery() {
  const query = useQuery({
    queryKey: queryKeys.dentists,
    queryFn: () => api.dentists(),
  });

  return {
    dentists: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
