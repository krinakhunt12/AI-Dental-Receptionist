import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { PatientDetails } from '../../api/types';
import { Input, Textarea } from '../ui/Input';
import type { DetailsErrors } from './validation';

export function StepDetails({
  patient,
  errors,
  onChange,
}: {
  patient: PatientDetails;
  errors: DetailsErrors;
  onChange: (patch: Partial<PatientDetails>) => void;
}) {
  return (
    <fieldset>
      <legend className="text-xl font-bold text-ink-900">Your details</legend>
      <p className="mt-1 text-sm text-ink-500">
        We only use these to confirm your visit and send reminders. Your information stays inside the clinic.
      </p>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <Input
          label="Full name"
          required
          autoComplete="name"
          placeholder="Priya Shah"
          value={patient.name}
          error={errors.name}
          onChange={(event) => onChange({ name: event.target.value })}
          containerClassName="sm:col-span-2"
        />

        <Input
          label="Phone number"
          required
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="98765 43210"
          value={patient.phone}
          error={errors.phone}
          onChange={(event) => onChange({ phone: event.target.value })}
        />

        <Input
          label="Email address"
          required
          type="email"
          autoComplete="email"
          placeholder="priya@example.com"
          value={patient.email}
          error={errors.email}
          onChange={(event) => onChange({ email: event.target.value })}
        />

        <Textarea
          label="Anything we should know?"
          optional
          placeholder="Sensitive tooth, first visit, medication you are taking…"
          value={patient.notes ?? ''}
          onChange={(event) => onChange({ notes: event.target.value })}
          containerClassName="sm:col-span-2"
          hint="This is optional, but it helps your dentist prepare."
        />
      </div>

      <p className="mt-6 flex flex-wrap items-center gap-2 rounded-xl bg-mint-50 px-4 py-3 text-sm text-brand-900">
        <MessageCircle className="size-4 shrink-0 text-brand-600" aria-hidden />
        Prefer to chat?
        <Link to="/chat" className="font-bold text-brand-700 underline underline-offset-2">
          Let our AI assistant book it for you.
        </Link>
      </p>
    </fieldset>
  );
}
