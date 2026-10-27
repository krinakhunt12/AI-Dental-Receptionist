import { useState } from 'react';
import { useAppointmentsQuery } from './hooks/useAppointmentsQuery';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';

const STATUSES: { v: string; label: string }[] = [
  { v: 'Confirmed', label: 'Confirmed' },
  { v: 'Pending', label: 'Pending' },
  { v: 'Completed', label: 'Completed' },
  { v: 'Cancelled', label: 'Cancelled' },
  { v: 'No-show', label: 'No-show' },
];

export default function AppointmentsPage() {
  const {
    appointments: rows,
    services,
    dentists,
    isLoading,
    isError,
    isRefetching,
    refetch,
    createAppointment,
    updateStatus,
    deleteAppointment,
  } = useAppointmentsQuery();

  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [showModal, setShowModal] = useState(false);

  // Form State for New Appointment Modal
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [dentistId, setDentistId] = useState('');
  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('10:00');
  const [submitting, setSubmitting] = useState(false);

  const activeServiceId = serviceId || (services[0]?.id ?? '');
  const activeDentistId = dentistId || (dentists[0]?.id ?? '');

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!patientName || !patientPhone || !date || !time) {
      alert('Please fill out all required fields.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await createAppointment({
        serviceId: activeServiceId,
        dentistId: activeDentistId,
        date,
        time,
        patientName,
        patientPhone,
      });
      setShowModal(false);
      setPatientName('');
      setPatientPhone('');
    } catch (err: unknown) {
      const msg =
        (err as { message?: string })?.message ||
        'Failed to book appointment. Please check availability.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const filteredRows = rows.filter((a) => {
    const matchesFilter = filter === 'all' || a.status.toLowerCase() === filter.toLowerCase();
    const q = search.toLowerCase();
    const serviceName = a.treatment || '';
    const doctorName = a.doctorName || '';
    const matchesSearch =
      !q ||
      a.patientName.toLowerCase().includes(q) ||
      serviceName.toLowerCase().includes(q) ||
      doctorName.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const totalBooked = rows.filter((a) => a.status === 'Confirmed' || a.status === 'Pending').length;
  const totalCompleted = rows.filter((a) => a.status === 'Completed').length;
  const totalCancelled = rows.filter((a) => a.status === 'Cancelled' || a.status === 'No-show').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
      case 'booked':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Completed':
      case 'completed':
        return 'bg-blue-50 text-blue-800 border-blue-300';
      case 'Cancelled':
      case 'cancelled':
        return 'bg-rose-50 text-rose-800 border-rose-300';
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full p-8 flex flex-col gap-6 font-sans">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-heading">Appointments Dashboard & Calendar</h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time view of all appointments scheduled by the AI receptionist or clinic front-desk staff.
          </p>
        </div>

        <button
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 cursor-pointer"
          onClick={() => setShowModal(true)}
        >
          <span>➕ Book New Appointment</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-700 border border-teal-100 flex items-center justify-center text-xl shrink-0">
            📅
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-slate-900 leading-tight font-heading">{rows.length}</span>
            <span className="text-xs text-slate-500 font-medium">Total Appointments</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center text-xl shrink-0">
            🟢
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-slate-900 leading-tight font-heading">{totalBooked}</span>
            <span className="text-xs text-slate-500 font-medium">Upcoming / Booked</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center text-xl shrink-0">
            ✔️
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-slate-900 leading-tight font-heading">{totalCompleted}</span>
            <span className="text-xs text-slate-500 font-medium">Completed Visits</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-700 border border-rose-100 flex items-center justify-center text-xl shrink-0">
            ❌
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-slate-900 leading-tight font-heading">{totalCancelled}</span>
            <span className="text-xs text-slate-500 font-medium">Cancelled / No-Show</span>
          </div>
        </div>
      </div>

      {/* Filter & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 bg-white border border-slate-200 focus-within:border-teal-500 focus-within:ring-3 focus-within:ring-teal-500/15 rounded-xl p-2.5 shadow-xs transition-all flex-1 min-w-[260px]">
          <span className="text-base text-slate-400 pl-1">🔍</span>
          <input
            className="flex-1 bg-transparent text-sm text-slate-900 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by patient, service, or dentist name…"
          />
        </div>

        <div className="flex items-center gap-3">
          <select
            className="bg-white border border-slate-200 text-slate-800 text-xs font-semibold px-3 py-2.5 rounded-xl shadow-xs focus:outline-none focus:border-teal-500 cursor-pointer"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Statuses ({rows.length})</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <span>{isRefetching ? 'Refreshing…' : '🔄 Refresh'}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-xl text-sm font-medium" role="alert">
          {error}
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <Skeleton className="h-6 w-52" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {!isLoading && isError && (
        <ErrorState
          title="Failed to load appointments"
          message="Could not load appointment roster or clinical services. Please try again."
          onRetry={() => refetch()}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && filteredRows.length === 0 && (
        <EmptyState
          title="No Appointments Found"
          description={
            rows.length === 0
              ? 'No appointments are booked yet. Click "Book New Appointment" to create one!'
              : 'No appointments match your search criteria.'
          }
          actionLabel="Book New Appointment"
          onAction={() => setShowModal(true)}
        />
      )}

      {/* Appointments Table */}
      {!isLoading && !isError && filteredRows.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="p-4">Date & Time</th>
                <th className="p-4">Patient Information</th>
                <th className="p-4">Requested Service</th>
                <th className="p-4">Assigned Dentist</th>
                <th className="p-4">Status & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-sm">
              {filteredRows.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{a.date}</div>
                    <div className="text-xs text-slate-500 mt-0.5">🕒 {a.time}</div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-900">👤 {a.patientName}</div>
                    <div className="text-xs text-slate-500 mt-0.5">📞 {a.patientPhone}</div>
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-slate-200">
                      🦷 {a.treatment || 'General Service'}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-800">
                    👨‍⚕️ {a.doctorName || 'Staff Dentist'}
                  </td>
                  <td className="p-4 flex items-center gap-3">
                    <select
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border cursor-pointer outline-none transition-all ${getStatusColor(a.status)}`}
                      value={a.status}
                      onChange={(e) => updateStatus(a.id, e.target.value)}
                      aria-label={`Status for ${a.patientName}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s.v} value={s.v}>
                          {s.label}
                        </option>
                      ))}
                    </select>

                    <button
                      className="text-slate-400 hover:text-rose-600 text-xs font-semibold cursor-pointer"
                      onClick={() => deleteAppointment(a.id)}
                      title="Cancel appointment"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Appointment Modal Form */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title="Book New Appointment"
        description="Select service procedure, assigned dentist, and calendar time slot."
        size="lg"
      >
        <form onSubmit={handleCreate} className="flex flex-col gap-3.5">
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase">Patient Full Name</label>
            <input
              className="w-full px-3.5 py-2 mt-1 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="e.g. Rahul Patel"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase">Phone Number</label>
            <input
              className="w-full px-3.5 py-2 mt-1 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500"
              value={patientPhone}
              onChange={(e) => setPatientPhone(e.target.value)}
              placeholder="e.g. +91 9876543210"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase">Service Procedure</label>
              <select
                className="w-full px-3.5 py-2 mt-1 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 bg-white cursor-pointer"
                value={activeServiceId}
                onChange={(e) => setServiceId(e.target.value)}
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} (${s.price})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase">Assigned Dentist</label>
              <select
                className="w-full px-3.5 py-2 mt-1 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500 bg-white cursor-pointer"
                value={activeDentistId}
                onChange={(e) => setDentistId(e.target.value)}
              >
                {dentists.map((d) => (
                  <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase">Appointment Date</label>
              <input
                type="date"
                className="w-full px-3.5 py-2 mt-1 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase">Start Time</label>
              <input
                type="time"
                className="w-full px-3.5 py-2 mt-1 border border-slate-200 rounded-xl text-sm outline-none focus:border-teal-500"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md shadow-teal-600/20 cursor-pointer disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Booking…' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
