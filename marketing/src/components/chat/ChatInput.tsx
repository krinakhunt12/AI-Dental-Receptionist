import { Mic, MicOff, SendHorizontal } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';

const SAMPLE_TRANSCRIPT = "I'd like to book a cleaning for tomorrow at 5 PM.";

export function ChatInput({
  onSend,
  disabled = false,
  className,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
  className?: string;
}) {
  const [value, setValue] = useState('');
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isVoiceMode) return;
    const timer = window.setTimeout(() => {
      setIsVoiceMode(false);
      setValue(SAMPLE_TRANSCRIPT);
      inputRef.current?.focus();
    }, 2600);
    return () => window.clearTimeout(timer);
  }, [isVoiceMode]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!value.trim() || disabled) return;
    onSend(value);
    setValue('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('border-t border-line bg-white p-3', className)}
      aria-label="Send a message to the SmileCare assistant"
    >
      {isVoiceMode && (
        <div className="mb-2 flex items-center justify-between gap-3 rounded-xl bg-mint-50 px-3 py-2">
          <span className="flex items-center gap-2 text-xs font-semibold text-brand-800">
            <span className="flex h-5 items-end gap-0.5" aria-hidden>
              {[0, 1, 2, 3, 4].map((bar) => (
                <span
                  key={bar}
                  className="w-1 rounded-full bg-brand-500"
                  style={{
                    height: '100%',
                    transformOrigin: 'bottom',
                    animation: `waveform 0.9s ease-in-out ${bar * 0.1}s infinite`,
                  }}
                />
              ))}
            </span>
            Listening… speak now
          </span>
          <button
            type="button"
            onClick={() => setIsVoiceMode(false)}
            className="text-xs font-bold text-brand-700 underline underline-offset-2"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsVoiceMode((mode) => !mode)}
          aria-label={isVoiceMode ? 'Stop voice input' : 'Start voice input'}
          className={cn(
            'flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors',
            isVoiceMode
              ? 'border-alert-500 bg-alert-50 text-alert-600'
              : 'border-line text-ink-500 hover:border-brand-300 hover:text-brand-700',
          )}
        >
          {isVoiceMode ? <MicOff className="size-4" aria-hidden /> : <Mic className="size-4" aria-hidden />}
        </button>

        <input
          ref={inputRef}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={isVoiceMode ? 'Listening for your request…' : 'Type your message…'}
          aria-label="Message"
          disabled={disabled || isVoiceMode}
          className="h-10 min-w-0 flex-1 rounded-full border border-line bg-ink-50/70 px-4 text-sm text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/12 disabled:opacity-60"
        />

        <button
          type="submit"
          disabled={!value.trim() || disabled || isVoiceMode}
          aria-label="Send message"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white transition-all hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <SendHorizontal className="size-4" aria-hidden />
        </button>
      </div>
    </form>
  );
}
