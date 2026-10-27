import { apiClient } from '../../../lib/apiClient';

export interface TriageLogItem {
  id: string;
  createdAt: string;
  urgency: 'EMERGENCY' | 'URGENT' | 'ROUTINE' | 'NONE';
  symptomKeys: string[];
  escalated: boolean;
  redactedText: string;
  patientId?: string | null;
  appointmentId?: string | null;
}

export async function getTriageLogs(
  clinicId: string,
  filters?: { urgency?: string; page?: number; limit?: number }
): Promise<{ logs: TriageLogItem[]; total: number; page: number; limit: number }> {
  const res = await apiClient<any>('/triage/logs', { params: filters });
  const data = res?.data ?? res;
  return {
    logs: data?.logs || [],
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 20,
  };
}
