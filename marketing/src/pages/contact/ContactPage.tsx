import { useMutation } from '@tanstack/react-query';
import { Car, Clock3, Mail, MapPin, Navigation, Phone, Send, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from '../components/sections/PageHeader';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input, Textarea } from '../components/ui/Input';
import { clinic } from '../data/clinic';
import { useSeo } from '../lib/useSeo';

interface ContactForm {
  name: string;
  phone: string;
  email: string;
  message: string;
}

type ContactErrors = Partial<Record<keyof ContactForm, string>>;

function validate(form: ContactForm): ContactErrors {
  const errors: ContactErrors = {};
  if (!form.name.trim()) errors.name = 'Please tell us your name.';
  if (!form.phone.trim()) errors.phone = 'A phone number helps us reply quickly.';
  else if (form.phone.replace(/\D/g, '').length < 10) errors.phone = 'That number looks too short.';
  if (!form.email.trim()) errors.email = 'Please add your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
    errors.email = 'Please check the email address — it looks incomplete.';
  if (!form.message.trim()) errors.message = 'Let us know how we can help.';
  return errors;
}

async function submitContactForm(form: ContactForm) {
  await new Promise((resolve) => setTimeout(resolve, 900));
  return form;
}

export function ContactPage() {
  useSeo({
    title: 'Contact SmileCare Dental Clinic | Ahmedabad',
    description:
      'Visit SmileCare Dental Clinic on CG Road, Ahmedabad. Call +91 98765 43210, send us a message, or find our opening hours, parking details and emergency guidance.',
    path: '/contact',
  });

  const [form, setForm] = useState<ContactForm>({ name: '', phone: '', email: '', message: '' });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [sent, setSent] = useState(false);

  const mutation = useMutation({
    mutationFn: submitContactForm,
    onSuccess: () => {
      setSent(true);
      setForm({ name: '', phone: '', email: '', message: '' });
    },
  });

  const update = (patch: Partial<ContactForm>) => {
    setForm((current) => ({ ...current, ...patch }));
    setErrors((current) => {
      const next = { ...current };
      Object.keys(patch).forEach((key) => delete next[key as keyof ContactForm]);
      return next;
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    mutation.mutate(form);
  };

  return (
    <>
      <PageHeader
        eyebrow="Get in touch"
        title="Talk to the clinic"
        description="Questions about a treatment, a quote or your appointment? Reach the front desk by phone, by message, or ask the AI assistant — it is online around the clock."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Contact' }]}
      />

      <section className="bg-canvas py-12 sm:py-16">
        <div className="container-page grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10">
          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-extrabold text-ink-900">Send us a message</h2>
            <p className="mt-2 text-[15px] text-ink-500">
              We reply to messages within one working day. For anything urgent, please call instead.
            </p>

            {sent && (
              <p
                role="status"
                className="mt-5 rounded-xl border border-brand-200 bg-mint-50 px-4 py-3 text-sm font-medium text-brand-900"
              >
                Thank you — your message is with our front desk. We will get back to you shortly.
              </p>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-5 sm:grid-cols-2">
              <Input
                label="Full name"
                required
                autoComplete="name"
                placeholder="Priya Shah"
                value={form.name}
                error={errors.name}
                onChange={(event) => update({ name: event.target.value })}
                containerClassName="sm:col-span-2"
              />
              <Input
                label="Phone number"
                required
                type="tel"
                autoComplete="tel"
                placeholder="98765 43210"
                value={form.phone}
                error={errors.phone}
                onChange={(event) => update({ phone: event.target.value })}
              />
              <Input
                label="Email address"
                required
                type="email"
                autoComplete="email"
                placeholder="priya@example.com"
                value={form.email}
                error={errors.email}
                onChange={(event) => update({ email: event.target.value })}
              />
              <Textarea
                label="How can we help?"
                required
                placeholder="Tell us what you would like to book or ask about…"
                value={form.message}
                error={errors.message}
                onChange={(event) => update({ message: event.target.value })}
                containerClassName="sm:col-span-2"
              />
              <div className="sm:col-span-2">
                <Button type="submit" loading={mutation.isPending} size="lg">
                  <Send className="size-4" aria-hidden />
                  Send message
                </Button>
              </div>
            </form>
          </Card>

          <div className="space-y-6">
            <Card className="p-6 sm:p-7">
              <h2 className="text-xl font-bold text-ink-900">Clinic details</h2>

              <ul className="mt-5 space-y-4 text-[15px] text-ink-600">
                <li className="flex gap-3">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden />
                  <span>
                    <span className="block font-semibold text-ink-900">
                      {clinic.address.line1}, {clinic.address.line2}
                    </span>
                    {clinic.address.city}, {clinic.address.state} {clinic.address.postalCode}
                  </span>
                </li>
                <li className="flex gap-3">
                  <Phone className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden />
                  <a href={`tel:${clinic.phone}`} className="font-semibold text-ink-900 hover:text-brand-700">
                    {clinic.phoneDisplay}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Mail className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden />
                  <a href={`mailto:${clinic.email}`} className="font-semibold text-ink-900 hover:text-brand-700">
                    {clinic.email}
                  </a>
                </li>
                <li className="flex gap-3">
                  <Car className="mt-0.5 size-5 shrink-0 text-brand-600" aria-hidden />
                  <span>{clinic.parking}</span>
                </li>
              </ul>

              <h3 className="mt-7 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-ink-900">
                <Clock3 className="size-4 text-brand-600" aria-hidden />
                Opening hours
              </h3>
              <table className="mt-4 w-full text-sm">
                <caption className="sr-only">Opening hours for SmileCare Dental Clinic</caption>
                <tbody className="divide-y divide-line">
                  {clinic.hours.map((entry) => (
                    <tr key={entry.day}>
                      <th scope="row" className="py-2.5 text-left font-medium text-ink-600">
                        {entry.day}
                        {entry.note && (
                          <span className="block text-xs font-normal text-ink-400">{entry.note}</span>
                        )}
                      </th>
                      <td className="py-2.5 text-right font-semibold text-ink-900">{entry.open}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
              <div
                className="flex h-56 flex-col items-center justify-center gap-3 bg-gradient-to-br from-mint-50 to-brand-100/60 text-center"
                role="img"
                aria-label="Map placeholder showing the clinic location on CG Road, Ahmedabad"
              >
                <span className="flex size-12 items-center justify-center rounded-2xl bg-white text-brand-600 shadow-soft">
                  <Navigation className="size-6" aria-hidden />
                </span>
                <p className="px-6 text-sm font-semibold text-ink-700">
                  Map embed placeholder
                  <span className="block text-xs font-normal text-ink-500">
                    {clinic.address.line2}, {clinic.address.city}
                  </span>
                </p>
                <a
                  href="https://maps.google.com/?q=SmileCare+Dental+Clinic+CG+Road+Ahmedabad"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-sm font-bold text-brand-700 underline underline-offset-4"
                >
                  Open in Google Maps
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-alert-500/30 bg-alert-50 p-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-alert-700">
                <ShieldAlert className="size-5" aria-hidden />
                Dental emergency?
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-alert-700">
                Severe bleeding, major facial swelling, difficulty breathing or a serious injury means{' '}
                <strong className="font-bold">call emergency services or visit the nearest emergency room
                immediately</strong>. Do not wait for an online reply.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-alert-600">
                For urgent but non-life-threatening dental problems — severe toothache, a knocked-out tooth or
                swelling that is not spreading — call the clinic and press 1 for the on-call dentist.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <a
                  href={`tel:${clinic.phone}`}
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-alert-600 px-5 text-sm font-bold text-white transition-colors hover:bg-alert-700"
                >
                  <Phone className="size-4" aria-hidden />
                  Call {clinic.phoneDisplay}
                </a>
                <a
                  href="tel:108"
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-alert-500/40 px-5 text-sm font-bold text-alert-700 transition-colors hover:bg-alert-100"
                >
                  Emergency services
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
