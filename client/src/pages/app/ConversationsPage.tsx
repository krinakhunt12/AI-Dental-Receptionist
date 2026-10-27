import React, { useState } from 'react';
import {
  useConversationsQuery,
  useConversationQuery,
  useTakeoverConversationMutation,
} from '../../features/conversations/hooks/useConversations';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { useUIStore } from '../../store/useUIStore';
import {
  MessageSquare,
  Search,
  Send,
  UserCheck,
  Bot,
  AlertTriangle,
  Calendar,
  Phone,
  Tag,
  CheckCircle2,
} from 'lucide-react';

export const ConversationsPage: React.FC = () => {
  const { data: conversations = [], isLoading, isError, refetch } = useConversationsQuery();
  const takeoverMut = useTakeoverConversationMutation();
  const { addToast } = useUIStore();

  const [activeFilter, setActiveFilter] = useState<'All' | 'AI Handled' | 'Needs Human' | 'Emergency' | 'Booked'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConvId, setSelectedConvId] = useState<string>('');
  const [replyText, setReplyText] = useState('');

  const effectiveSelectedId = selectedConvId || conversations[0]?.id || '';
  const { data: conversationDetail } = useConversationQuery(effectiveSelectedId);

  const filtered = conversations.filter((c) => {
    if (activeFilter !== 'All' && c.status !== activeFilter) return false;
    if (searchQuery) {
      return (
        c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.patientPhone.includes(searchQuery)
      );
    }
    return true;
  });

  const selectedConv = conversationDetail || conversations.find((c) => c.id === effectiveSelectedId) || conversations[0];

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedConv) return;
    takeoverMut.mutate(
      { convId: selectedConv.id, staffMessage: replyText },
      {
        onSuccess: () => {
          setReplyText('');
          addToast({ type: 'success', title: 'Message Sent!' });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Patient AI Conversations</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <ErrorState
          title="Failed to load conversations"
          message="Could not retrieve AI conversation threads. Please verify backend connectivity."
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs animate-fade-in">
      {/* PANE 1: FILTERS & SEARCH (260px) */}
      <div className="w-full md:w-64 border-r border-slate-200 p-4 space-y-4 bg-slate-50/50 shrink-0">
        <h3 className="text-sm font-bold text-slate-900">Inbox Filters</h3>

        <Input
          icon={Search}
          placeholder="Search patient name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="space-y-1">
          {(['All', 'AI Handled', 'Needs Human', 'Emergency', 'Booked'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between cursor-pointer ${
                activeFilter === f
                  ? 'bg-teal-600 text-white font-bold'
                  : 'text-slate-600 hover:bg-slate-200/60'
              }`}
            >
              <span>{f}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20">
                {f === 'All'
                  ? conversations.length
                  : conversations.filter((c) => c.status === f).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* PANE 2: CONVERSATION LIST (320px) */}
      <div className="w-full md:w-80 border-r border-slate-200 flex flex-col shrink-0 bg-white">
        <div className="p-3 border-b border-slate-100 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700">Conversations ({filtered.length})</span>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No conversations found.
            </div>
          ) : (
            filtered.map((conv) => {
              const isSelected = conv.id === effectiveSelectedId;
              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-teal-50/80 border-l-4 border-teal-600' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 text-xs">
                    {(conv.patientName || 'U')[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{conv.patientName}</h4>
                      <span className="text-[10px] text-slate-400">
                        {conv.lastMessageTime ? new Date(conv.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{conv.lastMessage || 'Active session'}</p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <Badge
                        size="sm"
                        variant={
                          conv.status === 'Emergency'
                            ? 'danger'
                            : conv.status === 'Needs Human'
                            ? 'warning'
                            : 'teal'
                        }
                      >
                        {conv.status || 'AI Handled'}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* PANE 3: TRANSCRIPT & PATIENT CONTEXT (Flex-1) */}
      {selectedConv ? (
        <div className="flex-1 flex flex-col bg-slate-50/30 min-w-0">
          {/* Header */}
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center">
                {(selectedConv.patientName || 'U')[0]}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedConv.patientName}</h3>
                <p className="text-xs text-slate-400">
                  {selectedConv.patientPhone} • Channel: {selectedConv.channel}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant={selectedConv.emergency ? 'danger' : 'teal'}>
                {selectedConv.status || 'Active'}
              </Badge>
              <Button
                size="sm"
                variant="primary"
                onClick={() => {
                  takeoverMut.mutate({ convId: selectedConv.id, staffMessage: 'Staff taking over chat.' });
                  addToast({ type: 'success', title: 'Took over chat!' });
                }}
              >
                Take Over Chat
              </Button>
            </div>
          </div>

          {/* Transcript Messages Window */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {(selectedConv.messages || []).length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Conversation started. Send a staff reply below to engage.
              </div>
            ) : (
              selectedConv.messages?.map((m) => {
                const isUser = m.sender === 'patient' || m.senderRole === 'user';
                const isStaff = m.sender === 'staff' || m.senderRole === 'staff';
                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isUser ? 'items-start' : 'items-end'}`}
                  >
                    <div
                      className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isUser
                          ? 'bg-white border border-slate-200 text-slate-900 rounded-bl-none shadow-xs'
                          : isStaff
                          ? 'bg-indigo-600 text-white rounded-br-none'
                          : 'bg-teal-600 text-white rounded-br-none'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] opacity-75 mb-1 font-bold">
                        <span>{isUser ? 'PATIENT' : (isStaff ? 'STAFF' : 'AI ASSISTANT')}</span>
                      </div>
                      {m.text || m.content}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1">
                      {m.timestamp || m.createdAt ? new Date(m.timestamp || m.createdAt || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Reply Bar */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendReply()}
              placeholder="Type staff response..."
              className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
            />
            <Button size="sm" onClick={handleSendReply} icon={Send} isLoading={takeoverMut.isPending}>
              Reply
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8">
          <EmptyState
            icon={MessageSquare}
            title="No Conversations Yet"
            description="Active patient AI chats and receptionist transcripts will be displayed here."
          />
        </div>
      )}
    </div>
  );
};
