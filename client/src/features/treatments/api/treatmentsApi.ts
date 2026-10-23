import { Treatment } from '../../../types';
import { apiClient } from '../../../lib/apiClient';
import { mockDb } from '../../../mocks/mockDb';

const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getTreatments(clinicId: string): Promise<Treatment[]> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    await delay(300);
    return mockDb.getTreatments(clinicId);
  }
  return apiClient.get<Treatment[]>(`/api/clinics/${clinicId}/treatments`);
}
