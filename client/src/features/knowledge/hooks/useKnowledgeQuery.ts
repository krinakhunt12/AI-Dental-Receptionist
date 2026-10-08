import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, queryKeys } from '../../../api';

export function useKnowledgeQuery() {
  const queryClient = useQueryClient();

  const docsQuery = useQuery({
    queryKey: queryKeys.docs,
    queryFn: () => api.docs(),
  });

  const uploadMutation = useMutation({
    mutationFn: (file: File) => api.upload(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.docs });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteDoc(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.docs });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats });
    },
  });

  const searchMutation = useMutation({
    mutationFn: (q: string) => api.search(q),
  });

  return {
    docs: docsQuery.data ?? [],
    isLoading: docsQuery.isLoading,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isSearching: searchMutation.isPending,
    searchResults: searchMutation.data ?? null,
    upload: (file: File) => uploadMutation.mutateAsync(file),
    deleteDoc: (id: string) => deleteMutation.mutateAsync(id),
    search: (q: string) => searchMutation.mutateAsync(q),
  };
}
