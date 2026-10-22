import { CalendarPlus, MessageCircleMore, Smartphone } from 'lucide-react';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';

const steps = [
  {
    icon: MessageCircleMore,
    title: 'Ask or chat',
    description: 'Tell the assistant what you need by text or voice. No forms, no queue, no office hours to wait for.',
  },
  {
    icon: CalendarPlus,
    title: 'Pick a time',
    description: 'Choose from live slots with your dentist, or let the assistant suggest the earliest appointment.',
  },
  {
    icon: Smartphone,
    title: 'Get confirmed',
    description: 'Your booking lands by SMS, email and WhatsApp, with a reminder the day before you visit.',
  },
];

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      tone="white"
      eyebrow="How it works"
      title="Three steps, about a minute"
      description="Booking with us now feels like sending a message to a friend who works at the clinic."
    >
      <div className="relative mt-14">
        <div
          className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-brand-200 via-brand-300 to-brand-200 lg:block"
          aria-hidden
        />

        <ol className="relative grid gap-10 lg:grid-cols-3 lg:gap-8">
          {steps.map((step, index) => (
            <Reveal key={step.title} as="li" delay={index * 0.12}>
              <div className="flex flex-col items-center text-center">
                <span className="relative flex size-14 items-center justify-center rounded-2xl border border-brand-200 bg-white text-brand-600 shadow-soft">
                  <step.icon className="size-6" aria-hidden />
                  <span className="absolute -right-2 -top-2 flex size-7 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white shadow-soft">
                    {index + 1}
                  </span>
                </span>
                <h3 className="mt-6 text-xl font-bold text-ink-900">{step.title}</h3>
                <p className="mt-2 max-w-xs text-[15px] leading-relaxed text-ink-500">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </Section>
  );
}
