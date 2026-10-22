import { Check, UserRound } from 'lucide-react';
import type { Dentist } from '../../api/types';
import { formatWorkingDays } from '../../data/dentists';
import { cn } from '../../lib/cn';
import { formatTimeLabel } from '../../lib/format';

export function StepDentist({
  dentists,
  selectedId,
  onSelect,
}: {
  dentists: Dentist[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}) {
  const noPreference = selectedId === null;

  return (
    <fieldset>
      <legend className="text-xl font-bold text-ink-900">Who would you like to see?</legend>
      <p className="mt-1 text-sm text-ink-500">
        Pick a dentist, or let us find the earliest appointment with the right specialist.
      </p>

      <div className="mt-6 space-y-3">
        <label
          className={cn(
            'flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all',
            noPreference ? 'border-brand-500 bg-mint-50 shadow-soft' : 'border-line bg-white hover:border-brand-300',
          )}
        >
          <input
            type="radio"
            name="dentist"
            value="none"
            checked={noPreference}
            onChange={() => onSelect(null)}
            className="sr-only"
          />
          <span
            className={cn(
              'flex size-11 shrink-0 items-center justify-center rounded-xl',
              noPreference ? 'bg-brand-600 text-white' : 'bg-mint-50 text-brand-600',
            )}
          >
            <UserRound className="size-5" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="flex items-center justify-between gap-3">
              <span className="text-[15px] font-bold text-ink-900">No preference</span>
              {noPreference && (
                <span className="flex size-5 items-center justify-center rounded-full bg-brand-600 text-white">
                  <Check className="size-3" aria-hidden />
                </span>
              )}
            </span>
            <span className="mt-1 block text-sm text-ink-500">
              We will match you with the earliest available dentist for your treatment.
            </span>
          </span>
        </label>

        {dentists.map((dentist) => {
          const selected = dentist.id === selectedId;
          return (
            <label
              key={dentist.id}
              className={cn(
                'flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition-all',
                selected
                  ? 'border-brand-500 bg-mint-50 shadow-soft'
                  : 'border-line bg-white hover:border-brand-300 hover:bg-mint-50/40',
              )}
            >
              <input
                type="radio"
                name="dentist"
                value={dentist.id}
                checked={selected}
                onChange={() => onSelect(dentist.id)}
                className="sr-only"
              />
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${dentist.accent} text-xs font-bold text-white`}
                aria-hidden
              >
                {dentist.initials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-3">
                  <span className="text-[15px] font-bold text-ink-900">{dentist.name}</span>
                  {selected && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-brand-600 text-white">
                      <Check className="size-3" aria-hidden />
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-sm text-ink-500">{dentist.specialization}</span>
                <span className="mt-1 block text-xs font-semibold text-ink-600">
                  {formatWorkingDays(dentist.workingDays)} · {formatTimeLabel(dentist.startTime)} –{' '}
                  {formatTimeLabel(dentist.endTime)}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
