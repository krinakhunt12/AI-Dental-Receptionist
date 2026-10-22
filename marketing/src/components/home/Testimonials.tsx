import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchTestimonials } from '../../api/client';
import { Card } from '../ui/Card';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { Skeleton } from '../ui/Skeleton';

export function Testimonials() {
  const { data, isLoading } = useQuery({ queryKey: ['testimonials'], queryFn: fetchTestimonials });
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>('[data-testimonial]');
    const amount = card ? card.offsetWidth + 24 : track.clientWidth;
    track.scrollBy({ left: amount * direction, behavior: 'smooth' });
  };

  return (
    <Section
      id="testimonials"
      tone="white"
      eyebrow="Patient stories"
      title="What our patients say"
      description="Real reviews from people who booked with the AI assistant."
    >
      {isLoading ? (
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <Skeleton key={index} className="h-56 rounded-2xl" />
          ))}
        </div>
      ) : (
        <>
          <div className="mt-12 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => scrollByCard(-1)}
              aria-label="Previous testimonials"
              className="flex size-11 items-center justify-center rounded-full border border-line bg-white text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-700"
            >
              <ChevronLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard(1)}
              aria-label="Next testimonials"
              className="flex size-11 items-center justify-center rounded-full border border-line bg-white text-ink-600 transition-colors hover:border-brand-300 hover:text-brand-700"
            >
              <ChevronRight className="size-5" aria-hidden />
            </button>
          </div>

          <div
            ref={trackRef}
            className="mt-6 flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 scrollbar-none"
            role="region"
            aria-label="Patient testimonials"
            tabIndex={0}
          >
            {data?.map((testimonial, index) => (
              <Reveal
                key={testimonial.id}
                delay={index * 0.08}
                className="w-[85%] shrink-0 snap-start sm:w-[60%] lg:w-[calc(33.333%-1rem)]"
              >
                <Card data-testimonial className="flex h-full flex-col">
                  <Quote className="size-7 text-brand-200" aria-hidden />
                  <div className="mt-4 flex items-center gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }, (_, star) => (
                      <Star
                        key={star}
                        className={
                          star < testimonial.rating
                            ? 'size-4 fill-accent-400 text-accent-400'
                            : 'size-4 fill-ink-100 text-ink-100'
                        }
                        aria-hidden
                      />
                    ))}
                  </div>
                  <p className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-600">“{testimonial.quote}”</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-mint-100 text-sm font-bold text-brand-800">
                      {testimonial.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')}
                    </span>
                    <div>
                      <p className="text-sm font-bold text-ink-900">{testimonial.name}</p>
                      <p className="text-xs text-ink-500">
                        {testimonial.context} · {testimonial.service}
                      </p>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </>
      )}
    </Section>
  );
}
