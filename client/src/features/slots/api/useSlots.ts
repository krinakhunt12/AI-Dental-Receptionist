import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../app/AuthProvider';
import { queryKeys } from '../../../lib/queryKeys';
import { getSlots } from './slotsApi';
import { Slot } from '../../../types';

export function useSlots(dentistId: string, date: string) {
  const { user, isHydrated } = useAuth();
  const clinicId = user?.clinicId;
  const isEnabled = Boolean(isHydrated && clinicId && dentistId && date);

  return useQuery<Slot[]>({
    queryKey: queryKeys.slots(clinicId || '', dentistId, date),
    queryFn: () => getSlots(clinicId!, dentistId, date),
    enabled: isEnabled,
    staleTime: 10_000, // 10 seconds
    refetchInterval: 30_000, // refetch every 30 seconds
  });
}
