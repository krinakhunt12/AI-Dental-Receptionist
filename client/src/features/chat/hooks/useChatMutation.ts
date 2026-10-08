import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, queryKeys, type Msg } from '../../../api';

export function useChatMutation() {
  const queryClient = useQueryClient();

  const chatMutation = useMutation({
    mutationFn: (messages: Msg[]) => api.chat(messages),
    onSuccess: () => {
      // Invalidate appointments & conversations queries so latest bookings show up immediately
      queryClient.invalidateQueries({ queryKey: queryKeys.appointments });
      queryClient.invalidateQueries({ queryKey: queryKeys.conversations });
      queryClient.invalidateQueries({ queryKey: queryKeys.stats });
    },
  });

  return {
    sendMessage: (messages: Msg[]) => chatMutation.mutateAsync(messages),
    isBusy: chatMutation.isPending,
    error: chatMutation.error,
  };
}
