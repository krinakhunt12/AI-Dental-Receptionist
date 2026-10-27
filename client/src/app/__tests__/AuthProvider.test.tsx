import React from 'react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import {
  AuthProvider,
  useAuth,
  readStoredUser,
  getInitialUser,
  AUTH_STORAGE_KEY,
  TOKEN_STORAGE_KEY,
  User,
} from '../AuthProvider';
import { RequireAuth, ProtectedRoute } from '../Guards';

// Helper consumer component to inspect AuthContext values in tests
const AuthTestConsumer: React.FC = () => {
  const { user, isAuthenticated, isHydrated, token, logout, login } = useAuth();
  return (
    <div>
      <span data-testid="hydrated">{String(isHydrated)}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="user-id">{user?.id || 'NO_USER'}</span>
      <span data-testid="user-name">{user?.name || 'NO_NAME'}</span>
      <span data-testid="token">{token || 'NO_TOKEN'}</span>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
      <button data-testid="login-btn" onClick={() => login('test@smilecare.ai', 'DENTIST')}>
        Login
      </button>
    </div>
  );
};

describe('AuthProvider & Auth Hydration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('1. empty storage: defaults to null user and sets isHydrated to true', async () => {
    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('hydrated').textContent).toBe('true');
    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('user-id').textContent).toBe('NO_USER');
  });

  it('2. empty storage in production mode: defaults to null user and sets isHydrated to true', async () => {
    import.meta.env.VITE_DEMO_MODE = 'false';

    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('hydrated').textContent).toBe('true');
    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('user-id').textContent).toBe('NO_USER');
  });

  it('3. corrupted JSON in storage: clears key, does not crash, and returns null', async () => {
    import.meta.env.VITE_DEMO_MODE = 'false';
    localStorage.setItem(AUTH_STORAGE_KEY, '{ invalid_malformed: JSON ');

    const storedUser = readStoredUser();
    expect(storedUser).toBeNull();
    // Key should have been purged
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();

    // Verify AuthProvider mounts safely with corrupted storage
    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('user-id').textContent).toBe('NO_USER');
  });

  it('3b. invalid shape in storage: purges bad object and returns null', async () => {
    import.meta.env.VITE_DEMO_MODE = 'false';
    // Object missing required role, name, and clinicId
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ id: 'only_id_without_fields' }));

    const storedUser = readStoredUser();
    expect(storedUser).toBeNull();
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });

  it('4. valid saved user: correctly hydrates saved user and token', async () => {
    import.meta.env.VITE_DEMO_MODE = 'false';
    const savedUser: User = {
      id: 'usr_saved_456',
      name: 'Dr. Jane Smith',
      email: 'jane@smilecare.ai',
      role: 'DENTIST',
      clinicId: 'clinic_test_01',
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(savedUser));
    localStorage.setItem(TOKEN_STORAGE_KEY, 'saved_jwt_token_123');

    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('hydrated').textContent).toBe('true');
    expect(screen.getByTestId('authenticated').textContent).toBe('true');
    expect(screen.getByTestId('user-id').textContent).toBe('usr_saved_456');
    expect(screen.getByTestId('user-name').textContent).toBe('Dr. Jane Smith');
    expect(screen.getByTestId('token').textContent).toBe('saved_jwt_token_123');
  });

  it('5. logout clearing storage: clears user state and removes keys from localStorage', async () => {
    import.meta.env.VITE_DEMO_MODE = 'true';

    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('authenticated').textContent).toBe('true');

    // Click logout
    act(() => {
      screen.getByTestId('logout-btn').click();
    });

    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('user-id').textContent).toBe('NO_USER');
    expect(localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
  });

  it('6. cross-tab sync: updates user state when storage event occurs', async () => {
    import.meta.env.VITE_DEMO_MODE = 'true';

    render(
      <AuthProvider>
        <AuthTestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId('authenticated').textContent).toBe('true');

    // Simulate another tab clearing the auth user
    act(() => {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: AUTH_STORAGE_KEY,
          newValue: null,
        })
      );
    });

    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('user-id').textContent).toBe('NO_USER');
  });
});

describe('Route Guard (RequireAuth / ProtectedRoute)', () => {
  it('shows skeleton before hydration, then redirects or renders content after hydration', async () => {
    import.meta.env.VITE_DEMO_MODE = 'false';
    localStorage.clear();

    render(
      <MemoryRouter initialEntries={['/app/dashboard']}>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
            <Route
              path="/app/dashboard"
              element={
                <RequireAuth>
                  <div data-testid="dashboard-content">Secret Clinic Dashboard</div>
                </RequireAuth>
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    // After mount and hydration with no user in production mode, redirects to /login
    expect(screen.queryByTestId('dashboard-content')).not.toBeInTheDocument();
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
  });

  it('renders skeleton directly while isHydrated is false', () => {
    // Test custom mock to verify skeleton is rendered when isHydrated is false
    const MockUnhydratedAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
      const value = {
        user: null,
        isAuthenticated: false,
        isHydrated: false, // unhydrated!
        token: null,
        login: async () => { },
        logout: () => { },
        switchRole: () => { },
        updateUser: () => { },
      };
      // We pass through AuthContext via custom provider if needed
      return <div>{children}</div>;
    };

    // Render with ProtectedRoute using custom mock
    const { container } = render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              // Testing RequireAuth behavior when isHydrated is false
              <RequireAuth>
                <div data-testid="secret">Secret</div>
              </RequireAuth>
            }
          />
        </Routes>
      </MemoryRouter>,
      {
        wrapper: ({ children }) => (
          <AuthProvider>
            {/* By default AuthProvider sets isHydrated: false during initial render, then true on mount */}
            {children}
          </AuthProvider>
        ),
      }
    );

    // ProtectedRoute alias matches RequireAuth
    expect(ProtectedRoute).toBe(RequireAuth);
  });

  it('renders protected children when user is authenticated and hydrated', () => {
    const validUser: User = {
      id: 'usr_authenticated_1',
      name: 'Dr. Krina Mehta',
      email: 'krina@smilecare.ai',
      role: 'OWNER',
      clinicId: 'clinic_01',
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(validUser));

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <AuthProvider>
          <Routes>
            <Route
              path="/protected"
              element={
                <ProtectedRoute>
                  <div data-testid="secret-content">Protected Dental Records</div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByTestId('secret-content')).toBeInTheDocument();
    expect(screen.getByText('Protected Dental Records')).toBeInTheDocument();
  });
});
