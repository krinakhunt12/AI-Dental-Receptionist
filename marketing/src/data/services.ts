import type { Service } from '../api/types';

export const services: Service[] = [
  {
    id: 'cleaning',
    name: 'Dental Cleaning',
    category: 'Preventive',
    summary: 'Gentle scaling and polishing that removes plaque, tartar and surface stains.',
    priceInr: 800,
    durationMin: 30,
    icon: 'Sparkles',
    whatToExpect: [
      'A quick health check of gums, tongue and existing fillings',
      'Ultrasonic scaling to lift tartar gently from the tooth surface',
      'Polish that leaves enamel smooth and noticeably brighter',
      'A short hygiene plan you can follow at home',
    ],
    preparation: [
      'Brush and floss before you arrive',
      'Tell us about any bleeding gums or sensitivity',
      'Skip whitening treatments for 3 days beforehand',
    ],
  },
  {
    id: 'root-canal',
    name: 'Root Canal',
    category: 'Restorative',
    summary: 'Painless treatment that removes infection and saves your natural tooth.',
    priceInr: 5000,
    durationMin: 90,
    icon: 'ShieldCheck',
    whatToExpect: [
      'Digital X-ray to map the infection precisely',
      'Local anaesthetic so the visit stays comfortable',
      'Careful cleaning and sealing of the inner canals',
      'A temporary crown, with the final crown fitted in a follow-up visit',
    ],
    preparation: [
      'Eat a light meal beforehand — you may be numb for a while',
      'Bring a list of any medicines you are taking',
      'Avoid very hot or cold drinks on the day',
    ],
  },
  {
    id: 'whitening',
    name: 'Teeth Whitening',
    category: 'Cosmetic',
    summary: 'Professional in-chair whitening that lifts years of coffee and tea stains.',
    priceInr: 3000,
    durationMin: 60,
    icon: 'Sun',
    whatToExpect: [
      'A shade check so you can see your starting colour',
      'A protective barrier for your gums',
      'Three rounds of whitening gel with a short activation light',
      'Before and after photos to track the change',
    ],
    preparation: [
      'Get a cleaning 1–2 weeks before whitening',
      'Bring lip balm — your lips stay dry for a day',
      'Avoid coloured drinks and smoking for 48 hours after',
    ],
  },
  {
    id: 'filling',
    name: 'Dental Filling',
    category: 'Restorative',
    summary: 'Tooth-coloured fillings that stop decay and blend in with your smile.',
    priceInr: 1500,
    durationMin: 45,
    icon: 'CircleDot',
    whatToExpect: [
      'A decay check with a small camera and X-ray',
      'Comfortable removal of the soft decay',
      'A composite filling shaped to match your bite',
      'A quick polish so the surface feels smooth',
    ],
    preparation: [
      'Eat before your visit — you may be numb afterwards',
      'Tell us if you have reacted to anaesthetics before',
      'Brush gently on the night of the appointment',
    ],
  },
  {
    id: 'braces',
    name: 'Braces',
    category: 'Orthodontics',
    summary: 'Modern metal, ceramic or aligner braces that straighten teeth at any age.',
    priceInr: 45000,
    durationMin: 60,
    priceNote: 'Consultation ₹500. Braces cost depends on the case and is quoted after assessment.',
    icon: 'AlignHorizontalJustify',
    whatToExpect: [
      'A full scan and photographs of your bite',
      'A treatment plan with timelines and total cost',
      'Fitting of brackets or your first aligner set',
      'Short reviews every 4–6 weeks to guide movement',
    ],
    preparation: [
      'A full dental cleaning before fitting',
      'Brush after every meal once braces go on',
      'Plan for the first adjustment within 4 weeks',
    ],
  },
  {
    id: 'implants',
    name: 'Dental Implants',
    category: 'Surgery',
    summary: 'Permanent, natural-looking tooth replacement that protects neighbouring teeth.',
    priceInr: 32000,
    durationMin: 120,
    priceNote: 'Consultation ₹1,000. Implant cost depends on the case and is quoted after a 3D scan.',
    icon: 'Anchor',
    whatToExpect: [
      'A 3D scan and a written treatment plan',
      'The implant placed under local anaesthetic',
      'A healing period of 3–6 months',
      'A custom-made crown fitted and colour-matched',
    ],
    preparation: [
      'Complete any cleaning or gum treatment first',
      'Arrange a light meal and a ride home',
      'Share your medical history and medicines',
    ],
  },
  {
    id: 'checkup',
    name: 'General Checkup',
    category: 'Preventive',
    summary: 'A routine exam for adults and children to catch small problems early.',
    priceInr: 500,
    durationMin: 30,
    icon: 'Stethoscope',
    whatToExpect: [
      'A visual check of teeth, gums and soft tissues',
      'Digital X-rays when we need a closer look',
      'A clear explanation of anything we find',
      'A simple plan for the next 6–12 months',
    ],
    preparation: [
      'Bring any previous X-rays or records',
      'List any medicines and allergies',
      'Brush before your appointment',
    ],
  },
  {
    id: 'extraction',
    name: 'Tooth Extraction',
    category: 'Surgery',
    summary: 'Careful removal of a damaged or impacted tooth with clear aftercare.',
    priceInr: 1000,
    durationMin: 30,
    icon: 'Scissors',
    whatToExpect: [
      'An X-ray to see the root position clearly',
      'Numbing of the area before anything is done',
      'Gentle removal with minimal pressure',
      'Written aftercare and a direct number to call if needed',
    ],
    preparation: [
      'Eat beforehand unless told otherwise',
      'Bring up any blood-thinning medicines',
      'Arrange to rest for the rest of the day',
    ],
  },
];

export const serviceCategories = [
  'All',
  'Preventive',
  'Cosmetic',
  'Restorative',
  'Orthodontics',
  'Surgery',
] as const;

export function getService(id: string | null | undefined) {
  if (!id) return undefined;
  return services.find((service) => service.id === id);
}
