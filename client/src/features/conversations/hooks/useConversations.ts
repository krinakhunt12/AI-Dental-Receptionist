import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../app/AuthProvider';
import { queryKeys } from '../../../lib/queryKeys';
import {
  getConversations,
  getConversation,
  addConversationMessage,
} from '../api/conversationsApi';
import { Conversation } from '../../../types';

export function useConversationsQuery(filters?: { patientId?: string; page?: number; limit?: number }) {
  const { user, isHydrated } = useAuth();
  const clinicId = user?.clinicId ?? '';

  return useQuery({
    queryKey: queryKeys.conversations(clinicId, filters),
    queryFn: () => getConversations(clinicId, filters),
    enabled: isHydrated && !!clinicId,
    refetchInterval: 15000,
  });
}

export function useConversationQuery(id: string) {
  const { user, isHydrated } = useAuth();
  const clinicId = user?.clinicId ?? '';

  return useQuery({
    queryKey: queryKeys.conversation(clinicId, id),
    queryFn: () => getConversation(clinicId, id),
    enabled: isHydrated && !!clinicId && !!id,
    refetchInterval: 5000,
  });
}

export function useTakeoverConversationMutation() {
  const { user } = useAuth();
  const clinicId = user?.clinicId ?? '';
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ convId, staffMessage }: { convId: string; staffMessage?: string }) =>
      addConversationMessage(clinicId, convId, staffMessage || 'Staff member joined the conversation.', 'staff'),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [clinicId, 'conversations'] });
      queryClient.invalidateQueries({ queryKey: queryKeys.conversation(clinicId, variables.convId) });
    },
  });
}
