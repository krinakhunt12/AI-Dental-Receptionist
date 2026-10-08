import { useEffect, useRef, useState } from 'react';
import { useChatMutation } from './hooks/useChatMutation';
import { type Msg, type Source } from '../../api';

type UiMsg = Msg & { tools?: string[]; escalated?: boolean; error?: boolean };

const GREETING: UiMsg = {
  role: 'assistant',
  content: "Hello! Welcome to SmileCare Dental Clinic. I'm your AI receptionist. How can I assist you today? I can help answer questions about our services, pricing, dentist schedules, or book an appointment for you.",
};

const STARTERS = [
  { label: 'Teeth Whitening Cost', prompt: 'How much does teeth whitening cost and how long does it take?' },
  { label: 'Orthodontist & Braces', prompt: 'Do you have an orthodontist available for braces consultation?' },
  { label: 'Clinic Parking & Directions', prompt: 'Where is the clinic located and where can I park?' },
  { label: 'Book Dental Cleaning', prompt: 'I would like to book a dental cleaning appointment for tomorrow.' },
];

export default function ChatPage() {
  const { sendMessage } = useChatMutation();
  const [msgs, setMsgs] = useState<UiMsg[]>([GREETING]);
  const [sources, setSources] = useState<Source[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, busy]);

  // Voice Text-to-Speech Helper
  function speakText(text: string) {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/\[.*?\]/g, '').replace(/[*_#]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }

  // Voice Speech-to-Text (Microphone Listener)
  function startListening() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your browser. Please try Chrome or Edge.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setInput(transcript);
        sendQuery(transcript);
      }
    };

    recognition.start();
  }

  async function sendQuery(queryText?: string) {
    const text = (queryText ?? input).trim();
    if (!text || busy) return;

    const userMsg: UiMsg = { role: 'user', content: text };
    const nextMsgs = [...msgs, userMsg];
    setMsgs(nextMsgs);
    setInput('');
    setBusy(true);

    try {
      const payload: Msg[] = nextMsgs.map((m) => ({ role: m.role, content: m.content }));
      const res = await sendMessage(payload);
      const assistantMsg: UiMsg = {
        role: 'assistant',
        content: res.reply,
        tools: res.toolsUsed,
        escalated: res.escalated,
      };
      setMsgs((prev) => [...prev, assistantMsg]);
      if (res.sources?.length) setSources(res.sources);
      speakText(res.reply);
    } catch (err) {
      setMsgs((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I hit an internal error processing your request. Please try again.',
          error: true,
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 font-sans">
      {/* Main Chat Conversation Container */}
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-sm flex flex-col h-[82vh] overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-200/80 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center text-xl">
              🤖
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm text-slate-100 font-heading">
                  Patient AI Receptionist
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <span className="text-[11px] text-teal-300">
                Powered by Gemini & Voice Agent
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setVoiceEnabled(!voiceEnabled)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
                voiceEnabled
                  ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              <span>{voiceEnabled ? '🔊 Voice On' : '🔇 Voice Off'}</span>
            </button>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto flex flex-col gap-4 bg-slate-50/50">
          {msgs.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                m.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed shadow-xs ${
                  m.role === 'user'
                    ? 'bg-teal-600 text-white rounded-br-none'
                    : m.error
                    ? 'bg-rose-50 text-rose-800 border border-rose-200 rounded-bl-none'
                    : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-none shadow-sm'
                }`}
              >
                {m.content}

                {m.tools && m.tools.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400">
                      Executed Tools:
                    </span>
                    {m.tools.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono font-bold bg-teal-50 text-teal-700 border border-teal-200 px-2 py-0.5 rounded-md"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {busy && (
            <div className="flex items-center gap-2 bg-white border border-slate-200/80 p-3 rounded-2xl w-fit shadow-xs animate-pulse text-xs text-slate-500">
              <span className="animate-spin">🌀</span>
              <span>AI Receptionist is thinking and verifying slots…</span>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Quick Conversation Starters */}
        <div className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2 overflow-x-auto">
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">
            Suggested:
          </span>
          {STARTERS.map((s, idx) => (
            <button
              key={idx}
              onClick={() => sendQuery(s.prompt)}
              className="text-xs text-slate-600 bg-slate-100 hover:bg-teal-50 hover:text-teal-700 border border-slate-200 hover:border-teal-200 px-3 py-1.5 rounded-full shrink-0 transition cursor-pointer"
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendQuery();
          }}
          className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2"
        >
          <button
            type="button"
            onClick={startListening}
            className={`p-3 rounded-xl border transition cursor-pointer shrink-0 ${
              listening
                ? 'bg-rose-50 text-rose-600 border-rose-300 animate-pulse'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200'
            }`}
            title="Speak with Microphone"
          >
            🎙️
          </button>

          <input
            type="text"
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs md:text-sm text-slate-900 focus:outline-none focus:border-teal-500 focus:bg-white transition"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or speak your message to the AI receptionist…"
            disabled={busy}
          />

          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20 transition cursor-pointer disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>

      {/* RAG Context & Source Citations Panel */}
      <div className="flex flex-col gap-4">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 font-heading">
            <span>📚 RAG Sources & Context</span>
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Real-time indexed passages retrieved from the SmileCare Knowledge Base during AI response generation.
          </p>

          <div className="divide-y divide-slate-100 max-h-[50vh] overflow-y-auto">
            {sources.map((src, i) => (
              <div key={i} className="py-2.5 flex flex-col gap-1 text-xs">
                <span className="font-bold text-teal-700 font-mono text-[11px]">
                  📄 {src.source}
                </span>
                <p className="text-slate-600 text-[11px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                  "{src.text}"
                </p>
              </div>
            ))}
            {sources.length === 0 && (
              <div className="py-6 text-center text-xs text-slate-400">
                No external RAG sources triggered yet. Ask about whitening or root canals!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
