import { apiClient } from '../../../lib/apiClient';
import { mockDb } from '../../../mocks/mockDb';

export interface StaffNotificationItem {
  id: string;
  type: 'ESCALATION' | 'FAILED_REMINDER';
  severity: 'EMERGENCY' | 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  message: string;
  metadata?: any;
  createdAt: string;
  isRead: boolean;
  acknowledgedAt?: string | null;
}

export async function getStaffNotifications(
  clinicId: string,
  unreadOnly?: boolean
): Promise<StaffNotificationItem[]> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    return mockDb.getStaffNotifications(clinicId, unreadOnly);
  }
  const res = await apiClient.get<any>('/api/notifications/staff', {
    params: { unreadOnly: unreadOnly ? 'true' : 'false' },
  });
  return res?.data ?? res;
}

export async function acknowledgeStaffNotification(
  clinicId: string,
  id: string
): Promise<StaffNotificationItem> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    return mockDb.acknowledgeStaffNotification(clinicId, id);
  }
  const res = await apiClient.patch<any>(`/api/notifications/staff/${id}/acknowledge`);
  return res?.data ?? res;
}
