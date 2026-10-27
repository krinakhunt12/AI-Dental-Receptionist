import {
  ReminderJob,
  NotificationConsent,
  NotificationChannel,
  ConsentStatus,
  TriageMessageResponse,
} from '../../../types';
import { apiClient } from '../../../lib/apiClient';

export async function getAppointmentReminders(
  clinicId: string,
  appointmentId: string
): Promise<ReminderJob[]> {
  const res = await apiClient<any>(`/appointments/${appointmentId}/reminders`);
  return res?.data ?? res;
}

export async function retryReminderJob(
  clinicId: string,
  jobId: string
): Promise<ReminderJob> {
  const res = await apiClient<any>(`/reminder-jobs/${jobId}/retry`, {
    method: 'POST',
  });
  return res?.data ?? res;
}

export async function updateNotificationConsent(
  clinicId: string,
  patientId: string,
  data: { channel: NotificationChannel; status: ConsentStatus; source?: string }
): Promise<NotificationConsent> {
  const res = await apiClient<any>(`/patients/${patientId}/consent`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res?.data ?? res;
}

export async function getReminderJobs(
  clinicId: string,
  filters?: { status?: string; page?: number; limit?: number }
): Promise<{ jobs: ReminderJob[]; total: number; page: number; limit: number }> {
  const res = await apiClient<any>('/reminder-jobs', { params: filters });
  const data = res?.data ?? res;
  return {
    jobs: data?.jobs || [],
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 20,
  };
}

export async function sendTriageMessage(data: {
  patientId?: string;
  appointmentId?: string;
  message: string;
}): Promise<TriageMessageResponse> {
  const res = await apiClient<any>('/triage/message', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res?.data ?? res;
}
