import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, queryKeys, type User, type Health, type UserRole } from '../../api';

interface AuthContextType {
  user: User | null;
  health: Health | null;
  offline: boolean;
  authChecking: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role?: UserRole; phone?: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('smilecare_user');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('smilecare_token'));
  const [authChecking, setAuthChecking] = useState(true);

  // Health Query using TanStack Query
  const { data: healthData, isError: healthError } = useQuery({
    queryKey: queryKeys.health,
    queryFn: () => api.health(),
    refetchInterval: 30000,
  });

  // Verify Session Query
  useEffect(() => {
    if (token) {
      api.me()
        .then((res) => {
          setUser(res.user);
          localStorage.setItem('smilecare_user', JSON.stringify(res.user));
        })
        .catch(() => {
          localStorage.removeItem('smilecare_token');
          localStorage.removeItem('smilecare_user');
          setUser(null);
          setToken(null);
        })
        .finally(() => setAuthChecking(false));
    } else {
      setAuthChecking(false);
    }
  }, [token]);

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: ({ email, pass }: { email: string; pass: string }) => api.login(email, pass),
    onSuccess: (res) => {
      localStorage.setItem('smilecare_token', res.token);
      localStorage.setItem('smilecare_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      queryClient.invalidateQueries();
    },
  });

  // Register Mutation
  const registerMutation = useMutation({
    mutationFn: (data: { name: string; email: string; password: string; role?: UserRole; phone?: string }) =>
      api.register(data),
    onSuccess: (res) => {
      localStorage.setItem('smilecare_token', res.token);
      localStorage.setItem('smilecare_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      queryClient.invalidateQueries();
    },
  });

  // Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: () => api.logout(),
    onSuccess: () => {
      localStorage.removeItem('smilecare_token');
      localStorage.removeItem('smilecare_user');
      setUser(null);
      setToken(null);
      queryClient.clear();
    },
    onError: () => {
      localStorage.removeItem('smilecare_token');
      localStorage.removeItem('smilecare_user');
      setUser(null);
      setToken(null);
      queryClient.clear();
    },
  });

  const handleLogin = async (email: string, pass: string) => {
    await loginMutation.mutateAsync({ email, pass });
  };

  const handleRegister = async (data: { name: string; email: string; password: string; role?: UserRole; phone?: string }) => {
    await registerMutation.mutateAsync(data);
  };

  const handleLogout = async () => {
    await logoutMutation.mutateAsync();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        health: healthData ?? null,
        offline: healthError,
        authChecking,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
