import { BookingWizard } from '../components/booking/BookingWizard';
import { PageHeader } from '../components/sections/PageHeader';
import { useSeo } from '../lib/useSeo';

export function BookPage() {
  useSeo({
    title: 'Book a Dental Appointment | SmileCare Dental Clinic',
    description:
      'Book your dental appointment in five simple steps — choose your treatment, pick a dentist, select a time and confirm. Confirmation arrives by SMS, email and WhatsApp.',
    path: '/book',
  });

  return (
    <>
      <PageHeader
        eyebrow="Appointments"
        title="Book your appointment"
        description="Five short steps. You can also let the AI assistant do it for you in a single message — it never sleeps."
        crumbs={[{ label: 'Home', to: '/' }, { label: 'Book appointment' }]}
      />

      <section className="bg-canvas py-12 sm:py-16">
        <div className="container-page">
          <BookingWizard />
        </div>
      </section>
    </>
  );
}
