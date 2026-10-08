import React, { useState } from 'react';
import { useTenant } from '../../app/TenantProvider';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Tabs } from '../../components/ui/Tabs';
import { useUIStore } from '../../store/useUIStore';
import { Code2, Copy, Check, Palette, Globe, Bot } from 'lucide-react';

export const WidgetPage: React.FC = () => {
  const { tenant, updateBrandColor } = useTenant();
  const { addToast } = useUIStore();

  const [greetingText, setGreetingText] = useState('Hi! Welcome to SmileCare Dental. How can I assist you?');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('html');

  const snippetCode = `<script src="https://cdn.smilecare.ai/widget.v2.js" data-clinic-id="${tenant.id}" data-color="${tenant.brandColor}"></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(snippetCode);
    setCopied(true);
    addToast({ type: 'success', title: 'Script Copied!', message: 'Paste into your website HTML before </body>.' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Code2 className="w-6 h-6 text-teal-600" />
          Widget Studio & Embed Customizer
        </h1>
        <p className="text-xs text-slate-500">
          Customize your AI chat widget aesthetics and copy script snippet for installation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Customizer Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-teal-600" />
              Brand Color & Greeting
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Primary Brand Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={tenant.brandColor || '#0d9488'}
                    onChange={(e) => updateBrandColor(e.target.value)}
                    className="w-10 h-10 rounded-xl border border-slate-200 cursor-pointer"
                  />
                  <Input
                    value={tenant.brandColor}
                    onChange={(e) => updateBrandColor(e.target.value)}
                    className="flex-1 font-mono text-xs"
                  />
                </div>
              </div>

              <Input
                label="Widget Initial Greeting"
                value={greetingText}
                onChange={(e) => setGreetingText(e.target.value)}
              />
            </div>
          </div>

          {/* Copy Script Box */}
          <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-3 border border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Embed Script Snippet</h3>
              <Button size="sm" onClick={handleCopy} icon={copied ? Check : Copy}>
                {copied ? 'Copied!' : 'Copy Code'}
              </Button>
            </div>

            <pre className="p-4 bg-slate-950 rounded-xl font-mono text-xs text-teal-300 overflow-x-auto border border-slate-850">
              {snippetCode}
            </pre>
          </div>
        </div>

        {/* Right: Live Widget Preview */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-80 h-[480px] bg-slate-900 rounded-3xl p-4 border-4 border-slate-800 shadow-2xl flex flex-col justify-between relative overflow-hidden">
            <div
              className="p-4 rounded-2xl text-white flex items-center gap-3"
              style={{ backgroundColor: tenant.brandColor || '#0d9488' }}
            >
              <Bot className="w-6 h-6" />
              <div>
                <h4 className="font-bold text-sm">{tenant.name}</h4>
                <p className="text-[10px] opacity-80">24/7 AI Receptionist</p>
              </div>
            </div>

            <div className="flex-1 p-3 space-y-2 overflow-y-auto">
              <div className="bg-slate-800 text-slate-200 p-3 rounded-xl text-xs max-w-[85%]">
                {greetingText}
              </div>
            </div>

            <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 bg-transparent text-xs text-white focus:outline-none"
                disabled
              />
              <button
                className="p-2 rounded-lg text-white font-bold text-xs"
                style={{ backgroundColor: tenant.brandColor || '#0d9488' }}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
