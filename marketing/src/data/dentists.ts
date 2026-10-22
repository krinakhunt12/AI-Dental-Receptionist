import type { Dentist } from '../api/types';

export const dentists: Dentist[] = [
  {
    id: 'patel',
    name: 'Dr. Arvind Patel',
    specialization: 'General & Restorative Dentistry',
    experienceYears: 15,
    qualifications: ['BDS, Gujarat University', 'MDS — Conservative Dentistry', 'Member, Indian Dental Association'],
    languages: ['English', 'Gujarati', 'Hindi'],
    workingDays: [1, 2, 3, 4, 5],
    startTime: '10:00',
    endTime: '19:00',
    bio: 'Dr. Patel has cared for families in Ahmedabad for over a decade. He is known for unhurried consultations and for explaining every option in plain language before anything begins.',
    highlights: ['Painless root canal specialist', 'Same-day emergency slots', 'Child-friendly appointments'],
    accent: 'from-brand-500 to-brand-700',
    initials: 'AP',
  },
  {
    id: 'shah',
    name: 'Dr. Priya Shah',
    specialization: 'Orthodontics',
    experienceYears: 11,
    qualifications: ['BDS, KLE Society', 'MDS — Orthodontics & Dentofacial Orthopaedics', 'Certified clear-aligner provider'],
    languages: ['English', 'Gujarati', 'Hindi', 'Marathi'],
    workingDays: [1, 2, 3, 4, 5, 6],
    startTime: '11:00',
    endTime: '18:00',
    bio: 'Dr. Shah plans orthodontic treatment around your lifestyle — traditional braces, ceramic brackets or removable aligners — with a clear schedule you can follow.',
    highlights: ['Teens and adults', 'Clear aligners', 'Digital treatment planning'],
    accent: 'from-sky-500 to-brand-600',
    initials: 'PS',
  },
  {
    id: 'mehta',
    name: 'Dr. Nikhil Mehta',
    specialization: 'Cosmetic & Implant Dentistry',
    experienceYears: 9,
    qualifications: ['BDS, Manipal College', 'MDS — Prosthodontics', 'Fellow, International College of Dentists'],
    languages: ['English', 'Gujarati', 'Hindi'],
    workingDays: [2, 3, 4, 5, 6],
    startTime: '12:00',
    endTime: '20:00',
    bio: 'Dr. Mehta focuses on natural-looking results — whitening, veneers and implants planned with digital scans so your new smile still looks like yours.',
    highlights: ['Same-day smile previews', '3D implant planning', 'Veneers and smile design'],
    accent: 'from-accent-400 to-accent-600',
    initials: 'NM',
  },
];

export function getDentist(id: string | null | undefined) {
  if (!id) return undefined;
  return dentists.find((dentist) => dentist.id === id);
}

export const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function formatWorkingDays(workingDays: number[]) {
  if (workingDays.length === 6) return 'Mon – Sat';
  if (workingDays.length === 5 && workingDays[0] === 1 && workingDays[4] === 5) return 'Mon – Fri';
  const short = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return workingDays.map((day) => short[day]).join(', ');
}
