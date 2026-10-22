import { CalendarDays, Clock3, Stethoscope, UserRound } from 'lucide-react';
import type { Dentist, Service } from '../../api/types';
import { formatPrice } from '../../lib/format';

export function SummarySidebar({
  service,
  dentist,
  date,
  time,
  className,
}: {
  service: Service | undefined;
  dentist: Dentist | undefined;
  date: string | null;
  time: string | null;
  className?: string;
}) {
  const rows = [
    {
      icon: Stethoscope,
      label: 'Treatment',
      value: service?.name ?? 'Not selected yet',
    },
    {
      icon: UserRound,
      label: 'Dentist',
      value: dentist?.name ?? 'No preference',
    },
    {
      icon: CalendarDays,
      label: 'Date',
      value: date
        ? new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          })
        : 'Not selected yet',
    },
    {
      icon: Clock3,
      label: 'Time',
      value: time ?? 'Not selected yet',
    },
  ];

  return (
    <aside className={className} aria-label="Appointment summary">
      <div className="sticky top-28 rounded-2xl border border-line bg-white p-5 shadow-soft">
        <h2 className="text-sm font-bold uppercase tracking-wider text-ink-900">Your booking</h2>

        <dl className="mt-4 space-y-3">
          {rows.map((row) => (
            <div key={row.label} className="flex items-start gap-3">
              <row.icon className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
              <div className="min-w-0">
                <dt className="text-xs font-medium text-ink-400">{row.label}</dt>
                <dd className="truncate text-sm font-semibold text-ink-900">{row.value}</dd>
              </div>
            </div>
          ))}
        </dl>

        <div className="mt-5 flex items-center justify-between border-t border-line pt-4">
          <span className="text-sm font-semibold text-ink-600">Estimated total</span>
          <span className="text-xl font-extrabold text-ink-900">{formatPrice(service?.priceInr ?? 0)}</span>
        </div>

        <p className="mt-4 rounded-xl bg-mint-50 px-3 py-2.5 text-xs leading-relaxed text-brand-900">
          Payment is collected at the clinic. This is a starting price — your dentist confirms the final fee before
          any treatment.
        </p>
      </div>
    </aside>
  );
}
