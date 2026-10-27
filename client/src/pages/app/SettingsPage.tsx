import React, { useState, useEffect } from 'react';
import { useClinicProfile, useUpdateClinicProfile } from '../../features/clinic/hooks/useClinicProfile';
import { useTenant } from '../../app/TenantProvider';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Skeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';
import { useUIStore } from '../../store/useUIStore';
import { Settings, Save, Palette, Phone, AlertTriangle, Globe } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { tenant, updateBrandColor } = useTenant();
  const { addToast } = useUIStore();

  const { data: profile, isLoading, isError, refetch } = useClinicProfile();
  const updateProfileMutation = useUpdateClinicProfile();

  const [clinicName, setClinicName] = useState('');
  const [phone, setPhone] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [timezone, setTimezone] = useState('America/New_York');
  const [brandColor, setBrandColor] = useState('#0d9488');

  useEffect(() => {
    if (profile) {
      setClinicName(profile.name || tenant.name);
      setPhone(profile.phone || '+1 (555) 234-5678');
      setEmergencyPhone(profile.emergencyPhone || '+1 (555) 911-CARE');
      setTimezone(profile.timezone || 'America/New_York');
      setBrandColor(profile.brandColor || tenant.brandColor || '#0d9488');
    }
  }, [profile, tenant]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(
      {
        name: clinicName,
        phone,
        emergencyPhone,
        timezone,
        brandColor,
      },
      {
        onSuccess: () => {
          updateBrandColor(brandColor);
          addToast({
            type: 'success',
            title: 'Clinic Settings Saved',
            message: 'Practice profile, emergency phone, and timezone successfully updated.',
          });
        },
        onError: (err: any) => {
          addToast({
            type: 'error',
            title: 'Failed to update settings',
            message: err?.message || 'Server rejected changes.',
          });
        },
      }
    );
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-teal-600" />
          Clinic Settings & Practice Profile
        </h1>
        <p className="text-xs text-slate-500">
          Configure clinic details, contact numbers, emergency escalation phones, and timezone.
        </p>
      </div>

      {isLoading && (
        <div className="p-6 bg-white rounded-2xl border border-slate-200 space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      )}

      {!isLoading && isError && (
        <ErrorState
          title="Failed to load clinic settings"
          message="Could not retrieve practice configuration from the server."
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !isError && (
        <form onSubmit={handleSave} className="p-6 bg-white rounded-2xl border border-slate-200 space-y-6">
          <Input
            label="Practice / Clinic Name"
            value={clinicName}
            onChange={(e) => setClinicName(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Primary Phone Number"
              icon={Phone}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
            />
            <Input
              label="After-Hours Emergency Hotline"
              icon={AlertTriangle}
              value={emergencyPhone}
              onChange={(e) => setEmergencyPhone(e.target.value)}
              placeholder="+1 (555) 911-0000"
            />
          </div>

          <Select
            label="Practice Timezone"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            options={[
              { value: 'America/New_York', label: 'Eastern Time (US & Canada) - America/New_York' },
              { value: 'America/Chicago', label: 'Central Time (US & Canada) - America/Chicago' },
              { value: 'America/Denver', label: 'Mountain Time (US & Canada) - America/Denver' },
              { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada) - America/Los_Angeles' },
              { value: 'Asia/Kolkata', label: 'India Standard Time - Asia/Kolkata' },
              { value: 'Europe/London', label: 'Greenwich Mean Time - Europe/London' },
            ]}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
              Primary Brand Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                className="w-10 h-10 rounded-xl border cursor-pointer"
              />
              <span className="font-mono text-xs">{brandColor}</span>
            </div>
          </div>

          <Button type="submit" icon={Save} isLoading={updateProfileMutation.isPending}>
            Save Clinic Settings
          </Button>
        </form>
      )}
    </div>
  );
};
