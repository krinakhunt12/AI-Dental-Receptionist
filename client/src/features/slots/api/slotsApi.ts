import { Slot } from '../../../types';
import { apiClient } from '../../../lib/apiClient';

export async function getSlots(
  clinicId: string,
  dentistId: string,
  date: string
): Promise<Slot[]> {
  const res = await apiClient<{ success?: boolean; data?: any[] } | any[]>('/slots', {
    params: { dentistId, doctorId: dentistId, date },
  });

  const rawList = Array.isArray(res)
    ? res
    : (Array.isArray((res as any)?.data) ? (res as any).data : []);

  return rawList.map((s: any, idx: number) => ({
    id: s.id || `slot_${idx}`,
    clinicId: s.clinicId || clinicId,
    dentistId: s.dentistId || dentistId,
    date: s.date || date,
    time: s.time || (s.startTime ? s.startTime.split('T')[1]?.slice(0, 5) : '09:00'),
    startTime: s.startTime,
    endTime: s.endTime,
    isAvailable: s.isAvailable !== false,
  }));
}
