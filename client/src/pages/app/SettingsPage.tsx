import React, { useState } from 'react';
import { useTenant } from '../../app/TenantProvider';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useUIStore } from '../../store/useUIStore';
import { Settings, Save, Palette, Globe, Shield } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { tenant, updateBrandColor } = useTenant();
  const { addToast } = useUIStore();
  const [clinicName, setClinicName] = useState(tenant.name);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({ type: 'success', title: 'Clinic Profile Updated!' });
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-teal-600" />
          Clinic Settings & Profile
        </h1>
        <p className="text-xs text-slate-500">Configure clinic details, brand colors, and integrations.</p>
      </div>

      <form onSubmit={handleSave} className="p-6 bg-white rounded-2xl border border-slate-200 space-y-6">
        <Input
          label="Clinic Practice Name"
          value={clinicName}
          onChange={(e) => setClinicName(e.target.value)}
        />

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
            Primary Brand Color
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={tenant.brandColor || '#0d9488'}
              onChange={(e) => updateBrandColor(e.target.value)}
              className="w-10 h-10 rounded-xl border cursor-pointer"
            />
            <span className="font-mono text-xs">{tenant.brandColor}</span>
          </div>
        </div>

        <Button type="submit" icon={Save}>
          Save Settings
        </Button>
      </form>
    </div>
  );
};
