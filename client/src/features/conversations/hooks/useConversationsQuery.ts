import { useQuery } from '@tanstack/react-query';
import { api, queryKeys } from '../../../api';

export function useConversationsQuery() {
  const query = useQuery({
    queryKey: queryKeys.conversations,
    queryFn: () => api.conversations(),
  });

  return {
    conversations: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
