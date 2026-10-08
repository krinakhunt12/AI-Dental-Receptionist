export interface PlanFeature {
  id: string;
  name: string;
  description: string;
  includedIn: ('STARTER' | 'GROWTH' | 'ENTERPRISE')[];
}

export interface PlanConfig {
  id: 'STARTER' | 'GROWTH' | 'ENTERPRISE';
  name: string;
  badge?: string;
  popular?: boolean;
  priceMonthly: number;
  priceYearly: number; // yearly price per month (billed annually)
  description: string;
  limits: {
    maxConversationsPerMonth: number;
    maxDoctors: number;
    maxSmsPerMonth: number;
    maxKnowledgeDocs: number;
    customBranding: boolean;
    whatsappIntegration: boolean;
    campaignsEnabled: boolean;
    analyticsLevel: 'BASIC' | 'ADVANCED' | 'CUSTOM';
    widgetCustomization: 'BASIC' | 'FULL';
    supportTier: 'EMAIL' | 'PRIORITY' | 'DEDICATED';
  };
  features: string[];
}

export const PLANS: Record<'STARTER' | 'GROWTH' | 'ENTERPRISE', PlanConfig> = {
  STARTER: {
    id: 'STARTER',
    name: 'Starter AI',
    priceMonthly: 99,
    priceYearly: 79,
    description: 'Perfect for single-doctor dental practices starting with AI automation.',
    limits: {
      maxConversationsPerMonth: 300,
      maxDoctors: 2,
      maxSmsPerMonth: 200,
      maxKnowledgeDocs: 5,
      customBranding: false,
      whatsappIntegration: false,
      campaignsEnabled: false,
      analyticsLevel: 'BASIC',
      widgetCustomization: 'BASIC',
      supportTier: 'EMAIL',
    },
    features: [
      '300 AI conversations / month',
      'Up to 2 Doctor profiles',
      'Web Chat Widget',
      'Basic Knowledge Base (5 docs)',
      'Calendar Sync (Google Calendar)',
      'Basic Analytics & Reports',
      'Standard Email Support',
    ],
  },
  GROWTH: {
    id: 'GROWTH',
    name: 'Growth Pro',
    popular: true,
    badge: 'MOST POPULAR',
    priceMonthly: 199,
    priceYearly: 159,
    description: 'Ideal for multi-doctor clinics scaling bookings and patient outreach.',
    limits: {
      maxConversationsPerMonth: 1000,
      maxDoctors: 5,
      maxSmsPerMonth: 800,
      maxKnowledgeDocs: 25,
      customBranding: true,
      whatsappIntegration: true,
      campaignsEnabled: true,
      analyticsLevel: 'ADVANCED',
      widgetCustomization: 'FULL',
      supportTier: 'PRIORITY',
    },
    features: [
      '1,000 AI conversations / month',
      'Up to 5 Doctor profiles & rosters',
      'Web Chat + WhatsApp Integration',
      'Advanced Knowledge Base (25 docs)',
      'Automated SMS/WhatsApp Campaigns',
      'Custom Branding & Color Themes',
      'Advanced Analytics & PDF Reports',
      'Priority 24/7 Support',
    ],
  },
  ENTERPRISE: {
    id: 'ENTERPRISE',
    name: 'Enterprise Ultra',
    badge: 'FOR CLINIC GROUPS',
    priceMonthly: 399,
    priceYearly: 319,
    description: 'For dental groups, DSO chains, and high-volume multi-location practices.',
    limits: {
      maxConversationsPerMonth: 5000,
      maxDoctors: 20,
      maxSmsPerMonth: 3000,
      maxKnowledgeDocs: 100,
      customBranding: true,
      whatsappIntegration: true,
      campaignsEnabled: true,
      analyticsLevel: 'CUSTOM',
      widgetCustomization: 'FULL',
      supportTier: 'DEDICATED',
    },
    features: [
      '5,000 AI conversations / month',
      'Up to 20 Doctor profiles',
      'Multi-location support',
      'Unlimited Knowledge Base docs',
      'Custom Voice AI Call Answering',
      'Dedicated Account Manager',
      'HIPAA & GDPR Compliance Pack',
      'Custom API & PMS Integrations',
    ],
  },
};
