import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { useTenant } from './TenantProvider';
import { PermissionKey, hasPermission, UserRole } from '../config/permissions';
import { UpgradePrompt } from '../components/ui/UpgradePrompt';
import { PlanConfig } from '../config/plans';

/**
 * Full-screen skeleton displayed during initial auth state hydration
 * to prevent flashing the login screen or premature redirection.
 */
export const AuthHydrationSkeleton: React.FC = () => (
  <div
    data-testid="auth-hydration-skeleton"
    className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-white p-6"
  >
    <div className="w-full max-w-md space-y-4 animate-pulse">
      <div className="h-10 w-44 bg-slate-800 rounded-lg mx-auto" />
      <div className="h-4 w-60 bg-slate-800/60 rounded-md mx-auto" />
      <div className="h-60 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 mt-6">
        <div className="h-4 bg-slate-800 rounded w-3/4" />
        <div className="h-4 bg-slate-800 rounded w-1/2" />
        <div className="h-10 bg-slate-800 rounded-lg mt-8" />
      </div>
    </div>
  </div>
);

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isHydrated, user } = useAuth();
  const location = useLocation();

  if (!isHydrated) {
    return <AuthHydrationSkeleton />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
};

export const ProtectedRoute = RequireAuth;

export const RequireRole: React.FC<{
  permission?: PermissionKey;
  allowedRoles?: UserRole[];
  children: React.ReactNode;
}> = ({ permission, allowedRoles, children }) => {
  const { user, isHydrated } = useAuth();

  if (!isHydrated) {
    return <AuthHydrationSkeleton />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  if (permission && !hasPermission(user.role, permission)) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
};

export const RequireActiveSubscription: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tenant } = useTenant();
  const location = useLocation();

  // Billing page should always be accessible even if expired or suspended!
  if (location.pathname.startsWith('/app/billing')) {
    return <>{children}</>;
  }

  if (tenant.status === 'TRIAL_EXPIRED') {
    return <Navigate to="/trial-expired" replace />;
  }

  if (tenant.status === 'SUSPENDED') {
    return <Navigate to="/suspended" replace />;
  }

  return <>{children}</>;
};

export const RequireFeature: React.FC<{
  featureKey: keyof PlanConfig['limits'];
  featureName: string;
  requiredPlanName?: string;
  children: React.ReactNode;
}> = ({ featureKey, featureName, requiredPlanName = 'Growth Pro', children }) => {
  const { plan } = useTenant();

  const isEnabled = plan.limits[featureKey];

  if (!isEnabled) {
    return (
      <div className="p-6 md:p-8 max-w-4xl mx-auto">
        <UpgradePrompt
          featureName={featureName}
          requiredPlanName={requiredPlanName}
          description={`Your current ${plan.name} plan does not include ${featureName}. Upgrade your subscription to unlock this capability.`}
        />
      </div>
    );
  }

  return <>{children}</>;
};
