import { NavLink } from 'react-router-dom';
import Logo from '../common/Logo';
import {
  HiMapPin,
  HiPhone,
  HiEnvelope,
  HiClock,
  HiSparkles,
  HiShieldCheck,
  HiHeart,
} from 'react-icons/hi2';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 pt-12 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-900">
        {/* Col 1: Brand Info */}
        <div className="flex flex-col gap-4">
          <Logo variant="full" size="lg" subtitle="AI Reception & Front Desk" />
          <p className="text-xs text-slate-400 leading-relaxed">
            Pioneering digital dentistry and continuous patient care with instantaneous AI scheduling, transparent pricing, and specialized clinical treatments.
          </p>
        </div>

        {/* Col 2: Quick Links */}
        <div className="flex flex-col gap-3 text-xs">
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] font-heading">
            Quick Navigation
          </span>
          <NavLink to="/" className="hover:text-teal-300 transition">
            Home & Overview
          </NavLink>
          <NavLink to="/services" className="hover:text-teal-300 transition">
            Services & Procedure Rates
          </NavLink>
          <NavLink to="/dentists" className="hover:text-teal-300 transition">
            Specialist Dentists & Roster
          </NavLink>
          <NavLink to="/chat" className="hover:text-teal-300 transition flex items-center gap-1">
            <HiSparkles className="text-teal-400" />
            <span>24/7 AI Receptionist</span>
          </NavLink>
          <NavLink to="/appointments" className="hover:text-teal-300 transition">
            Book Appointment
          </NavLink>
        </div>

        {/* Col 3: Clinic Hours */}
        <div className="flex flex-col gap-3 text-xs">
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] font-heading">
            Clinic Working Hours
          </span>
          <div className="flex items-start gap-2">
            <HiClock className="text-teal-400 text-sm shrink-0 mt-0.5" />
            <div className="flex flex-col text-slate-300">
              <span className="font-semibold text-white">Monday - Saturday</span>
              <span>9:00 AM - 8:00 PM</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <HiClock className="text-amber-400 text-sm shrink-0 mt-0.5" />
            <div className="flex flex-col text-slate-300">
              <span className="font-semibold text-white">Sunday</span>
              <span>Emergency Services Only</span>
            </div>
          </div>
          <div className="mt-1 bg-teal-950/60 border border-teal-800/60 p-2.5 rounded-xl text-[11px] text-teal-300 flex items-center gap-1.5">
            <HiShieldCheck className="text-teal-400 text-base shrink-0" />
            <span>AI Voice & Chat Assistant available 24 hours / 7 days</span>
          </div>
        </div>

        {/* Col 4: Contact & Location */}
        <div className="flex flex-col gap-3 text-xs">
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px] font-heading">
            Contact & Address
          </span>
          <div className="flex items-start gap-2">
            <HiMapPin className="text-teal-400 text-base shrink-0 mt-0.5" />
            <span>SmileCare Tower, Suite 402, Medical Enclave, Ring Road, Ahmedabad - 380015</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-slate-300">
            <HiPhone className="text-teal-400 shrink-0" />
            <span>+91 98765-43210 / (079) 2684-9000</span>
          </div>
          <div className="flex items-center gap-2 font-mono text-slate-300">
            <HiEnvelope className="text-teal-400 shrink-0" />
            <span>reception@smilecare.com</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
        <span>© {new Date().getFullYear()} SmileCare Dental Clinic & AI Receptionist. Built for Dental Care Excellence.</span>
        <div className="flex items-center gap-1">
          <span>Designed with</span>
          <HiHeart className="text-rose-500" />
          <span>for Krina & Patients</span>
        </div>
      </div>
    </footer>
  );
}
