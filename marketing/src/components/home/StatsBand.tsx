import { clinicStats } from '../../data/clinic';
import { Reveal } from '../ui/Reveal';

export function StatsBand() {
  return (
    <section className="bg-brand-600 py-16 sm:py-20">
      <div className="container-page">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {clinicStats.map((stat, index) => (
            <Reveal key={stat.id} delay={index * 0.08}>
              <div className="border-l-2 border-white/25 pl-5">
                <p className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">{stat.value}</p>
                <p className="mt-2 text-sm font-medium text-brand-50/85">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
