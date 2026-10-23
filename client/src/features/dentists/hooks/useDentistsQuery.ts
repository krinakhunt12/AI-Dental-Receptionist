import { useDentists } from '../api/useDentists';

export function useDentistsQuery() {
  const query = useDentists();

  return {
    dentists: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}
