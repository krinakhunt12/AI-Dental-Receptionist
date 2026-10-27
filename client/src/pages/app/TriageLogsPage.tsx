import React, { useState } from 'react';
import { useTriageLogs } from '../../features/triage/hooks/useTriageLogs';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Lock,
  RefreshCw,
  Filter,
  EyeOff,
} from 'lucide-react';

export const TriageLogsPage: React.FC = () => {
  const [urgencyFilter, setUrgencyFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useTriageLogs({
    urgency: urgencyFilter === 'ALL' ? undefined : urgencyFilter,
    page,
    limit: 25,
  });

  const logs = data?.logs || [];
  const total = data?.total || 0;

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'EMERGENCY':
        return (
          <Badge size="sm" variant="danger" icon={<AlertTriangle className="w-3 h-3" />}>
            EMERGENCY
          </Badge>
        );
      case 'URGENT':
        return (
          <Badge size="sm" variant="warning" icon={<Clock className="w-3 h-3" />}>
            URGENT
          </Badge>
        );
      case 'ROUTINE':
        return (
          <Badge size="sm" variant="teal" icon={<CheckCircle2 className="w-3 h-3" />}>
            ROUTINE
          </Badge>
        );
      default:
        return (
          <Badge size="sm" variant="neutral">
            {urgency}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            AI Emergency Triage Audit Logs
          </h1>
          <p className="text-xs text-slate-500">
            Immutable audit record of incoming patient messages, symptom extraction, and clinical escalation triggers (redacted for HIPAA compliance).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline" icon={RefreshCw} onClick={() => refetch()}>
            Refresh Logs
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Filter className="w-4 h-4 text-teal-600" />
            <span>Urgency:</span>
          </div>

          <div className="w-48">
            <Select
              label=""
              value={urgencyFilter}
              onChange={(e) => {
                setUrgencyFilter(e.target.value);
                setPage(1);
              }}
              options={[
                { value: 'ALL', label: 'All Urgency Levels' },
                { value: 'EMERGENCY', label: 'Emergency (High Priority)' },
                { value: 'URGENT', label: 'Urgent' },
                { value: 'ROUTINE', label: 'Routine' },
                { value: 'NONE', label: 'General / None' },
              ]}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Lock className="w-3.5 h-3.5 text-teal-600" />
          <span>Patient PHI automatically redacted (names, phone numbers masked)</span>
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
          title="Failed to load triage audit logs"
          message="Could not retrieve the triage log records. Please try again."
          onRetry={() => refetch()}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && logs.length === 0 && (
        <EmptyState
          icon={ShieldAlert}
          title="No Triage Logs Found"
          description={
            urgencyFilter !== 'ALL'
              ? `No triage interactions matched "${urgencyFilter}".`
              : 'No patient triage messages logged yet.'
          }
          actionLabel="Clear Filter"
          onAction={() => setUrgencyFilter('ALL')}
          actionIcon={Filter}
        />
      )}

      {/* Table Container */}
      {!isLoading && !isError && logs.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden h-[540px] flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase sticky top-0 z-10 shadow-2xs">
                <tr>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Urgency Level</th>
                  <th className="p-4">Detected Symptoms</th>
                  <th className="p-4">Staff Escalated</th>
                  <th className="p-4">Redacted Patient Statement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => {
                  const isEmergency = log.urgency === 'EMERGENCY';

                  return (
                    <tr
                      key={log.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isEmergency ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      <td className="p-4 font-mono text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{new Date(log.createdAt).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {getUrgencyBadge(log.urgency)}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {(log.symptomKeys || []).length > 0 ? (
                            log.symptomKeys.map((s, idx) => (
                              <span
                                key={idx}
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  isEmergency
                                    ? 'bg-rose-100 text-rose-800'
                                    : 'bg-slate-100 text-slate-700'
                                }`}
                              >
                                {s}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 italic">None detected</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        {log.escalated ? (
                          <Badge size="sm" variant="danger">
                            YES (ALERT SENT)
                          </Badge>
                        ) : (
                          <Badge size="sm" variant="neutral">
                            NO (AI RESOLVED)
                          </Badge>
                        )}
                      </td>
                      <td className="p-4 max-w-md">
                        <div className="flex items-start gap-1.5 p-2 bg-slate-50 rounded-xl border border-slate-100 font-mono text-[11px] text-slate-700">
                          <EyeOff className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="break-words line-clamp-2">{log.redactedText}</span>
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
    </div>
  );
};
