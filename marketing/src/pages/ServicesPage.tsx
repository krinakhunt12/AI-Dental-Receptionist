import { useQuery } from '@tanstack/react-query';
import { ArrowRight, CalendarCheck, Clock3, Info } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchServices } from '../api/client';
import type { Service } from '../api/types';
import { PageHeader } from '../components/sections/PageHeader';
import { Badge } from '../components/ui/Badge';
import { Button, ButtonLink } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Drawer } from '../components/ui/Drawer';
import { EmptyState } from '../components/ui/EmptyState';
import { Reveal } from '../components/ui/Reveal';
import { Section } from '../components/ui/Section';
import { ServiceGridSkeleton } from '../components/ui/Skeleton';
import { resolveServiceIcon } from '../components/ui/service-icons';
import { serviceCategories } from '../data/services';
import { cn } from '../lib/cn';
import { formatDuration, formatPrice } from '../lib/format';
import { useSeo } from '../lib/useSeo';

export function ServicesPage() {
  useSeo({
    title: 'Dental Services & Prices | SmileCare Dental Clinic',
    description:
      'Transparent prices for dental cleaning, root canal, teeth whitening, fillings, braces and implants. Filter by treatment type and book online in seconds.',
    path: '/services',
  });

  const { data: services, isLoading } = useQuery({ queryKey: ['services'], queryFn: fetchServices });
  const [category, setCategory] = useState<string>('All');
  const [activeService, setActiveService] = useState<Service | null>(null);

  const filtered = useMemo(
    () =>
      (services ?? []).filter((service) => category === 'All' || service.category === category),
    [services, category],
  );

  return (
    <>
      <PageHeader
        eyebrow="Treatments"
        title="Dental services with prices you can plan around"
        description="Every treatment below shows the starting price and how long it takes. Book online, or ask our AI assistant for detail on any of them — day or night."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Services' }]}
      />

      <Section tone="canvas" className="py-14 sm:py-16">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter services by category">
          {serviceCategories.map((item) => {
            const active = category === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                aria-pressed={active}
                className={cn(
                  'rounded-full border px-4 py-2 text-sm font-semibold transition-all',
                  active
                    ? 'border-brand-600 bg-brand-600 text-white shadow-soft'
                    : 'border-line bg-white text-ink-600 hover:border-brand-300 hover:text-brand-700',
                )}
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="mt-10">
          {isLoading ? (
            <ServiceGridSkeleton count={6} />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Info}
              title="No treatments in this category yet"
              description="We are adding new services all the time. Try another category, or ask the assistant what we can help with."
              action={
                <Button variant="outline" onClick={() => setCategory('All')}>
                  Show all treatments
                </Button>
              }
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((service, index) => {
                const Icon = resolveServiceIcon(service.icon);
                return (
                  <Reveal key={service.id} delay={index * 0.05}>
                    <Card id={service.id} interactive className="flex h-full scroll-mt-28 flex-col">
                      <div className="flex items-start justify-between gap-4">
                        <span className="flex size-12 items-center justify-center rounded-xl bg-mint-50 text-brand-600">
                          <Icon className="size-6" aria-hidden />
                        </span>
                        <Badge tone="mint">{service.category}</Badge>
                      </div>

                      <h2 className="mt-5 text-lg font-bold text-ink-900">{service.name}</h2>
                      <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-500">{service.summary}</p>

                      <dl className="mt-5 flex items-center gap-4 border-t border-line pt-4 text-sm">
                        <div>
                          <dt className="text-ink-400">Starting at</dt>
                          <dd className="text-lg font-extrabold text-ink-900">{formatPrice(service.priceInr)}</dd>
                        </div>
                        <div className="h-9 w-px bg-line" aria-hidden />
                        <div>
                          <dt className="text-ink-400">Duration</dt>
                          <dd className="flex items-center gap-1.5 font-semibold text-ink-700">
                            <Clock3 className="size-4 text-brand-600" aria-hidden />
                            {formatDuration(service.durationMin)}
                          </dd>
                        </div>
                      </dl>

                      {service.priceNote && (
                        <p className="mt-3 rounded-xl bg-ink-50 px-3 py-2 text-xs text-ink-500">{service.priceNote}</p>
                      )}

                      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                        <ButtonLink to={`/book?service=${service.id}`} size="sm" className="flex-1">
                          <CalendarCheck className="size-4" aria-hidden />
                          Book this service
                        </ButtonLink>
                        <Button variant="outline" size="sm" onClick={() => setActiveService(service)}>
                          Details
                        </Button>
                      </div>
                    </Card>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>

        <Reveal>
          <div className="mt-14 flex flex-col items-center gap-4 rounded-3xl border border-line bg-white px-6 py-10 text-center sm:px-12">
            <h2 className="text-2xl font-extrabold text-ink-900">Not sure which treatment you need?</h2>
            <p className="max-w-xl text-ink-500">
              Describe what is bothering you to the AI assistant and it will explain the usual options, what they
              involve and what they cost — then pass you to a dentist for a proper assessment.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/chat" variant="primary">
                Ask the assistant
                <ArrowRight className="size-4" aria-hidden />
              </ButtonLink>
              <Link
                to="/contact"
                className="text-sm font-semibold text-brand-700 underline underline-offset-4 hover:text-brand-800"
              >
                Talk to our front desk
              </Link>
            </div>
          </div>
        </Reveal>
      </Section>

      <Drawer
        open={Boolean(activeService)}
        onClose={() => setActiveService(null)}
        title={activeService?.name ?? ''}
        description={
          activeService
            ? `${formatPrice(activeService.priceInr)} · ${formatDuration(activeService.durationMin)} · ${activeService.category}`
            : undefined
        }
        footer={
          activeService ? (
            <>
              <Button variant="outline" onClick={() => setActiveService(null)}>
                Close
              </Button>
              <ButtonLink to={`/book?service=${activeService.id}`}>
                <CalendarCheck className="size-4" aria-hidden />
                Book this service
              </ButtonLink>
            </>
          ) : null
        }
      >
        {activeService && (
          <div className="space-y-7">
            <p className="text-[15px] leading-relaxed text-ink-600">{activeService.summary}</p>

            <section>
              <h3 className="text-sm font-bold uppercase tracking-wider text-ink-900">What to expect</h3>
              <ul className="mt-4 space-y-3">
                {activeService.whatToExpect.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-ink-600">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-2xl bg-mint-50 p-5">
              <h3 className="text-sm font-bold uppercase tracking-wider text-brand-900">Before your visit</h3>
              <ul className="mt-4 space-y-3">
                {activeService.preparation.map((item) => (
                  <li key={item} className="flex gap-3 text-[15px] leading-relaxed text-brand-900/80">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            <p className="text-sm text-ink-500">
              Final pricing is confirmed after an examination. Ask our assistant for the full fee breakdown, or call
              us and we will talk it through.
            </p>
          </div>
        )}
      </Drawer>
    </>
  );
}
