import { Check, Sparkles } from 'lucide-react';
import type { Service } from '../../api/types';
import { cn } from '../../lib/cn';
import { formatDuration, formatPrice } from '../../lib/format';
import { resolveServiceIcon } from '../ui/service-icons';

export function StepService({
  services,
  selectedId,
  onSelect,
}: {
  services: Service[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <fieldset>
      <legend className="text-xl font-bold text-ink-900">What would you like to book?</legend>
      <p className="mt-1 text-sm text-ink-500">
        Choose the treatment that fits. If you are unsure, pick a general checkup and we will advise you at the
        visit.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {services.map((service) => {
          const Icon = resolveServiceIcon(service.icon);
          const selected = service.id === selectedId;
          return (
            <label
              key={service.id}
              className={cn(
                'flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition-all',
                selected
                  ? 'border-brand-500 bg-mint-50 shadow-soft'
                  : 'border-line bg-white hover:border-brand-300 hover:bg-mint-50/40',
              )}
            >
              <input
                type="radio"
                name="service"
                value={service.id}
                checked={selected}
                onChange={() => onSelect(service.id)}
                className="sr-only"
              />
              <span
                className={cn(
                  'flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors',
                  selected ? 'bg-brand-600 text-white' : 'bg-mint-50 text-brand-600',
                )}
              >
                <Icon className="size-5" aria-hidden />
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-3">
                  <span className="text-[15px] font-bold text-ink-900">{service.name}</span>
                  {selected && (
                    <span className="flex size-5 items-center justify-center rounded-full bg-brand-600 text-white">
                      <Check className="size-3" aria-hidden />
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-sm text-ink-500">{service.summary}</span>
                <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-ink-600">
                  <span>{formatPrice(service.priceInr)}</span>
                  <span className="size-1 rounded-full bg-ink-300" aria-hidden />
                  <span>{formatDuration(service.durationMin)}</span>
                  <span className="size-1 rounded-full bg-ink-300" aria-hidden />
                  <span className="text-brand-700">{service.category}</span>
                </span>
              </span>
            </label>
          );
        })}
      </div>

      <p className="mt-5 flex items-start gap-2 rounded-xl bg-mint-50 px-4 py-3 text-sm text-brand-900">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
        Prices shown are starting prices. Your dentist will confirm the final fee after an examination — and tell you
        before anything begins.
      </p>
    </fieldset>
  );
}
