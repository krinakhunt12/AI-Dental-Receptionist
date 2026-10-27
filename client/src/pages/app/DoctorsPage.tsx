import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useDentists, createDentist } from '../../features/dentists/api';
import { useAuth } from '../../app/AuthProvider';
import { queryKeys } from '../../lib/queryKeys';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { Drawer } from '../../components/ui/Drawer';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { EmptyState } from '../../components/ui/EmptyState';
import { ErrorState } from '../../components/ui/ErrorState';
import { Plus, UserCheck, AlertCircle } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

const SPECIALTIES = [
  { value: 'General Dentistry', label: 'General Dentistry' },
  { value: 'Orthodontics', label: 'Orthodontics' },
  { value: 'Endodontics', label: 'Endodontics (Root Canal)' },
  { value: 'Periodontics', label: 'Periodontics (Gum Care)' },
  { value: 'Pediatric Dentistry', label: 'Pediatric Dentistry' },
  { value: 'Oral & Maxillofacial Surgery', label: 'Oral & Maxillofacial Surgery' },
  { value: 'Prosthodontics', label: 'Prosthodontics' },
  { value: 'Cosmetic Dentistry', label: 'Cosmetic Dentistry' },
];

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const DoctorsPage: React.FC = () => {
  const { data: doctors = [], isLoading, isError, refetch } = useDentists();
  const { addToast } = useUIStore();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [isAddDoctorOpen, setIsAddDoctorOpen] = useState(false);

  // Add Doctor Form State
  const [name, setName] = useState('');
  const [specialization, setSpecialization] = useState('General Dentistry');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [workingDays, setWorkingDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [slotDuration, setSlotDuration] = useState('30');
  const [inlineError, setInlineError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedDoc = doctors.find((d) => d.id === selectedDocId);

  const resetForm = () => {
    setName('');
    setSpecialization('General Dentistry');
    setEmail('');
    setPhone('');
    setWorkingDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
    setStartTime('09:00');
    setEndTime('17:00');
    setSlotDuration('30');
    setInlineError(null);
    setIsSubmitting(false);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsAddDoctorOpen(true);
  };

  const toggleDay = (day: string) => {
    setWorkingDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAddDoctorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInlineError(null);

    // Form Validations
    if (!name.trim()) {
      setInlineError('Doctor full name is required.');
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setInlineError('Please enter a valid email address.');
      return;
    }
    if (workingDays.length === 0) {
      setInlineError('Please select at least one active working day.');
      return;
    }
    if (startTime >= endTime) {
      setInlineError('Shift start time must be earlier than shift end time.');
      return;
    }

    setIsSubmitting(true);
    try {
      await createDentist({
        name: name.trim(),
        specialization: specialization.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        workingDays,
        startTime,
        endTime,
        slotDuration: parseInt(slotDuration, 10) || 30,
      });

      // Invalidate dentists query
      await queryClient.invalidateQueries({
        queryKey: queryKeys.dentists(user?.clinicId || ''),
      });
      // Also invalidate general dentists queries if any
      await queryClient.invalidateQueries({
        predicate: (query) => query.queryKey.includes('dentists'),
      });

      addToast({
        type: 'success',
        title: 'Doctor Added Successfully',
        message: `${name.trim()} has been registered to the clinic roster.`,
      });

      setIsAddDoctorOpen(false);
      resetForm();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create doctor profile.';
      setInlineError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Doctors & Weekly Roster</h1>
          <p className="text-xs text-slate-500">Configure doctor working hours, specialties, and price lists.</p>
        </div>

        <Button size="sm" icon={Plus} onClick={handleOpenAddModal}>
          Add New Doctor
        </Button>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Error State */}
      {!isLoading && isError && (
        <ErrorState
          title="Failed to load dentists roster"
          message="Could not retrieve doctor profiles and schedules. Please try again."
          onRetry={() => refetch()}
        />
      )}

      {/* Empty State */}
      {!isLoading && !isError && doctors.length === 0 && (
        <EmptyState
          icon={UserCheck}
          title="No Doctors Registered"
          description="Your clinic has no dentists on roster yet. Add your first doctor profile to get started."
          actionLabel="Add New Doctor"
          onAction={handleOpenAddModal}
          actionIcon={Plus}
        />
      )}

      {/* Grid */}
      {!isLoading && !isError && doctors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs h-[420px] flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={doc.avatarUrl}
                    alt={doc.name}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-teal-500/20"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{doc.name}</h3>
                    <p className="text-xs text-teal-600 font-semibold">{doc.specialty || doc.specialization}</p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-semibold">Working Days:</span>
                    <span className="font-bold text-slate-900">{doc.workingDays?.join(', ') || 'Mon-Fri'}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="font-semibold">Hours:</span>
                    <span className="font-bold text-slate-900">{doc.workingHours}</span>
                  </div>
                  {doc.phone && (
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="font-semibold">Phone:</span>
                      <span className="text-slate-900">{doc.phone}</span>
                    </div>
                  )}
                  {doc.email && (
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="font-semibold">Email:</span>
                      <span className="text-slate-900 truncate max-w-[170px]">{doc.email}</span>
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Offered Treatments ({doc.treatments.length}):
                  </span>
                  <div className="max-h-24 overflow-y-auto pr-1 space-y-1 text-xs">
                    {doc.treatments.length === 0 ? (
                      <p className="text-slate-400 italic text-[11px]">All general treatments bookable</p>
                    ) : (
                      doc.treatments.map((t, i) => (
                        <div key={i} className="flex items-center justify-between text-slate-700">
                          <span>{t.name}</span>
                          <span className="font-bold text-slate-900">${t.price} ({t.duration}m)</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedDocId(doc.id)}
                className="w-full justify-center shrink-0 mt-4"
              >
                Edit Weekly Schedule Grid
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* ADD DOCTOR MODAL */}
      <Modal
        open={isAddDoctorOpen}
        onClose={() => {
          setIsAddDoctorOpen(false);
          resetForm();
        }}
        title="Add New Doctor"
        description="Register a doctor profile, clinical specialty, working days, and default slot timings."
        size="lg"
      >
        <form onSubmit={handleAddDoctorSubmit} className="space-y-4">
          {inlineError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{inlineError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Doctor Full Name *"
              placeholder="e.g. Dr. Rajesh Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <Select
              label="Specialization *"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              options={SPECIALTIES}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. rajesh@smilecare.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Phone Number"
              placeholder="e.g. +91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Working Days Checkbox List */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-2">
              Working Days *
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_DAYS.map((day) => {
                const isSelected = workingDays.includes(day);
                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timings and Slot Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              type="time"
              label="Start Time *"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />

            <Input
              type="time"
              label="End Time *"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />

            <Select
              label="Slot Duration"
              value={slotDuration}
              onChange={(e) => setSlotDuration(e.target.value)}
              options={[
                { value: '15', label: '15 minutes' },
                { value: '30', label: '30 minutes' },
                { value: '45', label: '45 minutes' },
                { value: '60', label: '60 minutes' },
              ]}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsAddDoctorOpen(false);
                resetForm();
              }}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              Add Doctor
            </Button>
          </div>
        </form>
      </Modal>

      {/* SCHEDULE ROSTER DRAWER */}
      <Drawer
        open={!!selectedDocId}
        onClose={() => setSelectedDocId(null)}
        title={selectedDoc ? `Roster Editor: ${selectedDoc.name}` : 'Roster'}
      >
        {selectedDoc && (
          <div className="space-y-4 text-xs">
            <h4 className="font-bold text-slate-900">Weekly Availability Grid</h4>
            <div className="grid grid-cols-2 gap-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <label key={day} className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 cursor-pointer">
                  <input type="checkbox" defaultChecked={selectedDoc.workingDays?.includes(day)} />
                  <span className="font-bold">{day}</span>
                </label>
              ))}
            </div>
            <Button
              onClick={() => {
                addToast({ type: 'success', title: 'Doctor Roster Updated!' });
                setSelectedDocId(null);
              }}
              className="w-full justify-center"
            >
              Save Schedule
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  );
};

