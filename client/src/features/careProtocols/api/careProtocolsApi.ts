import {
  CareProtocol,
  CareProtocolFilters,
  CareInstruction,
  CarePlan,
} from '../../../types';
import { apiClient } from '../../../lib/apiClient';
import { mockDb } from '../../../mocks/mockDb';

const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getCareProtocols(
  clinicId: string,
  filters?: CareProtocolFilters
): Promise<CareProtocol[]> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    await delay(300);
    return mockDb.getCareProtocols(clinicId, filters);
  }
  const res = await apiClient.get<any>('/api/care-protocols', {
    params: filters as Record<string, string | number | boolean | undefined | null>,
  });
  return res?.data ?? res;
}

export async function getCareProtocol(
  clinicId: string,
  id: string
): Promise<CareProtocol> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    await delay(300);
    return mockDb.getCareProtocol(clinicId, id);
  }
  const res = await apiClient.get<any>(`/api/care-protocols/${id}`);
  return res?.data ?? res;
}

export async function createCareProtocol(
  clinicId: string,
  data: { treatmentId: string; name: string }
): Promise<CareProtocol> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    await delay(300);
    return mockDb.createCareProtocol(clinicId, data);
  }
  const res = await apiClient.post<any>('/api/care-protocols', data);
  return res?.data ?? res;
}

export async function updateCareProtocol(
  clinicId: string,
  id: string,
  data: { name?: string }
): Promise<CareProtocol> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    await delay(300);
    return mockDb.updateCareProtocol(clinicId, id, data);
  }
  const res = await apiClient.patch<any>(`/api/care-protocols/${id}`, data);
  return res?.data ?? res;
}

export async function approveCareProtocol(
  clinicId: string,
  id: string
): Promise<CareProtocol> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    await delay(300);
    return mockDb.approveCareProtocol(clinicId, id);
  }
  const res = await apiClient.post<any>(`/api/care-protocols/${id}/approve`);
  return res?.data ?? res;
}

export async function addCareInstruction(
  clinicId: string,
  protocolId: string,
  data: Omit<CareInstruction, 'id' | 'clinicId' | 'protocolId'>
): Promise<CareInstruction> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    await delay(300);
    return mockDb.addCareInstruction(clinicId, protocolId, data);
  }
  const res = await apiClient.post<any>(`/api/care-protocols/${protocolId}/instructions`, data);
  return res?.data ?? res;
}

export async function updateCareInstruction(
  clinicId: string,
  instructionId: string,
  data: Partial<CareInstruction>
): Promise<CareInstruction> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    await delay(300);
    const inst = await mockDb.getCareProtocol(clinicId, 'proto_1');
    return (inst.instructions?.[0] as CareInstruction) || ({} as CareInstruction);
  }
  const res = await apiClient.patch<any>(`/api/care-protocols/instructions/${instructionId}`, data);
  return res?.data ?? res;
}

export async function deleteCareInstruction(
  clinicId: string,
  instructionId: string
): Promise<{ success: boolean }> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    await delay(300);
    return { success: true };
  }
  const res = await apiClient.delete<any>(`/api/care-protocols/instructions/${instructionId}`);
  return res?.data ?? res;
}

export async function getCarePlan(
  clinicId: string,
  appointmentId: string
): Promise<CarePlan> {
  if (import.meta.env.VITE_USE_MOCK_API === 'true') {
    await delay(300);
    return mockDb.getCarePlan(clinicId, appointmentId);
  }
  const res = await apiClient.get<any>(`/api/appointments/${appointmentId}/care-plan`);
  return res?.data ?? res;
}
