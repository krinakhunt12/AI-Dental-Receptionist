import { usePatients } from '../api/usePatients';

export function usePatientsQuery() {
  const query = usePatients();

  return {
    patients: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
