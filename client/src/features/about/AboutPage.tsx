import {
  HiUserGroup,
  HiSparkles,
  HiShieldCheck,
  HiBuildingOffice2,
  HiCheckCircle,
  HiHeart,
  HiAcademicCap,
  HiClock,
} from 'react-icons/hi2';

export default function AboutPage() {
  const TEAM = [
    {
      name: 'Dr. Sarah Jenkins',
      role: 'Chief Dental Officer & Admin',
      qualifications: 'BDS, MDS (Prosthodontics) - 14+ Yrs Exp',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&auto=format&fit=crop&q=80',
      bio: 'Specialist in full-mouth rehabilitation, cosmetic veneers, and AI-assisted treatment planning.',
    },
    {
      name: 'Dr. Mark Rivera',
      role: 'Senior Orthodontist & Implant Specialist',
      qualifications: 'BDS, MDS (Orthodontics) - 10+ Yrs Exp',
      avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
      bio: 'Pioneer in clear aligner technology, painless dental implants, and digital smile design.',
    },
    {
      name: 'Krina Khunt',
      role: 'Head Receptionist & AI Operations Lead',
      qualifications: 'B.Tech CS / AI Integration Lead',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
      bio: 'Oversees AI receptionist integration, patient onboarding, and clinic workflow optimization.',
    },
    {
      name: 'Dr. Priya Patel',
      role: 'Cosmetic & General Dentist',
      qualifications: 'BDS (Gold Medalist) - 8+ Yrs Exp',
      avatar: 'https://images.unsplash.com/photo-1594824813566-88855ce78905?w=300&auto=format&fit=crop&q=80',
      bio: 'Dedicated to painless root canals, laser whitening, and preventive oral health care.',
    },
  ];

  const TECH = [
    {
      title: '24/7 AI Voice & Chat Reception',
      desc: 'Smart agent powered by Claude & Gemini for instant bookings, inquiries, and triage.',
      icon: '🤖',
    },
    {
      title: 'RAG Medical Search Engine',
      desc: 'Vector retrieval algorithm indexing clinical FAQs, safety guidelines, and treatment costs.',
      icon: '🔍',
    },
    {
      title: 'Conflict-Free Appointment Engine',
      desc: 'Automatic dentist shift validation preventing double bookings or out-of-shift slots.',
      icon: '⚡',
    },
    {
      title: 'HIPAA & Data Privacy Protected',
      desc: 'End-to-end tokenized patient data security and zero-retention voice processing.',
      icon: '🛡️',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto w-full p-6 md:p-10 flex flex-col gap-12 font-sans text-slate-100 bg-[#070a12] min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-8 md:p-12 border border-slate-800 shadow-xl flex flex-col gap-4 relative overflow-hidden animate-fade-in">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-bold px-3.5 py-1.5 rounded-full w-fit">
          <HiBuildingOffice2 className="text-teal-400" />
          <span>About SmileCare Dental Clinic</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight font-heading">
          Pioneering AI-Driven Dental Excellence & Patient Care
        </h1>

        <p className="text-slate-300 text-sm md:text-base max-w-3xl leading-relaxed">
          At SmileCare, we combine state-of-the-art clinical dentistry with an autonomous 24/7 AI receptionist. Patients receive immediate assistance, transparent treatment pricing, and hassle-free scheduling anytime.
        </p>
      </div>

      {/* Clinical Leadership & Staff */}
      <div className="flex flex-col gap-6 animate-fade-in-delayed">
        <div>
          <div className="flex items-center gap-2">
            <HiUserGroup className="text-teal-400 text-2xl" />
            <h2 className="text-2xl font-extrabold text-white font-heading">Clinical Leadership & Team</h2>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Meet the certified dental specialists and AI operations team leading SmileCare.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map((member, idx) => (
            <div
              key={idx}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl hover:border-teal-500/40 transition-all duration-300 hover:-translate-y-1 flex flex-col gap-3 group"
            >
              <img
                src={member.avatar}
                alt={member.name}
                className="w-full h-44 object-cover rounded-2xl border border-slate-800 group-hover:scale-105 transition-transform duration-300"
              />
              <div>
                <h3 className="font-bold text-white text-base font-heading">{member.name}</h3>
                <span className="text-xs font-semibold text-teal-300 bg-teal-950 px-2.5 py-0.5 rounded-full border border-teal-800/60 inline-block mt-1">
                  {member.role}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400">{member.qualifications}</p>
              <p className="text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-2.5">
                {member.bio}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Technology & AI Architecture Section */}
      <div className="bg-slate-900/90 text-white rounded-3xl p-8 border border-slate-800 shadow-2xl flex flex-col gap-6 relative overflow-hidden">
        <div className="flex items-center gap-2">
          <HiSparkles className="text-teal-400 text-2xl animate-pulse" />
          <h2 className="text-2xl font-extrabold text-white font-heading">AI Receptionist Infrastructure</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {TECH.map((t, idx) => (
            <div
              key={idx}
              className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 flex flex-col gap-3 hover:border-teal-500/30 transition-all duration-200"
            >
              <span className="text-3xl">{t.icon}</span>
              <h3 className="font-bold text-white text-sm font-heading">{t.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{t.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
