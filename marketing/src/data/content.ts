import type { Faq, Testimonial } from '../api/types';

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Rohan Mehta',
    context: 'Parent, Ahmedabad',
    rating: 5,
    service: 'Dental Cleaning',
    quote:
      'I booked my son\'s cleaning at 11:40 PM and had the confirmation before I put my phone down. The reminder came on WhatsApp the next morning. Genuinely the easiest booking I have done for anything.',
  },
  {
    id: 't2',
    name: 'Aisha Khan',
    context: 'Software engineer',
    rating: 5,
    service: 'Root Canal',
    quote:
      'I was nervous about a root canal and the assistant answered every question I had, including the price, without me having to call anyone. Dr. Patel explained each step before he started.',
  },
  {
    id: 't3',
    name: 'Vikram Desai',
    context: 'Business owner',
    rating: 4,
    service: 'Teeth Whitening',
    quote:
      'Whitening at 5 PM on a Saturday, exactly as I asked. The clinic was spotless and warm, and they reminded me to avoid coffee for a day, which nobody usually bothers to do.',
  },
  {
    id: 't4',
    name: 'Meera Iyer',
    context: 'Regular patient since 2016',
    rating: 5,
    service: 'Braces',
    quote:
      'Rescheduling my braces review took thirty seconds in the chat. I have never had to wait on hold, and my dentist still gets a proper note about what changed.',
  },
];

export const faqs: Faq[] = [
  {
    id: 'faq-pricing',
    question: 'How much do your treatments cost?',
    answer:
      'Prices are listed on each service page and start at ₹500 for a general checkup, ₹800 for a dental cleaning, ₹1,500 for a filling, ₹3,000 for whitening and ₹5,000 for a root canal. Braces and implants are quoted after an assessment, because the cost depends on your case. The AI assistant can share any of these prices instantly, day or night.',
  },
  {
    id: 'faq-insurance',
    question: 'Do you accept insurance?',
    answer:
      'We accept major dental insurance plans and provide itemised receipts with diagnostic codes, so your insurer can process the claim directly. For treatments not covered — whitening and orthodontics in most plans — we offer interest-free instalments over 3 to 6 months. Bring your card and any claim form to your first visit.',
  },
  {
    id: 'faq-emergency',
    question: 'What if I have a dental emergency?',
    answer:
      'Call us directly on +91 98765 43210 and press 1 for the on-call dentist. We hold same-day emergency slots every morning and evening. If you have severe bleeding, major facial swelling, difficulty breathing or a serious injury, please call emergency services or go to the nearest emergency room right away.',
  },
  {
    id: 'faq-reschedule',
    question: 'How do I reschedule or cancel an appointment?',
    answer:
      'Tell the AI assistant in chat — it will look up your booking and move you to the next available slot without needing a new phone call. You can also call the clinic or reply to the confirmation SMS. We ask for 12 hours notice so we can offer the slot to another patient.',
  },
  {
    id: 'faq-ai',
    question: 'Does the AI assistant replace my dentist?',
    answer:
      'No — and it never will. The assistant handles scheduling, pricing, opening hours and clinic information. Diagnosis, treatment plans and clinical decisions stay entirely with your dentist. Anything clinical is handed to a human, and you always see a dentist before any treatment begins.',
  },
  {
    id: 'faq-privacy',
    question: 'How is my personal health information protected?',
    answer:
      'Your details are encrypted in transit and at rest, and stored on servers located in India. We collect only what is needed to treat you and remind you of visits, we never sell patient data, and every member of staff accesses records on a need-to-know basis. Ask any team member for our full privacy policy.',
  },
];
