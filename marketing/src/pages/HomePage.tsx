import { useSeo } from '../lib/useSeo';
import { Hero } from '../components/home/Hero';
import { AiFeatures } from '../components/home/AiFeatures';
import { ServicesPreview } from '../components/home/ServicesPreview';
import { HowItWorks } from '../components/home/HowItWorks';
import { DentistsPreview } from '../components/home/DentistsPreview';
import { StatsBand } from '../components/home/StatsBand';
import { Testimonials } from '../components/home/Testimonials';
import { FaqSection } from '../components/home/FaqSection';
import { CtaBanner } from '../components/home/CtaBanner';

export function HomePage() {
  useSeo({
    title: 'SmileCare Dental Clinic | Healthy smiles, booked in seconds',
    description:
      'Gentle dental care in Ahmedabad with a 24/7 AI receptionist. Book cleanings, fillings, root canals, whitening, braces and implants in seconds — by chat or voice.',
    path: '/',
  });

  return (
    <>
      <Hero />
      <AiFeatures />
      <ServicesPreview />
      <HowItWorks />
      <DentistsPreview />
      <StatsBand />
      <Testimonials />
      <FaqSection />
      <CtaBanner />
    </>
  );
}
