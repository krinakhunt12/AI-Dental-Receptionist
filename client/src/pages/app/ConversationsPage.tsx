import React, { useState } from 'react';
import { useConversationsQuery, useTakeoverConversationMutation } from '../../api/mockClient';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
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
  const { data: conversations = [] } = useConversationsQuery();
  const takeoverMut = useTakeoverConversationMutation();
  const { addToast } = useUIStore();

  const [activeFilter, setActiveFilter] = useState<'All' | 'AI Handled' | 'Needs Human' | 'Emergency' | 'Booked'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConvId, setSelectedConvId] = useState<string>(conversations[0]?.id || 'conv_800');
  const [replyText, setReplyText] = useState('');

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

  const selectedConv = conversations.find((c) => c.id === selectedConvId) || conversations[0];

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
          {filtered.map((conv) => {
            const isSelected = conv.id === selectedConvId;
            return (
              <div
                key={conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                  isSelected ? 'bg-teal-50/80 border-l-4 border-teal-600' : 'hover:bg-slate-50'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center shrink-0 text-xs">
                  {conv.patientName[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{conv.patientName}</h4>
                    <span className="text-[10px] text-slate-400">{conv.lastMessageTime}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{conv.lastMessage}</p>
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
                      {conv.status}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* PANE 3: TRANSCRIPT & PATIENT CONTEXT (Flex-1) */}
      {selectedConv ? (
        <div className="flex-1 flex flex-col bg-slate-50/30 min-w-0">
          {/* Header */}
          <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-600 text-white font-bold flex items-center justify-center">
                {selectedConv.patientName[0]}
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
                {selectedConv.status}
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
            {selectedConv.messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'patient' ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'patient'
                      ? 'bg-white border border-slate-200 text-slate-900 rounded-bl-none shadow-xs'
                      : m.sender === 'staff'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-teal-600 text-white rounded-br-none'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] opacity-75 mb-1 font-bold">
                    <span>{m.sender.toUpperCase()}</span>
                    {m.confidenceScore && (
                      <span className="bg-white/20 px-1 rounded">
                        AI Conf: {Math.round(m.confidenceScore * 100)}%
                      </span>
                    )}
                  </div>
                  {m.text}
                </div>
                <span className="text-[10px] text-slate-400 mt-1">{m.timestamp}</span>
              </div>
            ))}
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
            <Button size="sm" onClick={handleSendReply} icon={Send}>
              Reply
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
          Select a conversation from the list.
        </div>
      )}
    </div>
  );
};
