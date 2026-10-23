import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../app/AuthProvider';
import { queryKeys } from '../../../lib/queryKeys';
import { getDentists } from './dentistsApi';
import { Dentist } from '../../../types';

export function useDentists() {
  const { user, isHydrated } = useAuth();
  const clinicId = user?.clinicId;
  const isEnabled = Boolean(isHydrated && clinicId);

  return useQuery<Dentist[]>({
    queryKey: queryKeys.dentists(clinicId || ''),
    queryFn: () => getDentists(clinicId!),
    enabled: isEnabled,
    staleTime: 10 * 60_000, // 10 minutes
  });
}
