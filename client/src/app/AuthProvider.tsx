import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../config/permissions';
import { queryClient } from '../lib/queryClient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clinicId: string;
  avatarUrl?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  token: string | null;
  login: (email: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateUser: (fields: Partial<User>) => void;
}

export const AUTH_STORAGE_KEY = 'smilecare_auth_user';
export const TOKEN_STORAGE_KEY = 'smilecare_auth_token';

export const DEMO_USER: User = {
  id: 'usr_mehta_101',
  name: 'Dr. Krina Mehta',
  email: 'krina@smilecare.ai',
  role: 'OWNER',
  clinicId: 'clinic_smilecare_01',
  avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
};

/**
 * Validates the shape of a user object.
 * Requires at least id, name, role, and clinicId as non-empty strings.
 */
export function isValidUser(data: unknown): data is User {
  if (!data || typeof data !== 'object') return false;
  const candidate = data as Record<string, unknown>;

  return (
    typeof candidate.id === 'string' &&
    candidate.id.trim().length > 0 &&
    typeof candidate.name === 'string' &&
    candidate.name.trim().length > 0 &&
    typeof candidate.role === 'string' &&
    candidate.role.trim().length > 0 &&
    typeof candidate.clinicId === 'string' &&
    candidate.clinicId.trim().length > 0
  );
}

/**
 * Safely reads and validates 'smilecare_auth_user' from localStorage.
 * If JSON parsing or shape validation fails, removes the corrupted key and returns null.
 */
export function readStoredUser(): User | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (isValidUser(parsed)) {
      return parsed;
    }

    // Invalid shape: remove corrupted key
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  } catch {
    // Malformed JSON or storage access error: remove bad key
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // ignore
    }
    return null;
  }
}

/**
 * Resolves initial user based on stored data or VITE_DEMO_MODE environment flag.
 */
export function getInitialUser(): User | null {
  const stored = readStoredUser();
  if (stored) return stored;

  if (import.meta.env?.VITE_DEMO_MODE === 'true') {
    return DEMO_USER;
  }

  return null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  const [token, setToken] = useState<string | null>(() => {
    try {
      const initial = getInitialUser();
      if (!initial) return null;
      return localStorage.getItem(TOKEN_STORAGE_KEY) || 'demo_jwt_token_smilecare';
    } catch {
      return null;
    }
  });

  // Mark hydrated on client mount
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Sync user state to localStorage
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (err) {
      console.error('Failed to write smilecare_auth_user to localStorage', err);
    }
  }, [user]);

  // Sync token state to localStorage
  useEffect(() => {
    try {
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      } else {
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      }
    } catch (err) {
      console.error('Failed to write smilecare_auth_token to localStorage', err);
    }
  }, [token]);

  // Cross-tab synchronization via window 'storage' event
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      // Handles storage.clear() or explicit smilecare_auth_user mutation
      if (event.key === null || event.key === AUTH_STORAGE_KEY) {
        if (!event.newValue) {
          // Cleared or deleted in another tab
          setUser(null);
          setToken(null);
        } else {
          // Updated in another tab
          const syncedUser = readStoredUser();
          setUser(syncedUser);
          if (!syncedUser) {
            setToken(null);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // Listen for unauthorized 401 events dispatched by apiClient
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (email: string, role: UserRole = 'OWNER') => {
    queryClient.clear();
    const newUser: User = {
      id: `usr_${Math.random().toString(36).substring(2, 7)}`,
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      email,
      role,
      clinicId: role === 'SUPER_ADMIN' ? 'platform_admin' : 'clinic_smilecare_01',
      avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    };
    setUser(newUser);
    setToken(`jwt_${Date.now()}`);
  };

  const logout = () => {
    queryClient.clear();
    setUser(null);
    setToken(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      const updated = { ...user, role };
      setUser(updated);
    }
  };

  const updateUser = (fields: Partial<User>) => {
    if (user) {
      if (fields.clinicId && fields.clinicId !== user.clinicId) {
        queryClient.clear();
      }
      setUser({ ...user, ...fields });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isHydrated,
        token,
        login,
        logout,
        switchRole,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
