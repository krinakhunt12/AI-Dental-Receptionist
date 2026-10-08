import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiPaperAirplane, HiSparkles, HiChatBubbleLeftRight } from 'react-icons/hi2';

export default function ChatDemoCard() {
  const navigate = useNavigate();

  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<
    Array<{ sender: 'patient' | 'ai'; text: string; time?: string }>
  >([
    {
      sender: 'patient',
      text: 'Do you have an opening for teeth cleaning tomorrow afternoon?',
      time: '2:14 PM',
    },
    {
      sender: 'ai',
      text: 'Yes! Dr. Patel is available tomorrow at 3:30 PM for dental cleaning (₹4,500). Should I confirm this slot for you?',
      time: '2:14 PM',
    },
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  const SUGGESTED_CHIPS = [
    'How much is teeth whitening?',
    'What are clinic hours?',
    'Is Dr. Patel available Friday?',
  ];

  const handleAskQuestion = (qText: string) => {
    if (!qText.trim()) return;

    const userMsg = qText.trim();
    setMessages((prev) => [
      ...prev,
      { sender: 'patient', text: userMsg, time: 'Just now' },
    ]);
    setQuestion('');
    setAiLoading(true);

    setTimeout(() => {
      let reply =
        'Our AI Receptionist operates 24/7. Would you like to schedule an appointment or ask about clinic procedures?';
      const lower = userMsg.toLowerCase();
      if (lower.includes('whitening')) {
        reply =
          'Laser Teeth Whitening costs ₹4,500. It takes 45 minutes and is performed by Dr. Priya Patel.';
      } else if (lower.includes('hours')) {
        reply =
          'Our clinic is open Mon–Sat from 9:00 AM to 8:00 PM. Our AI front desk processes bookings 24/7.';
      } else if (lower.includes('patel') || lower.includes('friday')) {
        reply =
          'Dr. Patel has available slots this Friday at 10:00 AM and 4:00 PM. Would you like to book one?';
      }

      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: reply, time: 'Just now' },
      ]);
      setAiLoading(false);
    }, 650);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Soft Teal Radial Glow behind card */}
      <div
        className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-teal-500/20 via-emerald-500/10 to-teal-600/20 blur-xl opacity-75 pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative bg-[#090e1a]/95 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl backdrop-blur-xl flex flex-col gap-4">
        {/* Card Header: "Try the AI receptionist" + Green dot "Online" */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300 shrink-0">
              <HiChatBubbleLeftRight className="text-lg" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-white font-heading">
                Try the AI receptionist
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-medium text-emerald-400">Online</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/register-clinic')}
            className="text-xs font-medium text-teal-400 hover:text-teal-300 transition focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none rounded"
          >
            Demo Sandbox
          </button>
        </div>

        {/* Chat History Messages Stream (Pre-populated sample bubbles) */}
        <div className="flex flex-col gap-3 min-h-[160px] max-h-[220px] overflow-y-auto pr-1 text-xs">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                msg.sender === 'patient' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl leading-relaxed ${
                  msg.sender === 'patient'
                    ? 'bg-teal-600 text-slate-950 font-medium rounded-br-xs'
                    : 'bg-slate-800/90 text-slate-100 border border-white/10 rounded-bl-xs'
                }`}
              >
                {msg.text}
              </div>
              {msg.time && (
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.time}
                </span>
              )}
            </div>
          ))}

          {aiLoading && (
            <div className="flex items-center gap-2 text-xs text-teal-400 bg-slate-800/80 border border-white/10 p-2.5 rounded-2xl w-fit">
              <div className="flex gap-1" aria-label="AI is typing">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce" />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
              <span className="text-[11px] text-slate-300">
                Searching clinic calendar…
              </span>
            </div>
          )}
        </div>

        {/* Suggested Question Chips (High contrast, one-click trigger) */}
        <div className="flex flex-wrap gap-2 pt-1">
          {SUGGESTED_CHIPS.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleAskQuestion(chip)}
              className="text-xs text-slate-200 bg-white/5 border border-white/10 hover:border-teal-400/50 hover:bg-white/10 hover:-translate-y-0.5 active:translate-y-0 px-3 py-1.5 rounded-lg transition-all duration-150 cursor-pointer font-normal text-left focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none"
            >
              💬 "{chip}"
            </button>
          ))}
        </div>

        {/* Chat Input Field (44px min target, high contrast placeholder, circular teal button) */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskQuestion(question);
          }}
          className="flex items-center gap-2 bg-[#050811] border border-white/10 rounded-xl p-1.5 focus-within:border-teal-400 transition-colors shadow-inner"
        >
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a patient question or request appointment..."
            className="w-full bg-transparent px-3 py-2 text-xs text-slate-100 placeholder-slate-400 outline-none h-11"
            aria-label="Ask the AI receptionist a question"
          />
          <button
            type="submit"
            disabled={!question.trim() || aiLoading}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 text-slate-950 flex items-center justify-center shrink-0 disabled:opacity-40 transition-transform active:scale-95 cursor-pointer focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:outline-none shadow-md"
            aria-label="Send Message"
          >
            <HiPaperAirplane className="text-sm" />
          </button>
        </form>
      </div>
    </div>
  );
}
