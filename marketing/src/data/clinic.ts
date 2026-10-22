import type { ClinicInfo } from '../api/types';

export const clinic: ClinicInfo = {
  name: 'SmileCare Dental Clinic',
  tagline: 'Gentle dental care, booked in seconds.',
  phone: '+919876543210',
  phoneDisplay: '+91 98765 43210',
  email: 'hello@smilecare.dental',
  address: {
    line1: '3rd Floor, Aurelia Health Plaza',
    line2: 'Nr. Riverfront Mall, CG Road',
    city: 'Ahmedabad',
    state: 'Gujarat',
    postalCode: '380006',
  },
  hours: [
    { day: 'Monday – Friday', open: '9:00 AM – 8:00 PM', note: 'Evening slots fill fast' },
    { day: 'Saturday', open: '9:00 AM – 6:00 PM' },
    { day: 'Sunday', open: 'By appointment', note: 'Emergency cases only' },
    { day: 'Public holidays', open: '10:00 AM – 2:00 PM' },
  ],
  parking: 'Free valet parking for the first 30 minutes. Two-hour parking at the Pucham Restaurant basement, opposite the clinic.',
  socials: [
    { label: 'Instagram', href: 'https://instagram.com', icon: 'Instagram' },
    { label: 'Facebook', href: 'https://facebook.com', icon: 'Facebook' },
    { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'Linkedin' },
    { label: 'YouTube', href: 'https://youtube.com', icon: 'Youtube' },
  ],
};

export const clinicStats = [
  { id: 'patients', value: '5,000+', label: 'Patients served' },
  { id: 'years', value: '15+', label: 'Years of experience' },
  { id: 'treatments', value: '12,400+', label: 'Treatments completed' },
  { id: 'conversations', value: '38,000+', label: 'AI conversations handled' },
];
