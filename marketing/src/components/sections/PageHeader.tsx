import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reveal } from '../ui/Reveal';

export interface Crumb {
  label: string;
  to?: string;
}

export function PageHeader({
  eyebrow,
  title,
  description,
  crumbs,
}: {
  eyebrow: string;
  title: string;
  description: string;
  crumbs: Crumb[];
}) {
  return (
    <section className="border-b border-line bg-gradient-to-b from-mint-50 to-white">
      <div className="container-page py-12 sm:py-16">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-sm">
            {crumbs.map((crumb, index) => (
              <li key={crumb.label} className="flex items-center gap-1.5">
                {index > 0 && <ChevronRight className="size-3.5 text-ink-300" aria-hidden />}
                {crumb.to ? (
                  <Link to={crumb.to} className="font-medium text-ink-500 transition-colors hover:text-brand-700">
                    {crumb.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-semibold text-ink-900">
                    {crumb.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <Reveal>
          <span className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-brand-700">
            {eyebrow}
          </span>
          <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] text-ink-900 sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-500">{description}</p>
        </Reveal>
      </div>
    </section>
  );
}
