import { PermissionKey } from './permissions';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  iconName: string;
  permission?: PermissionKey;
  requiredFeature?: 'campaignsEnabled' | 'whatsappIntegration' | 'customBranding';
  badgeCountKey?: 'conversationsWaiting' | 'emergenciesCount';
}

export interface NavGroup {
  id: string;
  groupLabel: string;
  items: NavItem[];
}

export const APP_NAV_GROUPS: NavGroup[] = [
  {
    id: 'main',
    groupLabel: 'Main',
    items: [
      {
        id: 'overview',
        label: 'Overview',
        path: '/app',
        iconName: 'LayoutDashboard',
        permission: 'overview.view',
      },
      {
        id: 'conversations',
        label: 'Conversations',
        path: '/app/conversations',
        iconName: 'MessageSquare',
        permission: 'conversations.view',
        badgeCountKey: 'emergenciesCount',
      },
      {
        id: 'appointments',
        label: 'Appointments',
        path: '/app/appointments',
        iconName: 'Calendar',
        permission: 'appointments.view',
      },
      {
        id: 'patients',
        label: 'Patients',
        path: '/app/patients',
        iconName: 'Users',
        permission: 'patients.view',
      },
    ],
  },
  {
    id: 'manage',
    groupLabel: 'Manage',
    items: [
      {
        id: 'doctors',
        label: 'Doctors & Roster',
        path: '/app/doctors',
        iconName: 'UserCheck',
        permission: 'doctors.view',
      },
      {
        id: 'knowledge-base',
        label: 'Knowledge Base',
        path: '/app/knowledge-base',
        iconName: 'Brain',
        permission: 'knowledge.manage',
      },
      {
        id: 'campaigns',
        label: 'Campaigns & Recalls',
        path: '/app/campaigns',
        iconName: 'Megaphone',
        permission: 'campaigns.manage',
        requiredFeature: 'campaignsEnabled',
      },
      {
        id: 'analytics',
        label: 'Analytics & Reports',
        path: '/app/analytics',
        iconName: 'BarChart3',
        permission: 'analytics.view',
      },
    ],
  },
  {
    id: 'account',
    groupLabel: 'Account & Settings',
    items: [
      {
        id: 'widget',
        label: 'Widget Studio',
        path: '/app/widget',
        iconName: 'Code2',
        permission: 'widget.manage',
      },
      {
        id: 'ai-settings',
        label: 'AI Behavior',
        path: '/app/ai-settings',
        iconName: 'Sliders',
        permission: 'aiSettings.manage',
      },
      {
        id: 'billing',
        label: 'Billing & Plan',
        path: '/app/billing',
        iconName: 'CreditCard',
        permission: 'billing.view',
      },
      {
        id: 'team',
        label: 'Team & Roles',
        path: '/app/team',
        iconName: 'ShieldCheck',
        permission: 'team.view',
      },
      {
        id: 'settings',
        label: 'Clinic Settings',
        path: '/app/settings',
        iconName: 'Settings',
        permission: 'settings.manage',
      },
    ],
  },
];
