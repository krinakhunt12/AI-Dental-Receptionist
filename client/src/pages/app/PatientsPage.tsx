import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { usePatients } from '../../features/patients/api';
import { useUpdateConsent } from '../../features/appointments/hooks/useReminders';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Drawer } from '../../components/ui/Drawer';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Toggle } from '../../components/ui/Toggle';
import { useUIStore } from '../../store/useUIStore';
import { Search, Download, Plus, User, Phone, Mail, Calendar, FileText, CheckCircle2, MessageSquare, Smartphone } from 'lucide-react';

export const PatientsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [queryInput, setQueryInput] = useState(initialSearch);
  const [debouncedQuery, setDebouncedQuery] = useState(initialSearch);

  // 300ms debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(queryInput);
      setSearchParams(queryInput ? { search: queryInput } : {}, { replace: true });
    }, 300);
    return () => clearTimeout(handler);
  }, [queryInput, setSearchParams]);

  const { data: patients = [], isLoading, isError, refetch } = usePatients({ search: debouncedQuery });
  const updateConsentMutation = useUpdateConsent();
  const { addToast } = useUIStore();

  const [selectedPatId, setSelectedPatId] = useState<string | null>(null);

  // Consent states for selected patient
  const [waConsent, setWaConsent] = useState(true);
  const [smsConsent, setSmsConsent] = useState(true);

  const selectedPatient = patients.find((p) => p.id === selectedPatId);

  const handleToggleConsent = (channel: 'WHATSAPP' | 'SMS', currentVal: boolean) => {
    if (!selectedPatient) return;
    const nextStatus = currentVal ? 'OPTED_OUT' : 'OPTED_IN';

    if (channel === 'WHATSAPP') setWaConsent(!currentVal);
    else setSmsConsent(!currentVal);

    updateConsentMutation.mutate(
      {
        patientId: selectedPatient.id,
        channel,
        status: nextStatus,
        source: 'STAFF_TOGGLE',
      },
      {
        onSuccess: () => {
          addToast({
            type: 'success',
            title: `${channel} Consent Updated`,
            message: `Patient ${selectedPatient.name} is now ${nextStatus === 'OPTED_IN' ? 'Subscribed' : 'Opted Out'}.`,
          });
        },
        onError: (err: any) => {
          // Revert on error
          if (channel === 'WHATSAPP') setWaConsent(currentVal);
          else setSmsConsent(currentVal);
          addToast({
            type: 'error',
            title: 'Failed to update consent',
            message: err?.message || 'Could not update consent state.',
          });
        },
      }
    );
  };

  const handleExportCSV = () => {
    addToast({
      type: 'success',
      title: 'CSV Export Started',
      message: 'Downloading patient directory records...',
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Patients Directory</h1>
          <p className="text-xs text-slate-500">Manage patient records, communication consent, and appointment history.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={Download} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button size="sm" icon={Plus} onClick={() => addToast({ type: 'info', title: 'Add Patient Modal' })}>
            Add Patient
          </Button>
        </div>
      </div>

      <div className="max-w-md">
        <Input
          icon={Search}
          placeholder="Search by name, phone, or email (300ms debounce)..."
          value={queryInput}
          onChange={(e) => setQueryInput(e.target.value)}
        />
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden p-6 space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoading && isError && (
        <ErrorState
          title="Failed to load patient records"
          message="Could not load the patient directory. Please try again."
          onRetry={() => refetch()}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && patients.length === 0 && (
        <EmptyState
          icon={User}
          title="No Patients Found"
          description={
            debouncedQuery
              ? `No patient records match the search "${debouncedQuery}". Try another query.`
              : 'No patient profiles exist in the system yet. Register your first patient to begin.'
          }
          actionLabel={debouncedQuery ? 'Clear Search' : 'Add New Patient'}
          onAction={debouncedQuery ? () => setQueryInput('') : () => addToast({ type: 'info', title: 'Add Patient Modal' })}
          actionIcon={debouncedQuery ? undefined : Plus}
        />
      )}

      {/* Patient Table */}
      {!isLoading && !isError && patients.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden h-[540px] flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase sticky top-0 z-10 shadow-2xs">
                <tr>
                  <th className="p-4">Patient Name</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Source</th>
                  <th className="p-4">Tags</th>
                  <th className="p-4">Total Visits</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {patients.map((pat) => (
                  <tr
                    key={pat.id}
                    onClick={() => {
                      setSelectedPatId(pat.id);
                      setWaConsent(true);
                      setSmsConsent(true);
                    }}
                    className="hover:bg-teal-50/50 cursor-pointer transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{pat.name}</div>
                      <div className="text-[11px] text-slate-400">
                        {pat.age ? `${pat.age} yrs • ` : ''}
                        {pat.gender || 'Patient'}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-800 font-medium">{pat.phone}</div>
                      <div className="text-[11px] text-slate-400">{pat.email}</div>
                    </td>
                    <td className="p-4">
                      <Badge variant="teal">{pat.source || 'Website'}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {(pat.tags || []).map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-900">{pat.totalVisits ?? 1} visits</td>
                    <td className="p-4 text-right">
                      <Button size="sm" variant="ghost">
                        View Profile
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Patient Profile Drawer */}
      <Drawer
        isOpen={!!selectedPatId}
        onClose={() => setSelectedPatId(null)}
        title={selectedPatient ? `Patient: ${selectedPatient.name}` : 'Profile'}
        description={`ID: ${selectedPatient?.id} • Phone: ${selectedPatient?.phone}`}
      >
        {selectedPatient && (
          <div className="space-y-6 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <p><strong>Email:</strong> {selectedPatient.email}</p>
              <p><strong>Medical History:</strong> {(selectedPatient.medicalHistory || ['No Known Allergies']).join(', ')}</p>
              <p><strong>Last Visit:</strong> {selectedPatient.lastVisit || 'N/A'}</p>
              <p><strong>Total Appointments:</strong> {selectedPatient.totalVisits ?? 1}</p>
            </div>

            {/* Notification Consent Toggles (WhatsApp / SMS) */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-4">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                Notification Consent Preferences (TCPA / GDPR)
              </h4>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <div>
                    <span className="font-bold text-slate-800 block">WhatsApp Care Reminders</span>
                    <span className="text-[11px] text-slate-500">
                      Receive pre-op fasting and post-op care guidance on WhatsApp
                    </span>
                  </div>
                </div>
                <Toggle
                  checked={waConsent}
                  onChange={() => handleToggleConsent('WHATSAPP', waConsent)}
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-sky-600" />
                  <div>
                    <span className="font-bold text-slate-800 block">SMS Care Reminders</span>
                    <span className="text-[11px] text-slate-500">
                      Receive backup SMS reminder messages and critical schedule alerts
                    </span>
                  </div>
                </div>
                <Toggle
                  checked={smsConsent}
                  onChange={() => handleToggleConsent('SMS', smsConsent)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900">Clinical Patient Notes</h4>
              <textarea
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-teal-500"
                rows={3}
                placeholder="Add medical notes for receptionist or dentist..."
              />
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
