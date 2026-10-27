import { apiClient } from '../../../lib/apiClient';
import { Conversation, Message } from '../../../types';

export async function getConversations(
  clinicId: string,
  filters?: { patientId?: string; page?: number; limit?: number }
): Promise<Conversation[]> {
  const response = await apiClient<{ success: boolean; data: { conversations: any[] } }>(
    '/ai/conversations',
    { params: filters }
  );

  const rawList = response?.data?.conversations || [];
  return rawList.map((c) => ({
    id: c.id,
    clinicId: c.clinicId,
    patientId: c.patientId,
    patientName: c.patient ? `${c.patient.firstName} ${c.patient.lastName}`.trim() : 'Website Visitor',
    patientPhone: c.patient?.phone || '+1 (555) 000-0000',
    patientAvatar: '',
    channel: c.channel === 'chat' ? 'Widget' : (c.channel || 'Widget'),
    status: c.status === 'ACTIVE' ? 'AI Handled' : (c.status || 'AI Handled'),
    lastMessage: c.messages?.[0]?.content || 'Chat session active',
    lastMessageTime: c.messages?.[0]?.createdAt || c.updatedAt || new Date().toISOString(),
    unread: false,
    emergency: false,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }));
}

export async function getConversation(clinicId: string, id: string): Promise<Conversation> {
  const response = await apiClient<{ success: boolean; data: any }>(`/ai/conversations/${id}`);
  const c = response?.data;
  return {
    id: c.id,
    clinicId: c.clinicId,
    patientId: c.patientId,
    patientName: c.patient ? `${c.patient.firstName} ${c.patient.lastName}`.trim() : 'Website Visitor',
    patientPhone: c.patient?.phone || '+1 (555) 000-0000',
    channel: c.channel === 'chat' ? 'Widget' : (c.channel || 'Widget'),
    status: c.status === 'ACTIVE' ? 'AI Handled' : (c.status || 'AI Handled'),
    lastMessage: c.messages?.[c.messages.length - 1]?.content || 'Chat session active',
    lastMessageTime: c.messages?.[c.messages.length - 1]?.createdAt || c.updatedAt,
    messages: (c.messages || []).map((m: any) => ({
      id: m.id,
      conversationId: m.conversationId,
      sender: m.senderRole === 'assistant' ? 'ai' : (m.senderRole === 'system' ? 'ai' : 'patient'),
      text: m.content,
      content: m.content,
      timestamp: m.createdAt,
      createdAt: m.createdAt,
    })),
  };
}

export async function addConversationMessage(
  clinicId: string,
  conversationId: string,
  content: string,
  senderRole = 'assistant'
): Promise<Message> {
  const response = await apiClient<{ success: boolean; data: any }>(
    `/ai/conversations/${conversationId}/messages`,
    {
      method: 'POST',
      body: JSON.stringify({ senderRole, content }),
    }
  );
  return response.data;
}
