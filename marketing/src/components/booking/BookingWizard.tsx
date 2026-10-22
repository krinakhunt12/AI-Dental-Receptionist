import { useMutation, useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CalendarCheck, Loader2, MessageCircle } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { createAppointment, fetchDentists, fetchServices, fetchSlotWindow } from '../../api/client';
import type { Appointment, BookingDraft, PatientDetails } from '../../api/types';
import { getService } from '../../data/services';
import { cn } from '../../lib/cn';
import { Button } from '../ui/Button';
import { Stepper, type StepperStep } from '../ui/Stepper';
import { StepDateTime } from './StepDateTime';
import { StepDentist } from './StepDentist';
import { StepDetails } from './StepDetails';
import { StepReview } from './StepReview';
import { StepService } from './StepService';
import { SummarySidebar } from './SummarySidebar';
import { SuccessScreen } from './SuccessScreen';
import { validateDetails, type DetailsErrors } from './validation';

const steps: StepperStep[] = [
  { id: 'service', label: 'Choose service' },
  { id: 'dentist', label: 'Choose dentist' },
  { id: 'datetime', label: 'Pick a time' },
  { id: 'details', label: 'Your details' },
  { id: 'review', label: 'Review' },
];

export function BookingWizard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<BookingDraft>(() => ({
    serviceId: searchParams.get('service'),
    dentistId: searchParams.get('dentist'),
    date: null,
    time: null,
    patient: { name: '', phone: '', email: '', notes: '' },
  }));
  const [errors, setErrors] = useState<DetailsErrors>({});
  const [stepError, setStepError] = useState<string | null>(null);
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  });
  const { data: dentists } = useQuery({ queryKey: ['dentists'], queryFn: fetchDentists });
  const { data: slotDays, isLoading: slotsLoading } = useQuery({
    queryKey: ['slots', draft.serviceId, draft.dentistId],
    queryFn: () => fetchSlotWindow(draft.serviceId, draft.dentistId, 45),
  });

  const service = useMemo(() => getService(draft.serviceId), [draft.serviceId]);
  const dentist = useMemo(
    () => dentists?.find((item) => item.id === draft.dentistId),
    [dentists, draft.dentistId],
  );

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  const updateParams = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    setSearchParams(next, { replace: true });
  };

  const patchDraft = (patch: Partial<BookingDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
  };

  const selectService = (id: string) => {
    patchDraft({ serviceId: id });
    updateParams({ service: id });
    setStepError(null);
  };

  const selectDentist = (id: string | null) => {
    patchDraft({ dentistId: id });
    updateParams({ dentist: id });
    setStepError(null);
  };

  const validateStep = (index: number) => {
    if (index === 0 && !draft.serviceId) {
      setStepError('Choose a treatment to continue — pick the closest match and we will confirm the rest.');
      return false;
    }
    if (index === 2 && (!draft.date || !draft.time)) {
      setStepError('Pick a date and a time slot to continue.');
      return false;
    }
    if (index === 3) {
      const nextErrors = validateDetails(draft.patient);
      setErrors(nextErrors);
      if (Object.keys(nextErrors).length > 0) {
        setStepError('A couple of details need fixing before we can confirm.');
        return false;
      }
    }
    setStepError(null);
    return true;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
  };

  const goBack = () => {
    setStepError(null);
    setStep((current) => Math.max(current - 1, 0));
  };

  const mutation = useMutation({
    mutationFn: (payload: BookingDraft) => createAppointment(payload),
    onSuccess: (created) => {
      setAppointment(created);
      setSearchParams(new URLSearchParams(), { replace: true });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
  });

  const updatePatient = (patch: Partial<PatientDetails>) => {
    setDraft((current) => ({ ...current, patient: { ...current.patient, ...patch } }));
    setErrors((current) => {
      const next = { ...current };
      Object.keys(patch).forEach((key) => delete next[key as keyof DetailsErrors]);
      return next;
    });
  };

  if (appointment) {
    return (
      <SuccessScreen
        appointment={appointment}
        onBookAnother={() => {
          setAppointment(null);
          setStep(0);
          setDraft({
            serviceId: null,
            dentistId: null,
            date: null,
            time: null,
            patient: { name: '', phone: '', email: '', notes: '' },
          });
        }}
      />
    );
  }

  return (
    <div ref={topRef} className="scroll-mt-28">
      <div className="rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-6">
        <Stepper steps={steps} current={step} onStepSelect={(index) => { setStepError(null); setStep(index); }} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start">
        <div className="rounded-2xl border border-line bg-white p-5 shadow-soft sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              {stepError && (
                <p
                  role="alert"
                  className="mb-6 rounded-xl border border-alert-500/30 bg-alert-50 px-4 py-3 text-sm font-medium text-alert-700"
                >
                  {stepError}
                </p>
              )}

              {step === 0 &&
                (servicesLoading ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Array.from({ length: 6 }, (_, index) => (
                      <span key={index} className="h-28 animate-pulse rounded-2xl bg-ink-100" aria-hidden />
                    ))}
                  </div>
                ) : (
                  <StepService services={services ?? []} selectedId={draft.serviceId} onSelect={selectService} />
                ))}

              {step === 1 && (
                <StepDentist dentists={dentists ?? []} selectedId={draft.dentistId} onSelect={selectDentist} />
              )}

              {step === 2 && (
                <StepDateTime
                  slots={slotDays ?? []}
                  selectedDate={draft.date}
                  selectedTime={draft.time}
                  loading={slotsLoading}
                  onSelectDate={(date) => {
                    patchDraft({ date, time: null });
                    setStepError(null);
                  }}
                  onSelectTime={(time) => {
                    patchDraft({ time });
                    setStepError(null);
                  }}
                />
              )}

              {step === 3 && (
                <StepDetails patient={draft.patient} errors={errors} onChange={updatePatient} />
              )}

              {step === 4 && (
                <StepReview
                  service={service}
                  dentist={dentist}
                  date={draft.date}
                  time={draft.time}
                  patient={draft.patient}
                  onEdit={(index) => {
                    setStepError(null);
                    setStep(index);
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="ghost" onClick={goBack} disabled={step === 0} className="sm:order-1">
              <ArrowLeft className="size-4" aria-hidden />
              Back
            </Button>

            {step < steps.length - 1 ? (
              <Button onClick={goNext} className="sm:order-2">
                Continue
                <ArrowRight className="size-4" aria-hidden />
              </Button>
            ) : (
              <Button
                variant="accent"
                onClick={() => mutation.mutate(draft)}
                disabled={mutation.isPending}
                className="sm:order-2"
              >
                {mutation.isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    Confirming…
                  </>
                ) : (
                  <>
                    <CalendarCheck className="size-4" aria-hidden />
                    Confirm appointment
                  </>
                )}
              </Button>
            )}
          </div>

          {mutation.isError && (
            <p role="alert" className="mt-4 rounded-xl bg-alert-50 px-4 py-3 text-sm font-medium text-alert-700">
              We could not save that booking just now. Please try again, or call us on +91 98765 43210 and we will
              book it for you.
            </p>
          )}
        </div>

        <SummarySidebar
          service={service}
          dentist={dentist}
          date={draft.date}
          time={draft.time}
          className="hidden lg:block"
        />
      </div>

      <p className="mt-8 flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-mint-50 px-5 py-4 text-center text-sm text-brand-900">
        <MessageCircle className="size-4 shrink-0 text-brand-600" aria-hidden />
        Prefer to chat?
        <Link to="/chat" className="font-bold text-brand-700 underline underline-offset-2">
          Let our AI assistant book it for you.
        </Link>
      </p>

      <div className={cn('mt-6 lg:hidden')}>
        <SummarySidebar service={service} dentist={dentist} date={draft.date} time={draft.time} />
      </div>
    </div>
  );
}
