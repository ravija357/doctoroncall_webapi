"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { User, AuthState, LoginResponse } from '../types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await api.get<{ success: boolean; user: User }>('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        if (res.data.user.role) localStorage.setItem('selected_role', res.data.user.role);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: any) => {
    const res = await api.post<LoginResponse>('/auth/login', data);
    if (res.data.success) {
      setUser(res.data.user);
      if (res.data.user.role) localStorage.setItem('selected_role', res.data.user.role);
      if (res.data.user.role) localStorage.setItem('selected_role', res.data.user.role);
      
      if (res.data.user.role === 'admin') router.push('/admin');
      else if (res.data.user.role === 'doctor') router.push('/doctor/dashboard');
      else router.push('/dashboard');
    }
  };

  const register = async (data: any) => {
    const res = await api.post<LoginResponse>('/auth/register', data);
    if (res.data.success) {
      setUser(res.data.user);
      if (res.data.user.role) localStorage.setItem('selected_role', res.data.user.role);
      router.push('/dashboard');
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      setUser(null);
      localStorage.removeItem('selected_role');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed', error);
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading: loading, 
      login, 
      register, 
      logout,
      refreshUser: checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
