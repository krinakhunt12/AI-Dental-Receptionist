import { useEffect, useState } from 'react';
import { api, type Health } from './api';
import Analytics from './views/Analytics';
import Appointments from './views/Appointments';
import Chat from './views/Chat';
import Conversations from './views/Conversations';
import Dashboard from './views/Dashboard';
import Dentists from './views/Dentists';
import Knowledge from './views/Knowledge';
import Patients from './views/Patients';
import Services from './views/Services';

type Tab =
  | 'dashboard'
  | 'chat'
  | 'appointments'
  | 'dentists'
  | 'services'
  | 'patients'
  | 'conversations'
  | 'knowledge'
  | 'analytics';

export default function App() {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [health, setHealth] = useState<Health | null>(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    api.health().then(setHealth).catch(() => setOffline(true));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-900">
      {/* Sidebar Navigation Rail */}
      <aside className="bg-slate-900 text-slate-300 p-5 flex flex-col gap-6 border-r border-slate-800 select-none overflow-y-auto">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 cursor-pointer" onClick={() => setTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-xl shadow-lg shadow-teal-900/40 shrink-0">
            🦷
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg text-slate-100 leading-tight">
              {health?.clinic ?? 'SmileCare'}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-teal-400 font-bold">
              AI Receptionist
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex flex-col gap-1" aria-label="Main Navigation">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3.5 mb-1">
            Clinic Operations
          </div>

          <button
            className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 text-left ${tab === 'dashboard'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-900/30'
                : 'hover:bg-slate-800 hover:text-slate-100 text-slate-400'
              }`}
            onClick={() => setTab('dashboard')}
          >
            <span className="text-base">📊</span>
            <span>Dashboard</span>
          </button>

          <button
            className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 text-left ${tab === 'chat'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-900/30'
                : 'hover:bg-slate-800 hover:text-slate-100 text-slate-400'
              }`}
            onClick={() => setTab('chat')}
          >
            <span className="text-base">💬</span>
            <span>Patient AI Chat & Voice</span>
          </button>

          <button
            className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 text-left ${tab === 'appointments'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-900/30'
                : 'hover:bg-slate-800 hover:text-slate-100 text-slate-400'
              }`}
            onClick={() => setTab('appointments')}
          >
            <span className="text-base">📅</span>
            <span>Appointments</span>
          </button>

          <button
            className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 text-left ${tab === 'dentists'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-900/30'
                : 'hover:bg-slate-800 hover:text-slate-100 text-slate-400'
              }`}
            onClick={() => setTab('dentists')}
          >
            <span className="text-base">👨‍⚕️</span>
            <span>Dentists</span>
          </button>

          <button
            className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 text-left ${tab === 'services'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-900/30'
                : 'hover:bg-slate-800 hover:text-slate-100 text-slate-400'
              }`}
            onClick={() => setTab('services')}
          >
            <span className="text-base">🦷</span>
            <span>Services & Prices</span>
          </button>

          <button
            className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 text-left ${tab === 'patients'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-900/30'
                : 'hover:bg-slate-800 hover:text-slate-100 text-slate-400'
              }`}
            onClick={() => setTab('patients')}
          >
            <span className="text-base">👤</span>
            <span>Patients</span>
          </button>

          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3.5 mt-3 mb-1">
            AI Engine & Data
          </div>

          <button
            className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 text-left ${tab === 'conversations'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-900/30'
                : 'hover:bg-slate-800 hover:text-slate-100 text-slate-400'
              }`}
            onClick={() => setTab('conversations')}
          >
            <span className="text-base">📝</span>
            <span>AI Summaries & Logs</span>
          </button>

          <button
            className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 text-left ${tab === 'knowledge'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-900/30'
                : 'hover:bg-slate-800 hover:text-slate-100 text-slate-400'
              }`}
            onClick={() => setTab('knowledge')}
          >
            <span className="text-base">📚</span>
            <span>Knowledge Base (RAG)</span>
          </button>

          <button
            className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 text-left ${tab === 'analytics'
                ? 'bg-teal-600 text-white shadow-md shadow-teal-900/30'
                : 'hover:bg-slate-800 hover:text-slate-100 text-slate-400'
              }`}
            onClick={() => setTab('analytics')}
          >
            <span className="text-base">📈</span>
            <span>Analytics</span>
          </button>
        </nav>

        {/* System Status Footer */}
        <div className="mt-auto bg-slate-800/60 border border-slate-700/50 rounded-xl p-3.5 text-xs flex flex-col gap-2.5">
          {offline ? (
            <div className="flex items-center gap-2.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
              <div>
                <div className="font-semibold text-slate-200">Server Offline</div>
                <div className="text-[11px] text-slate-400">Run <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-400">npm run dev</code></div>
              </div>
            </div>
          ) : health ? (
            <>
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${health.llm.startsWith('demo') ? 'bg-amber-400 shadow-sm shadow-amber-400/50' : 'bg-emerald-400 shadow-sm shadow-emerald-400/50'}`} />
                <div className="min-w-0">
                  <div className="font-semibold text-slate-200 truncate">{health.llm.startsWith('demo') ? 'Free AI Engine' : health.llm}</div>
                  <div className="text-[11px] text-slate-400">{health.llm.startsWith('demo') ? 'Built-in smart agent' : 'Active Claude Agent'}</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-1.5 border-t border-slate-700/40">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-slate-200">Vector Search</div>
                  <div className="text-[11px] text-slate-400 truncate">{health.retrieval === 'local' ? 'Transformers.js embeddings' : 'BM25 Keyword search'}</div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 text-slate-400">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
              <span>Connecting to backend…</span>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Stage */}
      <main className="overflow-y-auto min-w-0 flex flex-col h-full bg-slate-50">
        {tab === 'dashboard' && <Dashboard onNavigate={(t) => setTab(t)} />}
        {tab === 'chat' && <Chat />}
        {tab === 'appointments' && <Appointments />}
        {tab === 'dentists' && <Dentists />}
        {tab === 'services' && <Services />}
        {tab === 'patients' && <Patients />}
        {tab === 'conversations' && <Conversations />}
        {tab === 'knowledge' && <Knowledge />}
        {tab === 'analytics' && <Analytics />}
      </main>
    </div>
  );
}
