import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, CheckCircle2, ArrowRight, PhoneCall, Calendar, ShieldCheck, MessageSquare, Bot, Star, DollarSign } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Interactive ROI Calculator State
  const [missedCallsPerWeek, setMissedCallsPerWeek] = useState(25);
  const [avgAppointmentValue, setAvgAppointmentValue] = useState(250);

  const monthlyRecoveredValue = Math.round(missedCallsPerWeek * 4 * 0.4 * avgAppointmentValue);

  // Interactive Live Chat Simulator State
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Hi there! Welcome to SmileCare Dental. I am your 24/7 AI receptionist. How can I assist you today?' },
  ]);
  const [userQuery, setUserQuery] = useState('');

  const handleSendQuery = (textToSend?: string) => {
    const q = textToSend || userQuery;
    if (!q.trim()) return;

    const newMsgs = [...chatMessages, { sender: 'user', text: q }];
    setChatMessages(newMsgs);
    setUserQuery('');

    setTimeout(() => {
      let reply = "I can certainly help you book an appointment for that! Dr. Krina Mehta has openings this Thursday at 10:00 AM or 2:30 PM. Shall I reserve Thursday 10:00 AM for you?";
      if (q.toLowerCase().includes('price') || q.toLowerCase().includes('cost')) {
        reply = "Our routine dental checkup & cleaning is $120. Invisalign assessments start at $100. We also accept PPO dental insurances! Would you like to schedule a visit?";
      } else if (q.toLowerCase().includes('pain') || q.toLowerCase().includes('emergency')) {
        reply = "⚠️ Pain detected! I am escalating your request immediately to our on-call dental team. Please provide your phone number so Dr. Mehta's office can call you directly.";
      }

      setChatMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    }, 600);
  };

  return (
    <div className="space-y-24">
      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-8 md:pt-16 text-center space-y-8 relative">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold uppercase tracking-wider animate-fade-in">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>AUTONOMOUS AI RECEPTIONIST FOR DENTAL CLINICS</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight text-white">
          Never Miss a Patient Call or Booking <br />
          <span className="gradient-text-teal">Powered by Autonomous Dental AI</span>
        </h1>

        <p className="text-slate-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          SmileCare AI handles patient inquiries, books appointments directly into your PMS, resolves pricing questions 24/7, and recovers missed calls automatically.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={() => navigate('/register')}
            icon={Sparkles}
            className="bg-gradient-to-r from-teal-400 to-teal-500 text-slate-950 font-bold text-base px-8 py-4 shadow-xl shadow-teal-500/25"
          >
            Start 14-Day Free Trial
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/demo')}
            icon={Bot}
            className="border-slate-700 text-white hover:bg-slate-800 text-base px-8 py-4"
          >
            Try Live AI Demo
          </Button>
        </div>

        {/* Hero Interactive Widget Preview Grid */}
        <div className="pt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
          {/* Left Hero Value Props */}
          <div className="lg:col-span-6 space-y-6">
            <h3 className="text-2xl font-bold text-white">
              Transform Your Front Desk Operations
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Instant 24/7 Appointment Booking</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Integrates with Google Calendar, Dentrix, and Open Dental for real-time slot checking.</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">Emergency Triage & Escalation</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Detects severe pain or swelling and alerts your on-call dentist via SMS instantly.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Live Interactive Chat Simulator */}
          <div className="lg:col-span-6">
            <div className="bg-slate-900 border border-teal-500/30 rounded-3xl p-5 shadow-2xl space-y-4 relative">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-bold text-sm text-white">Live AI Receptionist Demo</span>
                </div>
                <span className="text-[10px] text-teal-400 font-mono bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-800">
                  SmileCare v2.4 AI
                </span>
              </div>

              {/* Chat Log Window */}
              <div className="h-64 overflow-y-auto space-y-3 p-2 bg-slate-950/80 rounded-2xl border border-slate-850">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed ${msg.sender === 'user'
                          ? 'bg-teal-600 text-white rounded-br-none'
                          : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                        }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Sample Prompts */}
              <div className="flex flex-wrap gap-2 text-[11px]">
                <button
                  onClick={() => handleSendQuery('How much does teeth whitening cost?')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 cursor-pointer"
                >
                  "How much is whitening?"
                </button>
                <button
                  onClick={() => handleSendQuery('I have an emergency toothache!')}
                  className="px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800 cursor-pointer"
                >
                  "I have severe toothache!"
                </button>
              </div>

              {/* Input field */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
                  placeholder="Ask the AI receptionist anything..."
                  className="flex-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-teal-500"
                />
                <Button size="sm" onClick={() => handleSendQuery()} icon={ArrowRight}>
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI CALCULATOR SECTION */}
      <section className="max-w-5xl mx-auto px-4 md:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 border border-teal-500/30 rounded-3xl p-8 md:p-12 shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Calculate Your Clinic's Recovered Revenue
            </h2>
            <p className="text-xs text-slate-400">See how much lost revenue SmileCare AI converts back into confirmed bookings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
                  <span>Missed Calls / Enquiries per Week:</span>
                  <span className="text-teal-400 text-base">{missedCallsPerWeek} calls</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={missedCallsPerWeek}
                  onChange={(e) => setMissedCallsPerWeek(Number(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-2">
                  <span>Average Appointment Value ($):</span>
                  <span className="text-teal-400 text-base">${avgAppointmentValue}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1500"
                  step="25"
                  value={avgAppointmentValue}
                  onChange={(e) => setAvgAppointmentValue(Number(e.target.value))}
                  className="w-full accent-teal-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Result Box */}
            <div className="bg-slate-950/80 border border-teal-500/40 p-6 rounded-2xl text-center space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Estimated Monthly Recovered Revenue
              </span>
              <div className="text-4xl md:text-5xl font-extrabold text-teal-400">
                ${monthlyRecoveredValue.toLocaleString()}
              </div>
              <p className="text-[11px] text-slate-400">
                Based on a conservative 40% AI conversion rate for missed calls & after-hours chats.
              </p>
              <Button
                size="md"
                onClick={() => navigate('/register')}
                className="w-full justify-center mt-2"
                icon={Sparkles}
              >
                Claim Your Recovered Revenue
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
