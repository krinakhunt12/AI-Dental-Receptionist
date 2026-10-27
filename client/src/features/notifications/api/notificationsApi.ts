import { apiClient } from '../../../lib/apiClient';

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
  const res = await apiClient<any>('/notifications/staff', {
    params: { unreadOnly: unreadOnly ? 'true' : 'false' },
  });
  return res?.data ?? res ?? [];
}

export async function acknowledgeStaffNotification(
  clinicId: string,
  id: string
): Promise<StaffNotificationItem> {
  const res = await apiClient<any>(`/notifications/staff/${id}/acknowledge`, {
    method: 'PATCH',
  });
  return res?.data ?? res;
}
