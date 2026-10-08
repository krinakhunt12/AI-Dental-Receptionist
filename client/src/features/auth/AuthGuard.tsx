import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, authChecking } = useAuth();
  const location = useLocation();

  if (authChecking) {
    return (
      <div className="h-screen w-screen bg-slate-900 flex flex-col items-center justify-center text-slate-300">
        <LoadingSpinner message="Authenticating SmileCare AI Portal…" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
