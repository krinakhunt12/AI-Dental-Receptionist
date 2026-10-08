import { useEffect, useRef, useState } from 'react';
import { api, type Msg, type Source } from '../api';

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

export default function Chat() {
  const [msgs, setMsgs] = useState<UiMsg[]>([GREETING]);
  const [sources, setSources] = useState<Source[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [msgs, busy]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const next: UiMsg[] = [...msgs, { role: 'user', content }];
    setMsgs(next);
    setInput('');
    setBusy(true);
    try {
      const history = next.filter((m) => !m.error).map(({ role, content }) => ({ role, content }));
      const r = await api.chat(history);
      setMsgs((m) => [...m, { role: 'assistant', content: r.reply, tools: r.toolsUsed, escalated: r.escalated }]);
      setSources(r.sources);
    } catch (e) {
      setMsgs((m) => [...m, { role: 'assistant', content: e instanceof Error ? e.message : 'Something went wrong while connecting to the receptionist agent.', error: true }]);
    } finally {
      setBusy(false);
    }
  }

  const maxScore = Math.max(...sources.map((s) => s.score), 0.0001);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] h-full overflow-hidden">
      {/* Main Conversation Stream */}
      <section className="flex flex-col h-full bg-white border-r border-slate-200 min-w-0" aria-label="Conversation">
        <header className="px-7 py-4 border-b border-slate-200 flex items-center justify-between bg-white shrink-0">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Patient Chat Simulator</h1>
            <p className="text-xs text-slate-500">Live patient interface powered by RAG and Claude agent tool execution</p>
          </div>
          <button
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-1.5 shadow-xs"
            onClick={() => { setMsgs([GREETING]); setSources([]); }}
            title="Restart conversation"
          >
            <span>🔄</span>
            <span>New Chat</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-7 flex flex-col gap-5 bg-slate-50/70" role="log" aria-live="polite">
          {msgs.map((m, i) => (
            <div
              key={i}
              className={`flex gap-3 max-w-[85%] ${
                m.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 shadow-xs ${
                  m.role === 'assistant'
                    ? 'bg-teal-100 text-teal-800 border border-teal-200'
                    : 'bg-slate-900 text-white'
                }`}
              >
                {m.role === 'assistant' ? '🤖' : '👤'}
              </div>

              <div className="flex flex-col gap-1.5">
                <div
                  className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-xs whitespace-pre-wrap break-words ${
                    m.error
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : m.role === 'assistant'
                      ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                      : 'bg-teal-600 text-white rounded-tr-xs font-normal'
                  }`}
                >
                  {m.content}
                </div>

                {m.tools && m.tools.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-0.5">
                    {m.tools.map((t) => (
                      <span key={t} className="bg-slate-100 text-slate-600 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-slate-200 flex items-center gap-1">
                        ⚡ {t}
                      </span>
                    ))}
                  </div>
                )}

                {m.escalated && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-2 mt-1">
                    ⚠️ Dental emergency pattern detected. Escalated to human reception team.
                  </div>
                )}
              </div>
            </div>
          ))}

          {busy && (
            <div className="flex gap-3 max-w-[85%] self-start">
              <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 border border-teal-200 flex items-center justify-center text-sm font-bold shrink-0">
                🤖
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 flex items-center gap-1.5 shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-typing-1" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-typing-2" />
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-typing-3" />
              </div>
            </div>
          )}

          {msgs.length === 1 && (
            <div className="flex flex-col gap-2.5 mt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Suggested Quick Inquiries
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {STARTERS.map((s, idx) => (
                  <button
                    key={idx}
                    className="bg-white border border-slate-200 hover:border-teal-500 hover:bg-teal-50/60 hover:text-teal-800 text-slate-700 text-xs font-medium p-3 rounded-xl shadow-xs transition-all text-left flex items-center justify-between gap-2"
                    onClick={() => send(s.prompt)}
                  >
                    <span>{s.label}</span>
                    <span className="text-teal-600 font-bold">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input Composer */}
        <div className="p-5 bg-white border-t border-slate-200 flex gap-3 items-center shrink-0">
          <input
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-teal-500 focus:ring-3 focus:ring-teal-500/15 text-sm text-slate-800 shadow-xs transition-all"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && send(input)}
            placeholder="Ask about dental services, prices, or book an appointment…"
            maxLength={2000}
            aria-label="Patient message prompt"
            disabled={busy}
          />
          <button
            className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-teal-600/20 transition-all shrink-0 flex items-center gap-1.5"
            onClick={() => send(input)}
            disabled={busy || !input.trim()}
          >
            <span>Send</span>
            <span>➔</span>
          </button>
        </div>
      </section>

      {/* RAG Context Sidebar Drawer */}
      <aside className="bg-slate-50/80 border-l border-slate-200 flex flex-col h-full overflow-y-auto" aria-label="Retrieved context">
        <header className="px-6 py-4 border-b border-slate-200 bg-white shrink-0">
          <h2 className="text-base font-bold text-slate-900">RAG Knowledge Context</h2>
          <p className="text-xs text-slate-500 mt-0.5">Passages dynamically retrieved to inform AI response</p>
        </header>

        <div className="p-6 flex flex-col gap-3.5 flex-1">
          {sources.length === 0 ? (
            <div className="text-center py-12 text-slate-400 flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-200/70 flex items-center justify-center text-xl text-slate-500">
                📖
              </div>
              <h3 className="font-semibold text-sm text-slate-700">No Context Retrieved Yet</h3>
              <p className="text-xs text-slate-500 max-w-[240px]">
                Ask a question about services, pricing, policies, or procedures to view live vector search results.
              </p>
            </div>
          ) : (
            sources.map((s, i) => (
              <article key={i} className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800 truncate flex items-center gap-1.5">📄 {s.source}</span>
                  <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60 shrink-0">
                    Score: {(s.score * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-teal-500 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(5, (s.score / maxScore) * 100))}%` }}
                  />
                </div>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {s.text.replace(/^#+\s*/gm, '')}
                </p>
              </article>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
