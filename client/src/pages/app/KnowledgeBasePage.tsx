import React, { useState } from 'react';
import {
  useKnowledgeDocs,
  useAddKnowledgeDoc,
  useDeleteKnowledgeDoc,
  useSearchKnowledge,
} from '../../features/knowledge/hooks/useKnowledge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { useUIStore } from '../../store/useUIStore';
import { Brain, Upload, Plus, FileText, CheckCircle2, Trash2, Sparkles, Send } from 'lucide-react';

export const KnowledgeBasePage: React.FC = () => {
  const { data: docs = [], isLoading, isError, refetch } = useKnowledgeDocs();
  const addDocMut = useAddKnowledgeDoc();
  const deleteDocMut = useDeleteKnowledgeDoc();
  const { addToast } = useUIStore();

  const [testQuestion, setTestQuestion] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const { data: searchResults = [], isLoading: isSearching } = useSearchKnowledge(activeSearch);

  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQ.trim() || !newA.trim()) return;
    try {
      await addDocMut.mutateAsync({
        name: `FAQ: ${newQ.slice(0, 35)}...`,
        question: newQ,
        answer: newA,
        text: `Question: ${newQ}\nAnswer: ${newA}`,
      });
      setNewQ('');
      setNewA('');
      addToast({ type: 'success', title: 'FAQ Added!', message: 'AI Knowledge Base updated and indexed.' });
    } catch {
      addToast({ type: 'error', title: 'Error adding FAQ', message: 'Could not update knowledge base.' });
    }
  };

  const handleTestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQuestion.trim()) return;
    setActiveSearch(testQuestion.trim());
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDocMut.mutateAsync(id);
      addToast({ type: 'info', title: 'Document removed', message: 'Indexed passages updated.' });
    } catch {
      addToast({ type: 'error', title: 'Error deleting', message: 'Failed to delete knowledge document.' });
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Brain className="w-6 h-6 text-teal-600" />
            Train Your Dental AI Knowledge Base
          </h1>
          <p className="text-xs text-slate-500">
            Manage clinic knowledge documents, add custom FAQ pairs, and test semantic retrieval against live RAG.
          </p>
        </div>

        <Badge variant="teal" icon={<CheckCircle2 className="w-4 h-4" />}>
          RAG Vector Index Synced ({docs.length} Documents)
        </Badge>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      )}

      {isError && (
        <ErrorState
          title="Failed to load knowledge base"
          message="Could not connect to the clinic knowledge repository."
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Uploads & FAQ Pairs */}
          <div className="lg:col-span-8 space-y-6">
            {/* Add FAQ Form */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900">Add Custom Question & Answer Pair</h3>
              <form onSubmit={handleAddFaq} className="space-y-3">
                <Input
                  label="Patient Question"
                  placeholder="e.g. Do you accept Delta Dental insurance?"
                  value={newQ}
                  onChange={(e) => setNewQ(e.target.value)}
                  required
                />
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Verified Clinic Answer
                  </label>
                  <textarea
                    placeholder="e.g. Yes, we accept Delta Dental PPO, MetLife, and Cigna. Co-pay is determined after checking your policy."
                    value={newA}
                    onChange={(e) => setNewA(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                    rows={3}
                    required
                  />
                </div>
                <Button type="submit" size="sm" icon={Plus} isLoading={addDocMut.isPending}>
                  Train AI on Question
                </Button>
              </form>
            </div>

            {/* Existing Trained Documents & FAQs */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 h-[420px] flex flex-col shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 shrink-0">
                <h3 className="text-sm font-bold text-slate-900">
                  Trained Documents & FAQ Library ({docs.length})
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 space-y-3 mt-3">
                {docs.length === 0 ? (
                  <EmptyState
                    icon={FileText}
                    title="No knowledge documents yet"
                    description="Add FAQ pairs or clinical policies above to train your AI receptionist."
                  />
                ) : (
                  docs.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 flex items-start justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                          <h4 className="text-xs font-bold text-slate-900 truncate">{doc.name}</h4>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {doc.chars} characters • {doc.chunks} semantic chunk{doc.chunks !== 1 ? 's' : ''} • Added {new Date(doc.addedAt).toLocaleDateString()}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5 transition-colors cursor-pointer"
                        title="Delete Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column: AI Test Sandbox */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-xs h-[560px] flex flex-col">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">RAG Semantic Search Test</h3>
              </div>
              <p className="text-xs text-slate-500">
                Ask a test question to verify what facts the AI receptionist retrieves from your indexed knowledge base.
              </p>

              <form onSubmit={handleTestSubmit} className="space-y-3">
                <Input
                  placeholder="e.g. Does insurance cover root canals?"
                  value={testQuestion}
                  onChange={(e) => setTestQuestion(e.target.value)}
                />
                <Button type="submit" size="sm" icon={Send} className="w-full justify-center" isLoading={isSearching}>
                  Test Retrieval
                </Button>
              </form>

              {activeSearch && (
                <div className="flex-1 overflow-y-auto mt-2 space-y-2 border-t border-slate-100 pt-3">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Retrieved Knowledge Passages ({searchResults.length}):
                  </span>
                  {searchResults.length === 0 ? (
                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-500 italic">
                      No matching passages found for "{activeSearch}". Try adding an FAQ or policy covering this topic.
                    </div>
                  ) : (
                    searchResults.map((hit, idx) => (
                      <div key={idx} className="p-3 bg-teal-50/50 rounded-xl border border-teal-100 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-bold text-teal-700">
                          <span className="truncate max-w-[180px]">{hit.source}</span>
                          <span>Score: {Math.round(hit.score * 100)}%</span>
                        </div>
                        <p className="text-slate-700 leading-relaxed text-[11px]">{hit.text}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
