import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { useUIStore } from '../../store/useUIStore';
import { ShieldCheck, UserPlus, Mail } from 'lucide-react';
import { UserRole } from '../../config/permissions';

export const TeamPage: React.FC = () => {
  const { addToast } = useUIStore();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const team = [
    { name: 'Dr. Krina Mehta', email: 'krina@smilecare.ai', role: 'OWNER', status: 'Active' },
    { name: 'Rahul Verma', email: 'reception@smilecare.ai', role: 'RECEPTIONIST', status: 'Active' },
    { name: 'Dr. Ananya Sharma', email: 'ananya@smilecare.ai', role: 'DENTIST', status: 'Active' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-teal-600" />
            Clinic Team & Role Management
          </h1>
          <p className="text-xs text-slate-500">Manage user access control and permissions matrix.</p>
        </div>

        <Button icon={UserPlus} onClick={() => setIsInviteOpen(true)}>
          Invite Team Member
        </Button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {team.map((m, idx) => (
              <tr key={idx} className="hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-900">{m.name}</td>
                <td className="p-4 text-slate-600">{m.email}</td>
                <td className="p-4">
                  <Badge variant="teal">{m.role}</Badge>
                </td>
                <td className="p-4">
                  <Badge variant="success">{m.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title="Invite Clinic Staff Member"
        description="Select role permissions for the new staff member."
      >
        <div className="space-y-4">
          <Input label="Full Name" placeholder="e.g. Rahul Sharma" />
          <Input label="Email Address" type="email" placeholder="rahul@smilecare.ai" />
          <Select
            label="Role"
            options={[
              { value: 'ADMIN', label: 'Admin (Full access except billing owner)' },
              { value: 'RECEPTIONIST', label: 'Receptionist (Inbox, Calendar, Patients)' },
              { value: 'DENTIST', label: 'Dentist (Own schedule & patient records)' },
            ]}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsInviteOpen(false);
                addToast({ type: 'success', title: 'Invitation Sent via Email!' });
              }}
            >
              Send Invite
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
