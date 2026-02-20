"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

type Role = 'doctor' | 'patient' | null;

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  isLoading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load role from localStorage on mount
    const savedRole = localStorage.getItem('selected_role') as Role;
    if (savedRole && (savedRole === 'doctor' || savedRole === 'patient')) {
      setRoleState(savedRole);
    }
    setIsLoading(false);
  }, []);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
    if (newRole) {
      localStorage.setItem('selected_role', newRole);
    } else {
      localStorage.removeItem('selected_role');
    }
  };

  return (
    <RoleContext.Provider value={{ role, setRole, isLoading }}>
      {children}
    </RoleContext.Provider>
  );
}

export const useRole = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
