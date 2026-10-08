import React from 'react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useUIStore } from '../../store/useUIStore';
import { Megaphone, Plus, MessageCircle, Send, CheckCircle2, Calendar } from 'lucide-react';

export const CampaignsPage: React.FC = () => {
  const { addToast } = useUIStore();

  const campaigns = [
    {
      name: '24h Pre-Appointment Confirmation',
      channel: 'WhatsApp & SMS',
      trigger: '24 hours before appointment',
      status: 'Active',
      sent: 412,
      confirmed: '94%',
    },
    {
      name: '6-Month Hygiene Recall Reminder',
      channel: 'SMS',
      trigger: '180 days after last cleaning',
      status: 'Active',
      sent: 184,
      confirmed: '38%',
    },
    {
      name: 'No-Show Followup & Reschedule',
      channel: 'WhatsApp',
      trigger: '2 hours after missed appointment',
      status: 'Active',
      sent: 28,
      confirmed: '62%',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-teal-600" />
            Reminders & Recalls Campaigns
          </h1>
          <p className="text-xs text-slate-500">Automate SMS and WhatsApp patient outreach workflows.</p>
        </div>

        <Button size="sm" icon={Plus} onClick={() => addToast({ type: 'info', title: 'Create Campaign Modal' })}>
          Create New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {campaigns.map((c, idx) => (
          <div key={idx} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="teal">{c.channel}</Badge>
              <Badge variant="success">{c.status}</Badge>
            </div>

            <h3 className="text-base font-bold text-slate-900">{c.name}</h3>
            <p className="text-xs text-slate-500">Trigger: {c.trigger}</p>

            <div className="p-3 bg-slate-50 rounded-xl flex justify-between text-xs font-bold">
              <div>
                <span className="text-slate-500 font-medium block">Total Sent</span>
                <span className="text-slate-900 text-sm">{c.sent}</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 font-medium block">Conversion</span>
                <span className="text-teal-600 text-sm">{c.confirmed}</span>
              </div>
            </div>

            <Button size="sm" variant="outline" className="w-full justify-center">
              Edit Campaign Rules
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
