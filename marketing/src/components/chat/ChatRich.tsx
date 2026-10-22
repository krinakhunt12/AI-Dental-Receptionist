import { motion } from 'framer-motion';
import { CalendarCheck, Clock3, PhoneCall, ShieldAlert, Stethoscope, UserRound } from 'lucide-react';
import type { ChatSlot } from '../../api/chat';
import { clinic } from '../../data/clinic';
import type { Appointment, Dentist } from '../../api/types';
import { cn } from '../../lib/cn';
import { formatPrice } from '../../lib/format';

export function SlotPicker({
  slots,
  heading,
  onSelect,
}: {
  slots: ChatSlot[];
  heading: string;
  onSelect: (slot: ChatSlot) => void;
}) {
  return (
    <div className="mt-3 rounded-2xl border border-line bg-white p-3 shadow-soft">
      <p className="px-1 pb-2 text-xs font-bold uppercase tracking-wider text-ink-400">{heading}</p>
      <div className="grid grid-cols-2 gap-2">
        {slots.map((slot) => (
          <button
            key={slot.id}
            type="button"
            onClick={() => onSelect(slot)}
            className="rounded-xl border border-brand-200 bg-mint-50 px-3 py-2 text-left transition-all hover:border-brand-500 hover:bg-brand-50"
          >
            <span className="block text-sm font-bold text-brand-800">{slot.timeLabel}</span>
            <span className="mt-0.5 block text-xs text-ink-500">{slot.dateLabel}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function AppointmentCard({ appointment }: { appointment: Appointment }) {
  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-brand-200 bg-white">
      <div className="flex items-center gap-2 bg-brand-600 px-4 py-2.5 text-white">
        <CalendarCheck className="size-4" aria-hidden />
        <span className="text-sm font-bold">Appointment confirmed</span>
      </div>
      <dl className="divide-y divide-line text-sm">
        <div className="flex items-center justify-between gap-4 px-4 py-2.5">
          <dt className="flex items-center gap-2 text-ink-500">
            <Stethoscope className="size-4" aria-hidden />
            Treatment
          </dt>
          <dd className="font-semibold text-ink-900">{appointment.serviceName}</dd>
        </div>
        <div className="flex items-center justify-between gap-4 px-4 py-2.5">
          <dt className="flex items-center gap-2 text-ink-500">
            <Clock3 className="size-4" aria-hidden />
            When
          </dt>
          <dd className="font-semibold text-ink-900">
            {appointment.date} · {appointment.time}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4 px-4 py-2.5">
          <dt className="flex items-center gap-2 text-ink-500">
            <UserRound className="size-4" aria-hidden />
            Dentist
          </dt>
          <dd className="font-semibold text-ink-900">{appointment.dentistName}</dd>
        </div>
        <div className="flex items-center justify-between gap-4 bg-ink-50/70 px-4 py-2.5">
          <dt className="text-ink-500">Estimated fee</dt>
          <dd className="font-bold text-ink-900">{formatPrice(appointment.priceInr)}</dd>
        </div>
      </dl>
    </div>
  );
}

export function DentistCard({ dentist }: { dentist: Dentist }) {
  return (
    <div className="mt-3 flex items-center gap-3 rounded-2xl border border-line bg-white p-3 shadow-soft">
      <span
        className={cn(
          'flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-sm font-bold text-white',
          dentist.accent,
        )}
      >
        {dentist.initials}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-ink-900">{dentist.name}</p>
        <p className="truncate text-xs text-ink-500">{dentist.specialization}</p>
        <p className="mt-1 text-xs text-ink-400">{dentist.experienceYears} years of experience</p>
      </div>
    </div>
  );
}

export function EmergencyCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-3 overflow-hidden rounded-2xl border border-alert-500/40 bg-alert-50"
      role="alert"
    >
      <div className="flex items-center gap-2 bg-alert-600 px-4 py-2.5 text-white">
        <ShieldAlert className="size-4" aria-hidden />
        <span className="text-sm font-bold">This needs urgent care</span>
      </div>
      <div className="space-y-3 px-4 py-4 text-sm text-alert-700">
        <p>
          <strong className="font-bold">Call emergency services or go to the nearest emergency room now</strong> if
          you have severe bleeding, major facial swelling, difficulty breathing or a serious injury.
        </p>
        <p className="text-alert-600">
          Our AI assistant cannot assess injuries or advise on medicines. For urgent but non-life-threatening dental
          problems, call the clinic and press 1 for the on-call dentist.
        </p>
        <a
          href={`tel:${clinic.phone}`}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-alert-600 px-5 text-sm font-bold text-white transition-colors hover:bg-alert-700"
        >
          <PhoneCall className="size-4" aria-hidden />
          Call {clinic.phoneDisplay}
        </a>
      </div>
    </motion.div>
  );
}

export function HandoffCard({ status }: { status: 'connecting' | 'connected' }) {
  if (status === 'connecting') {
    return (
      <div className="mt-3 flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 shadow-soft">
        <span className="relative flex size-2.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand-400 opacity-75" />
          <span className="relative inline-flex size-2.5 rounded-full bg-brand-500" />
        </span>
        <p className="text-sm font-medium text-ink-600">Connecting you to our team…</p>
      </div>
    );
  }

  return (
    <div className="mt-3 flex items-center gap-3 rounded-2xl border border-brand-200 bg-mint-50 px-4 py-3">
      <span className="flex size-9 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
        RK
      </span>
      <div>
        <p className="text-sm font-bold text-brand-900">Rahul from the front desk</p>
        <p className="text-xs text-brand-700">Online now · usually replies in under a minute</p>
      </div>
    </div>
  );
}
