import { Dentist } from '../../../types';
import { apiClient } from '../../../lib/apiClient';
import { mockDb } from '../../../mocks/mockDb';

const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getDentists(clinicId: string): Promise<Dentist[]> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    await delay(300);
    return mockDb.getDentists(clinicId);
  }
  return apiClient.get<Dentist[]>(`/api/clinics/${clinicId}/dentists`);
}
