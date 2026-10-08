import React, { useState } from 'react';
import {
  useAppointmentsQuery,
  useDoctorsQuery,
  useRescheduleAppointmentMutation,
  useUpdateAppointmentStatusMutation,
} from '../../api/mockClient';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Select } from '../../components/ui/Select';
import { Drawer } from '../../components/ui/Drawer';
import { useUIStore } from '../../store/useUIStore';
import { Calendar as CalendarIcon, Clock, User, Plus, Filter, CheckCircle2 } from 'lucide-react';

export const AppointmentsPage: React.FC = () => {
  const { data: appointments = [] } = useAppointmentsQuery();
  const { data: doctors = [] } = useDoctorsQuery();
  const rescheduleMut = useRescheduleAppointmentMutation();
  const updateStatusMut = useUpdateAppointmentStatusMutation();
  const { addToast } = useUIStore();

  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('ALL');
  const [selectedAptId, setSelectedAptId] = useState<string | null>(null);

  const filteredApts = appointments.filter(
    (a) => selectedDoctorId === 'ALL' || a.doctorId === selectedDoctorId
  );

  const selectedApt = appointments.find((a) => a.id === selectedAptId);

  // Drag-to-reschedule simulation helper
  const handleSimulateDragReschedule = (aptId: string) => {
    rescheduleMut.mutate(
      { id: aptId, newDate: '2026-10-12', newTime: '14:00' },
      {
        onSuccess: () => {
          addToast({
            type: 'success',
            title: 'Slot Dragged & Rescheduled!',
            message: 'Moved appointment to Oct 12 at 14:00. Confirmation SMS queued.',
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

        <div className="flex items-center gap-3">
          <Select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Doctors' },
              ...doctors.map((d) => ({ value: d.id, label: d.name })),
            ]}
          />

          <div className="inline-flex p-1 bg-slate-200/70 rounded-xl">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                viewMode === 'calendar' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg ${
                viewMode === 'list' ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              List View
            </button>
          </div>
        </div>
      </div>

      {/* CALENDAR OR LIST VIEW */}
      {viewMode === 'calendar' ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">October 2026 Grid Schedule</h3>
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
                        <Badge size="sm" variant={apt.status === 'Confirmed' ? 'success' : 'warning'}>
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
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase">
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
                    <Badge variant={apt.status === 'Confirmed' ? 'success' : 'warning'}>
                      {apt.status}
                    </Badge>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        updateStatusMut.mutate({ id: apt.id, status: 'Confirmed' })
                      }
                    >
                      Confirm
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
            </div>
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={() => {
                  updateStatusMut.mutate({ id: selectedApt.id, status: 'Completed' });
                  addToast({ type: 'success', title: 'Marked Completed' });
                  setSelectedAptId(null);
                }}
              >
                Mark Completed
              </Button>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};
