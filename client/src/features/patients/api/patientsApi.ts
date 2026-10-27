import { Patient, PatientFilters } from '../../../types';
import { apiClient } from '../../../lib/apiClient';

function mapPatient(p: any): Patient {
  const name = `${p.firstName || ''} ${p.lastName || ''}`.trim() || p.name || 'Patient';
  const age = p.dateOfBirth
    ? Math.max(1, new Date().getFullYear() - new Date(p.dateOfBirth).getFullYear())
    : (p.age || 32);

  return {
    id: p.id,
    clinicId: p.clinicId,
    name,
    phone: p.phone || '',
    email: p.email || '',
    age,
    gender: (p.gender || 'Other') as Patient['gender'],
    lastVisit: p.lastVisit || (p.updatedAt ? new Date(p.updatedAt).toISOString().split('T')[0] : '2026-10-15'),
    nextAppointment: p.nextAppointment,
    source: p.source || 'Website Widget',
    tags: p.tags || ['General Checkup'],
    medicalHistory: p.medicalNotes ? [p.medicalNotes] : (p.medicalHistory || []),
    totalVisits: p.totalVisits || 1,
    totalAppointments: p.totalAppointments || 1,
    createdAt: p.createdAt,
  };
}

export async function getPatients(
  clinicId: string,
  filters?: PatientFilters
): Promise<Patient[]> {
  const res = await apiClient<{ success?: boolean; data?: { patients?: any[] } | any[] } | any[]>(
    '/patients',
    { params: filters as Record<string, string | number | boolean | undefined | null> }
  );

  const rawList = Array.isArray(res)
    ? res
    : (Array.isArray((res as any)?.data)
      ? (res as any).data
      : (res as any)?.data?.patients || []);

  return rawList.map(mapPatient);
}
