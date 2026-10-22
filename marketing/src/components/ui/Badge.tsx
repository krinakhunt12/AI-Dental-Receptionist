import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type BadgeTone = 'brand' | 'mint' | 'amber' | 'slate' | 'outline' | 'danger';

const tones: Record<BadgeTone, string> = {
  brand: 'bg-brand-50 text-brand-700',
  mint: 'bg-mint-100 text-brand-800',
  amber: 'bg-accent-50 text-accent-700',
  slate: 'bg-ink-100 text-ink-600',
  outline: 'border border-line text-ink-600',
  danger: 'bg-alert-50 text-alert-700',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  children: ReactNode;
}

export function Badge({ tone = 'brand', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold',
        tones[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
