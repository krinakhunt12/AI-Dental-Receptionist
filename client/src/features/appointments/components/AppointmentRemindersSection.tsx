import React from 'react';
import { useAppointmentReminders, useRetryReminder } from '../hooks/useReminders';
import { Button } from '../../../components/ui/Button';
import { Skeleton } from '../../../components/ui/Skeleton';
import { useUIStore } from '../../../store/useUIStore';
import { ReminderJob, ReminderJobStatus } from '../../../types';
import {
  Bell,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RotateCcw,
  MessageSquare,
  Smartphone,
  Info,
} from 'lucide-react';

interface AppointmentRemindersSectionProps {
  appointmentId: string;
}

export const AppointmentRemindersSection: React.FC<AppointmentRemindersSectionProps> = ({
  appointmentId,
}) => {
  const { data: reminders = [], isLoading, isError, refetch } = useAppointmentReminders(appointmentId);
  const retryMutation = useRetryReminder();
  const { addToast } = useUIStore();

  const handleRetry = (job: ReminderJob) => {
    retryMutation.mutate(job.id, {
      onSuccess: () => {
        addToast({
          type: 'success',
          title: 'Reminder Re-queued',
          message: `Job for "${job.instruction?.title || 'Care Reminder'}" set to Pending.`,
        });
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

  const getStatusBadge = (job: ReminderJob) => {
    switch (job.status as ReminderJobStatus) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            Pending
          </span>
        );
      case 'PROCESSING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
            Processing
          </span>
        );
      case 'SENT':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            Sent
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
            Failed
          </span>
        );
      case 'SKIPPED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300">
            <Info className="w-3.5 h-3.5 text-slate-500" />
            Skipped
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200 line-through">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
            {job.status}
          </span>
        );
    }
  };

  const formatDateTime = (isoString?: string | null) => {
    if (!isoString) return '—';
    try {
      const d = new Date(isoString);
      return d.toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-teal-600" />
          <h4 className="text-sm font-bold text-slate-900">Care Reminders</h4>
          {reminders.length > 0 && (
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              {reminders.length}
            </span>
          )}
        </div>
        <button
          onClick={() => refetch()}
          className="text-[11px] font-semibold text-slate-500 hover:text-teal-600 transition-colors"
          title="Refresh reminder status"
        >
          Refresh
        </button>
      </div>

      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-14 w-full rounded-xl" />
          <Skeleton className="h-14 w-full rounded-xl" />
        </div>
      )}

      {isError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center justify-between">
          <span>Failed to load care reminders.</span>
          <Button size="sm" variant="ghost" onClick={() => refetch()} className="text-xs">
            Retry
          </Button>
        </div>
      )}

      {!isLoading && !isError && reminders.length === 0 && (
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700">No Reminders Scheduled</p>
          <p className="text-[11px]">
            Reminders are generated automatically when an appointment is booked with an APPROVED care protocol.
          </p>
        </div>
      )}

      {!isLoading && !isError && reminders.length > 0 && (
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {reminders.map((job) => (
            <div
              key={job.id}
              className="p-3 rounded-xl border border-slate-200 bg-white shadow-2xs space-y-2 transition-all hover:border-slate-300"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-slate-900 text-xs">
                      {job.instruction?.title || 'Care Reminder'}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        job.channel === 'WHATSAPP'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-sky-100 text-sky-800'
                      }`}
                    >
                      {job.channel === 'WHATSAPP' ? (
                        <MessageSquare className="w-2.5 h-2.5" />
                      ) : (
                        <Smartphone className="w-2.5 h-2.5" />
                      )}
                      {job.channel}
                    </span>
                    {job.instruction?.isCritical && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-rose-100 text-rose-700 border border-rose-200">
                        Critical
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Scheduled: {formatDateTime(job.sendAt)}
                    {job.sentAt && ` • Delivered: ${formatDateTime(job.sentAt)}`}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {getStatusBadge(job)}
                </div>
              </div>

              {/* Status details: Failed error with Retry button, or Skipped reason */}
              {job.status === 'FAILED' && (
                <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-rose-100 text-rose-700 text-[11px]">
                  <span className="truncate" title={job.lastError || 'Delivery attempt failed'}>
                    ⚠️ {job.lastError || 'Delivery failure after max attempts'}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="shrink-0 h-6 px-2 text-[11px] border-rose-300 text-rose-700 hover:bg-rose-50"
                    disabled={retryMutation.isPending}
                    onClick={() => handleRetry(job)}
                  >
                    <RotateCcw className={`w-3 h-3 mr-1 ${retryMutation.isPending ? 'animate-spin' : ''}`} />
                    Retry
                  </Button>
                </div>
              )}

              {job.status === 'SKIPPED' && job.skipReason && (
                <div className="pt-1 border-t border-slate-100 text-[11px] text-slate-500 italic">
                  Reason: {job.skipReason}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
