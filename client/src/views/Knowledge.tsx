import { useEffect, useRef, useState } from 'react';
import { api, type Doc, type Source } from '../api';

export default function Knowledge() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<Source[] | null>(null);
  const [searching, setSearching] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = () => api.docs().then(setDocs).catch((e) => setError(e.message));
  
  useEffect(() => {
    load();
  }, []);

  async function upload(f?: File) {
    if (!f) return;
    setBusy(true);
    setError('');
    try {
      await api.upload(f);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function runSearch() {
    if (!q.trim()) return;
    setSearching(true);
    try {
      const results = await api.search(q);
      setHits(results);
    } catch (e) {
      setError('Search test failed.');
    } finally {
      setSearching(false);
    }
  }

  const totalChunks = docs.reduce((sum, d) => sum + d.chunks, 0);

  return (
    <div className="max-w-5xl mx-auto w-full p-8 flex flex-col gap-6">
      {/* View Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Knowledge Base Management</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage documents the AI receptionist relies on for RAG vector search, pricing inquiries, and clinic policies.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center text-xl shrink-0">
            📑
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-slate-900 leading-tight">{docs.length}</span>
            <span className="text-xs text-slate-500 font-medium">Indexed Documents</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center text-xl shrink-0">
            🧩
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-slate-900 leading-tight">{totalChunks}</span>
            <span className="text-xs text-slate-500 font-medium">Vector Passages</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center text-xl shrink-0">
            ⚡
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900 leading-tight">PDF, MD, TXT</span>
            <span className="text-xs text-slate-500 font-medium">Supported Formats</span>
          </div>
        </div>
      </div>

      {/* Upload Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.md,.txt"
          hidden
          onChange={(e) => upload(e.target.files?.[0])}
        />
        <button
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold text-sm shadow-md shadow-teal-600/20 transition-all flex items-center gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={busy}
        >
          <span>{busy ? '⏳ Chunking & Indexing…' : '📤 Upload New Document'}</span>
        </button>
        <span className="text-xs text-slate-500 font-medium">
          Supported formats: PDF, Markdown, or Plain Text (max 10MB)
        </span>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-sm font-medium" role="alert">
          {error}
        </div>
      )}

      {/* Documents Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="p-4">Document Name</th>
              <th className="p-4">Chunks Indexed</th>
              <th className="p-4">Date Added</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-sm">
            {docs.map((d) => (
              <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="p-4 font-semibold text-slate-900 flex items-center gap-2">
                  <span>{d.name.endsWith('.pdf') ? '📕' : d.name.endsWith('.md') ? '📘' : '📄'}</span>
                  <span>{d.name}</span>
                </td>
                <td className="p-4">
                  <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200">
                    {d.chunks} passages
                  </span>
                </td>
                <td className="p-4 text-slate-500 text-xs">
                  {new Date(d.addedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>
                <td className="p-4 text-right">
                  <button
                    className="text-rose-600 hover:text-rose-800 font-semibold text-xs transition-colors"
                    onClick={() => api.deleteDoc(d.id).then(load)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
            {docs.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center p-8 text-slate-400 text-sm">
                  No documents in knowledge base yet. Upload a clinic document or policy to enable vector search!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Vector Retrieval Sandbox / Search Tester */}
      <section className="mt-4 flex flex-col gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Vector Retrieval Sandbox</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Simulate how the assistant queries the vector store to extract relevant knowledge passages.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white border border-slate-200 focus-within:border-teal-500 focus-within:ring-3 focus-within:ring-teal-500/15 rounded-xl p-2.5 shadow-xs transition-all">
          <span className="text-base text-slate-400 pl-1">🔍</span>
          <input
            className="flex-1 bg-transparent text-sm text-slate-900 focus:outline-none"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSearch()}
            placeholder="Type a test query (e.g. 'whitening procedure details' or 'cancellation policy')"
          />
          <button
            className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-all disabled:opacity-50"
            onClick={runSearch}
            disabled={searching || !q.trim()}
          >
            {searching ? 'Searching…' : 'Search'}
          </button>
        </div>

        {hits && (
          <div className="flex flex-col gap-3">
            {hits.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No vector passages matched your query.</p>
            ) : (
              hits.map((h, i) => (
                <article key={i} className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col gap-2">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800 flex items-center gap-1.5">📄 {h.source}</span>
                    <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200/60">
                      Match Score: {(h.score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: `${Math.min(100, Math.max(5, h.score * 100))}%` }} />
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{h.text.replace(/^#+\s*/gm, '')}</p>
                </article>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
}
