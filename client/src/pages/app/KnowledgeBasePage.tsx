import React, { useState } from 'react';
import { useKnowledgeGapsQuery } from '../../api/mockClient';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { useUIStore } from '../../store/useUIStore';
import { Brain, Upload, Plus, FileText, CheckCircle2, AlertTriangle, Sparkles, Send } from 'lucide-react';

export const KnowledgeBasePage: React.FC = () => {
  const { data: gaps = [] } = useKnowledgeGapsQuery();
  const { addToast } = useUIStore();

  const [testQuestion, setTestQuestion] = useState('');
  const [testAnswer, setTestAnswer] = useState<string | null>(null);

  const [faqs, setFaqs] = useState([
    { q: 'What insurance do you accept?', a: 'We accept Delta Dental, MetLife, Cigna, Guardian, and Aetna PPO plans.' },
    { q: 'Is emergency root canal covered?', a: 'Yes, emergency root canals are covered up to 80% under standard PPO insurance.' },
  ]);

  const [newQ, setNewQ] = useState('');
  const [newA, setNewA] = useState('');

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQ || !newA) return;
    setFaqs([...faqs, { q: newQ, a: newA }]);
    setNewQ('');
    setNewA('');
    addToast({ type: 'success', title: 'FAQ Added!', message: 'AI Knowledge Base updated.' });
  };

  const handleTestSubmit = () => {
    if (!testQuestion.trim()) return;
    setTestAnswer(`Based on your uploaded Fee Guide, ${testQuestion} is answered automatically using 98% AI confidence.`);
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
            Upload PDFs, add custom FAQ pairs, and resolve AI knowledge gaps.
          </p>
        </div>

        <Badge variant="teal" icon={<CheckCircle2 className="w-4 h-4" />}>
          AI Model Synced (14 Documents)
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Uploads & FAQ Pairs */}
        <div className="lg:col-span-8 space-y-6">
          {/* File Upload Box */}
          <div className="p-8 bg-white rounded-2xl border-2 border-dashed border-teal-300 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">Upload PDF / Fee Guides</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Drag & drop clinic fee schedules, insurance matrices, or consent forms (Max 25MB per document).
            </p>
            <Button size="sm" onClick={() => addToast({ type: 'success', title: 'File Uploaded!', message: 'AI training initiated.' })}>
              Select File to Upload
            </Button>
          </div>

          {/* Add FAQ Form */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Add Custom Question & Answer Pair</h3>
            <form onSubmit={handleAddFaq} className="space-y-3">
              <Input
                label="Question"
                placeholder="e.g. Do you offer teeth whitening touching up?"
                value={newQ}
                onChange={(e) => setNewQ(e.target.value)}
              />
              <textarea
                placeholder="Answer text..."
                value={newA}
                onChange={(e) => setNewA(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                rows={3}
              />
              <Button type="submit" size="sm" icon={Plus}>
                Train AI on Question
              </Button>
            </form>
          </div>

          {/* Existing Trained FAQs */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Trained FAQ Library</h3>
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                  <div className="font-bold text-slate-900">Q: {f.q}</div>
                  <div className="text-slate-600">A: {f.a}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Gaps & Test Sandbox */}
        <div className="lg:col-span-4 space-y-6">
          {/* Test Sandbox Box */}
          <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-4 border border-teal-500/30">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              Test This Knowledge Base
            </h3>
            <p className="text-xs text-slate-300">
              Type a hypothetical question to test if your AI answers correctly based on your knowledge base.
            </p>

            <div className="space-y-2">
              <input
                type="text"
                value={testQuestion}
                onChange={(e) => setTestQuestion(e.target.value)}
                placeholder="Ask a test question..."
                className="w-full text-xs p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none"
              />
              <Button size="sm" onClick={handleTestSubmit} className="w-full justify-center">
                Simulate Answer
              </Button>
            </div>

            {testAnswer && (
              <div className="p-3 rounded-xl bg-teal-950/60 border border-teal-800 text-xs text-teal-200 animate-fade-in">
                {testAnswer}
              </div>
            )}
          </div>

          {/* AI Unanswered Gaps */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Unanswered Gaps List
            </h3>
            <p className="text-xs text-slate-500">
              Questions patients asked that the AI couldn't answer yet.
            </p>

            <div className="space-y-2">
              {gaps.map((g, idx) => (
                <div key={idx} className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
                  <div className="text-xs font-bold text-amber-900">{g.question}</div>
                  <div className="text-[10px] text-amber-700 flex justify-between">
                    <span>Asked {g.count} times</span>
                    <button
                      onClick={() => {
                        setNewQ(g.question);
                        addToast({ type: 'info', title: 'Question copied to editor above' });
                      }}
                      className="font-bold underline cursor-pointer"
                    >
                      Add Answer →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
