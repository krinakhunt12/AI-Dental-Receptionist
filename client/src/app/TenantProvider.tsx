import React, { createContext, useContext, useState, useEffect } from 'react';
import { PLANS, PlanConfig } from '../config/plans';

export type TenantStatus = 'ACTIVE' | 'TRIAL' | 'TRIAL_EXPIRED' | 'SUSPENDED';

export interface TenantUsage {
  conversationsUsed: number;
  conversationsMax: number;
  doctorsUsed: number;
  doctorsMax: number;
  smsUsed: number;
  smsMax: number;
  knowledgeDocsUsed: number;
  knowledgeDocsMax: number;
}

export interface TenantInfo {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  brandColor: string;
  planId: 'STARTER' | 'GROWTH' | 'ENTERPRISE';
  status: TenantStatus;
  trialDaysLeft?: number;
  usage: TenantUsage;
}

interface TenantContextType {
  tenant: TenantInfo;
  plan: PlanConfig;
  updateBrandColor: (color: string) => void;
  updatePlan: (planId: 'STARTER' | 'GROWTH' | 'ENTERPRISE') => void;
  updateStatus: (status: TenantStatus) => void;
  hasFeature: (featureKey: keyof PlanConfig['limits']) => boolean;
}

const DEFAULT_TENANT: TenantInfo = {
  id: 'clinic_smilecare_01',
  name: 'SmileCare Dental Studio',
  slug: 'smilecare-studio',
  logoUrl: '',
  brandColor: '#0d9488', // Teal
  planId: 'GROWTH',
  status: 'ACTIVE',
  trialDaysLeft: 12,
  usage: {
    conversationsUsed: 640,
    conversationsMax: 1000,
    doctorsUsed: 3,
    doctorsMax: 5,
    smsUsed: 210,
    smsMax: 800,
    knowledgeDocsUsed: 14,
    knowledgeDocsMax: 25,
  },
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenant, setTenant] = useState<TenantInfo>(() => {
    const saved = localStorage.getItem('smilecare_tenant_info');
    return saved ? JSON.parse(saved) : DEFAULT_TENANT;
  });

  const plan = PLANS[tenant.planId] || PLANS.GROWTH;

  useEffect(() => {
    localStorage.setItem('smilecare_tenant_info', JSON.stringify(tenant));
    // Apply brand color CSS variable dynamically
    if (tenant.brandColor) {
      document.documentElement.style.setProperty('--brand-primary', tenant.brandColor);
    }
  }, [tenant]);

  const updateBrandColor = (color: string) => {
    setTenant((prev) => ({ ...prev, brandColor: color }));
  };

  const updatePlan = (planId: 'STARTER' | 'GROWTH' | 'ENTERPRISE') => {
    const newPlanLimits = PLANS[planId].limits;
    setTenant((prev) => ({
      ...prev,
      planId,
      usage: {
        ...prev.usage,
        conversationsMax: newPlanLimits.maxConversationsPerMonth,
        doctorsMax: newPlanLimits.maxDoctors,
        smsMax: newPlanLimits.maxSmsPerMonth,
        knowledgeDocsMax: newPlanLimits.maxKnowledgeDocs,
      },
    }));
  };

  const updateStatus = (status: TenantStatus) => {
    setTenant((prev) => ({ ...prev, status }));
  };

  const hasFeature = (featureKey: keyof PlanConfig['limits']): boolean => {
    const val = plan.limits[featureKey];
    return typeof val === 'boolean' ? val : true;
  };

  return (
    <TenantContext.Provider
      value={{
        tenant,
        plan,
        updateBrandColor,
        updatePlan,
        updateStatus,
        hasFeature,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) throw new Error('useTenant must be used within a TenantProvider');
  return context;
};
