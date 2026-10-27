import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppointments, useUpdateAppointment, useCancelAppointment } from '../../features/appointments/api';
import { useDentists } from '../../features/dentists/api';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Drawer } from '../../components/ui/Drawer';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { useUIStore } from '../../store/useUIStore';
import { Calendar as CalendarIcon, Clock, User, Plus, Filter, CheckCircle2, Search } from 'lucide-react';
import { AppointmentRemindersSection } from '../../features/appointments/components/AppointmentRemindersSection';

export const AppointmentsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialDoctor = searchParams.get('doctor') || 'ALL';
  const initialStatus = searchParams.get('status') || 'ALL';
  const initialSearch = searchParams.get('search') || '';

  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(initialDoctor);
  const [selectedStatus, setSelectedStatus] = useState<string>(initialStatus);
  const [searchInput, setSearchInput] = useState<string>(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState<string>(initialSearch);

  // 300ms debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      const params: Record<string, string> = {};
      if (selectedDoctorId !== 'ALL') params.doctor = selectedDoctorId;
      if (selectedStatus !== 'ALL') params.status = selectedStatus;
      if (searchInput) params.search = searchInput;
      setSearchParams(params, { replace: true });
    }, 300);
    return () => clearTimeout(handler);
  }, [searchInput, selectedDoctorId, selectedStatus, setSearchParams]);

  const {
    data: appointments = [],
    isLoading: isLoadingAppts,
    isError: isErrorAppts,
    refetch: refetchAppts,
  } = useAppointments({
    doctorId: selectedDoctorId === 'ALL' ? undefined : selectedDoctorId,
    status: selectedStatus === 'ALL' ? undefined : selectedStatus,
    search: debouncedSearch || undefined,
  });

  const {
    data: doctors = [],
    isLoading: isLoadingDoctors,
    isError: isErrorDoctors,
    refetch: refetchDoctors,
  } = useDentists();

  const updateAppointmentMut = useUpdateAppointment();
  const cancelAppointmentMut = useCancelAppointment();
  const { addToast } = useUIStore();

  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedAptId, setSelectedAptId] = useState<string | null>(null);

  const isLoading = isLoadingAppts || isLoadingDoctors;
  const isError = isErrorAppts || isErrorDoctors;

  const handleRetry = () => {
    refetchAppts();
    refetchDoctors();
  };

  const filteredApts = appointments;

  const selectedApt = appointments.find((a) => a.id === selectedAptId);

  // Drag-to-reschedule simulation helper
  const handleSimulateDragReschedule = (aptId: string) => {
    updateAppointmentMut.mutate(
      { id: aptId, data: { date: '2026-10-12', time: '14:00' } },
      {
        onSuccess: () => {
          addToast({
            type: 'success',
            title: 'Slot Dragged & Rescheduled!',
            message: 'Moved appointment to Oct 12 at 14:00. Confirmation SMS queued.',
          });
        },
        onError: (err: unknown) => {
          addToast({
            type: 'error',
            title: 'Reschedule Failed',
            message: err instanceof Error ? err.message : 'Slot unavailable',
          });
        },
      }
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Appointments Calendar & Roster</h1>
          <p className="text-xs text-slate-500">Manage patient slots, doctor schedules, and status chips.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="w-48 sm:w-60">
            <Input
              icon={Search}
              placeholder="Search appointments..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <Select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Doctors' },
              ...doctors.map((d) => ({ value: d.id, label: d.name })),
            ]}
          />

          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Statuses' },
              { value: 'Confirmed', label: 'Confirmed' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Completed', label: 'Completed' },
              { value: 'Cancelled', label: 'Cancelled' },
            ]}
          />

          <div className="inline-flex p-1 bg-slate-200/70 rounded-xl">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${viewMode === 'calendar' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600'
                }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${viewMode === 'list' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600'
                }`}
            >
              List View
            </button>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3">
                <Skeleton className="h-4 w-24 mx-auto" />
                <div className="space-y-2">
                  <Skeleton className="h-20 w-full rounded-xl" />
                  <Skeleton className="h-20 w-full rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoading && isError && (
        <ErrorState
          title="Failed to load appointments"
          message="Could not retrieve appointments and doctor rosters. Please check your connection and retry."
          onRetry={handleRetry}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredApts.length === 0 && (
        <EmptyState
          icon={CalendarIcon}
          title="No Appointments Found"
          description={
            selectedDoctorId !== 'ALL'
              ? 'There are no appointments booked for the selected doctor.'
              : 'There are no active appointments in the schedule yet.'
          }
          actionLabel={selectedDoctorId !== 'ALL' ? 'Show All Doctors' : undefined}
          onAction={selectedDoctorId !== 'ALL' ? () => setSelectedDoctorId('ALL') : undefined}
        />
      )}

      {/* CALENDAR OR LIST VIEW */}
      {!isLoading && !isError && filteredApts.length > 0 && (
        viewMode === 'calendar' ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Weekly Schedule Grid</h3>
              <span className="text-xs text-slate-400">Tip: Click any slot to view or drag to reschedule</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {['Mon (Oct 5)', 'Tue (Oct 6)', 'Wed (Oct 7)', 'Thu (Oct 8)', 'Fri (Oct 9)'].map((day, dIdx) => (
                <div key={dIdx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3">
                  <div className="text-xs font-bold text-slate-800 text-center pb-2 border-b border-slate-200">
                    {day}
                  </div>

                  <div className="space-y-2">
                    {filteredApts.slice(dIdx * 3, dIdx * 3 + 3).map((apt) => (
                      <div
                        key={apt.id}
                        onClick={() => setSelectedAptId(apt.id)}
                        className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-teal-500 cursor-pointer space-y-1 group transition-all"
                      >
                        <div className="flex items-center justify-between text-[11px] font-bold text-teal-700">
                          <span>{apt.time}</span>
                          <Badge
                            size="sm"
                            variant={
                              apt.status === 'Confirmed'
                                ? 'success'
                                : apt.status === 'Cancelled'
                                  ? 'danger'
                                  : 'warning'
                            }
                          >
                            {apt.status}
                          </Badge>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 truncate">{apt.patientName}</h5>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{apt.treatment}</p>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSimulateDragReschedule(apt.id);
                          }}
                          className="text-[10px] text-teal-600 font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity pt-1 block"
                        >
                          ⇄ Simulate Drag to Reschedule
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden h-[540px] flex flex-col">
            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase sticky top-0 z-10 shadow-2xs">
                  <tr>
                    <th className="p-4">Patient</th>
                    <th className="p-4">Doctor</th>
                    <th className="p-4">Treatment</th>
                    <th className="p-4">Date & Time</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApts.map((apt) => (
                    <tr key={apt.id} className="hover:bg-slate-50">
                      <td className="p-4 font-bold text-slate-900">{apt.patientName}</td>
                      <td className="p-4 text-slate-600">{apt.doctorName}</td>
                      <td className="p-4 text-slate-600">{apt.treatment}</td>
                      <td className="p-4 font-semibold text-slate-800">
                        {apt.date} @ {apt.time}
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            apt.status === 'Confirmed'
                              ? 'success'
                              : apt.status === 'Cancelled'
                                ? 'danger'
                                : 'warning'
                          }
                        >
                          {apt.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {apt.status !== 'Confirmed' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              updateAppointmentMut.mutate({ id: apt.id, data: { status: 'Confirmed' } })
                            }
                          >
                            Confirm
                          </Button>
                        )}
                        {apt.status !== 'Cancelled' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-rose-600 hover:text-rose-700"
                            onClick={() => cancelAppointmentMut.mutate(apt.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* APPOINTMENT DETAIL DRAWER */}
      <Drawer
        isOpen={!!selectedAptId}
        onClose={() => setSelectedAptId(null)}
        title={selectedApt ? `Appointment: ${selectedApt.patientName}` : 'Detail'}
      >
        {selectedApt && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <p><strong>Patient:</strong> {selectedApt.patientName}</p>
              <p><strong>Phone:</strong> {selectedApt.patientPhone}</p>
              <p><strong>Doctor:</strong> {selectedApt.doctorName}</p>
              <p><strong>Treatment:</strong> {selectedApt.treatment}</p>
              <p><strong>Slot:</strong> {selectedApt.date} at {selectedApt.time}</p>
              <p>
                <strong>Status:</strong>{' '}
                <Badge
                  size="sm"
                  variant={
                    selectedApt.status === 'Confirmed'
                      ? 'success'
                      : selectedApt.status === 'Cancelled'
                        ? 'danger'
                        : 'warning'
                  }
                >
                  {selectedApt.status}
                </Badge>
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={() => {
                  updateAppointmentMut.mutate({ id: selectedApt.id, data: { status: 'Completed' } });
                  addToast({ type: 'success', title: 'Marked Completed' });
                  setSelectedAptId(null);
                }}
              >
                Mark Completed
              </Button>
              {selectedApt.status !== 'Cancelled' && (
                <Button
                  variant="outline"
                  className="text-rose-600 border-rose-200 hover:bg-rose-50"
                  onClick={() => {
                    cancelAppointmentMut.mutate(selectedApt.id);
                    addToast({ type: 'info', title: 'Appointment Cancelled' });
                    setSelectedAptId(null);
                  }}
                >
                  Cancel Slot
                </Button>
              )}
            </div>

            {/* Reminders section for this appointment */}
            <AppointmentRemindersSection appointmentId={selectedApt.id} />
          </div>
        )}
      </Drawer>
    </div>
  );
};
