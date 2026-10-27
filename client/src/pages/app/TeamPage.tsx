import React, { useState } from 'react';
import { useTeamUsers } from '../../features/team/hooks/useTeamUsers';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { useUIStore } from '../../store/useUIStore';
import { ShieldCheck, UserPlus, Mail, Users } from 'lucide-react';
import { UserRole } from '../../config/permissions';

export const TeamPage: React.FC = () => {
  const { data: team = [], isLoading, isError, refetch } = useTeamUsers();
  const { addToast } = useUIStore();
  const [isInviteOpen, setIsInviteOpen] = useState(false);

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

      {isLoading && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      )}

      {!isLoading && isError && (
        <ErrorState
          title="Failed to load clinic team members"
          message="Could not retrieve the staff roster for this clinic."
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && team.length === 0 && (
        <EmptyState
          icon={Users}
          title="No Team Members Found"
          description="Your clinic has no registered staff yet. Invite team members to collaborate."
          actionLabel="Invite Team Member"
          onAction={() => setIsInviteOpen(true)}
          actionIcon={UserPlus}
        />
      )}

      {!isLoading && !isError && team.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden h-[420px] flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase sticky top-0 z-10 shadow-2xs">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {team.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50">
                    <td className="p-4 font-bold text-slate-900">{m.name}</td>
                    <td className="p-4 text-slate-600">{m.email}</td>
                    <td className="p-4">
                      <Badge variant="teal">{m.role}</Badge>
                    </td>
                    <td className="p-4">
                      <Badge variant="success">{m.status || 'Active'}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
