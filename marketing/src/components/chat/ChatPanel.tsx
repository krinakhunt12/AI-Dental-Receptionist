import { AnimatePresence, motion } from 'framer-motion';
import { Minimize2, PhoneCall, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import { cn } from '../../lib/cn';
import { ToothMark } from '../layout/BrandLogo';
import { ChatInput } from './ChatInput';
import { ChatMessageItem, TypingIndicator } from './ChatMessageItem';

export interface ChatPanelProps {
  variant?: 'widget' | 'page';
  onClose?: () => void;
  onMinimize?: () => void;
  className?: string;
}

export function ChatPanel({ variant = 'widget', onClose, onMinimize, className }: ChatPanelProps) {
  const { messages, suggestions, isTyping, send, confirmSlot } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (!node) return;
    node.scrollTo({ top: node.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div
      className={cn(
        'flex h-full flex-col overflow-hidden bg-white',
        variant === 'widget' ? 'rounded-2xl' : 'rounded-3xl border border-line shadow-card',
        className,
      )}
      role="region"
      aria-label="SmileCare AI assistant"
    >
      <header className="flex items-center gap-3 border-b border-line bg-white px-4 py-3.5">
        <span className="relative flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
          <ToothMark className="size-5" />
          <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-white bg-emerald-500" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-bold text-ink-900">SmileCare Assistant</p>
          <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
            <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
            Online 24/7
          </p>
        </div>
        {onMinimize && (
          <button
            type="button"
            onClick={onMinimize}
            aria-label="Minimize chat"
            className="flex size-9 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
          >
            <Minimize2 className="size-4" aria-hidden />
          </button>
        )}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close chat"
            className="flex size-9 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
          >
            <X className="size-4" aria-hidden />
          </button>
        )}
      </header>

      <div
        ref={scrollRef}
        className="flex-1 space-y-4 overflow-y-auto bg-canvas px-4 py-5"
        aria-live="polite"
        aria-atomic="false"
      >
        {messages.map((message) => (
          <ChatMessageItem key={message.id} message={message} onSlotSelect={confirmSlot} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="flex gap-2 overflow-x-auto border-t border-line bg-white px-3 py-2.5 scrollbar-none"
          >
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => send(suggestion)}
                className="shrink-0 rounded-full border border-brand-200 bg-mint-50 px-3.5 py-1.5 text-xs font-semibold text-brand-800 transition-colors hover:border-brand-500 hover:bg-brand-50"
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <ChatInput onSend={send} />

      <p className="flex items-center justify-center gap-1.5 bg-white px-4 pb-3 text-center text-[11px] leading-snug text-ink-400">
        <PhoneCall className="size-3" aria-hidden />
        AI assistant for scheduling and clinic info. Not a substitute for medical advice.
      </p>
    </div>
  );
}
