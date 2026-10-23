import { Slot } from '../../../types';
import { apiClient } from '../../../lib/apiClient';
import { mockDb } from '../../../mocks/mockDb';

const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getSlots(
  clinicId: string,
  dentistId: string,
  date: string
): Promise<Slot[]> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    await delay(300);
    return mockDb.getSlots(clinicId, dentistId, date);
  }
  return apiClient.get<Slot[]>(`/api/clinics/${clinicId}/slots`, {
    params: { dentistId, date },
  });
}
