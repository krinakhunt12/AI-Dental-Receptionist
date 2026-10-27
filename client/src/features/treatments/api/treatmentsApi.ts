import { Treatment } from '../../../types';
import { apiClient } from '../../../lib/apiClient';

export async function getTreatments(clinicId: string): Promise<Treatment[]> {
  const res = await apiClient<{ success?: boolean; data?: any } | any[]>('/treatments');
  const rawList = Array.isArray(res)
    ? res
    : (Array.isArray((res as any)?.data)
       ? (res as any).data
       : (res as any)?.data?.treatments || []);

  return rawList.map((t: any) => ({
    id: t.id,
    clinicId: t.clinicId,
    name: t.name,
    duration: t.durationMins || t.duration || 45,
    price: Number(t.price) || 0,
    description: t.description || '',
  }));
}

export interface CreateTreatmentInput {
  name: string;
  price: number;
  durationMins?: number;
  description?: string;
}

export async function createTreatment(data: CreateTreatmentInput): Promise<Treatment> {
  const res = await apiClient.post<{ success: boolean; data: any }>(
    '/treatments',
    data
  );
  const t = (res as any)?.data || res;
  return {
    id: t.id,
    clinicId: t.clinicId,
    name: t.name,
    duration: t.durationMins || t.duration || 45,
    price: Number(t.price) || 0,
    description: t.description || '',
  };
}
