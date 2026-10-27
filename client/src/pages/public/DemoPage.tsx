import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Send, Bot, Sparkles, RefreshCw } from 'lucide-react';

export const DemoPage: React.FC = () => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Hello! I am Dr. Krina Mehta’s AI Receptionist. I can answer questions about procedures, check pricing, or schedule your visit. How can I help?' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    const updated = [...messages, { sender: 'user', text: userMsg }];
    setMessages(updated);
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updated.map((m) => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
      });
      const data = await res.json();
      const reply = data.reply || "We have appointments open this week with Dr. Michael Vance. Would you like me to check available slots for you?";
      setMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'ai',
          text: "We have appointments open this week with Dr. Michael Vance. Would you like me to check available slots for you?",
        },
      ]);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">Live AI Receptionist Demo</h1>
        <p className="text-xs text-slate-400">Test how the AI receptionist handles patient questions in real time.</p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-teal-400" />
            <span className="font-bold text-white text-sm">SmileCare Dental AI Assistant</span>
          </div>
          <button
            onClick={() => setMessages([messages[0]])}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Demo
          </button>
        </div>

        <div className="h-80 overflow-y-auto space-y-3 p-3 bg-slate-950 rounded-2xl border border-slate-850">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-xs ${
                  m.sender === 'user'
                    ? 'bg-teal-600 text-white rounded-br-none'
                    : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your question (e.g. Do you accept Delta Dental?)"
            className="flex-1 bg-slate-950 border border-slate-800 text-xs text-white rounded-xl px-4 py-3 focus:outline-none focus:border-teal-500"
          />
          <Button onClick={handleSend} icon={Send}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
