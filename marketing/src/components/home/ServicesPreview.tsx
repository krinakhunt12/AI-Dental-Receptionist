import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { services } from '../../data/services';
import { formatDuration, formatPrice } from '../../lib/format';
import { Card } from '../ui/Card';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { resolveServiceIcon } from '../ui/service-icons';

export function ServicesPreview() {
  const featured = services.slice(0, 6);

  return (
    <Section
      id="services"
      tone="mint"
      eyebrow="Treatments"
      title="Everyday care and long-term solutions"
      description="Transparent pricing on every treatment, so you can plan with confidence."
    >
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((service, index) => {
          const Icon = resolveServiceIcon(service.icon);
          return (
            <Reveal key={service.id} delay={index * 0.06}>
              <Card interactive className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-white text-brand-600 shadow-soft">
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <span className="rounded-full bg-mint-100 px-3 py-1 text-xs font-semibold text-brand-800">
                    {service.category}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-bold text-ink-900">{service.name}</h3>
                <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-500">{service.summary}</p>

                <div className="mt-5 flex items-baseline gap-2 border-t border-line pt-4">
                  <span className="text-sm text-ink-400">From</span>
                  <span className="text-xl font-extrabold text-ink-900">{formatPrice(service.priceInr)}</span>
                  <span className="text-sm text-ink-400">· {formatDuration(service.durationMin)}</span>
                </div>

                <Link
                  to={`/services#${service.id}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700 transition-colors hover:text-brand-800"
                >
                  Learn more
                  <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Card>
            </Reveal>
          );
        })}
      </div>

      <Reveal>
        <div className="mt-12 flex justify-center">
          <Link
            to="/services"
            className="inline-flex h-12 items-center gap-2 rounded-full border border-brand-300 bg-white px-6 text-sm font-bold text-brand-700 transition-all hover:border-brand-500 hover:bg-brand-50"
          >
            View all services and prices
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </Reveal>
    </Section>
  );
}
