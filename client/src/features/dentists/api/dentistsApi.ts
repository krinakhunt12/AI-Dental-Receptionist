import { Dentist } from '../../../types';
import { apiClient } from '../../../lib/apiClient';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function mapDentist(d: any): Dentist {
  const workingDays = Array.isArray(d.workingHours) && d.workingHours.length > 0
    ? d.workingHours.filter((wh: any) => !wh.isClosed).map((wh: any) => DAY_NAMES[wh.dayOfWeek] || 'Mon')
    : (Array.isArray(d.workingDays) ? d.workingDays : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);

  const activeHours = Array.isArray(d.workingHours) && d.workingHours.length > 0
    ? d.workingHours.find((wh: any) => !wh.isClosed) || d.workingHours[0]
    : null;

  const workingHoursStr = activeHours
    ? `${activeHours.startTime} - ${activeHours.endTime}`
    : (typeof d.workingHours === 'string' ? d.workingHours : '09:00 - 17:00');

  return {
    id: d.id,
    clinicId: d.clinicId,
    name: d.name,
    specialty: d.specialty || 'General Dentist',
    specialization: d.specialty || 'General Dentist',
    avatarUrl: d.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    email: d.email || '',
    phone: d.phone || '',
    workingDays,
    workingHours: workingHoursStr,
    treatments: Array.isArray(d.treatments) ? d.treatments : [],
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

export interface CreateDentistInput {
  name: string;
  specialization?: string;
  specialty?: string;
  email?: string;
  phone?: string;
  workingDays?: string[];
  startTime?: string;
  endTime?: string;
  slotDuration?: number;
}

export async function createDentist(data: CreateDentistInput): Promise<Dentist> {
  const dayMap: Record<string, number> = {
    Sun: 0, Sunday: 0,
    Mon: 1, Monday: 1,
    Tue: 2, Tuesday: 2,
    Wed: 3, Wednesday: 3,
    Thu: 4, Thursday: 4,
    Fri: 5, Friday: 5,
    Sat: 6, Saturday: 6,
  };

  const startTime = data.startTime || '09:00';
  const endTime = data.endTime || '17:00';
  const days = data.workingDays && data.workingDays.length > 0
    ? data.workingDays
    : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  const workingHours = days.map((day) => ({
    dayOfWeek: dayMap[day] ?? 1,
    startTime,
    endTime,
    isClosed: false,
  }));

  const payload = {
    name: data.name.trim(),
    specialty: data.specialization?.trim() || data.specialty?.trim() || 'General Dentistry',
    email: data.email?.trim() || undefined,
    phone: data.phone?.trim() || undefined,
    bio: data.slotDuration ? `Slot duration: ${data.slotDuration}m` : undefined,
    workingHours,
  };

  const res = await apiClient.post<{ success: boolean; data: any; message?: string }>(
    '/dentists',
    payload
  );

  const created = (res as any)?.data || res;
  return mapDentist(created);
}

