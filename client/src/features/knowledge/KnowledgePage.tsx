import { useRef, useState } from 'react';
import { useKnowledgeQuery } from './hooks/useKnowledgeQuery';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  HiBookOpen,
  HiDocumentArrowUp,
  HiMagnifyingGlass,
  HiTrash,
  HiSparkles,
  HiDocumentText,
  HiCheckCircle,
} from 'react-icons/hi2';

export default function KnowledgePage() {
  const {
    docs,
    isLoading,
    isUploading,
    isDeleting,
    isSearching,
    searchResults: hits,
    upload,
    deleteDoc,
    search,
  } = useKnowledgeQuery();

  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(f?: File) {
    if (!f) return;
    setError('');
    try {
      await upload(f);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function runSearch() {
    if (!q.trim()) return;
    try {
      await search(q);
    } catch (e) {
      setError('Search test failed.');
    }
  }

  if (isLoading) {
    return <LoadingSpinner message="Loading RAG Knowledge Library…" />;
  }

  const totalChunks = docs.reduce((sum, d) => sum + d.chunks, 0);

  return (
    <div className="max-w-6xl mx-auto w-full p-6 md:p-10 flex flex-col gap-6 font-sans text-slate-800">
      {/* View Header */}
      <div>
        <div className="flex items-center gap-2">
          <HiBookOpen className="text-teal-600 text-2xl" />
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            RAG Knowledge Base & Clinical Index
          </h1>
        </div>
        <p className="text-xs md:text-sm text-slate-500 mt-1">
          Upload PDF or TXT clinic policy documents to train the AI receptionist for semantic RAG retrieval.
        </p>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-sm font-medium" role="alert">
          {error}
        </div>
      )}

      {/* Upload & Index Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Card */}
        <div className="md:col-span-2 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base font-heading">
              Upload New Knowledge Document
            </h3>
            <span className="text-xs text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200 font-semibold">
              PDF / TXT supported
            </span>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-teal-500 bg-slate-50/50 hover:bg-teal-50/20 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all group"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
              <HiDocumentArrowUp />
            </div>
            <div className="text-center">
              <span className="font-bold text-sm text-slate-800 group-hover:text-teal-600 transition">
                {isUploading ? 'Uploading and Chunking Document…' : 'Click to Upload Document'}
              </span>
              <p className="text-xs text-slate-400 mt-0.5">
                PDF or plain text clinic FAQs, guidelines, or procedure fees
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,.txt,.md"
              onChange={(e) => handleUpload(e.target.files?.[0])}
            />
          </div>
        </div>

        {/* Knowledge Stats Summary Card */}
        <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <HiSparkles className="text-teal-400 text-xl" />
              <h3 className="font-extrabold text-base font-heading">RAG Index Health</h3>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Total Documents:</span>
                <span className="font-extrabold text-teal-300 font-mono text-sm">{docs.length}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Indexed Passages:</span>
                <span className="font-extrabold text-teal-300 font-mono text-sm">{totalChunks}</span>
              </div>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 pt-4 border-t border-slate-800">
            Passages are parsed into 500-character chunks with overlap for semantic similarity matching.
          </div>
        </div>
      </div>

      {/* Interactive RAG Search Tester */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
        <h3 className="font-bold text-slate-900 text-base font-heading">
          Test Semantic RAG Search Engine
        </h3>
        <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 focus-within:border-teal-500 rounded-xl p-2.5">
          <HiMagnifyingGlass className="text-base text-slate-400 pl-1 shrink-0" />
          <input
            className="flex-1 bg-transparent text-xs md:text-sm text-slate-900 focus:outline-none"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && runSearch()}
            placeholder="Ask a question (e.g. 'How much is teeth whitening?') to test vector search…"
          />
          <button
            onClick={runSearch}
            disabled={isSearching}
            className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition cursor-pointer disabled:opacity-50"
          >
            {isSearching ? 'Searching…' : 'Search RAG'}
          </button>
        </div>

        {hits && (
          <div className="flex flex-col gap-2 pt-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Top Matched Passages:
            </span>
            <div className="divide-y divide-slate-100 bg-slate-50 rounded-xl border border-slate-200 p-3">
              {hits.map((h, i) => (
                <div key={i} className="py-2.5 flex flex-col gap-1 text-xs">
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="font-bold text-teal-700 font-mono">Source: {h.source}</span>
                    <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded text-[10px] font-bold">
                      Match Score: {(h.score * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-slate-700 font-sans italic">"{h.text}"</p>
                </div>
              ))}
              {hits.length === 0 && (
                <div className="text-slate-400 text-xs text-center py-3">
                  No matching passages found for your search query.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Document Library Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm font-heading">Indexed Document Library</h3>
          <span className="text-xs text-slate-500">{docs.length} documents uploaded</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="p-4">Document Title</th>
                <th className="p-4">Total Characters</th>
                <th className="p-4">Vector Passages</th>
                <th className="p-4">Upload Timestamp</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs md:text-sm">
              {docs.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-bold text-slate-900 flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xs shrink-0">
                      <HiDocumentText />
                    </div>
                    <span>{d.name}</span>
                  </td>
                  <td className="p-4 text-slate-600 font-mono text-xs">
                    {d.chars.toLocaleString()} chars
                  </td>
                  <td className="p-4">
                    <span className="bg-teal-50 text-teal-800 border border-teal-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {d.chunks} chunks
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 text-xs">
                    {new Date(d.addedAt).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => deleteDoc(d.id)}
                      disabled={isDeleting}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                      title="Delete Document"
                    >
                      <HiTrash className="text-base" />
                    </button>
                  </td>
                </tr>
              ))}
              {docs.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-slate-400 text-sm">
                    No documents uploaded yet. Upload a PDF or TXT file above to populate the knowledge base!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
