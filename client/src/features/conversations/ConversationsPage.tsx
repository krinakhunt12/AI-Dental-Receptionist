import { useConversationsQuery } from './hooks/useConversationsQuery';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  HiDocumentText,
  HiPhone,
  HiSparkles,
  HiClock,
} from 'react-icons/hi2';

export default function ConversationsPage() {
  const { conversations: list, isLoading } = useConversationsQuery();

  if (isLoading) {
    return <LoadingSpinner message="Loading AI Call Logs…" />;
  }

  return (
    <div className="max-w-6xl mx-auto w-full p-6 md:p-10 flex flex-col gap-6 font-sans text-slate-800">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <HiDocumentText className="text-teal-600 text-2xl" />
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            AI Conversation Logs & Summaries
          </h1>
        </div>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Automated summaries generated after patient AI receptionist interactions.
        </p>
      </div>

      {/* Conversations Cards List */}
      <div className="flex flex-col gap-4">
        {list.map((c) => (
          <div
            key={c.id}
            className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col gap-3 hover:shadow-md transition-all"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 font-extrabold text-lg flex items-center justify-center shrink-0">
                  <HiDocumentText />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base font-heading">
                    Patient: {c.patientName}
                  </h3>
                  <div className="text-xs text-slate-500 flex items-center gap-2 font-mono mt-0.5">
                    <span className="flex items-center gap-1">
                      <HiPhone />
                      <span>{c.patientPhone}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <HiClock />
                      <span>{c.date} ({c.time})</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
                  Intent: {c.intent}
                </span>
                <span
                  className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                    c.status === 'Confirmed'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      : c.status === 'Transferred'
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-blue-50 text-blue-800 border-blue-200'
                  }`}
                >
                  {c.status}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 text-xs text-slate-700 leading-relaxed">
              <div className="flex items-center gap-1.5 text-slate-900 font-bold mb-1">
                <HiSparkles className="text-teal-600 text-base" />
                <span>AI Conversation Summary:</span>
              </div>
              <p>{c.summary}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>
                Assigned Doctor: <strong className="text-slate-800">{c.dentistName}</strong>
              </span>
              <span>
                Logged at{' '}
                {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-400">
            No conversation logs recorded yet.
          </div>
        )}
      </div>
    </div>
  );
}
