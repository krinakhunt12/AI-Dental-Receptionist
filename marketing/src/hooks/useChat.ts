import { useCallback, useEffect, useRef, useState } from 'react';
import { quickReplies, sendMessage, type ChatMessage } from '../api/chat';
import type { Appointment } from '../api/types';

const greeting: ChatMessage = {
  id: 'greeting',
  role: 'assistant',
  text: "Hi there! I'm the SmileCare assistant. I can book appointments, share prices and opening hours, and answer questions about our treatments — any hour of the day. How can I help?",
  timestamp: Date.now(),
};

let counter = 0;
function nextId(prefix = 'msg') {
  counter += 1;
  return `${prefix}-${Date.now()}-${counter}`;
}

export type HandoffState = 'idle' | 'connecting' | 'connected';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([greeting]);
  const [suggestions, setSuggestions] = useState<string[]>(quickReplies);
  const [isTyping, setIsTyping] = useState(false);
  const [handoff, setHandoff] = useState<HandoffState>('idle');
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
    },
    [],
  );

  const push = useCallback((message: ChatMessage) => {
    setMessages((current) => [...current, message]);
  }, []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      push({ id: nextId('user'), role: 'user', text: trimmed, timestamp: Date.now() });
      setIsTyping(true);
      setSuggestions([]);

      try {
        const reply = await sendMessage(trimmed);

        if (reply.payload?.type === 'handoff') {
          setHandoff('connecting');
          const timer = window.setTimeout(() => {
            setHandoff('connected');
            push({
              id: nextId('assistant'),
              role: 'assistant',
              text: "You're connected. Rahul from our front desk is with you now — he can also book you in if you'd rather not use chat.",
              timestamp: Date.now(),
            });
            setSuggestions([]);
          }, 2200);
          timers.current.push(timer);
        }

        push({
          id: nextId('assistant'),
          role: 'assistant',
          text: reply.text,
          timestamp: Date.now(),
          payload: reply.payload,
        });
        setSuggestions(reply.suggestions ?? []);
      } finally {
        setIsTyping(false);
      }
    },
    [push],
  );

  const confirmSlot = useCallback(
    (slot: { date: string; dateLabel: string; timeLabel: string }, serviceName = 'Dental Cleaning') => {
      const appointment: Appointment = {
        id: `SC-${Math.floor(100000 + Math.random() * 899999)}`,
        serviceId: 'cleaning',
        serviceName,
        dentistId: 'patel',
        dentistName: 'Dr. Arvind Patel',
        date: slot.date,
        time: slot.timeLabel,
        durationMin: 30,
        priceInr: 800,
        patient: {
          name: 'Guest patient',
          phone: '+91 98765 43210',
          email: 'guest@smilecare.dental',
        },
        createdAt: new Date().toISOString(),
      };

      push({
        id: nextId('assistant'),
        role: 'assistant',
        text: `All set — I've held ${slot.timeLabel} on ${slot.dateLabel} for you. I've noted it under a guest profile for now; the front desk will confirm your name and number when you visit.`,
        timestamp: Date.now(),
        payload: { type: 'appointment', appointment },
      });
      setSuggestions(['Talk to receptionist', 'Book appointment']);
    },
    [push],
  );

  const reset = useCallback(() => {
    setMessages([greeting]);
    setSuggestions(quickReplies);
    setHandoff('idle');
  }, []);

  return { messages, suggestions, isTyping, handoff, send, confirmSlot, reset };
}
