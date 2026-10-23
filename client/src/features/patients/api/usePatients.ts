import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../../../app/AuthProvider';
import { queryKeys } from '../../../lib/queryKeys';
import { getPatients } from './patientsApi';
import { Patient, PatientFilters } from '../../../types';

export function usePatients(filters?: PatientFilters) {
  const { user, isHydrated } = useAuth();
  const clinicId = user?.clinicId;
  const isEnabled = Boolean(isHydrated && clinicId);

  return useQuery<Patient[]>({
    queryKey: queryKeys.patients(clinicId || '', filters),
    queryFn: () => getPatients(clinicId!, filters),
    enabled: isEnabled,
  });
}
