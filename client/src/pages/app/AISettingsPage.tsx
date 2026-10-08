import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Toggle } from '../../components/ui/Toggle';
import { useUIStore } from '../../store/useUIStore';
import { Sliders, Save, Bot, MessageSquare } from 'lucide-react';

export const AISettingsPage: React.FC = () => {
  const { addToast } = useUIStore();

  const [tone, setTone] = useState('Professional & Empathetic');
  const [emergencyEscalation, setEmergencyEscalation] = useState(true);
  const [phoneNotification, setPhoneNotification] = useState(true);

  const handleSave = () => {
    addToast({ type: 'success', title: 'AI Configuration Saved!' });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Sliders className="w-6 h-6 text-teal-600" />
            AI Persona & Escalation Rules
          </h1>
          <p className="text-xs text-slate-500">Configure how the AI receptionist communicates and escalates.</p>
        </div>

        <Button icon={Save} onClick={handleSave}>
          Save AI Settings
        </Button>
      </div>

      <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-6 max-w-3xl">
        <Select
          label="AI Conversation Tone"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
          options={[
            { value: 'Professional & Empathetic', label: 'Professional & Empathetic (Recommended for Dental)' },
            { value: 'Warm & Friendly', label: 'Warm & Friendly' },
            { value: 'Concise & Direct', label: 'Concise & Direct' },
          ]}
        />

        <Toggle
          checked={emergencyEscalation}
          onChange={setEmergencyEscalation}
          label="Enable Automatic Emergency Escalation"
          description="Detects severe pain or bleeding keywords and triggers urgent SMS alerts."
        />

        <Toggle
          checked={phoneNotification}
          onChange={setPhoneNotification}
          label="SMS Notification to On-Call Dentist"
          description="Send SMS to Dr. Krina Mehta (+1 555-234-5678) when human takeover is requested."
        />
      </div>
    </div>
  );
};
