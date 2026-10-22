import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/cn';
import { useDialog } from './dialog-utils';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  side?: 'right' | 'left';
}

export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  side = 'right',
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useDialog(open, onClose, panelRef);

  const offscreen = side === 'right' ? { x: '100%' } : { x: '-100%' };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-ink-900/45 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={offscreen}
            animate={{ x: 0 }}
            exit={offscreen}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className={cn(
              'absolute inset-y-0 flex w-full max-w-md flex-col bg-white shadow-lift',
              side === 'right' ? 'right-0' : 'left-0',
            )}
          >
            <div className="flex items-start justify-between gap-6 border-b border-line px-6 py-5">
              <div>
                <h2 className="text-xl font-bold text-ink-900">{title}</h2>
                {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close panel"
                className="rounded-full p-2 text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
            {footer && (
              <div className="flex flex-wrap gap-3 border-t border-line bg-ink-50/60 px-6 py-4">{footer}</div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
