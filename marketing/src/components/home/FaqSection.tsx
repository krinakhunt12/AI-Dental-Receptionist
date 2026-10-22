import { useQuery } from '@tanstack/react-query';
import { fetchFaqs } from '../../api/client';
import { Accordion } from '../ui/Accordion';
import { Reveal } from '../ui/Reveal';
import { Section } from '../ui/Section';
import { Skeleton } from '../ui/Skeleton';

export function FaqSection() {
  const { data, isLoading } = useQuery({ queryKey: ['faqs'], queryFn: fetchFaqs });

  return (
    <Section
      id="faq"
      tone="canvas"
      eyebrow="Questions"
      title="Everything patients ask us"
      description="Still unsure about something? Our AI assistant answers the rest, any time of day."
    >
      <div className="mx-auto mt-12 max-w-3xl">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
            <Skeleton className="h-16 rounded-2xl" />
          </div>
        ) : (
          <Reveal>
            <Accordion items={data ?? []} defaultOpenId="faq-pricing" />
          </Reveal>
        )}
      </div>
    </Section>
  );
}
