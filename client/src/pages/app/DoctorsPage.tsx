import React, { useState } from 'react';
import { useDoctorsQuery } from '../../api/mockClient';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Drawer } from '../../components/ui/Drawer';
import { Plus, UserCheck, Clock, DollarSign, Calendar } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

export const DoctorsPage: React.FC = () => {
  const { data: doctors = [] } = useDoctorsQuery();
  const { addToast } = useUIStore();
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  const selectedDoc = doctors.find((d) => d.id === selectedDocId);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Doctors & Weekly Roster</h1>
          <p className="text-xs text-slate-500">Configure doctor working hours, specialties, and price lists.</p>
        </div>

        <Button size="sm" icon={Plus} onClick={() => addToast({ type: 'info', title: 'Add Doctor Modal' })}>
          Add New Doctor
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <div
            key={doc.id}
            className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <img
                src={doc.avatarUrl}
                alt={doc.name}
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-teal-500/20"
              />
              <div>
                <h3 className="text-base font-bold text-slate-900">{doc.name}</h3>
                <p className="text-xs text-teal-600 font-semibold">{doc.specialty}</p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-semibold">Working Days:</span>
                <span className="font-bold text-slate-900">{doc.workingDays.join(', ')}</span>
              </div>
              <div className="flex items-center justify-between text-slate-700">
                <span className="font-semibold">Hours:</span>
                <span className="font-bold text-slate-900">{doc.workingHours}</span>
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Offered Treatments ({doc.treatments.length}):
              </span>
              <div className="space-y-1 text-xs">
                {doc.treatments.map((t, i) => (
                  <div key={i} className="flex items-center justify-between text-slate-700">
                    <span>{t.name}</span>
                    <span className="font-bold text-slate-900">${t.price} ({t.duration}m)</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedDocId(doc.id)}
              className="w-full justify-center"
            >
              Edit Weekly Schedule Grid
            </Button>
          </div>
        ))}
      </div>

      <Drawer
        isOpen={!!selectedDocId}
        onClose={() => setSelectedDocId(null)}
        title={selectedDoc ? `Roster Editor: ${selectedDoc.name}` : 'Roster'}
      >
        {selectedDoc && (
          <div className="space-y-4 text-xs">
            <h4 className="font-bold text-slate-900">Weekly Availability Grid</h4>
            <div className="grid grid-cols-2 gap-3">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <label key={day} className="flex items-center gap-2 p-3 rounded-xl border border-slate-200">
                  <input type="checkbox" defaultChecked={selectedDoc.workingDays.includes(day)} />
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
