import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../app/AuthProvider';
import { queryKeys } from '../../../lib/queryKeys';
import { getTreatments } from './treatmentsApi';
import { Treatment } from '../../../types';

export function useTreatments() {
  const { user, isHydrated } = useAuth();
  const clinicId = user?.clinicId;
  const isEnabled = Boolean(isHydrated && clinicId);

  return useQuery<Treatment[]>({
    queryKey: queryKeys.treatments(clinicId || ''),
    queryFn: () => getTreatments(clinicId!),
    enabled: isEnabled,
    staleTime: 10 * 60_000, // 10 minutes
  });
}
