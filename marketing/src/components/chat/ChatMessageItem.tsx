import { motion } from 'framer-motion';
import type { ChatMessage } from '../../api/chat';
import { cn } from '../../lib/cn';
import { AppointmentCard, DentistCard, EmergencyCard, HandoffCard, SlotPicker } from './ChatRich';

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString('en-IN', {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md bg-ink-100 px-4 py-3.5" aria-label="Assistant is typing">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="size-1.5 rounded-full bg-ink-400"
          style={{ animation: `typing 1.2s ease-in-out ${index * 0.16}s infinite` }}
          aria-hidden
        />
      ))}
    </div>
  );
}

export function ChatMessageItem({
  message,
  onSlotSelect,
}: {
  message: ChatMessage;
  onSlotSelect: (slot: { date: string; dateLabel: string; timeLabel: string }) => void;
}) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-end"
      >
        <div className="max-w-[85%]">
          <div className="rounded-2xl rounded-tr-md bg-brand-600 px-4 py-3 text-[15px] leading-relaxed text-white shadow-soft">
            {message.text}
          </div>
          <p className="mt-1 text-right text-[11px] text-ink-400">{formatTime(message.timestamp)}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start">
      <div className="max-w-[92%]">
        <div className="rounded-2xl rounded-tl-md bg-ink-100 px-4 py-3 text-[15px] leading-relaxed text-ink-800">
          {message.text}
        </div>

        {message.payload?.type === 'slots' && (
          <SlotPicker slots={message.payload.slots} heading={message.payload.heading} onSelect={onSlotSelect} />
        )}
        {message.payload?.type === 'appointment' && <AppointmentCard appointment={message.payload.appointment} />}
        {message.payload?.type === 'dentist' && <DentistCard dentist={message.payload.dentist} />}
        {message.payload?.type === 'emergency' && <EmergencyCard />}
        {message.payload?.type === 'handoff' && <HandoffCard status={message.payload.status} />}

        <p className={cn('mt-1 text-[11px] text-ink-400')}>SmileCare Assistant · {formatTime(message.timestamp)}</p>
      </div>
    </motion.div>
  );
}
