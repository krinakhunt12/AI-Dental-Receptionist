export type UserRole = 'OWNER' | 'ADMIN' | 'RECEPTIONIST' | 'DENTIST' | 'SUPER_ADMIN';

export type PermissionKey =
  | 'overview.view'
  | 'conversations.view'
  | 'conversations.takeover'
  | 'appointments.view'
  | 'appointments.manage'
  | 'patients.view'
  | 'patients.manage'
  | 'doctors.view'
  | 'doctors.manage'
  | 'knowledge.manage'
  | 'campaigns.manage'
  | 'analytics.view'
  | 'widget.manage'
  | 'aiSettings.manage'
  | 'billing.view'
  | 'billing.manage'
  | 'team.view'
  | 'team.manage'
  | 'settings.manage'
  | 'admin.access';

export const ROLE_PERMISSIONS: Record<UserRole, PermissionKey[]> = {
  SUPER_ADMIN: [
    'overview.view', 'conversations.view', 'conversations.takeover',
    'appointments.view', 'appointments.manage', 'patients.view', 'patients.manage',
    'doctors.view', 'doctors.manage', 'knowledge.manage', 'campaigns.manage',
    'analytics.view', 'widget.manage', 'aiSettings.manage', 'billing.view',
    'billing.manage', 'team.view', 'team.manage', 'settings.manage', 'admin.access'
  ],
  OWNER: [
    'overview.view', 'conversations.view', 'conversations.takeover',
    'appointments.view', 'appointments.manage', 'patients.view', 'patients.manage',
    'doctors.view', 'doctors.manage', 'knowledge.manage', 'campaigns.manage',
    'analytics.view', 'widget.manage', 'aiSettings.manage', 'billing.view',
    'billing.manage', 'team.view', 'team.manage', 'settings.manage'
  ],
  ADMIN: [
    'overview.view', 'conversations.view', 'conversations.takeover',
    'appointments.view', 'appointments.manage', 'patients.view', 'patients.manage',
    'doctors.view', 'doctors.manage', 'knowledge.manage', 'campaigns.manage',
    'analytics.view', 'widget.manage', 'aiSettings.manage', 'billing.view',
    'team.view', 'team.manage', 'settings.manage'
  ],
  RECEPTIONIST: [
    'overview.view', 'conversations.view', 'conversations.takeover',
    'appointments.view', 'appointments.manage', 'patients.view', 'patients.manage',
    'doctors.view', 'analytics.view'
  ],
  DENTIST: [
    'overview.view', 'appointments.view', 'patients.view'
  ],
};

export function hasPermission(role: UserRole, permission: PermissionKey): boolean {
  if (!role) return false;
  const perms = ROLE_PERMISSIONS[role];
  return perms ? perms.includes(permission) : false;
}
