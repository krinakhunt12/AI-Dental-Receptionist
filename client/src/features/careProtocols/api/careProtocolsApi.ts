import {
  CareProtocol,
  CareProtocolFilters,
  CareInstruction,
  CarePlan,
} from '../../../types';
import { apiClient } from '../../../lib/apiClient';

export async function getCareProtocols(
  clinicId: string,
  filters?: CareProtocolFilters
): Promise<CareProtocol[]> {
  const res = await apiClient<any>('/care-protocols', {
    params: filters as Record<string, string | number | boolean | undefined | null>,
  });
  return res?.data ?? res ?? [];
}

export async function getCareProtocol(
  clinicId: string,
  id: string
): Promise<CareProtocol> {
  const res = await apiClient<any>(`/care-protocols/${id}`);
  return res?.data ?? res;
}

export async function createCareProtocol(
  clinicId: string,
  data: { treatmentId: string; name: string }
): Promise<CareProtocol> {
  const res = await apiClient<any>('/care-protocols', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res?.data ?? res;
}

export async function updateCareProtocol(
  clinicId: string,
  id: string,
  data: { name?: string }
): Promise<CareProtocol> {
  const res = await apiClient<any>(`/care-protocols/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res?.data ?? res;
}

export async function approveCareProtocol(
  clinicId: string,
  id: string
): Promise<CareProtocol> {
  const res = await apiClient<any>(`/care-protocols/${id}/approve`, {
    method: 'POST',
  });
  return res?.data ?? res;
}

export async function addCareInstruction(
  clinicId: string,
  protocolId: string,
  data: Omit<CareInstruction, 'id' | 'clinicId' | 'protocolId'>
): Promise<CareInstruction> {
  const res = await apiClient<any>(`/care-protocols/${protocolId}/instructions`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res?.data ?? res;
}

export async function updateCareInstruction(
  clinicId: string,
  instructionId: string,
  data: Partial<CareInstruction>
): Promise<CareInstruction> {
  const res = await apiClient<any>(`/care-protocols/instructions/${instructionId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res?.data ?? res;
}

export async function deleteCareInstruction(
  clinicId: string,
  instructionId: string
): Promise<{ success: boolean }> {
  const res = await apiClient<any>(`/care-protocols/instructions/${instructionId}`, {
    method: 'DELETE',
  });
  return res?.data ?? res ?? { success: true };
}

export async function getCarePlan(
  clinicId: string,
  appointmentId: string
): Promise<CarePlan> {
  const res = await apiClient<any>(`/appointments/${appointmentId}/care-plan`);
  return res?.data ?? res;
}
