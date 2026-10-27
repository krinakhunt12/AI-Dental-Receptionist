import {
  ReminderJob,
  NotificationConsent,
  NotificationChannel,
  ConsentStatus,
  TriageMessageResponse,
} from '../../../types';
import { apiClient } from '../../../lib/apiClient';
import { mockDb } from '../../../mocks/mockDb';

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getAppointmentReminders(
  clinicId: string,
  appointmentId: string
): Promise<ReminderJob[]> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    await delay(250);
    return mockDb.getAppointmentReminders(clinicId, appointmentId);
  }
  const res = await apiClient.get<any>(`/api/appointments/${appointmentId}/reminders`);
  return res?.data ?? res;
}

export async function retryReminderJob(
  clinicId: string,
  jobId: string
): Promise<ReminderJob> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    await delay(250);
    return mockDb.retryReminderJob(clinicId, jobId);
  }
  const res = await apiClient.post<any>(`/api/reminder-jobs/${jobId}/retry`);
  return res?.data ?? res;
}

export async function updateNotificationConsent(
  clinicId: string,
  patientId: string,
  data: { channel: NotificationChannel; status: ConsentStatus; source?: string }
): Promise<NotificationConsent> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    await delay(250);
    return mockDb.updateNotificationConsent(
      clinicId,
      patientId,
      data.channel,
      data.status,
      data.source
    );
  }
  const res = await apiClient.patch<any>(`/api/patients/${patientId}/consent`, data);
  return res?.data ?? res;
}

export async function getReminderJobs(
  clinicId: string,
  filters?: { status?: string; page?: number; limit?: number }
): Promise<{ jobs: ReminderJob[]; total: number; page: number; limit: number }> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    await delay(250);
    return mockDb.getReminderJobs(clinicId, filters);
  }
  const res = await apiClient.get<any>('/api/reminder-jobs', { params: filters });
  return res?.data ?? res;
}

export async function sendTriageMessage(data: {
  patientId?: string;
  appointmentId?: string;
  message: string;
}): Promise<TriageMessageResponse> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    await delay(400);
    return {
      reply: `[Mock AI Receptionist] Thank you for your inquiry: "${data.message}". Please rinse gently with warm salt water and contact the clinic if discomfort persists.\n\nNote: This is general guidance and the clinic can be contacted for concerns.`,
      urgency: 'NONE',
      escalated: false,
      symptomKeys: [],
      appointmentId: data.appointmentId || null,
      patientId: data.patientId || null,
    };
  }
  const res = await apiClient.post<any>('/api/triage/message', data);
  return res?.data ?? res;
}
