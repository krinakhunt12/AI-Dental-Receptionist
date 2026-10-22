import { ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { dentists, formatWorkingDays } from '../../data/dentists';
import { formatTimeLabel } from '../../lib/format';
import { Card } from '../ui/Card';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';

export function DentistsPreview() {
  return (
    <Section
      id="dentists"
      tone="canvas"
      eyebrow="Meet our dentists"
      title="Care you can put a name to"
      description="Every treatment is led by a dentist you will meet in person — here is who they are."
    >
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {dentists.map((dentist, index) => (
          <Reveal key={dentist.id} delay={index * 0.08}>
            <Card interactive className="flex h-full flex-col text-center">
              <span
                className={`mx-auto flex size-24 items-center justify-center rounded-3xl bg-gradient-to-br ${dentist.accent} text-2xl font-extrabold text-white shadow-soft`}
                aria-hidden
              >
                {dentist.initials}
              </span>
              <h3 className="mt-5 text-lg font-bold text-ink-900">{dentist.name}</h3>
              <p className="mt-1 text-sm font-semibold text-brand-700">{dentist.specialization}</p>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-500">{dentist.bio}</p>

              <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-mint-50 px-3 py-2.5 text-xs font-semibold text-brand-800">
                <Clock className="size-3.5" aria-hidden />
                {formatWorkingDays(dentist.workingDays)} · {formatTimeLabel(dentist.startTime)} –{' '}
                {formatTimeLabel(dentist.endTime)}
              </div>

              <Link
                to={`/book?dentist=${dentist.id}`}
                className="mt-4 inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-brand-300 text-sm font-bold text-brand-700 transition-colors hover:bg-brand-50"
              >
                Book with {dentist.name.replace('Dr. ', 'Dr. ')}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
