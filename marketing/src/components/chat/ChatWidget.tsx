import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '../../lib/cn';
import { ToothMark } from '../layout/BrandLogo';
import { ChatPanel } from './ChatPanel';

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [hintVisible, setHintVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[80] flex justify-end">
      <div className="pointer-events-auto relative m-4 flex flex-col items-end sm:m-6">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.98 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className={cn(
                'absolute bottom-[calc(100%+0.75rem)] right-0 w-[380px] max-w-[calc(100vw-2rem)] overflow-hidden shadow-lift',
                'h-[min(560px,calc(100vh-9rem))] max-sm:fixed max-sm:inset-0 max-sm:h-full max-sm:max-w-none max-sm:rounded-none',
              )}
            >
              <ChatPanel variant="widget" onClose={() => setOpen(false)} onMinimize={() => setOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative flex items-center gap-3">
          <AnimatePresence>
            {!open && (
              <motion.span
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: hintVisible ? 1 : 0, x: hintVisible ? 0 : 8 }}
                exit={{ opacity: 0, x: 8 }}
                className="pointer-events-none absolute right-[calc(100%+0.75rem)] hidden rounded-full bg-ink-900 px-3.5 py-2 text-xs font-semibold text-white shadow-lift sm:block"
              >
                Ask me anything
              </motion.span>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            onMouseEnter={() => setHintVisible(true)}
            onMouseLeave={() => setHintVisible(false)}
            aria-label={open ? 'Close the AI assistant chat' : 'Open the AI assistant chat'}
            aria-expanded={open}
            className={cn(
              'relative flex size-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lift transition-all duration-300 hover:bg-brand-700',
              open && 'bg-ink-900 hover:bg-ink-800',
            )}
          >
            {!open && (
              <span
                className="absolute inset-0 rounded-full bg-brand-500/40"
                style={{ animation: 'pulseRing 2.6s ease-out infinite' }}
                aria-hidden
              />
            )}
            {open ? (
              <MessageCircle className="relative size-6" aria-hidden />
            ) : (
              <ToothMark className="relative size-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
