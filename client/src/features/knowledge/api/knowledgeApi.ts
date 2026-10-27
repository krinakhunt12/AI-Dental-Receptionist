import { apiClient } from '../../../lib/apiClient';
import { KnowledgeDoc } from '../../../types';

export async function getKnowledgeDocs(): Promise<KnowledgeDoc[]> {
  return apiClient<KnowledgeDoc[]>('/knowledge');
}

export async function addKnowledgeDoc(data: {
  name?: string;
  text?: string;
  question?: string;
  answer?: string;
}): Promise<KnowledgeDoc> {
  return apiClient<KnowledgeDoc>('/knowledge', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteKnowledgeDoc(id: string): Promise<{ ok: boolean }> {
  return apiClient<{ ok: boolean }>(`/knowledge/${id}`, {
    method: 'DELETE',
  });
}

export async function searchKnowledge(query: string): Promise<Array<{ source: string; text: string; score: number }>> {
  return apiClient<Array<{ source: string; text: string; score: number }>>('/knowledge/search', {
    params: { q: query },
  });
}
