import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../app/AuthProvider';
import { queryKeys } from '../../../lib/queryKeys';
import {
  getCareProtocols,
  getCareProtocol,
  getCarePlan,
  approveCareProtocol,
} from './careProtocolsApi';
import { CareProtocol, CareProtocolFilters, CarePlan } from '../../../types';

export function useCareProtocols(filters?: CareProtocolFilters) {
  const { user, isHydrated } = useAuth();
  const clinicId = user?.clinicId;
  const isEnabled = Boolean(isHydrated && clinicId);

  return useQuery<CareProtocol[]>({
    queryKey: queryKeys.careProtocols(clinicId || '', filters),
    queryFn: () => getCareProtocols(clinicId!, filters),
    enabled: isEnabled,
    staleTime: 10 * 60_000, // 10 minutes
  });
}

export function useCareProtocol(id: string) {
  const { user, isHydrated } = useAuth();
  const clinicId = user?.clinicId;
  const isEnabled = Boolean(isHydrated && clinicId && id);

  return useQuery<CareProtocol>({
    queryKey: queryKeys.careProtocol(clinicId || '', id),
    queryFn: () => getCareProtocol(clinicId!, id),
    enabled: isEnabled,
    staleTime: 10 * 60_000, // 10 minutes
  });
}

export function useCarePlan(appointmentId: string) {
  const { user, isHydrated } = useAuth();
  const clinicId = user?.clinicId;
  const isEnabled = Boolean(isHydrated && clinicId && appointmentId);

  return useQuery<CarePlan>({
    queryKey: queryKeys.carePlan(clinicId || '', appointmentId),
    queryFn: () => getCarePlan(clinicId!, appointmentId),
    enabled: isEnabled,
  });
}

export function useApproveProtocol() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const clinicId = user?.clinicId;

  return useMutation({
    mutationFn: (protocolId: string) => {
      if (!clinicId) throw new Error('Clinic context is required to approve protocol');
      return approveCareProtocol(clinicId, protocolId);
    },
    onSuccess: (_data, protocolId) => {
      if (clinicId) {
        queryClient.invalidateQueries({ queryKey: [clinicId, 'careProtocols'] });
        queryClient.invalidateQueries({
          queryKey: queryKeys.careProtocol(clinicId, protocolId),
        });
      }
    },
  });
}
