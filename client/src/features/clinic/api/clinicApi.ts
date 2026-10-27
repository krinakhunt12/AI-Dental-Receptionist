import { apiClient } from '../../../lib/apiClient';

export interface ClinicProfile {
  id: string;
  name: string;
  slug?: string;
  subdomain?: string;
  phone?: string;
  emergencyPhone?: string;
  timezone?: string;
  workingHours?: any;
  brandColor?: string;
  status?: string;
}

export async function getClinicProfile(clinicId: string): Promise<ClinicProfile> {
  const res = await apiClient<{ success?: boolean; data?: any } | any>('/clinic/me');
  return (res as any)?.data ?? res;
}

export async function updateClinicProfile(
  clinicId: string,
  data: Partial<ClinicProfile>
): Promise<ClinicProfile> {
  const res = await apiClient<{ success?: boolean; data?: any } | any>('/clinic/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return (res as any)?.data ?? res;
}
