import { CalendarDays, Clock3, MessageCircle, Stethoscope, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Dentist, Service } from '../../api/types';
import { formatPrice } from '../../lib/format';

export function StepReview({
  service,
  dentist,
  date,
  time,
  patient,
  onEdit,
}: {
  service: Service | undefined;
  dentist: Dentist | undefined;
  date: string | null;
  time: string | null;
  patient: { name: string; phone: string; email: string; notes?: string };
  onEdit: (step: number) => void;
}) {
  const rows = [
    { icon: Stethoscope, label: 'Treatment', value: service?.name ?? '—', step: 0 },
    { icon: UserRound, label: 'Dentist', value: dentist?.name ?? 'No preference', step: 1 },
    {
      icon: CalendarDays,
      label: 'Date',
      value: date ? new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) : '—',
      step: 2,
    },
    { icon: Clock3, label: 'Time', value: time ?? '—', step: 2 },
  ];

  return (
    <fieldset>
      <legend className="text-xl font-bold text-ink-900">Review and confirm</legend>
      <p className="mt-1 text-sm text-ink-500">Check the details below, then confirm your appointment.</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-line bg-white">
        <dl className="divide-y divide-line">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4 px-5 py-4">
              <dt className="flex items-center gap-3 text-sm text-ink-500">
                <row.icon className="size-4 text-brand-600" aria-hidden />
                {row.label}
              </dt>
              <dd className="flex items-center gap-3 text-right">
                <span className="text-sm font-bold text-ink-900">{row.value}</span>
                <button
                  type="button"
                  onClick={() => onEdit(row.step)}
                  className="text-xs font-bold text-brand-700 underline underline-offset-2"
                >
                  Edit
                </button>
              </dd>
            </div>
          ))}

          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <dt className="text-sm text-ink-500">Patient</dt>
            <dd className="text-right">
              <p className="text-sm font-bold text-ink-900">{patient.name}</p>
              <p className="text-xs text-ink-500">
                {patient.phone} · {patient.email}
              </p>
              <button
                type="button"
                onClick={() => onEdit(3)}
                className="mt-1 text-xs font-bold text-brand-700 underline underline-offset-2"
              >
                Edit
              </button>
            </dd>
          </div>

          {patient.notes && (
            <div className="px-5 py-4">
              <dt className="text-sm text-ink-500">Notes</dt>
              <dd className="mt-1 text-sm text-ink-700">{patient.notes}</dd>
            </div>
          )}

          <div className="flex items-center justify-between gap-4 bg-mint-50 px-5 py-4">
            <dt className="text-sm font-semibold text-brand-900">Estimated fee</dt>
            <dd className="text-lg font-extrabold text-brand-900">{formatPrice(service?.priceInr ?? 0)}</dd>
          </div>
        </dl>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-ink-500">
        By confirming, you agree to receive appointment reminders by SMS, email and WhatsApp. You can cancel or
        reschedule at any time from those messages, or by calling the clinic.
      </p>

      <p className="mt-4 flex flex-wrap items-center gap-2 rounded-xl bg-ink-50 px-4 py-3 text-sm text-ink-600">
        <MessageCircle className="size-4 shrink-0 text-brand-600" aria-hidden />
        Prefer to chat?
        <Link to="/chat" className="font-bold text-brand-700 underline underline-offset-2">
          Let our AI assistant book it for you.
        </Link>
      </p>
    </fieldset>
  );
}
