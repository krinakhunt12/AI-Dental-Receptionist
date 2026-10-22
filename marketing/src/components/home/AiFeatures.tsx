import { CalendarCheck, Clock3, MessageCircle, Wallet } from 'lucide-react';
import { Card } from '../ui/Card';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';

const features = [
  {
    icon: CalendarCheck,
    title: 'Book in seconds',
    description: 'Pick a live slot from our diary and confirm it in under a minute — no forms, no callbacks.',
  },
  {
    icon: Clock3,
    title: 'Available 24/7',
    description: 'Ask at 2 AM when you cannot sleep with toothache, and get a real answer right away.',
  },
  {
    icon: MessageCircle,
    title: 'Chat or voice',
    description: 'Type your request or speak it out. The assistant listens and replies in plain language.',
  },
  {
    icon: Wallet,
    title: 'Instant prices',
    description: 'Exact fees for every treatment before you visit, so there are no surprises on the day.',
  },
];

export function AiFeatures() {
  return (
    <Section
      id="ai-receptionist"
      tone="white"
      eyebrow="Meet your AI receptionist"
      title="A front desk that never sleeps"
      description="Our assistant handles the admin around your visit — and hands anything clinical straight to a dentist."
    >
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <Reveal key={feature.title} delay={index * 0.08}>
            <Card interactive className="h-full">
              <span className="flex size-12 items-center justify-center rounded-xl bg-mint-50 text-brand-600">
                <feature.icon className="size-6" aria-hidden />
              </span>
              <h3 className="mt-5 text-lg font-bold text-ink-900">{feature.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-500">{feature.description}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
