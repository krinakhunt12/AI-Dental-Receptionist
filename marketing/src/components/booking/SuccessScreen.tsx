import { motion } from 'framer-motion';
import { CalendarPlus, CheckCircle2, Clock3, MessageSquareText, PhoneCall, Stethoscope, UserRound } from 'lucide-react';
import type { Appointment } from '../../api/types';
import { clinic } from '../../data/clinic';
import { downloadAppointmentIcs } from '../../lib/ical';
import { formatPrice } from '../../lib/format';
import { Button, ButtonLink } from '../ui/Button';

export function SuccessScreen({
  appointment,
  onBookAnother,
}: {
  appointment: Appointment;
  onBookAnother: () => void;
}) {
  const dateLabel = new Date(`${appointment.date}T00:00:00`).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-2xl"
    >
      <div className="rounded-3xl border border-line bg-white p-6 shadow-card sm:p-10">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-mint-50 text-brand-600">
          <CheckCircle2 className="size-7" aria-hidden />
        </span>

        <h1 className="mt-6 text-3xl font-extrabold text-ink-900">You're booked in, {appointment.patient.name.split(' ')[0]}</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
          We have reserved your slot. A confirmation is on its way to your phone, email and WhatsApp, with a
          reminder the day before your visit.
        </p>

        <dl className="mt-8 divide-y divide-line overflow-hidden rounded-2xl border border-line">
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <dt className="flex items-center gap-3 text-sm text-ink-500">
              <Stethoscope className="size-4 text-brand-600" aria-hidden />
              Treatment
            </dt>
            <dd className="text-right text-sm font-bold text-ink-900">
              {appointment.serviceName}
              <span className="block text-xs font-medium text-ink-500">
                {formatPrice(appointment.priceInr)} · {appointment.durationMin} min
              </span>
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <dt className="flex items-center gap-3 text-sm text-ink-500">
              <UserRound className="size-4 text-brand-600" aria-hidden />
              Dentist
            </dt>
            <dd className="text-right text-sm font-bold text-ink-900">{appointment.dentistName}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <dt className="flex items-center gap-3 text-sm text-ink-500">
              <Clock3 className="size-4 text-brand-600" aria-hidden />
              When
            </dt>
            <dd className="text-right text-sm font-bold text-ink-900">
              {dateLabel}
              <span className="block text-xs font-medium text-ink-500">{appointment.time}</span>
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 bg-mint-50 px-5 py-4">
            <dt className="text-sm font-semibold text-brand-900">Reference</dt>
            <dd className="text-sm font-bold text-brand-900">{appointment.id}</dd>
          </div>
        </dl>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => downloadAppointmentIcs(appointment)} className="flex-1">
            <CalendarPlus className="size-4" aria-hidden />
            Add to calendar
          </Button>
          <Button variant="outline" onClick={onBookAnother} className="flex-1">
            Book another appointment
          </Button>
        </div>

        <p className="mt-6 flex items-start gap-2 rounded-xl bg-ink-50 px-4 py-3 text-sm text-ink-500">
          <MessageSquareText className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
          Confirmation will be sent by SMS, email and WhatsApp. Need to change something? Call us on{' '}
          <a href={`tel:${clinic.phone}`} className="font-semibold text-brand-700 underline underline-offset-2">
            {clinic.phoneDisplay}
          </a>
          <span className="inline-flex">
            <PhoneCall className="hidden size-3.5" aria-hidden />
          </span>
        </p>
      </div>

      <div className="mt-6 text-center">
        <ButtonLink to="/" variant="ghost" size="sm">
          Back to the homepage
        </ButtonLink>
      </div>
    </motion.div>
  );
}
