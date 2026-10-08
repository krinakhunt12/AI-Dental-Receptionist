import { useQuery } from '@tanstack/react-query';
import { api, queryKeys } from '../../../api';

export function usePatientsQuery() {
  const query = useQuery({
    queryKey: queryKeys.patients,
    queryFn: () => api.patients(),
  });

  return {
    patients: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
