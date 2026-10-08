import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../config/permissions';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  clinicId: string;
  avatarUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (email: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateUser: (fields: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: 'usr_mehta_101',
  name: 'Dr. Krina Mehta',
  email: 'krina@smilecare.ai',
  role: 'OWNER',
  clinicId: 'clinic_smilecare_01',
  avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('smilecare_auth_user');
    return saved ? JSON.parse(saved) : DEMO_USER;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('smilecare_auth_token') || 'demo_jwt_token_smilecare';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('smilecare_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('smilecare_auth_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('smilecare_auth_token', token);
    } else {
      localStorage.removeItem('smilecare_auth_token');
    }
  }, [token]);

  const login = async (email: string, role: UserRole = 'OWNER') => {
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
    setUser(null);
    setToken(null);
  };

  const switchRole = (role: UserRole) => {
    if (user) {
      const updated = { ...user, role };
      setUser(updated);
    }
  };

  const updateUser = (fields: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...fields });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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
