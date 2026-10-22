import { cn } from '../../lib/cn';

/** Simple tooth mark used in the brand lockup. */
export function ToothMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={cn('size-5', className)}
    >
      <path
        d="M12 2.6c-2.3 0-3.6 1-5.2 1.5-1.9.6-3.3 1.9-3.3 4.6 0 2.3.8 3.9 1.2 5.8.4 1.5.6 3.1.9 4.3.3 1.2 1 2 1.9 2 .9 0 1.5-.8 1.9-2 .4-1.2.6-2.5.9-3.4.3-.8 1-1.3 1.7-1.3s1.4.5 1.7 1.3c.3.9.5 2.2.9 3.4.4 1.2 1 2 1.9 2 .9 0 1.6-.8 1.9-2 .3-1.2.5-2.8.9-4.3.4-1.9 1.2-3.5 1.2-5.8 0-2.7-1.4-4-3.3-4.6-1.6-.5-2.9-1.5-5.2-1.5Z"
        fill="currentColor"
        opacity="0.95"
      />
      <path
        d="M8.2 5.6c-.9.5-1.6 1.3-2 2.3"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  );
}

export function BrandLogo({
  className,
  compact = false,
  invert = false,
}: {
  className?: string;
  compact?: boolean;
  invert?: boolean;
}) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <span
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft',
          invert && 'bg-white/15 text-white',
        )}
      >
        <ToothMark className="size-5" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            'font-display text-lg font-extrabold tracking-tight text-ink-900',
            invert && 'text-white',
          )}
        >
          SmileCare
        </span>
        {!compact && (
          <span className={cn('mt-0.5 text-[11px] font-medium text-ink-400', invert && 'text-brand-100/80')}>
            Dental Clinic
          </span>
        )}
      </span>
    </span>
  );
}
