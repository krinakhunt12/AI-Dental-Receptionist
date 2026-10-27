import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../app/AuthProvider';
import { queryKeys } from '../../../lib/queryKeys';
import { getClinicProfile, updateClinicProfile, ClinicProfile } from '../api/clinicApi';

export function useClinicProfile() {
  const { user, isHydrated } = useAuth();
  const clinicId = user?.clinicId;
  const isEnabled = Boolean(isHydrated && clinicId);

  return useQuery<ClinicProfile>({
    queryKey: queryKeys.clinicProfile(clinicId || ''),
    queryFn: () => getClinicProfile(clinicId!),
    enabled: isEnabled,
    staleTime: 5 * 60_000,
  });
}

export function useUpdateClinicProfile() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const clinicId = user?.clinicId;

  return useMutation({
    mutationFn: (data: Partial<ClinicProfile>) => {
      if (!clinicId) throw new Error('Clinic context required');
      return updateClinicProfile(clinicId, data);
    },
    onSuccess: () => {
      if (clinicId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.clinicProfile(clinicId) });
      }
    },
  });
}
