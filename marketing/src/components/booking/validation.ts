import type { PatientDetails } from '../../api/types';

export interface DetailsErrors {
  name?: string;
  phone?: string;
  email?: string;
}

export function validateDetails(patient: PatientDetails): DetailsErrors {
  const errors: DetailsErrors = {};
  const name = patient.name.trim();
  const phoneDigits = patient.phone.replace(/\D/g, '');
  const email = patient.email.trim();

  if (!name) {
    errors.name = 'Please tell us your name so we know who to expect.';
  } else if (name.length < 2) {
    errors.name = 'That name looks a little short — please enter your full name.';
  }

  if (!patient.phone.trim()) {
    errors.phone = 'We need a phone number to send your confirmation.';
  } else if (phoneDigits.length < 10) {
    errors.phone = 'That phone number looks too short — please enter a 10-digit number.';
  }

  if (!email) {
    errors.email = 'Please add your email so we can send the appointment details.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    errors.email = 'Please check the email address — it does not look complete.';
  }

  return errors;
}
