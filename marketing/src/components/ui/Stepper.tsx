import { Check } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface StepperStep {
  id: string;
  label: string;
  description?: string;
}

export interface StepperProps {
  steps: StepperStep[];
  current: number;
  onStepSelect?: (index: number) => void;
  className?: string;
}

export function Stepper({ steps, current, onStepSelect, className }: StepperProps) {
  return (
    <nav aria-label="Booking progress" className={cn('w-full', className)}>
      <ol className="flex items-center gap-2 sm:gap-3">
        {steps.map((step, index) => {
          const isDone = index < current;
          const isCurrent = index === current;
          const canNavigate = Boolean(onStepSelect) && index <= current;

          return (
            <li key={step.id} className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  disabled={!canNavigate}
                  onClick={() => canNavigate && onStepSelect?.(index)}
                  aria-current={isCurrent ? 'step' : undefined}
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-all duration-300',
                    isDone && 'border-brand-600 bg-brand-600 text-white',
                    isCurrent && 'border-brand-600 bg-white text-brand-700 ring-4 ring-brand-600/12',
                    !isDone && !isCurrent && 'border-line bg-white text-ink-400',
                    canNavigate && !isCurrent && 'cursor-pointer hover:border-brand-300 hover:text-brand-700',
                  )}
                >
                  {isDone ? <Check className="size-4" aria-hidden /> : index + 1}
                  <span className="sr-only">
                    {isDone ? `${step.label} completed` : `Step ${index + 1}: ${step.label}`}
                  </span>
                </button>
                <span
                  className={cn(
                    'hidden truncate text-sm font-semibold sm:block',
                    isCurrent ? 'text-ink-900' : isDone ? 'text-brand-700' : 'text-ink-400',
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <span
                  aria-hidden
                  className={cn(
                    'h-px flex-1 transition-colors duration-500',
                    isDone ? 'bg-brand-500' : 'bg-line',
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
      <p className="mt-3 text-sm font-medium text-ink-500 sm:hidden">
        Step {current + 1} of {steps.length} · {steps[current]?.label}
      </p>
    </nav>
  );
}
