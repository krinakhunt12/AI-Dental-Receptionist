import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { SiteLayout } from './components/layout/SiteLayout';

const HomePage = lazy(() => import('./pages/HomePage').then((m) => ({ default: m.HomePage })));
const ServicesPage = lazy(() => import('./pages/ServicesPage').then((m) => ({ default: m.ServicesPage })));
const DentistsPage = lazy(() => import('./pages/DentistsPage').then((m) => ({ default: m.DentistsPage })));
const BookPage = lazy(() => import('./pages/BookPage').then((m) => ({ default: m.BookPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const ChatPage = lazy(() => import('./pages/ChatPage').then((m) => ({ default: m.ChatPage })));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

const withSuspense = (Component: React.ComponentType) => (
  <Suspense
    fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
        <span className="sr-only">Loading page</span>
      </div>
    }
  >
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { path: '/', element: withSuspense(HomePage) },
      { path: '/services', element: withSuspense(ServicesPage) },
      { path: '/dentists', element: withSuspense(DentistsPage) },
      { path: '/book', element: withSuspense(BookPage) },
      { path: '/contact', element: withSuspense(ContactPage) },
      { path: '/chat', element: withSuspense(ChatPage) },
      { path: '*', element: withSuspense(NotFoundPage) },
    ],
  },
]);
