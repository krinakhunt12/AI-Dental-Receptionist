import { Patient, PatientFilters } from '../../../types';
import { apiClient } from '../../../lib/apiClient';
import { mockDb } from '../../../mocks/mockDb';

const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getPatients(
  clinicId: string,
  filters?: PatientFilters
): Promise<Patient[]> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    await delay(300);
    return mockDb.getPatients(clinicId, filters);
  }
  return apiClient.get<Patient[]>(`/api/clinics/${clinicId}/patients`, {
    params: filters as Record<string, string | number | boolean | undefined | null>,
  });
}
