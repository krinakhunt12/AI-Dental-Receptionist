import { apiClient } from '../../../lib/apiClient';
import { mockDb } from '../../../mocks/mockDb';

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
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    return mockDb.getTriageLogs(clinicId, filters);
  }
  const res = await apiClient.get<any>('/api/triage/logs', { params: filters });
  return res?.data ?? res;
}
