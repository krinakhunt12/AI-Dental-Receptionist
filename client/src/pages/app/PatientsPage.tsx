import React, { useState } from 'react';
import { usePatientsQuery } from '../../api/mockClient';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Drawer } from '../../components/ui/Drawer';
import { useUIStore } from '../../store/useUIStore';
import { Search, Download, Plus, User, Phone, Mail, Calendar, FileText } from 'lucide-react';

export const PatientsPage: React.FC = () => {
  const { data: patients = [] } = usePatientsQuery();
  const { addToast } = useUIStore();
  const [query, setQuery] = useState('');
  const [selectedPatId, setSelectedPatId] = useState<string | null>(null);

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.phone.includes(query) ||
      p.email.toLowerCase().includes(query.toLowerCase())
  );

  const selectedPatient = patients.find((p) => p.id === selectedPatId);

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
          <p className="text-xs text-slate-500">Manage patient records, tags, and AI chat histories.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" icon={Download} onClick={handleExportCSV}>
            Export CSV
          </Button>
          <Button size="sm" icon={Plus}>
            Add Patient
          </Button>
        </div>
      </div>

      <div className="max-w-md">
        <Input
          icon={Search}
          placeholder="Search by name, phone, or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-600 uppercase">
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
            {filtered.map((pat) => (
              <tr
                key={pat.id}
                onClick={() => setSelectedPatId(pat.id)}
                className="hover:bg-teal-50/50 cursor-pointer"
              >
                <td className="p-4">
                  <div className="font-bold text-slate-900">{pat.name}</div>
                  <div className="text-[11px] text-slate-400">{pat.age} yrs • {pat.gender}</div>
                </td>
                <td className="p-4">
                  <div className="text-slate-800 font-medium">{pat.phone}</div>
                  <div className="text-[11px] text-slate-400">{pat.email}</div>
                </td>
                <td className="p-4">
                  <Badge variant="teal">{pat.source}</Badge>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {pat.tags.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 font-bold text-slate-900">{pat.totalVisits} visits</td>
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
              <p><strong>Medical History:</strong> {selectedPatient.medicalHistory.join(', ')}</p>
              <p><strong>Last Visit:</strong> {selectedPatient.lastVisit}</p>
              <p><strong>Total Appointments:</strong> {selectedPatient.totalVisits}</p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900">Patient Notes</h4>
              <textarea
                className="w-full text-xs p-3 rounded-xl border border-slate-200"
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
