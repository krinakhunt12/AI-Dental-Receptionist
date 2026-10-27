import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../app/AuthProvider';
import { queryKeys } from '../../../lib/queryKeys';
import {
  getSubscription,
  getInvoices,
  updateSubscriptionPlan,
  cancelSubscription,
} from '../api/subscriptionsApi';

export function useSubscription() {
  const { user, isHydrated } = useAuth();
  const clinicId = user?.clinicId ?? '';

  return useQuery({
    queryKey: queryKeys.subscription(clinicId),
    queryFn: () => getSubscription(),
    enabled: isHydrated && !!clinicId,
  });
}

export function useInvoices() {
  const { user, isHydrated } = useAuth();
  const clinicId = user?.clinicId ?? '';

  return useQuery({
    queryKey: queryKeys.invoices(clinicId),
    queryFn: () => getInvoices(),
    enabled: isHydrated && !!clinicId,
  });
}

export function useUpdateSubscriptionPlan() {
  const { user } = useAuth();
  const clinicId = user?.clinicId ?? '';
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { planCode: string; billingPeriod?: 'MONTHLY' | 'YEARLY' }) =>
      updateSubscriptionPlan(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription(clinicId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.invoices(clinicId) });
    },
  });
}

export function useCancelSubscription() {
  const { user } = useAuth();
  const clinicId = user?.clinicId ?? '';
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cancelSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.subscription(clinicId) });
    },
  });
}
