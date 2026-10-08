import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen theme-light bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">403 - Access Forbidden</h1>
        <p className="text-xs text-slate-500">
          Your current user role does not have permission to view this page. Contact your clinic owner to request access.
        </p>
        <Button onClick={() => navigate('/app')} icon={ArrowLeft} className="w-full justify-center">
          Back to Overview
        </Button>
      </div>
    </div>
  );
};
