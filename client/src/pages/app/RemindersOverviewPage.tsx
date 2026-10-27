import React, { useState } from 'react';
import { useReminderJobs, useRetryReminder } from '../../features/appointments/hooks/useReminders';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { useUIStore } from '../../store/useUIStore';
import { ReminderJob, ReminderJobStatus } from '../../types';
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  Smartphone,
  MessageSquare,
  Filter,
  RefreshCw,
  Send,
} from 'lucide-react';

export const RemindersOverviewPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const { addToast } = useUIStore();

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useReminderJobs({
    status: statusFilter === 'ALL' ? undefined : statusFilter,
    page,
    limit: 20,
  });

  const retryMutation = useRetryReminder();

  const handleRetry = (job: ReminderJob) => {
    retryMutation.mutate(job.id, {
      onSuccess: () => {
        addToast({
          type: 'success',
          title: 'Reminder Job Re-queued',
          message: `Job ${job.id} for "${job.instruction?.title || 'Care Reminder'}" is re-queued as PENDING.`,
        });
        refetch();
      },
      onError: (err: any) => {
        addToast({
          type: 'error',
          title: 'Retry Failed',
          message: err?.message || 'Could not retry reminder job.',
        });
      },
    });
  };

  const getStatusBadge = (status: ReminderJobStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge size="sm" variant="warning" icon={<Clock className="w-3 h-3" />}>
            PENDING
          </Badge>
        );
      case 'SENT':
        return (
          <Badge size="sm" variant="success" icon={<CheckCircle2 className="w-3 h-3" />}>
            SENT
          </Badge>
        );
      case 'FAILED':
        return (
          <Badge size="sm" variant="danger" icon={<AlertTriangle className="w-3 h-3" />}>
            FAILED
          </Badge>
        );
      case 'SKIPPED':
        return (
          <Badge size="sm" variant="neutral">
            SKIPPED
          </Badge>
        );
      default:
        return (
          <Badge size="sm" variant="neutral">
            {status}
          </Badge>
        );
    }
  };

  const jobs = data?.jobs || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-teal-600" />
            Patient Care Reminders & Dispatch Monitor
          </h1>
          <p className="text-xs text-slate-500">
            Monitor automated WhatsApp/SMS pre-op fasting and post-op care notifications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline" icon={RefreshCw} onClick={() => refetch()}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter Toolbar with Status Chips */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Status Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'ALL', label: 'All Jobs' },
            { id: 'FAILED', label: 'Failed' },
            { id: 'SKIPPED', label: 'Skipped (Opt-out / Quiet Hours)' },
            { id: 'PENDING', label: 'Pending Queue' },
            { id: 'SENT', label: 'Sent' },
          ].map((chip) => (
            <button
              key={chip.id}
              onClick={() => {
                setStatusFilter(chip.id);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${statusFilter === chip.id
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Showing <strong>{jobs.length}</strong> of <strong>{total}</strong> reminders
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoading && isError && (
        <ErrorState
          title="Failed to load reminder jobs"
          message="Could not retrieve the reminder queue for this clinic. Please retry."
          onRetry={() => refetch()}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && jobs.length === 0 && (
        <EmptyState
          icon={Bell}
          title="No Reminder Jobs Found"
          description={
            statusFilter !== 'ALL'
              ? `No reminders currently in "${statusFilter}" state.`
              : 'No reminder jobs scheduled for this clinic yet.'
          }
          actionLabel="Clear Filters"
          onAction={() => setStatusFilter('ALL')}
          actionIcon={Filter}
        />
      )}

      {/* Table Container */}
      {!isLoading && !isError && jobs.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden h-[540px] flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase sticky top-0 z-10 shadow-2xs">
                <tr>
                  <th className="p-4">Job ID</th>
                  <th className="p-4">Scheduled For</th>
                  <th className="p-4">Channel</th>
                  <th className="p-4">Instruction / Message</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Reason / Error</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-slate-800">
                      {job.id}
                    </td>
                    <td className="p-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(job.sendAt).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                        {job.channel === 'WHATSAPP' ? (
                          <>
                            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                            <span>WhatsApp</span>
                          </>
                        ) : (
                          <>
                            <Smartphone className="w-3.5 h-3.5 text-sky-600" />
                            <span>SMS</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="p-4 max-w-xs text-slate-800">
                      <p className="font-bold truncate">{job.instruction?.title || 'Pre/Post Op Step'}</p>
                      <p className="text-slate-500 text-[11px] truncate">
                        {job.instruction?.body || 'Patient care instruction'}
                      </p>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(job.status as ReminderJobStatus)}
                    </td>
                    <td className="p-4 text-slate-500 max-w-xs">
                      {job.lastError || job.skipReason ? (
                        <span className="text-rose-600 font-medium truncate block">
                          {job.lastError || job.skipReason}
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">—</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      {job.status === 'FAILED' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          icon={RotateCcw}
                          className="border-rose-300 text-rose-700 hover:bg-rose-50"
                          onClick={() => handleRetry(job)}
                          isLoading={retryMutation.isPending}
                        >
                          Retry Job
                        </Button>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No action</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
