import { useEffect, useState } from 'react';
import { api, type ConversationLog } from '../api';

export default function Conversations() {
  const [list, setList] = useState<ConversationLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.conversations()
      .then(setList)
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-5xl mx-auto w-full p-8 flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Conversation Logs & Summaries</h1>
        <p className="text-sm text-slate-500 mt-1">
          Automated summaries generated after patient AI receptionist interactions (Section 12 of Project Plan).
        </p>
      </div>

      {/* Conversations Cards List */}
      <div className="flex flex-col gap-4">
        {list.map((c) => (
          <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 font-extrabold text-lg flex items-center justify-center">
                  📝
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Patient: {c.patientName}</h3>
                  <div className="text-xs text-slate-500">📞 {c.patientPhone} • {c.date} ({c.time})</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full">
                  Intent: {c.intent}
                </span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${c.status === 'Confirmed' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : c.status === 'Transferred' ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-blue-50 text-blue-800 border-blue-200'}`}>
                  {c.status}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3.5 text-xs text-slate-700 leading-relaxed">
              <strong className="text-slate-900 block mb-1">🤖 AI Conversation Summary:</strong>
              {c.summary}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Assigned Doctor: <strong>{c.dentistName}</strong></span>
              <span>Logged at {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
