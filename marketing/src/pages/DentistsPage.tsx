import { useQuery } from '@tanstack/react-query';
import { Award, CalendarCheck, Clock, GraduationCap, Languages, Sparkles } from 'lucide-react';
import { fetchDentists } from '../api/client';
import { PageHeader } from '../components/sections/PageHeader';
import { Badge } from '../components/ui/Badge';
import { ButtonLink } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Reveal } from '../components/ui/Reveal';
import { Section } from '../components/ui/Section';
import { CardSkeleton } from '../components/ui/Skeleton';
import { dentists as fallbackDentists, formatWorkingDays } from '../data/dentists';
import { formatTimeLabel } from '../lib/format';
import { useSeo } from '../lib/useSeo';

export function DentistsPage() {
  useSeo({
    title: 'Our Dentists | SmileCare Dental Clinic, Ahmedabad',
    description:
      'Meet the SmileCare dental team — general and restorative dentistry, orthodontics and cosmetic implant care. View qualifications, experience and working hours, then book.',
    path: '/dentists',
  });

  const { data, isLoading } = useQuery({ queryKey: ['dentists'], queryFn: fetchDentists });
  const list = data ?? fallbackDentists;

  return (
    <>
      <PageHeader
        eyebrow="Our team"
        title="Dentists you will actually get to know"
        description="Pick the dentist you are comfortable with, or choose “no preference” and we will match you with the earliest available slot."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Dentists' }]}
      />

      <Section tone="canvas" className="py-14 sm:py-16">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[0, 1, 2].map((index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {list.map((dentist, index) => (
              <Reveal key={dentist.id} delay={index * 0.08}>
                <Card className="flex h-full flex-col">
                  <div className="flex items-center gap-4">
                    <span
                      className={`flex size-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br ${dentist.accent} text-2xl font-extrabold text-white shadow-soft`}
                      role="img"
                      aria-label={`Portrait placeholder for ${dentist.name}`}
                    >
                      {dentist.initials}
                    </span>
                    <div className="min-w-0">
                      <h2 className="text-lg font-bold text-ink-900">{dentist.name}</h2>
                      <p className="mt-1 text-sm font-semibold text-brand-700">{dentist.specialization}</p>
                      <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-ink-500">
                        <Award className="size-3.5 text-brand-600" aria-hidden />
                        {dentist.experienceYears} years of experience
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 text-[15px] leading-relaxed text-ink-500">{dentist.bio}</p>

                  <ul className="mt-5 space-y-2">
                    {dentist.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2.5 text-sm text-ink-600">
                        <Sparkles className="mt-0.5 size-4 shrink-0 text-brand-500" aria-hidden />
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  <dl className="mt-5 space-y-3 border-t border-line pt-5 text-sm">
                    <div className="flex gap-3">
                      <dt className="flex w-6 shrink-0 justify-center text-ink-400">
                        <GraduationCap className="size-4" aria-hidden />
                        <span className="sr-only">Qualifications</span>
                      </dt>
                      <dd className="space-y-1">
                        {dentist.qualifications.map((item) => (
                          <p key={item} className="text-ink-600">
                            {item}
                          </p>
                        ))}
                      </dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="flex w-6 shrink-0 justify-center text-ink-400">
                        <Clock className="size-4" aria-hidden />
                        <span className="sr-only">Working hours</span>
                      </dt>
                      <dd className="text-ink-600">
                        {formatWorkingDays(dentist.workingDays)} · {formatTimeLabel(dentist.startTime)} –{' '}
                        {formatTimeLabel(dentist.endTime)}
                      </dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="flex w-6 shrink-0 justify-center text-ink-400">
                        <Languages className="size-4" aria-hidden />
                        <span className="sr-only">Languages</span>
                      </dt>
                      <dd className="text-ink-600">{dentist.languages.join(', ')}</dd>
                    </div>
                  </dl>

                  <div className="mt-6 flex items-center gap-3">
                    <ButtonLink to={`/book?dentist=${dentist.id}`} className="flex-1">
                      <CalendarCheck className="size-4" aria-hidden />
                      Book with {dentist.name}
                    </ButtonLink>
                    <Badge tone="outline">Next day slots</Badge>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        )}

        <Reveal>
          <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-line bg-white px-6 py-10 text-center sm:px-12">
            <h2 className="text-2xl font-extrabold text-ink-900">No preference?</h2>
            <p className="max-w-xl text-ink-500">
              Tell us what you need and we will match you with the earliest suitable dentist. The AI assistant can do
              this in a single message, at any hour.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/book" variant="accent">
                <CalendarCheck className="size-4" aria-hidden />
                Book without a preference
              </ButtonLink>
              <ButtonLink to="/chat" variant="outline">
                Ask the assistant
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
