import { Appointment, AppointmentFilters } from '../../../types';
import { apiClient } from '../../../lib/apiClient';

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

function mapAppointment(a: any): Appointment {
  const statusStr = String(a.status || 'Pending').toLowerCase();
  let status: Appointment['status'] = 'Pending';
  if (statusStr === 'confirmed') status = 'Confirmed';
  else if (statusStr === 'completed') status = 'Completed';
  else if (statusStr === 'cancelled') status = 'Cancelled';
  else if (statusStr === 'no_show' || statusStr === 'no-show') status = 'No-show';

  return {
    id: a.id,
    clinicId: a.clinicId,
    patientId: a.patientId,
    patientName: a.patient ? `${a.patient.firstName || ''} ${a.patient.lastName || ''}`.trim() : (a.patientName || 'Patient'),
    patientPhone: a.patient?.phone || a.patientPhone || '',
    doctorId: a.doctorId,
    doctorName: a.doctor?.name || a.doctorName || 'Doctor',
    treatment: a.treatment?.name || a.service?.name || a.treatment || 'Consultation',
    treatmentId: a.treatmentId || a.serviceId,
    date: a.startTime ? a.startTime.split('T')[0] : (a.date || ''),
    time: a.startTime ? a.startTime.split('T')[1]?.slice(0, 5) : (a.time || ''),
    durationMins: a.durationMins || 45,
    status,
    source: a.source || 'Website Widget',
    notes: a.notes,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  };
}

export async function getAppointments(
  clinicId: string,
  filters?: AppointmentFilters
): Promise<Appointment[]> {
  const res = await apiClient<{ success?: boolean; data?: { appointments?: any[] } | any[] } | any[]>(
    '/appointments',
    { params: filters as Record<string, string | number | boolean | undefined | null> }
  );

  const rawList = Array.isArray(res)
    ? res
    : (Array.isArray((res as any)?.data)
      ? (res as any).data
      : (res as any)?.data?.appointments || []);

  return rawList.map(mapAppointment);
}

export async function getAppointment(
  clinicId: string,
  id: string
): Promise<Appointment> {
  const res = await apiClient<{ success?: boolean; data?: any } | any>(`/appointments/${id}`);
  const item = (res as any)?.data || res;
  return mapAppointment(item);
}

export async function createAppointment(
  clinicId: string,
  data: CreateAppointmentInput
): Promise<Appointment> {
  const startTime = `${data.date}T${data.time}:00.000Z`;
  const duration = data.durationMins || 45;
  const endDateObj = new Date(new Date(startTime).getTime() + duration * 60000);
  const endTime = endDateObj.toISOString();

  const payload = {
    doctorId: data.doctorId,
    patientId: data.patientId,
    serviceId: data.treatmentId,
    startTime,
    endTime,
    notes: data.notes,
    source: 'WEBSITE',
  };

  const res = await apiClient<{ success: boolean; data: any }>('/appointments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  return mapAppointment(res.data);
}

export async function updateAppointment(
  clinicId: string,
  id: string,
  data: UpdateAppointmentInput
): Promise<Appointment> {
  const payload: any = {};
  if (data.status) {
    payload.status = data.status.toUpperCase();
  }
  if (data.date && data.time) {
    payload.startTime = `${data.date}T${data.time}:00.000Z`;
  }
  if (data.notes) payload.notes = data.notes;

  const res = await apiClient<{ success: boolean; data: any }>(`/appointments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });

  return mapAppointment(res.data);
}

export async function cancelAppointment(
  clinicId: string,
  id: string
): Promise<Appointment> {
  const res = await apiClient<{ success: boolean; data: any }>(`/appointments/${id}/cancel`, {
    method: 'POST',
  });
  return mapAppointment(res.data);
}
