import { Appointment, AppointmentFilters } from '../../../types';
import { apiClient } from '../../../lib/apiClient';
import { mockDb } from '../../../mocks/mockDb';

const delay = (ms: number = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export interface CreateAppointmentInput {
  patientId?: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName?: string;
  treatment: string;
  treatmentId?: string;
  date: string;
  time: string;
  durationMins?: number;
  notes?: string;
  source?: Appointment['source'];
}

export interface UpdateAppointmentInput extends Partial<CreateAppointmentInput> {
  status?: Appointment['status'];
}

export async function getAppointments(
  clinicId: string,
  filters?: AppointmentFilters
): Promise<Appointment[]> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    await delay(300);
    return mockDb.getAppointments(clinicId, filters);
  }
  return apiClient.get<Appointment[]>(`/api/clinics/${clinicId}/appointments`, {
    params: filters as Record<string, string | number | boolean | undefined | null>,
  });
}

export async function getAppointment(
  clinicId: string,
  id: string
): Promise<Appointment> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    await delay(300);
    return mockDb.getAppointment(clinicId, id);
  }
  return apiClient.get<Appointment>(`/api/clinics/${clinicId}/appointments/${id}`);
}

export async function createAppointment(
  clinicId: string,
  data: CreateAppointmentInput
): Promise<Appointment> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    await delay(300);
    return mockDb.createAppointment(clinicId, data);
  }
  return apiClient.post<Appointment>(`/api/clinics/${clinicId}/appointments`, data);
}

export async function updateAppointment(
  clinicId: string,
  id: string,
  data: UpdateAppointmentInput
): Promise<Appointment> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    await delay(300);
    return mockDb.updateAppointment(clinicId, id, data as Partial<Appointment>);
  }
  return apiClient.patch<Appointment>(`/api/clinics/${clinicId}/appointments/${id}`, data);
}

export async function cancelAppointment(
  clinicId: string,
  id: string
): Promise<Appointment> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    await delay(300);
    return mockDb.cancelAppointment(clinicId, id);
  }
  return apiClient.patch<Appointment>(`/api/clinics/${clinicId}/appointments/${id}/cancel`);
}
