"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Basic user type for our mock profile data
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  joinDate: string;
  stats: {
    savedCars: number;
    inquiries: number;
    testDrives: number;
  };
  role: 'admin' | 'customer';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role: 'admin' | 'customer') => boolean;
  signup: (name: string, email: string, role: 'admin' | 'customer') => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('caRyaUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, role: 'admin' | 'customer'): boolean => {
    // Mock login - fetch from a simulated database of all users
    const allUsersStr = localStorage.getItem('caRyaUsers');
    const allUsers: User[] = allUsersStr ? JSON.parse(allUsersStr) : [];
    
    const matchedUser = allUsers.find(u => u.email === email && u.role === role);
    
    if (matchedUser) {
      setUser(matchedUser);
      localStorage.setItem('caRyaUser', JSON.stringify(matchedUser));
      return true;
    } 
    return false;
  };

  const signup = (name: string, email: string, role: 'admin' | 'customer' = 'customer') => {
    const newUser: User = {
      id: 'user_' + Date.now(),
      name,
      email,
      joinDate: new Date().toISOString(),
      stats: { savedCars: 0, inquiries: 0, testDrives: 0 },
      role
    };

    // Save to global list of users
    const allUsersStr = localStorage.getItem('caRyaUsers');
    const allUsers: User[] = allUsersStr ? JSON.parse(allUsersStr) : [];
    
    // Simple deduplication
    if (!allUsers.find(u => u.email === email)) {
      allUsers.push(newUser);
      localStorage.setItem('caRyaUsers', JSON.stringify(allUsers));
    }

    setUser(newUser);
    localStorage.setItem('caRyaUser', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('caRyaUser');
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('caRyaUser', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
