import { Dentist } from '../../../types';
import { apiClient } from '../../../lib/apiClient';

function mapDentist(d: any): Dentist {
  return {
    id: d.id,
    clinicId: d.clinicId,
    name: d.name,
    specialty: d.specialty || 'General Dentist',
    specialization: d.specialty || 'General Dentist',
    avatarUrl: d.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    email: d.email || '',
    phone: d.phone || '',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    workingHours: '09:00 - 17:00',
    treatments: [],
  };
}

export async function getDentists(clinicId: string): Promise<Dentist[]> {
  const res = await apiClient<{ success?: boolean; data?: any } | any[]>('/dentists');
  const rawList = Array.isArray(res)
    ? res
    : (Array.isArray((res as any)?.data)
      ? (res as any).data
      : (res as any)?.data?.doctors || []);

  return rawList.map(mapDentist);
}
