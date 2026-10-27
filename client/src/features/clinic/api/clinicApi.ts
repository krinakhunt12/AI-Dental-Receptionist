import { apiClient } from '../../../lib/apiClient';
import { mockDb } from '../../../mocks/mockDb';

export interface ClinicProfile {
  id: string;
  name: string;
  subdomain?: string;
  phone?: string;
  emergencyPhone?: string;
  timezone?: string;
  workingHours?: any;
  brandColor?: string;
  status?: string;
}

export async function getClinicProfile(clinicId: string): Promise<ClinicProfile> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    return mockDb.getClinicProfile(clinicId);
  }
  const res = await apiClient.get<any>('/api/clinic');
  return res?.data ?? res;
}

export async function updateClinicProfile(
  clinicId: string,
  data: Partial<ClinicProfile>
): Promise<ClinicProfile> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    return mockDb.updateClinicProfile(clinicId, data);
  }
  const res = await apiClient.patch<any>('/api/clinic', data);
  return res?.data ?? res;
}
