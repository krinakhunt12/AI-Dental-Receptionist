import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../../store/useUIStore';
import { Search, Calendar, Users, MessageSquare, Settings, User, FileText, ArrowRight, X } from 'lucide-react';

export const CommandPalette: React.FC = () => {
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const items = [
    { title: 'Overview Dashboard', category: 'Navigation', icon: Search, path: '/app' },
    { title: 'Conversations & Inbox', category: 'Navigation', icon: MessageSquare, path: '/app/conversations' },
    { title: 'Appointments Calendar', category: 'Navigation', icon: Calendar, path: '/app/appointments' },
    { title: 'Patients Directory', category: 'Navigation', icon: Users, path: '/app/patients' },
    { title: 'Train AI Knowledge Base', category: 'Manage', icon: FileText, path: '/app/knowledge-base' },
    { title: 'Widget Studio', category: 'Account', icon: Settings, path: '/app/widget' },
    { title: 'Billing & Subscriptions', category: 'Account', icon: Settings, path: '/app/billing' },
    // Mock patient search results
    { title: 'Priya Sharma (Patient Profile)', category: 'Patient', icon: User, path: '/app/patients/pat_101' },
    { title: 'Rahul Verma (Root Canal Booking)', category: 'Appointment', icon: Calendar, path: '/app/appointments' },
  ];

  const filtered = items.filter((i) =>
    i.title.toLowerCase().includes(query.toLowerCase()) ||
    i.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    setCommandPaletteOpen(false);
    setQuery('');
    navigate(path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setCommandPaletteOpen(false)}
      />

      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in z-10">
        <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command or search patients, appointments, pages... (Cmd+K)"
            className="flex-1 text-sm bg-transparent border-none text-slate-900 dark:text-slate-100 focus:outline-none placeholder-slate-400"
            autoFocus
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">No matching commands or records found.</div>
          ) : (
            filtered.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSelect(item.path)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-teal-50 dark:hover:bg-slate-800 cursor-pointer group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-teal-100 dark:group-hover:bg-teal-900/40 text-slate-600 dark:text-slate-300 group-hover:text-teal-700">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-teal-700 dark:group-hover:text-teal-400">
                      {item.title}
                    </span>
                    <span className="ml-2 text-[11px] text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
