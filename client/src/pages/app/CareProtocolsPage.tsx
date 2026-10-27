import React, { useState } from 'react';
import {
  useCareProtocols,
  useApproveProtocol,
  useUpdateCareProtocol,
  useAddInstruction,
} from '../../features/careProtocols/api';
import { useTreatments } from '../../features/treatments/api';
import { useAuth } from '../../app/AuthProvider';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Drawer } from '../../components/ui/Drawer';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { useUIStore } from '../../store/useUIStore';
import { CareProtocol, CareProtocolStatus, CareInstruction, CarePhase, CareCategory } from '../../types';
import {
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Plus,
  Filter,
  ShieldAlert,
  Edit3,
  Check,
  Info,
  Calendar,
  Layers,
} from 'lucide-react';

export const CareProtocolsPage: React.FC = () => {
  const { user } = useAuth();
  const { addToast } = useUIStore();

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [treatmentFilter, setTreatmentFilter] = useState<string>('ALL');

  const { data: treatments = [] } = useTreatments();
  const {
    data: protocols = [],
    isLoading,
    isError,
    refetch,
  } = useCareProtocols({
    status: statusFilter === 'ALL' ? undefined : (statusFilter as CareProtocolStatus),
    treatmentId: treatmentFilter === 'ALL' ? undefined : treatmentFilter,
  });

  const approveMutation = useApproveProtocol();
  const updateProtocolMutation = useUpdateCareProtocol();
  const addInstructionMutation = useAddInstruction();

  // Selected for View / Edit Drawer
  const [selectedProtocol, setSelectedProtocol] = useState<CareProtocol | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');

  // New instruction form
  const [isAddingInst, setIsAddingInst] = useState(false);
  const [instTitle, setInstTitle] = useState('');
  const [instBody, setInstBody] = useState('');
  const [instPhase, setInstPhase] = useState<CarePhase>('POST_OP');
  const [instCategory, setInstCategory] = useState<CareCategory>('HYGIENE');
  const [instOffset, setInstOffset] = useState<number>(120);
  const [instCritical, setInstCritical] = useState<boolean>(false);

  // Approve Confirm Dialog
  const [protocolToApprove, setProtocolToApprove] = useState<CareProtocol | null>(null);

  // Check if current user is authorized to approve: DOCTOR/DENTIST or CLINIC_OWNER/OWNER or ADMIN
  const canApprove =
    user?.role === 'DENTIST' ||
    user?.role === 'OWNER' ||
    user?.role === 'ADMIN' ||
    (user as any)?.role === 'CLINIC_OWNER' ||
    (user as any)?.role === 'DOCTOR';

  // Helper to validate whether protocol has placeholder strings in instructions
  const checkPlaceholders = (proto: CareProtocol): string[] => {
    const placeholders: string[] = [];
    const placeholderRegex = /\[(NPO_HOURS|TIME|HOURS|FASTING|TODO|TBD|X)\]|TODO|TBD/i;

    (proto.instructions || []).forEach((inst) => {
      if (placeholderRegex.test(inst.body) || placeholderRegex.test(inst.title)) {
        placeholders.push(`"${inst.title}": Contains unresolved template placeholder (${inst.body.match(placeholderRegex)?.[0] || 'TODO'})`);
      }
      if (inst.category === 'FASTING' && (!inst.body || inst.body.trim().length < 5)) {
        placeholders.push(`"${inst.title}": Fasting/NPO timing details are required.`);
      }
    });

    return placeholders;
  };

  const handleOpenDrawer = (proto: CareProtocol) => {
    setSelectedProtocol(proto);
    setEditName(proto.name);
    setIsEditing(false);
    setIsAddingInst(false);
  };

  const handleSaveProtocol = () => {
    if (!selectedProtocol) return;
    updateProtocolMutation.mutate(
      { id: selectedProtocol.id, data: { name: editName } },
      {
        onSuccess: (updated) => {
          addToast({
            type: 'success',
            title: 'Protocol Updated',
            message:
              selectedProtocol.status === 'APPROVED'
                ? `Created draft version ${selectedProtocol.version + 1}. Version ${selectedProtocol.version} remains active.`
                : 'Protocol changes saved.',
          });
          setIsEditing(false);
          setSelectedProtocol({ ...selectedProtocol, name: editName });
        },
        onError: (err: any) => {
          addToast({
            type: 'error',
            title: 'Update Failed',
            message: err?.message || 'Could not update protocol.',
          });
        },
      }
    );
  };

  const handleAddInstruction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProtocol) return;
    if (!instTitle.trim() || !instBody.trim()) {
      addToast({ type: 'warning', title: 'Title and body are required' });
      return;
    }

    addInstructionMutation.mutate(
      {
        protocolId: selectedProtocol.id,
        data: {
          title: instTitle,
          body: instBody,
          phase: instPhase,
          category: instCategory,
          offsetMinutes: Number(instOffset) || 0,
          isCritical: instCritical,
          sortOrder: (selectedProtocol.instructions?.length || 0) + 1,
        },
      },
      {
        onSuccess: (newInst) => {
          addToast({ type: 'success', title: 'Instruction Added!' });
          setSelectedProtocol({
            ...selectedProtocol,
            instructions: [...(selectedProtocol.instructions || []), newInst],
          });
          setIsAddingInst(false);
          setInstTitle('');
          setInstBody('');
        },
        onError: (err: any) => {
          addToast({
            type: 'error',
            title: 'Failed to add instruction',
            message: err?.message || 'Could not save instruction.',
          });
        },
      }
    );
  };

  const handleApproveConfirm = () => {
    if (!protocolToApprove) return;

    const blockingIssues = checkPlaceholders(protocolToApprove);
    if (blockingIssues.length > 0) {
      addToast({
        type: 'error',
        title: 'Approval Blocked: Incomplete Placeholders',
        message: blockingIssues[0],
      });
      return;
    }

    approveMutation.mutate(protocolToApprove.id, {
      onSuccess: () => {
        addToast({
          type: 'success',
          title: 'Protocol Approved & Activated',
          message: `${protocolToApprove.name} is now approved for live patient scheduling.`,
        });
        setProtocolToApprove(null);
        if (selectedProtocol?.id === protocolToApprove.id) {
          setSelectedProtocol({ ...selectedProtocol, status: 'APPROVED' });
        }
      },
      onError: (err: any) => {
        addToast({
          type: 'error',
          title: 'Approval Failed',
          message: err?.message || 'Server rejected approval.',
        });
      },
    });
  };

  const filteredProtocols = protocols.filter((p) => {
    if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
    if (treatmentFilter !== 'ALL' && p.treatmentId !== treatmentFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-600" />
            Care Protocols & Clinical Guidelines
          </h1>
          <p className="text-xs text-slate-500">
            Define pre-op, post-op instructions, fasting requirements, and escalation safety triggers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="teal" icon={<Layers className="w-3.5 h-3.5" />}>
            {protocols.length} Total Protocols
          </Badge>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-teal-600" />
          <span>Filters:</span>
        </div>

        <div className="w-48">
          <Select
            label=""
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'DRAFT', label: 'Draft' },
              { value: 'APPROVED', label: 'Approved (Active)' },
              { value: 'ARCHIVED', label: 'Archived' },
            ]}
          />
        </div>

        <div className="w-60">
          <Select
            label=""
            value={treatmentFilter}
            onChange={(e) => setTreatmentFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Treatments' },
              ...treatments.map((t) => ({ value: t.id, label: t.name })),
            ]}
          />
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoading && isError && (
        <ErrorState
          title="Failed to load care protocols"
          message="Could not retrieve the protocol catalog for this clinic."
          onRetry={() => refetch()}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredProtocols.length === 0 && (
        <EmptyState
          icon={FileText}
          title="No Protocols Found"
          description="There are no care protocols matching your current filters. Clear filters or create one."
          actionLabel="Reset Filters"
          onAction={() => {
            setStatusFilter('ALL');
            setTreatmentFilter('ALL');
          }}
          actionIcon={Filter}
        />
      )}

      {/* Table Container */}
      {!isLoading && !isError && filteredProtocols.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden h-[540px] flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase sticky top-0 z-10 shadow-2xs">
                <tr>
                  <th className="p-4">Protocol Name</th>
                  <th className="p-4">Treatment</th>
                  <th className="p-4">Version</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Approved By / At</th>
                  <th className="p-4">Instructions</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProtocols.map((proto) => {
                  const placeholders = checkPlaceholders(proto);
                  const isReadyForApprove = proto.status === 'DRAFT' && placeholders.length === 0;

                  return (
                    <tr
                      key={proto.id}
                      onClick={() => handleOpenDrawer(proto)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                    >
                      <td className="p-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                          <span>{proto.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-600">
                        {proto.treatment?.name || 'General Treatment'}
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-800">
                        v{proto.version}
                      </td>
                      <td className="p-4">
                        <Badge
                          size="sm"
                          variant={
                            proto.status === 'APPROVED'
                              ? 'success'
                              : proto.status === 'DRAFT'
                                ? 'warning'
                                : 'neutral'
                          }
                        >
                          {proto.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-slate-500">
                        {proto.status === 'APPROVED' && proto.approvedAt ? (
                          <div>
                            <span className="font-semibold text-slate-700">Dr. Approved</span>
                            <span className="block text-[10px] text-slate-400">
                              {new Date(proto.approvedAt).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Pending Approval</span>
                        )}
                      </td>
                      <td className="p-4 text-slate-600">
                        <span className="font-semibold">
                          {(proto.instructions || []).length} steps
                        </span>{' '}
                        •{' '}
                        <span className="text-rose-600 font-medium">
                          {(proto.escalationRules || proto.rules || []).length} safety rules
                        </span>
                      </td>
                      <td
                        className="p-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-2">
                          {/* Approve Button: Visible only to DOCTOR or CLINIC_OWNER */}
                          {canApprove && proto.status === 'DRAFT' && (
                            <Button
                              size="sm"
                              variant="primary"
                              icon={Check}
                              disabled={!isReadyForApprove}
                              title={
                                placeholders.length > 0
                                  ? placeholders[0]
                                  : 'Approve and activate protocol'
                              }
                              onClick={() => setProtocolToApprove(proto)}
                            >
                              Approve
                            </Button>
                          )}

                          <Button
                            size="sm"
                            variant="outline"
                            icon={Edit3}
                            onClick={() => handleOpenDrawer(proto)}
                          >
                            View & Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PROTOCOL EDITOR & DETAILS DRAWER */}
      <Drawer
        open={!!selectedProtocol}
        onClose={() => setSelectedProtocol(null)}
        title={selectedProtocol ? `${selectedProtocol.name} (v${selectedProtocol.version})` : 'Protocol'}
        description={`Status: ${selectedProtocol?.status} • Treatment: ${selectedProtocol?.treatment?.name || 'General'}`}
      >
        {selectedProtocol && (
          <div className="space-y-6 text-xs">
            {/* Version diff note if editing an APPROVED protocol */}
            {selectedProtocol.status === 'APPROVED' && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 space-y-1">
                <div className="flex items-center gap-2 font-bold">
                  <Info className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Version Lock Policy</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Editing creates version {selectedProtocol.version + 1}; version {selectedProtocol.version} stays active until approved.
                </p>
              </div>
            )}

            {/* Title edit */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">Protocol Metadata</span>
                {!isEditing ? (
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
                    Edit Title
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" variant="primary" onClick={handleSaveProtocol}>
                      Save
                    </Button>
                  </div>
                )}
              </div>

              {isEditing ? (
                <Input
                  label="Protocol Name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              ) : (
                <p className="text-slate-700">
                  <strong>Name:</strong> {selectedProtocol.name}
                </p>
              )}
            </div>

            {/* Placeholder Validation Alert */}
            {(() => {
              const placeholders = checkPlaceholders(selectedProtocol);
              if (placeholders.length === 0) return null;
              return (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Unresolved Fasting / Clinical Timing Placeholders</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-rose-700">
                    {placeholders.map((p, idx) => (
                      <li key={idx}>{p}</li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-rose-600 italic mt-1">
                    Fasting/NPO and clinic-specific timings must be defined before doctor approval.
                  </p>
                </div>
              );
            })()}

            {/* Instructions List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-teal-600" />
                  Care Instructions ({selectedProtocol.instructions?.length || 0})
                </h4>
                <Button
                  size="sm"
                  variant="outline"
                  icon={Plus}
                  onClick={() => setIsAddingInst(!isAddingInst)}
                >
                  Add Step
                </Button>
              </div>

              {/* Add instruction inline form */}
              {isAddingInst && (
                <form
                  onSubmit={handleAddInstruction}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3 animate-fade-in"
                >
                  <h5 className="font-bold text-slate-800">Add New Instruction Step</h5>
                  <Input
                    label="Step Title"
                    value={instTitle}
                    onChange={(e) => setInstTitle(e.target.value)}
                    placeholder="e.g., Fasting NPO Guideline"
                  />
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Message Body</label>
                    <textarea
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-teal-500"
                      rows={2}
                      value={instBody}
                      onChange={(e) => setInstBody(e.target.value)}
                      placeholder="e.g. Do not consume solid foods for 6 hours prior to sedation."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Select
                      label="Phase"
                      value={instPhase}
                      onChange={(e) => setInstPhase(e.target.value as CarePhase)}
                      options={[
                        { value: 'PRE_OP', label: 'PRE_OP (Before)' },
                        { value: 'POST_OP', label: 'POST_OP (After)' },
                      ]}
                    />
                    <Select
                      label="Category"
                      value={instCategory}
                      onChange={(e) => setInstCategory(e.target.value as CareCategory)}
                      options={[
                        { value: 'FASTING', label: 'FASTING / NPO' },
                        { value: 'MEDICATION', label: 'MEDICATION' },
                        { value: 'HYGIENE', label: 'HYGIENE' },
                        { value: 'DIET', label: 'DIET' },
                        { value: 'ACTIVITY', label: 'ACTIVITY' },
                        { value: 'HYDRATION', label: 'HYDRATION' },
                        { value: 'OTHER', label: 'OTHER' },
                      ]}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Offset (Minutes from Apt)"
                      type="number"
                      value={instOffset}
                      onChange={(e) => setInstOffset(Number(e.target.value))}
                    />
                    <div className="flex items-center gap-2 pt-6">
                      <input
                        type="checkbox"
                        id="critCheck"
                        checked={instCritical}
                        onChange={(e) => setInstCritical(e.target.checked)}
                        className="rounded text-teal-600"
                      />
                      <label htmlFor="critCheck" className="font-semibold text-slate-700">
                        Critical Safety Flag
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <Button size="sm" variant="ghost" onClick={() => setIsAddingInst(false)}>
                      Cancel
                    </Button>
                    <Button size="sm" variant="primary" type="submit">
                      Save Instruction
                    </Button>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {(selectedProtocol.instructions || []).map((inst) => (
                  <div
                    key={inst.id}
                    className="p-3 bg-white rounded-xl border border-slate-200 space-y-1 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{inst.title}</span>
                        <Badge
                          size="sm"
                          variant={inst.phase === 'PRE_OP' ? 'warning' : 'teal'}
                        >
                          {inst.phase}
                        </Badge>
                        <Badge size="sm" variant="neutral">
                          {inst.category}
                        </Badge>
                      </div>
                      <span className="text-[11px] font-mono text-slate-500">
                        {inst.offsetMinutes >= 0 ? `+${inst.offsetMinutes}m` : `${inst.offsetMinutes}m`}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{inst.body}</p>
                    {inst.isCritical && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-rose-600 font-bold">
                        <ShieldAlert className="w-3 h-3" /> Mandatory Safety Instruction
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Escalation Rules List */}
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                Escalation & Safety Rules ({(selectedProtocol.escalationRules || selectedProtocol.rules || []).length})
              </h4>
              <div className="space-y-2">
                {(selectedProtocol.escalationRules || selectedProtocol.rules || []).map((rule) => (
                  <div
                    key={rule.id}
                    className="p-3 bg-rose-50/50 rounded-xl border border-rose-200/60 space-y-1 text-slate-800"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-900">{rule.symptomKey}</span>
                      <Badge size="sm" variant="danger">
                        {rule.action}
                      </Badge>
                    </div>
                    <p className="text-slate-600 text-[11px]">{rule.description}</p>
                    <p className="text-slate-500 text-[10px] italic">Reply: "{rule.message}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Approval Action in Drawer for Doctor */}
            {canApprove && selectedProtocol.status === 'DRAFT' && (
              <div className="pt-4 border-t border-slate-200">
                <Button
                  size="md"
                  variant="primary"
                  icon={CheckCircle2}
                  className="w-full justify-center"
                  disabled={checkPlaceholders(selectedProtocol).length > 0}
                  onClick={() => setProtocolToApprove(selectedProtocol)}
                >
                  Approve Protocol v{selectedProtocol.version}
                </Button>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* CONFIRM APPROVAL MODAL */}
      <Modal
        open={!!protocolToApprove}
        onClose={() => setProtocolToApprove(null)}
        title={`Approve Protocol: ${protocolToApprove?.name}`}
        description="Verify clinical safety guidelines before making this protocol live."
        size="md"
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-700">
            You are about to approve <strong>{protocolToApprove?.name}</strong> (v{protocolToApprove?.version}). Once approved:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            <li>Any existing approved version will be archived.</li>
            <li>New appointments with this treatment will automatically receive scheduled reminders according to these instructions.</li>
            <li>All Fasting / NPO guidelines and safety triggers will be active for AI patient triage.</li>
          </ul>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button variant="ghost" onClick={() => setProtocolToApprove(null)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              icon={CheckCircle2}
              onClick={handleApproveConfirm}
              isLoading={approveMutation.isPending}
            >
              Confirm Approval
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
