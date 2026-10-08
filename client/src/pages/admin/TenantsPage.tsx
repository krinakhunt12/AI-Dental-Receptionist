import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { useUIStore } from '../../store/useUIStore';
import { Search, UserCheck, ShieldAlert } from 'lucide-react';

export const TenantsPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useUIStore();
  const [query, setQuery] = useState('');

  const tenants = [
    { id: 'clinic_smilecare_01', name: 'SmileCare Dental Studio', plan: 'Growth Pro', status: 'ACTIVE', mrr: 199, owner: 'Dr. Krina Mehta' },
    { id: 'clinic_bay_dental', name: 'Bay Area Orthodontics', plan: 'Enterprise Ultra', status: 'ACTIVE', mrr: 399, owner: 'Dr. Sarah Jenkins' },
    { id: 'clinic_city_care', name: 'City Dental Clinic', plan: 'Starter AI', status: 'TRIAL', mrr: 99, owner: 'Dr. Rajesh Patel' },
  ];

  const handleImpersonate = (tenantName: string) => {
    addToast({
      type: 'warning',
      title: 'Impersonation Audit Logged',
      message: `Impersonating ${tenantName}. All actions are recorded in security logs.`,
    });
    navigate('/app');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Subscribed Clinics & Tenants</h1>
          <p className="text-xs text-slate-400">View and manage tenant accounts, plans, and impersonation.</p>
        </div>
      </div>

      <div className="max-w-md">
        <Input
          icon={Search}
          placeholder="Search clinic name..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 border-b border-slate-800 font-bold text-white uppercase">
            <tr>
              <th className="p-4">Clinic Name</th>
              <th className="p-4">Owner</th>
              <th className="p-4">Plan</th>
              <th className="p-4">MRR</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {tenants.map((t) => (
              <tr key={t.id} className="hover:bg-slate-800/50">
                <td className="p-4 font-bold text-white">{t.name}</td>
                <td className="p-4">{t.owner}</td>
                <td className="p-4"><Badge variant="teal">{t.plan}</Badge></td>
                <td className="p-4 font-bold text-white">${t.mrr}/mo</td>
                <td className="p-4"><Badge variant="success">{t.status}</Badge></td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="danger"
                    icon={ShieldAlert}
                    onClick={() => handleImpersonate(t.name)}
                  >
                    Impersonate
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
