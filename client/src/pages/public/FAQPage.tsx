import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Search } from 'lucide-react';
import { Input } from '../../components/ui/Input';

export const FAQPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Is SmileCare AI HIPAA compliant?',
      a: 'Yes! All patient conversation data, phone audio logs, and appointment records are encrypted with AES-256 at rest and TLS 1.3 in transit with strict HIPAA BAA agreements.',
    },
    {
      q: 'Which practice management software (PMS) do you integrate with?',
      a: 'We support 2-way sync with Google Calendar, Dentrix, Open Dental, Eaglesoft, and Curve Dental.',
    },
    {
      q: 'What happens when a patient reports an emergency toothache?',
      a: 'The AI immediately detects severe pain or swelling symptoms and triggers an instant SMS alert to your designated on-call dentist while offering an immediate emergency slot.',
    },
    {
      q: 'Can I train the AI on my clinic’s custom fees and insurance rules?',
      a: 'Absolutely. Upload your fee PDFs, insurance matrix, or FAQ documents in the Knowledge Base tab and the AI will update its knowledge within seconds.',
    },
    {
      q: 'Do I need a credit card to start the 14-day free trial?',
      a: 'No credit card is required! You can test all Growth Pro features risk-free for 14 days.',
    },
  ];

  const filtered = faqs.filter(
    (f) => f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Frequently Asked Questions</h1>
        <p className="text-xs text-slate-400">Everything you need to know about SmileCare AI.</p>
      </div>

      <div className="max-w-md mx-auto">
        <Input
          icon={Search}
          placeholder="Search questions..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filtered.map((item, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full text-left p-5 flex items-center justify-between font-bold text-white text-sm cursor-pointer"
              >
                <span>{item.q}</span>
                <ChevronDown className={`w-5 h-5 text-teal-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
