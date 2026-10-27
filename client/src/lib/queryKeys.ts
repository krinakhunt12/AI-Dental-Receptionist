import { AppointmentFilters, PatientFilters, CareProtocolFilters } from '../types';

export const queryKeys = {
  all: (clinicId: string) => [clinicId] as const,
  appointments: (clinicId: string, filters?: AppointmentFilters) =>
    [clinicId, 'appointments', filters ?? {}] as const,
  appointment: (clinicId: string, id: string) =>
    [clinicId, 'appointments', id] as const,
  dentists: (clinicId: string) =>
    [clinicId, 'dentists'] as const,
  treatments: (clinicId: string) =>
    [clinicId, 'treatments'] as const,
  slots: (clinicId: string, dentistId: string, date: string) =>
    [clinicId, 'slots', dentistId, date] as const,
  patients: (clinicId: string, filters?: PatientFilters) =>
    [clinicId, 'patients', filters ?? {}] as const,
  careProtocols: (clinicId: string, filters?: CareProtocolFilters) =>
    [clinicId, 'careProtocols', filters ?? {}] as const,
  careProtocol: (clinicId: string, id: string) =>
    [clinicId, 'careProtocols', id] as const,
  carePlan: (clinicId: string, appointmentId: string) =>
    [clinicId, 'appointments', appointmentId, 'carePlan'] as const,
  appointmentReminders: (clinicId: string, appointmentId: string) =>
    [clinicId, 'appointments', appointmentId, 'reminders'] as const,
  patientConsent: (clinicId: string, patientId: string) =>
    [clinicId, 'patients', patientId, 'consent'] as const,
  dashboardSummary: (clinicId: string, range?: { from?: string; to?: string }) =>
    [clinicId, 'dashboard', 'summary', range ?? {}] as const,
  appointmentsTrend: (clinicId: string, range?: { from?: string; to?: string; interval?: string }) =>
    [clinicId, 'dashboard', 'trend', range ?? {}] as const,
  treatmentsBreakdown: (clinicId: string, range?: { from?: string; to?: string }) =>
    [clinicId, 'dashboard', 'treatments', range ?? {}] as const,
  dentistUtilization: (clinicId: string, range?: { from?: string; to?: string }) =>
    [clinicId, 'dashboard', 'utilization', range ?? {}] as const,
  aiReceptionist: (clinicId: string, range?: { from?: string; to?: string }) =>
    [clinicId, 'dashboard', 'ai', range ?? {}] as const,
  staffNotifications: (clinicId: string, unreadOnly?: boolean) =>
    [clinicId, 'notifications', { unreadOnly: !!unreadOnly }] as const,
  reminderJobs: (clinicId: string, filters?: { status?: string; page?: number; limit?: number }) =>
    [clinicId, 'reminderJobs', filters ?? {}] as const,
  triageLogs: (clinicId: string, filters?: { urgency?: string; page?: number; limit?: number }) =>
    [clinicId, 'triageLogs', filters ?? {}] as const,
  clinicProfile: (clinicId: string) =>
    [clinicId, 'clinic', 'profile'] as const,
  teamUsers: (clinicId: string) =>
    [clinicId, 'team', 'users'] as const,
};
