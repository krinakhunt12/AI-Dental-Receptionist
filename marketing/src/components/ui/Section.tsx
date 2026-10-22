import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Reveal } from './Reveal';

export type SectionTone = 'white' | 'canvas' | 'mint' | 'brand' | 'navy';

const tones: Record<SectionTone, string> = {
  white: 'bg-white',
  canvas: 'bg-canvas',
  mint: 'bg-mint-50',
  brand: 'bg-brand-600',
  navy: 'bg-ink-900',
};

export interface SectionProps {
  id?: string;
  tone?: SectionTone;
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  innerClassName?: string;
  children?: ReactNode;
  as?: 'section' | 'div';
}

export function Section({
  id,
  tone = 'white',
  eyebrow,
  title,
  description,
  align = 'center',
  className,
  innerClassName,
  children,
  as: Tag = 'section',
}: SectionProps) {
  const centred = align === 'center';
  return (
    <Tag id={id} className={cn('py-16 sm:py-20 lg:py-24', tones[tone], className)}>
      <div className={cn('container-page', innerClassName)}>
        {(eyebrow || title || description) && (
          <Reveal>
            <div
              className={cn(
                'flex flex-col gap-4',
                centred ? 'mx-auto max-w-2xl text-center items-center' : 'max-w-2xl items-start',
              )}
            >
              {eyebrow && (
                <span
                  className={cn(
                    'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em]',
                    tone === 'brand' || tone === 'navy'
                      ? 'bg-white/10 text-brand-100'
                      : 'bg-brand-50 text-brand-700',
                  )}
                >
                  {eyebrow}
                </span>
              )}
              {title && (
                <h2
                  className={cn(
                    'text-3xl font-extrabold leading-[1.15] sm:text-4xl lg:text-[2.75rem]',
                    tone === 'brand' || tone === 'navy' ? 'text-white' : 'text-ink-900',
                  )}
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  className={cn(
                    'text-base leading-relaxed sm:text-lg',
                    tone === 'brand' || tone === 'navy' ? 'text-brand-50/85' : 'text-ink-500',
                  )}
                >
                  {description}
                </p>
              )}
            </div>
          </Reveal>
        )}
        {children}
      </div>
    </Tag>
  );
}
