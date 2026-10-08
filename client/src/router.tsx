import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import PublicLayout from './components/layout/PublicLayout';
import PortalLayout from './components/layout/PortalLayout';
import LoadingSpinner from './components/common/LoadingSpinner';
import AuthGuard from './features/auth/AuthGuard';

// Lazy loading individual feature page components for code-splitting
const LoginPage = lazy(() => import('./features/auth/LoginPage'));
const HomePage = lazy(() => import('./features/home/HomePage'));
const DashboardPage = lazy(() => import('./features/dashboard/DashboardPage'));
const ChatPage = lazy(() => import('./features/chat/ChatPage'));
const AppointmentsPage = lazy(() => import('./features/appointments/AppointmentsPage'));
const DentistsPage = lazy(() => import('./features/dentists/DentistsPage'));
const ServicesPage = lazy(() => import('./features/services/ServicesPage'));
const PatientsPage = lazy(() => import('./features/patients/PatientsPage'));
const ConversationsPage = lazy(() => import('./features/conversations/ConversationsPage'));
const KnowledgePage = lazy(() => import('./features/knowledge/KnowledgePage'));
const AnalyticsPage = lazy(() => import('./features/analytics/AnalyticsPage'));
const AboutPage = lazy(() => import('./features/about/AboutPage'));
const ContactPage = lazy(() => import('./features/contact/ContactPage'));

// Helper to wrap lazy loaded component with Suspense fallback
const withSuspense = (Component: React.LazyExoticComponent<React.ComponentType<any>>) => (
  <Suspense fallback={<LoadingSpinner />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/login',
    element: withSuspense(LoginPage),
  },
  // Public Website Theme Routes (Accessible by everyone)
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: withSuspense(HomePage),
      },
      {
        path: 'services',
        element: withSuspense(ServicesPage),
      },
      {
        path: 'dentists',
        element: withSuspense(DentistsPage),
      },
      {
        path: 'chat',
        element: withSuspense(ChatPage),
      },
      {
        path: 'appointments',
        element: withSuspense(AppointmentsPage),
      },
      {
        path: 'about',
        element: withSuspense(AboutPage),
      },
      {
        path: 'contact',
        element: withSuspense(ContactPage),
      },
    ],
  },
  // Protected Staff & Management Portal Routes (Requires AuthGuard)
  {
    path: '/',
    element: (
      <AuthGuard>
        <PortalLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: 'dashboard',
        element: withSuspense(DashboardPage),
      },
      {
        path: 'patients',
        element: withSuspense(PatientsPage),
      },
      {
        path: 'conversations',
        element: withSuspense(ConversationsPage),
      },
      {
        path: 'knowledge',
        element: withSuspense(KnowledgePage),
      },
      {
        path: 'analytics',
        element: withSuspense(AnalyticsPage),
      },
    ],
  },
  // Fallback redirect to Home Page
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
