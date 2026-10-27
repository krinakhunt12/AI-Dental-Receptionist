import { CalendarCheck, Home, SearchX } from 'lucide-react';
import { ButtonLink } from '../components/ui/Button';
import { useSeo } from '../lib/useSeo';

export function NotFoundPage() {
  useSeo({
    title: 'Page not found | SmileCare Dental Clinic',
    description: 'The page you were looking for could not be found. Book an appointment or chat with our AI assistant instead.',
  });

  return (
    <section className="bg-canvas py-20 sm:py-28">
      <div className="container-page flex flex-col items-center text-center">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-mint-50 text-brand-600">
          <SearchX className="size-8" aria-hidden />
        </span>
        <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-brand-600">Error 404</p>
        <h1 className="mt-3 text-4xl font-extrabold text-ink-900 sm:text-5xl">This page slipped out of the diary</h1>
        <p className="mt-4 max-w-lg text-lg leading-relaxed text-ink-500">
          The link may be old or the address mistyped. Let us get you back to something useful — our appointments,
          services and prices are all a click away.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <ButtonLink to="/" size="lg">
            <Home className="size-4" aria-hidden />
            Back to homepage
          </ButtonLink>
          <ButtonLink to="/book" size="lg" variant="accent">
            <CalendarCheck className="size-4" aria-hidden />
            Book appointment
          </ButtonLink>
        </div>

        <p className="mt-8 text-sm text-ink-400">
          Looking for a treatment?{' '}
          <ButtonLink to="/services" variant="ghost" size="sm" className="h-auto p-0 underline underline-offset-2">
            Browse services and prices
          </ButtonLink>
        </p>
      </div>
    </section>
  );
}
