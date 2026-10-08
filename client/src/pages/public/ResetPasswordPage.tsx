import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Lock, ArrowRight } from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToast } = useUIStore();
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({ type: 'success', title: 'Password Updated', message: 'You can now log in.' });
    navigate('/login');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-white">Create New Password</h1>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-left space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            icon={Lock}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" icon={ArrowRight} className="w-full justify-center">
            Save New Password
          </Button>
        </form>
      </div>
    </div>
  );
};
