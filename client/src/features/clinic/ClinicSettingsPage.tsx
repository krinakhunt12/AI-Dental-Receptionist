import { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useDentistsQuery } from '../dentists/hooks/useDentistsQuery';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  HiBuildingOffice2,
  HiUserGroup,
  HiCodeBracket,
  HiSparkles,
  HiClock,
  HiPhone,
  HiEnvelope,
  HiMapPin,
  HiCheckCircle,
  HiClipboardDocumentCheck,
  HiShieldCheck,
} from 'react-icons/hi2';

export default function ClinicSettingsPage() {
  const { health } = useAuth();
  const { dentists, isLoading: dentistsLoading } = useDentistsQuery();
  const [copiedScript, setCopiedScript] = useState(false);

  const [clinicProfile, setClinicProfile] = useState({
    clinicName: health?.clinic ?? 'SmileCare Dental Suite',
    tagline: 'Modern Pain-Free Dental Care & 24/7 AI Receptionist',
    owner: 'Dr. Krina Khunt',
    email: 'reception@smilecaredental.com',
    phone: '+91 98765-43210',
    emergencyPhone: '+91 98765-00000',
    address: 'SmileCare Tower, Suite 402, Ring Road, Ahmedabad',
    operatingHours: 'Mon - Sat: 9:00 AM - 8:00 PM',
    subscriptionTier: 'Professional Suite (Active)',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  const embedCode = `<script 
  src="https://cdn.ai-dental-receptionist.com/widget.js" 
  data-clinic-id="cln_smilecare_402" 
  data-assistant-name="Maya AI Receptionist" 
  async>
</script>`;

  const copyEmbedCode = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  if (dentistsLoading) {
    return <LoadingSpinner message="Loading Clinic Workspace Configuration…" />;
  }

  return (
    <div className="max-w-7xl mx-auto w-full p-6 md:p-10 flex flex-col gap-8 font-sans text-slate-100 bg-[#070a12] min-h-screen">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-slate-800 p-8 rounded-3xl shadow-xl flex flex-col gap-3 relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <HiBuildingOffice2 className="text-teal-400 text-3xl shrink-0" />
            <div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight font-heading">
                Registered Clinic Profile & Setup
              </h1>
              <p className="text-xs md:text-sm text-slate-300 mt-1">
                Manage your registered clinic details, doctors roster, AI receptionist widget, and subscription status.
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-300 bg-emerald-950 border border-emerald-800 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
            <HiCheckCircle className="text-emerald-400" />
            <span>{clinicProfile.subscriptionTier}</span>
          </span>
        </div>
      </div>

      {savedSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-2xl text-xs font-bold flex items-center gap-2">
          <HiCheckCircle className="text-base" />
          <span>Clinic settings successfully saved and synced with AI Receptionist Engine!</span>
        </div>
      )}

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Form Profile */}
        <form onSubmit={handleSaveProfile} className="lg:col-span-2 flex flex-col gap-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 md:p-8 flex flex-col gap-5 shadow-xl">
            <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2 border-b border-slate-800 pb-3">
              <HiBuildingOffice2 className="text-teal-400" />
              <span>Clinic Registration Information</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Registered Clinic Name
                </label>
                <input
                  type="text"
                  value={clinicProfile.clinicName}
                  onChange={(e) => setClinicProfile({ ...clinicProfile, clinicName: e.target.value })}
                  className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-teal-500 transition"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Clinic Lead Director / Doctor
                </label>
                <input
                  type="text"
                  value={clinicProfile.owner}
                  onChange={(e) => setClinicProfile({ ...clinicProfile, owner: e.target.value })}
                  className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-teal-500 transition"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Official Clinic Email
                </label>
                <input
                  type="email"
                  value={clinicProfile.email}
                  onChange={(e) => setClinicProfile({ ...clinicProfile, email: e.target.value })}
                  className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-teal-500 transition font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Primary Phone Line
                </label>
                <input
                  type="tel"
                  value={clinicProfile.phone}
                  onChange={(e) => setClinicProfile({ ...clinicProfile, phone: e.target.value })}
                  className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-teal-500 transition font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Emergency Escalation Phone
                </label>
                <input
                  type="tel"
                  value={clinicProfile.emergencyPhone}
                  onChange={(e) => setClinicProfile({ ...clinicProfile, emergencyPhone: e.target.value })}
                  className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-teal-500 transition font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Clinic Operating Schedule
                </label>
                <input
                  type="text"
                  value={clinicProfile.operatingHours}
                  onChange={(e) => setClinicProfile({ ...clinicProfile, operatingHours: e.target.value })}
                  className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-teal-500 transition"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Physical Address
                </label>
                <input
                  type="text"
                  value={clinicProfile.address}
                  onChange={(e) => setClinicProfile({ ...clinicProfile, address: e.target.value })}
                  className="w-full bg-[#050811] border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none focus:border-teal-500 transition"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                className="btn-shimmer px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition cursor-pointer"
              >
                Save Clinic Settings
              </button>
            </div>
          </div>

          {/* Roster Summary */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                <HiUserGroup className="text-teal-400" />
                <span>Registered Clinic Dentists ({dentists.length})</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dentists.map((d) => (
                <div key={d.id} className="bg-[#050811] border border-slate-800 rounded-2xl p-4 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xs">
                      👨‍⚕️
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-xs">{d.name}</h4>
                      <span className="text-[10px] text-teal-300 font-semibold">{d.specialization}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono mt-1">
                    Shift: {d.start} - {d.end}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Right Col: Embed Widget Code & Subscription */}
        <div className="flex flex-col gap-6">
          {/* Embed Script Card */}
          <div className="bg-gradient-to-br from-slate-900 via-[#0a0f20] to-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col gap-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-white text-base font-heading flex items-center gap-2">
                <HiCodeBracket className="text-teal-400" />
                <span>AI Widget Script</span>
              </h3>
              <button
                onClick={copyEmbedCode}
                className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/30 transition cursor-pointer flex items-center gap-1"
              >
                <HiClipboardDocumentCheck />
                <span>{copiedScript ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Copy this script tag and insert it into your clinic website HTML to immediately enable the 24/7 AI Receptionist chat & booking widget:
            </p>

            <pre className="bg-[#04060d] p-3 rounded-2xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto select-all">
              {embedCode}
            </pre>

            <div className="bg-teal-950/40 border border-teal-800/60 rounded-xl p-3 text-[11px] text-teal-200 flex items-center gap-2">
              <HiShieldCheck className="text-teal-400 text-base shrink-0" />
              <span>Syncs automatically with your clinic's working hours and doctor roster.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
