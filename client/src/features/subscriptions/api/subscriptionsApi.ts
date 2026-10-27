import { apiClient } from '../../../lib/apiClient';
import { Invoice } from '../../../types';

export interface SubscriptionData {
  id: string;
  clinicId: string;
  planId: string;
  status: string;
  billingPeriod: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelledAt?: string | null;
  plan?: {
    id: string;
    name: string;
    code: string;
    priceMonthly: number;
    priceYearly: number;
    maxDoctors: number;
    maxAppointmentsPerMonth: number;
    maxAiCallsPerMonth: number;
    features: any;
  };
  invoices?: Invoice[];
}

export async function getSubscription(): Promise<SubscriptionData> {
  const res = await apiClient<{ success: boolean; data: SubscriptionData }>('/subscriptions');
  return res.data;
}

export async function getInvoices(): Promise<Invoice[]> {
  const res = await apiClient<{ success: boolean; data: Invoice[] }>('/subscriptions/invoices');
  return res.data || [];
}

export async function updateSubscriptionPlan(data: {
  planCode: string;
  billingPeriod?: 'MONTHLY' | 'YEARLY';
}): Promise<SubscriptionData> {
  const res = await apiClient<{ success: boolean; data: SubscriptionData }>('/subscriptions/plan', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function cancelSubscription(): Promise<SubscriptionData> {
  const res = await apiClient<{ success: boolean; data: SubscriptionData }>('/subscriptions/cancel', {
    method: 'POST',
  });
  return res.data;
}
