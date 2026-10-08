import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MarketingLayout } from './layouts/MarketingLayout';
import { AppLayout } from './layouts/AppLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { RequireAuth, RequireRole, RequireActiveSubscription, RequireFeature } from './app/Guards';

// Lazy loading page components
const HomePage = lazy(() => import('./pages/public/HomePage').then((m) => ({ default: m.HomePage })));
const FeaturesPage = lazy(() => import('./pages/public/FeaturesPage').then((m) => ({ default: m.FeaturesPage })));
const PricingPage = lazy(() => import('./pages/public/PricingPage').then((m) => ({ default: m.PricingPage })));
const HowItWorksPage = lazy(() => import('./pages/public/HowItWorksPage').then((m) => ({ default: m.HowItWorksPage })));
const DemoPage = lazy(() => import('./pages/public/DemoPage').then((m) => ({ default: m.DemoPage })));
const ContactPage = lazy(() => import('./pages/public/ContactPage').then((m) => ({ default: m.ContactPage })));
const FAQPage = lazy(() => import('./pages/public/FAQPage').then((m) => ({ default: m.FAQPage })));
const LoginPage = lazy(() => import('./pages/public/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterWizardPage = lazy(() => import('./pages/public/RegisterWizardPage').then((m) => ({ default: m.RegisterWizardPage })));
const VerifyEmailPage = lazy(() => import('./pages/public/VerifyEmailPage').then((m) => ({ default: m.VerifyEmailPage })));
const ForgotPasswordPage = lazy(() => import('./pages/public/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import('./pages/public/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage })));

