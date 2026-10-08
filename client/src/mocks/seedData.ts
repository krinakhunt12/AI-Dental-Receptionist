export interface Patient {
  id: string;
  name: string;
  phone: string;
  email: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other';
  lastVisit: string;
  nextAppointment?: string;
  source: 'Website Widget' | 'WhatsApp' | 'Phone Call' | 'Walk-in';
  tags: string[];
  medicalHistory: string[];
  totalVisits: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  treatment: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  durationMins: number;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'No-show' | 'Cancelled';
  source: 'Website Widget' | 'WhatsApp' | 'Phone Call' | 'Walk-in';
  notes?: string;
}

export interface Message {
  id: string;
  sender: 'ai' | 'patient' | 'staff';
  text: string;
  timestamp: string;
  confidenceScore?: number;
}

export interface Conversation {
  id: string;
  patientName: string;
  patientPhone: string;
  patientAvatar?: string;
  channel: 'Widget' | 'WhatsApp' | 'Phone';
  status: 'AI Handled' | 'Needs Human' | 'Emergency' | 'Booked';
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  emergency: boolean;
  messages: Message[];
  tags: string[];
  internalNotes?: string[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatarUrl: string;
  email: string;
  phone: string;
  workingDays: string[]; // e.g. ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
  workingHours: string; // e.g. '09:00 - 17:00'
  treatments: { name: string; duration: number; price: number }[];
}

export interface Invoice {
  id: string;
  number: string;
  date: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Failed';
  pdfUrl: string;
  planName: string;
}

// Seed 5 Doctors
export const SEED_DOCTORS: Doctor[] = [
  {
    id: 'doc_1',
    name: 'Dr. Krina Mehta',
    specialty: 'Cosmetic & Implant Specialist',
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    email: 'krina.mehta@smilecare.ai',
    phone: '+1 (555) 234-5678',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    workingHours: '09:00 - 17:00',
    treatments: [
      { name: 'Smile Makeover Consultation', duration: 45, price: 150 },
      { name: 'Dental Implant Placement', duration: 90, price: 1200 },
      { name: 'Porcelain Veneers (per tooth)', duration: 60, price: 800 },
    ],
  },
  {
    id: 'doc_2',
    name: 'Dr. Ananya Sharma',
    specialty: 'Orthodontist & Invisalign',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813566-818a4d471946?w=150&auto=format&fit=crop&q=80',
    email: 'ananya.sharma@smilecare.ai',
    phone: '+1 (555) 345-6789',
    workingDays: ['Mon', 'Wed', 'Thu', 'Sat'],
    workingHours: '10:00 - 18:00',
    treatments: [
      { name: 'Invisalign Assessment', duration: 30, price: 100 },
      { name: 'Braces Tightening', duration: 30, price: 80 },
      { name: 'Retainer Fitting', duration: 30, price: 150 },
    ],
  },
  {
    id: 'doc_3',
    name: 'Dr. Rajesh Patel',
    specialty: 'Endodontist (Root Canal Specialist)',
    avatarUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    email: 'rajesh.patel@smilecare.ai',
    phone: '+1 (555) 456-7890',
    workingDays: ['Tue', 'Thu', 'Fri', 'Sat'],
    workingHours: '08:30 - 16:30',
    treatments: [
      { name: 'Root Canal Treatment', duration: 60, price: 650 },
      { name: 'Emergency Pulp Care', duration: 45, price: 300 },
    ],
  },
  {
    id: 'doc_4',
    name: 'Dr. Sarah Jenkins',
    specialty: 'Pediatric Dentistry',
    avatarUrl: 'https://images.unsplash.com/photo-1594824813566-818a4d471946?w=150&auto=format&fit=crop&q=80',
    email: 'sarah.j@smilecare.ai',
    phone: '+1 (555) 567-8901',
    workingDays: ['Mon', 'Tue', 'Fri'],
    workingHours: '09:00 - 15:00',
    treatments: [
      { name: 'Child Dental Exam & Fluoride', duration: 30, price: 90 },
      { name: 'Pediatric Sealants', duration: 30, price: 120 },
    ],
  },
  {
    id: 'doc_5',
    name: 'Dr. Vikram Roy',
    specialty: 'General & Preventative Dentist',
    avatarUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    email: 'vikram.roy@smilecare.ai',
    phone: '+1 (555) 678-9012',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    workingHours: '08:00 - 16:00',
    treatments: [
      { name: 'Routine Checkup & Teeth Cleaning', duration: 45, price: 120 },
      { name: 'Composite Cavity Filling', duration: 45, price: 180 },
      { name: 'Tooth Extraction', duration: 45, price: 250 },
    ],
  },
];

// Generate 30 realistic patients
const patientFirstNames = ['Priya', 'Aarav', 'Neha', 'Rohan', 'Kavya', 'Siddharth', 'Ananya', 'Aditya', 'Meera', 'Vikram', 'Divya', 'Karan', 'Riya', 'Amit', 'Pooja', 'Rahul', 'Simran', 'Tanvi', 'Deepak', 'Swati', 'Manish', 'Alok', 'Shruti', 'Varun', 'Isha', 'Yash', 'Bhavna', 'Gaurav', 'Tarun', 'Shweta'];
const patientLastNames = ['Sharma', 'Verma', 'Gupta', 'Patel', 'Singh', 'Joshi', 'Mehta', 'Rao', 'Kumar', 'Kapoor', 'Reddy', 'Chawla', 'Nair', 'Deshmukh', 'Saxena', 'Agrawal', 'Iyer', 'Chatterjee', 'Bhasin', 'Bansal', 'Thakur', 'Bhatia', 'Kulkarni', 'Sengupta', 'Pillai', 'Mallick', 'Shetty', 'Vaidya', 'Ahluwalia', 'Soni'];
const sources: Patient['source'][] = ['Website Widget', 'WhatsApp', 'Phone Call', 'Walk-in'];

export const SEED_PATIENTS: Patient[] = Array.from({ length: 30 }).map((_, idx) => {
  const fName = patientFirstNames[idx % patientFirstNames.length];
  const lName = patientLastNames[idx % patientLastNames.length];
  return {
    id: `pat_${101 + idx}`,
    name: `${fName} ${lName}`,
    phone: `+1 (555) ${100 + idx}-${2000 + idx}`,
    email: `${fName.toLowerCase()}.${lName.toLowerCase()}@gmail.com`,
    age: 22 + (idx * 3) % 45,
    gender: idx % 2 === 0 ? 'Female' : 'Male',
    lastVisit: `2026-0${(idx % 9) + 1}-15`,
    nextAppointment: idx % 3 === 0 ? `2026-10-1${idx % 9}` : undefined,
    source: sources[idx % sources.length],
    tags: idx % 4 === 0 ? ['VIP Patient', 'Invisalign'] : idx % 3 === 0 ? ['Emergency History'] : ['Routine Cleanings'],
    medicalHistory: idx % 5 === 0 ? ['Penicillin Allergy', 'Hypertension'] : ['No Known Allergies'],
    totalVisits: 1 + (idx % 8),
  };
});

// Generate 60 realistic appointments
const treatmentsList = [
  'Routine Checkup & Teeth Cleaning',
  'Root Canal Treatment',
  'Invisalign Assessment',
  'Teeth Whitening Express',
  'Dental Implant Consultation',
  'Composite Cavity Filling',
  'Tooth Extraction Emergency',
];

export const SEED_APPOINTMENTS: Appointment[] = Array.from({ length: 60 }).map((_, idx) => {
  const patient = SEED_PATIENTS[idx % SEED_PATIENTS.length];
  const doctor = SEED_DOCTORS[idx % SEED_DOCTORS.length];
  const dayOffset = (idx % 14) - 5; // spans past and next 9 days
  const dateObj = new Date();
  dateObj.setDate(dateObj.getDate() + dayOffset);
  const dateStr = dateObj.toISOString().split('T')[0];

  const hours = 9 + (idx % 8);
  const timeStr = `${hours < 10 ? '0' : ''}${hours}:00`;
  const statuses: Appointment['status'][] = ['Confirmed', 'Pending', 'Completed', 'No-show', 'Cancelled'];

  return {
    id: `apt_${500 + idx}`,
    patientId: patient.id,
    patientName: patient.name,
    patientPhone: patient.phone,
    doctorId: doctor.id,
    doctorName: doctor.name,
    treatment: treatmentsList[idx % treatmentsList.length],
    date: dateStr,
    time: timeStr,
    durationMins: 45,
    status: dayOffset < 0 ? (idx % 6 === 0 ? 'No-show' : 'Completed') : statuses[idx % 3],
    source: patient.source,
    notes: idx % 4 === 0 ? 'Patient requested morning slot only.' : undefined,
  };
});

// Seed 40 Conversations
export const SEED_CONVERSATIONS: Conversation[] = Array.from({ length: 40 }).map((_, idx) => {
  const patient = SEED_PATIENTS[idx % SEED_PATIENTS.length];
  const isEmergency = idx % 9 === 0;
  const isHumanNeeded = idx % 5 === 0 || isEmergency;
  const isBooked = idx % 3 === 0;

  const channels: Conversation['channel'][] = ['Widget', 'WhatsApp', 'Phone'];
  const channel = channels[idx % channels.length];

  let status: Conversation['status'] = 'AI Handled';
  if (isEmergency) status = 'Emergency';
  else if (isHumanNeeded) status = 'Needs Human';
  else if (isBooked) status = 'Booked';

  const lastMsg = isEmergency
    ? 'I have severe sudden throbbing toothache and swelling on my right jaw! Need urgent help!'
    : isBooked
    ? 'Great! Appointment confirmed for Thursday at 10:00 AM with Dr. Krina Mehta.'
    : 'Can you tell me how much Invisalign costs at your clinic?';

  return {
    id: `conv_${800 + idx}`,
    patientName: patient.name,
    patientPhone: patient.phone,
    patientAvatar: `https://images.unsplash.com/photo-${1500000000000 + idx * 10000}?w=100&auto=format&fit=crop&q=80`,
    channel,
    status,
    lastMessage: lastMsg,
    lastMessageTime: `10:${15 + (idx % 40)} AM`,
    unread: idx < 6,
    emergency: isEmergency,
    tags: isEmergency ? ['Urgent', 'Severe Pain'] : ['Inquiry', 'Pricing'],
    internalNotes: isEmergency ? ['Staff notified on SMS by AI receptionist'] : [],
    messages: [
      {
        id: `m1_${idx}`,
        sender: 'patient',
        text: `Hello, I'm interested in booking a consultation for ${treatmentsList[idx % treatmentsList.length]}.`,
        timestamp: '10:10 AM',
      },
      {
        id: `m2_${idx}`,
        sender: 'ai',
        text: `Hi ${patient.name}! I am SmileCare's AI receptionist. We would love to help you! Dr. Krina Mehta has openings this Thursday at 10:00 AM and 2:30 PM. Would either work for you?`,
        timestamp: '10:11 AM',
        confidenceScore: 0.98,
      },
      {
        id: `m3_${idx}`,
        sender: 'patient',
        text: lastMsg,
        timestamp: `10:${15 + (idx % 40)} AM`,
      },
    ],
  };
});

// Seed 12 Invoices
export const SEED_INVOICES: Invoice[] = Array.from({ length: 12 }).map((_, idx) => ({
  id: `inv_${900 + idx}`,
  number: `INV-2026-00${12 - idx}`,
  date: `2026-0${Math.max(1, 10 - idx)}-01`,
  amount: 199,
  status: idx === 0 ? 'Pending' : 'Paid',
  pdfUrl: '#',
  planName: 'Growth Pro Plan',
}));

// Unanswered Gaps for Knowledge Base
export const SEED_AI_GAPS = [
  { question: 'Do you accept Guardian Dental Insurance?', count: 18, status: 'Unresolved' },
  { question: 'What is the recovery period for wisdom tooth extraction?', count: 12, status: 'Unresolved' },
  { question: 'Do you offer nitrous oxide sedation for nervous patients?', count: 9, status: 'Unresolved' },
];
