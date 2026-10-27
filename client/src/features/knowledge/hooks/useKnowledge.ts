import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../app/AuthProvider';
import { queryKeys } from '../../../lib/queryKeys';
import {
  getKnowledgeDocs,
  addKnowledgeDoc,
  deleteKnowledgeDoc,
  searchKnowledge,
} from '../api/knowledgeApi';

export function useKnowledgeDocs() {
  const { user, isHydrated } = useAuth();
  const clinicId = user?.clinicId ?? '';

  return useQuery({
    queryKey: queryKeys.knowledgeDocs(clinicId),
    queryFn: () => getKnowledgeDocs(),
    enabled: isHydrated && !!clinicId,
  });
}

export function useAddKnowledgeDoc() {
  const { user } = useAuth();
  const clinicId = user?.clinicId ?? '';
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { name?: string; text?: string; question?: string; answer?: string }) =>
      addKnowledgeDoc(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.knowledgeDocs(clinicId) });
    },
  });
}

export function useDeleteKnowledgeDoc() {
  const { user } = useAuth();
  const clinicId = user?.clinicId ?? '';
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteKnowledgeDoc(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.knowledgeDocs(clinicId) });
    },
  });
}

export function useSearchKnowledge(query: string) {
  const { user, isHydrated } = useAuth();
  const clinicId = user?.clinicId ?? '';

  return useQuery({
    queryKey: queryKeys.knowledgeSearch(clinicId, query),
    queryFn: () => searchKnowledge(query),
    enabled: isHydrated && !!clinicId && query.trim().length > 0,
  });
}
