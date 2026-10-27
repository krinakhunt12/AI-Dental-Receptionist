import { apiClient } from '../../../lib/apiClient';

export interface TeamUserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  createdAt?: string;
}

export async function getTeamUsers(clinicId: string): Promise<TeamUserItem[]> {
  const res = await apiClient<{ success?: boolean; data?: any[] } | any[]>('/users');
  const rawList = Array.isArray(res)
    ? res
    : (Array.isArray((res as any)?.data) ? (res as any).data : []);

  return rawList.map((u: any) => ({
    id: u.id,
    name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.name || u.email,
    email: u.email,
    role: u.role || 'STAFF',
    status: u.isActive !== false ? 'ACTIVE' : 'INACTIVE',
    createdAt: u.createdAt,
  }));
}
