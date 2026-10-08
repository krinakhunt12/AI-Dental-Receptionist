import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiPhone,
  HiEnvelope,
  HiMapPin,
  HiClock,
  HiChatBubbleLeftRight,
  HiCheckCircle,
  HiPaperAirplane,
  HiBuildingOffice2,
} from 'react-icons/hi2';

export default function ContactPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Appointment Request');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto w-full p-6 md:p-10 flex flex-col gap-10 font-sans text-slate-100 bg-[#070a12] min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-8 md:p-10 border border-slate-800/80 shadow-xl flex flex-col gap-3 relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <span className="text-xs font-semibold uppercase tracking-wider text-teal-400">
          Get In Touch
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight font-heading">
          Contact SmileCare Dental Clinic
        </h1>
        <p className="text-slate-300 text-sm max-w-2xl leading-relaxed font-normal">
          Have questions about a procedure, insurance coverage, or dental emergency? Reach our reception team or connect directly with our 24/7 AI Receptionist.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 items-start animate-fade-in-delayed">
        {/* Contact Info & Map Card */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col gap-5 backdrop-blur-xl">
            <h2 className="text-xl font-bold text-white font-heading">Clinic Contact Information</h2>

            <div className="flex flex-col gap-4 text-xs md:text-sm">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/15 text-teal-300 border border-teal-500/25 flex items-center justify-center text-lg shrink-0">
                  <HiMapPin />
                </div>
                <div>
                  <span className="font-semibold text-white block text-sm">Clinic Address</span>
                  <span className="text-slate-300 font-normal leading-relaxed">
                    SmileCare Tower, Suite 402, Medical Enclave, Ring Road, Ahmedabad - 380015
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/15 text-teal-300 border border-teal-500/25 flex items-center justify-center text-lg shrink-0">
                  <HiPhone />
                </div>
                <div>
                  <span className="font-semibold text-white block text-sm">Phone & Emergency Line</span>
                  <span className="text-slate-300 font-mono text-xs">+91 (079) 2684-9000 / +91 98765-43210</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/15 text-teal-300 border border-teal-500/25 flex items-center justify-center text-lg shrink-0">
                  <HiEnvelope />
                </div>
                <div>
                  <span className="font-semibold text-white block text-sm">Email Support</span>
                  <span className="text-slate-300 font-mono text-xs">reception@smilecaredental.com</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/15 text-teal-300 border border-teal-500/25 flex items-center justify-center text-lg shrink-0">
                  <HiClock />
                </div>
                <div>
                  <span className="font-semibold text-white block text-sm">Operating Hours</span>
                  <span className="text-slate-300 font-normal">Mon - Sat: 9:00 AM - 8:00 PM | Sun: Emergency Only</span>
                  <span className="text-teal-400 font-semibold block mt-1 text-xs">
                    🤖 AI Receptionist: Available 24 Hours / 7 Days
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Instant AI Action Banner */}
          <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-950 text-white rounded-3xl p-6 border border-teal-800/50 shadow-xl flex flex-col gap-3">
            <h3 className="font-bold text-lg text-white font-heading">Need an Instant Response?</h3>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Don't wait for office hours. Ask our AI Receptionist about whitening prices, dentist availability, or book a slot right now.
            </p>
            <button
              onClick={() => navigate('/chat')}
              className="btn-shimmer mt-2 w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-semibold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <HiChatBubbleLeftRight className="text-base" />
              <span>Talk to Patient AI Assistant</span>
            </button>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col gap-5 backdrop-blur-xl">
          <div>
            <h2 className="text-xl font-bold text-white font-heading">Send Us a Direct Message</h2>
            <p className="text-xs text-slate-400 mt-1 font-normal">
              Our front-desk team will respond to your query within 2 business hours.
            </p>
          </div>

          {submitted ? (
            <div className="bg-teal-950/60 border border-teal-700/60 text-teal-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3 animate-fade-in shadow-xl">
              <HiCheckCircle className="text-4xl text-teal-400 animate-bounce" />
              <h3 className="font-bold text-lg font-heading text-white">Message Sent Successfully!</h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-sm font-normal">
                Thank you, {name}. We have received your inquiry regarding "{subject}". Our reception team will reach out at {email} or {phone}.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-semibold rounded-xl shadow-md cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs md:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-300 uppercase text-[11px] block mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Ramesh Shah"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 outline-none focus:border-teal-500 transition-colors font-normal"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-300 uppercase text-[11px] block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 outline-none focus:border-teal-500 transition-colors font-mono font-normal"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-300 uppercase text-[11px] block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ramesh@example.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 outline-none focus:border-teal-500 transition-colors font-mono font-normal"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-300 uppercase text-[11px] block mb-1">
                  Subject / Inquiry Type
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-teal-500 transition-colors cursor-pointer font-normal"
                >
                  <option value="Appointment Request">Appointment Request</option>
                  <option value="Treatment Pricing & Insurance">Treatment Pricing & Insurance</option>
                  <option value="Orthodontist Consultation">Orthodontist Consultation</option>
                  <option value="Dental Emergency">Dental Emergency</option>
                  <option value="General Question">General Question</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-300 uppercase text-[11px] block mb-1">
                  Your Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your questions or requested appointment dates here..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 outline-none focus:border-teal-500 transition-colors font-normal"
                />
              </div>

              <button
                type="submit"
                className="btn-shimmer py-3 px-6 bg-gradient-to-r from-teal-500 via-teal-400 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-semibold text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <HiPaperAirplane className="text-base" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
