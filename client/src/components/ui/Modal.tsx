import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export interface ModalProps {
  open?: boolean;
  isOpen?: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCloseButton?: boolean;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  className = '',
}) => {
  const isModalOpen = open !== undefined ? open : (isOpen ?? false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape & Lock body scroll while open, restore on close
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen, onClose]);

  // Focus the first focusable field on open
  useEffect(() => {
    if (!isModalOpen || !panelRef.current) return;

    const timer = requestAnimationFrame(() => {
      if (!panelRef.current) return;
      const focusable = panelRef.current.querySelector<HTMLElement>(
        'input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [role="combobox"]:not([aria-disabled="true"])'
      );
      if (focusable) {
        focusable.focus();
      } else {
        const anyButton = panelRef.current.querySelector<HTMLElement>(
          'button:not([disabled]):not([aria-label="Close dialog"])'
        );
        if (anyButton) {
          anyButton.focus();
        }
      }
    });

    return () => cancelAnimationFrame(timer);
  }, [isModalOpen]);

  if (!isModalOpen) return null;
  if (typeof document === 'undefined') return null;

  const sizeClasses: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
    '2xl': 'max-w-4xl',
  };

  return createPortal(
    <div
      className="fixed inset-0 z-modal flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-dialog-title' : undefined}
      aria-describedby={description ? 'modal-dialog-desc' : undefined}
    >
      {/* Fixed inset-0 backdrop with z-modal-backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity z-modal-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Centred panel, max-h-[90vh] with an internally scrolling body and z-modal */}
      <div
        ref={panelRef}
        className={`relative w-full ${sizeClasses[size] || 'max-w-md'} bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh] z-modal my-auto animate-fade-in ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || description || showCloseButton) && (
          <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div className="pr-4">
              {title && (
                <h3 id="modal-dialog-title" className="text-lg font-bold text-slate-900 dark:text-slate-100 font-heading">
                  {title}
                </h3>
              )}
              {description && (
                <p id="modal-dialog-desc" className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {description}
                </p>
              )}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        )}

        {/* Internally scrolling body */}
        <div className="p-6 overflow-y-auto flex-1">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-850 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3 shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
