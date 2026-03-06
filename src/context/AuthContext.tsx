"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { User, AuthState, LoginResponse } from '../types';
import { useRouter } from 'next/navigation';
import { useRole } from './RoleContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  googleLogin: (idToken: string, role?: string) => Promise<void>;
  appleLogin: (idToken: string, role?: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUserLocal: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { clearRole } = useRole();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await api.get<{ success: boolean; user: User }>('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
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
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (res.data.user.role) localStorage.setItem('selected_role', res.data.user.role);
      
      if (res.data.user.role === 'admin') router.push('/admin');
      else if (res.data.user.role === 'doctor') router.push('/doctor/dashboard');
      else router.push('/dashboard');
    }
  };

  const googleLogin = async (idToken: string, role?: string) => {
    const res = await api.post<LoginResponse>('/auth/google', { idToken, role });
    if (res.data.success) {
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (res.data.user.role) localStorage.setItem('selected_role', res.data.user.role);
      
      if (res.data.user.role === 'admin') router.push('/admin');
      else if (res.data.user.role === 'doctor') router.push('/doctor/dashboard');
      else router.push('/dashboard');
    }
  };

  const appleLogin = async (idToken: string, role?: string) => {
    const res = await api.post<LoginResponse>('/auth/apple', { idToken, role });
    if (res.data.success) {
      setUser(res.data.user);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (res.data.user.role) localStorage.setItem('selected_role', res.data.user.role);
      
      if (res.data.user.role === 'admin') router.push('/admin');
      else if (res.data.user.role === 'doctor') router.push('/doctor/dashboard');
      else router.push('/dashboard');
    }
  };

  const register = async (data: any) => {
    const res = await api.post<LoginResponse>('/auth/register', data);
    if (res.data.success) {
      // Don't auto-login, just redirect to login page as requested
      router.push('/login');
    }
  };

  const forgotPassword = async (email: string) => {
    const res = await api.post<{ success: boolean; message: string }>('/auth/forgot-password', { email });
    return res.data;
  };

  const logout = async () => {
    try {
      clearRole();
      await api.post('/auth/logout');
      setUser(null);
      localStorage.removeItem('user');
      router.push('/');
    } catch (error) {
      console.error('Logout failed', error);
      clearRole();
      setUser(null);
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      isLoading: loading, 
      login, 
      googleLogin,
      appleLogin,
      register, 
      forgotPassword,
      logout,
      refreshUser: checkAuth,
      updateUserLocal: (u: User) => {
        setUser(u);
        localStorage.setItem('user', JSON.stringify(u));
      }
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
