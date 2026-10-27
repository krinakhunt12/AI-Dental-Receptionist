import { apiClient } from '../../../lib/apiClient';
import { mockDb } from '../../../mocks/mockDb';

export interface TeamUserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  createdAt?: string;
}

export async function getTeamUsers(clinicId: string): Promise<TeamUserItem[]> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    return mockDb.getTeamUsers(clinicId);
  }
  const res = await apiClient.get<any>('/api/users');
  return res?.data ?? res;
}
