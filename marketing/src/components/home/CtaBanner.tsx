import { CalendarCheck } from 'lucide-react';
import { ButtonLink } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

export function CtaBanner() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-page">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-ink-900 px-6 py-12 sm:px-12 sm:py-16">
            <div
              className="pointer-events-none absolute -right-20 -top-24 size-80 rounded-full bg-brand-600/25 blur-3xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-28 left-10 size-72 rounded-full bg-accent-500/15 blur-3xl"
              aria-hidden
            />

            <div className="relative flex flex-col items-center gap-8 text-center">
              <h2 className="max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-4xl">
                Ready for a brighter smile?
              </h2>
              <p className="max-w-xl text-base leading-relaxed text-ink-200">
                Book with our AI assistant in under a minute, or call the front desk if you would rather speak to
                someone. We will keep a slot open for you.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <ButtonLink to="/book" size="lg" variant="accent">
                  <CalendarCheck className="size-4" aria-hidden />
                  Book Appointment
                </ButtonLink>
                <ButtonLink
                  to="/chat"
                  size="lg"
                  variant="ghost"
                  className="border border-white/20 text-white hover:bg-white/10 hover:text-white"
                >
                  Chat with the assistant
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
