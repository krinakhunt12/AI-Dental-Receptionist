import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import { useTenant } from './TenantProvider';
import { PermissionKey, hasPermission, UserRole } from '../config/permissions';
import UpgradePrompt from '../components/ui/UpgradePrompt';
import { PlanConfig } from '../config/plans';

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={`/login?next=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
};

export const RequireRole: React.FC<{
  permission?: PermissionKey;
  allowedRoles?: UserRole[];
  children: React.ReactNode;
}> = ({ permission, allowedRoles, children }) => {
  const { user } = useAuth();

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
