import { AppointmentFilters, PatientFilters } from '../types';

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
};