// Clinic App Pages
const OverviewPage = lazy(() => import('./pages/app/OverviewPage').then((m) => ({ default: m.OverviewPage })));
const ConversationsPage = lazy(() => import('./pages/app/ConversationsPage').then((m) => ({ default: m.ConversationsPage })));
const AppointmentsPage = lazy(() => import('./pages/app/AppointmentsPage').then((m) => ({ default: m.AppointmentsPage })));
const PatientsPage = lazy(() => import('./pages/app/PatientsPage').then((m) => ({ default: m.PatientsPage })));
const DoctorsPage = lazy(() => import('./pages/app/DoctorsPage').then((m) => ({ default: m.DoctorsPage })));
const KnowledgeBasePage = lazy(() => import('./pages/app/KnowledgeBasePage').then((m) => ({ default: m.KnowledgeBasePage })));
const CampaignsPage = lazy(() => import('./pages/app/CampaignsPage').then((m) => ({ default: m.CampaignsPage })));
const AnalyticsPage = lazy(() => import('./pages/app/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage })));
const WidgetPage = lazy(() => import('./pages/app/WidgetPage').then((m) => ({ default: m.WidgetPage })));
const AISettingsPage = lazy(() => import('./pages/app/AISettingsPage').then((m) => ({ default: m.AISettingsPage })));
const BillingPage = lazy(() => import('./pages/app/BillingPage').then((m) => ({ default: m.BillingPage })));
const TeamPage = lazy(() => import('./pages/app/TeamPage').then((m) => ({ default: m.TeamPage })));
const SettingsPage = lazy(() => import('./pages/app/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const OnboardingPage = lazy(() => import('./pages/app/OnboardingPage').then((m) => ({ default: m.OnboardingPage })));

// Super Admin Pages
const AdminOverviewPage = lazy(() => import('./pages/admin/AdminOverviewPage').then((m) => ({ default: m.AdminOverviewPage })));
const TenantsPage = lazy(() => import('./pages/admin/TenantsPage').then((m) => ({ default: m.TenantsPage })));
const PlansManagerPage = lazy(() => import('./pages/admin/PlansManagerPage').then((m) => ({ default: m.PlansManagerPage })));
const HealthPage = lazy(() => import('./pages/admin/HealthPage').then((m) => ({ default: m.HealthPage })));

// Errors
const ForbiddenPage = lazy(() => import('./pages/errors/ForbiddenPage').then((m) => ({ default: m.ForbiddenPage })));
const NotFoundPage = lazy(() => import('./pages/errors/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));
const TrialExpiredPage = lazy(() => import('./pages/errors/TrialExpiredPage').then((m) => ({ default: m.TrialExpiredPage })));
const SuspendedPage = lazy(() => import('./pages/errors/SuspendedPage').then((m) => ({ default: m.SuspendedPage })));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense
    fallback={
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" />
      </div>
    }
  >
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  // Public Marketing Routes
  {
    path: '/',
    element: <MarketingLayout />,
    children: [
      { index: true, element: withSuspense(HomePage) },
      { path: 'features', element: withSuspense(FeaturesPage) },
      { path: 'pricing', element: withSuspense(PricingPage) },
      { path: 'how-it-works', element: withSuspense(HowItWorksPage) },
      { path: 'demo', element: withSuspense(DemoPage) },
      { path: 'contact', element: withSuspense(ContactPage) },
      { path: 'faq', element: withSuspense(FAQPage) },
      { path: 'login', element: withSuspense(LoginPage) },
      { path: 'register', element: withSuspense(RegisterWizardPage) },
      { path: 'verify-email', element: withSuspense(VerifyEmailPage) },
      { path: 'forgot-password', element: withSuspense(ForgotPasswordPage) },
      { path: 'reset-password', element: withSuspense(ResetPasswordPage) },
    ],
  },

  // Protected Clinic App Routes
  {
    path: '/app',
    element: (
      <RequireAuth>
        <RequireActiveSubscription>
          <AppLayout />
        </RequireActiveSubscription>
      </RequireAuth>
    ),
    children: [
      {
        index: true,
        element: (
          <RequireRole permission="overview.view">
            {withSuspense(OverviewPage)}
          </RequireRole>
        ),
      },
      {
        path: 'conversations',
        element: (
          <RequireRole permission="conversations.view">
            {withSuspense(ConversationsPage)}
          </RequireRole>
        ),
      },
      {
        path: 'conversations/:id',
        element: (
          <RequireRole permission="conversations.view">
            {withSuspense(ConversationsPage)}
          </RequireRole>
        ),
      },
      {
        path: 'appointments',
        element: (
          <RequireRole permission="appointments.view">
            {withSuspense(AppointmentsPage)}
          </RequireRole>
        ),
      },
      {
        path: 'patients',
        element: (
          <RequireRole permission="patients.view">
            {withSuspense(PatientsPage)}
          </RequireRole>
        ),
      },
      {
        path: 'patients/:id',
        element: (
          <RequireRole permission="patients.view">
            {withSuspense(PatientsPage)}
          </RequireRole>
        ),
      },
      {
        path: 'doctors',
        element: (
          <RequireRole permission="doctors.view">
            {withSuspense(DoctorsPage)}
          </RequireRole>
        ),
      },
      {
        path: 'knowledge-base',
        element: (
          <RequireRole permission="knowledge.manage">
            {withSuspense(KnowledgeBasePage)}
          </RequireRole>
        ),
      },
      {
        path: 'campaigns',
        element: (
          <RequireRole permission="campaigns.manage">
            <RequireFeature featureKey="campaignsEnabled" featureName="SMS & WhatsApp Reminders Campaign Manager">
              {withSuspense(CampaignsPage)}
            </RequireFeature>
          </RequireRole>
        ),
      },
      {
        path: 'analytics',
        element: (
          <RequireRole permission="analytics.view">
            {withSuspense(AnalyticsPage)}
          </RequireRole>
        ),
      },
      {
        path: 'widget',
        element: (
          <RequireRole permission="widget.manage">
            {withSuspense(WidgetPage)}
          </RequireRole>
        ),
      },
      {
        path: 'ai-settings',
        element: (
          <RequireRole permission="aiSettings.manage">
            {withSuspense(AISettingsPage)}
          </RequireRole>
        ),
      },
      {
        path: 'billing',
        element: (
          <RequireRole permission="billing.view">
            {withSuspense(BillingPage)}
          </RequireRole>
        ),
      },
      {
        path: 'team',
        element: (
          <RequireRole permission="team.view">
            {withSuspense(TeamPage)}
          </RequireRole>
        ),
      },
      {
        path: 'settings',
        element: (
          <RequireRole permission="settings.manage">
            {withSuspense(SettingsPage)}
          </RequireRole>
        ),
      },
      {
        path: 'onboarding',
        element: withSuspense(OnboardingPage),
      },
    ],
  },

  // Super Admin Routes
  {
    path: '/admin',
    element: (
      <RequireAuth>
        <RequireRole allowedRoles={['SUPER_ADMIN']}>
          <AdminLayout />
        </RequireRole>
      </RequireAuth>
    ),
    children: [
      { index: true, element: withSuspense(AdminOverviewPage) },
      { path: 'tenants', element: withSuspense(TenantsPage) },
      { path: 'plans', element: withSuspense(PlansManagerPage) },
      { path: 'health', element: withSuspense(HealthPage) },
    ],
  },

  // Error Routes
  { path: '/403', element: withSuspense(ForbiddenPage) },
  { path: '/404', element: withSuspense(NotFoundPage) },
  { path: '/trial-expired', element: withSuspense(TrialExpiredPage) },
  { path: '/suspended', element: withSuspense(SuspendedPage) },
  { path: '*', element: <Navigate to="/404" replace /> },
]);
