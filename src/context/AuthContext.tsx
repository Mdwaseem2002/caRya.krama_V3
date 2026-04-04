"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ─── STORAGE KEY ──────────────────────────────────────────────────────────────
// This is shared with SignFetch.tsx so both read/write the same data store.
const STORAGE_KEY = 'caRyaUsers';
const SESSION_KEY = 'caRyaUser';

// ─── TYPES ────────────────────────────────────────────────────────────────────
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
  status: 'active' | 'inactive';
  lastActivity?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role: 'admin' | 'customer') => boolean;
  signup: (name: string, email: string, role: 'admin' | 'customer') => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── PROVIDER ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Restore active session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem(SESSION_KEY);
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  /**
   * LOGIN — reads from `caRyaUsers` (the same store SignFetch uses).
   * Matches by email (case-insensitive, trimmed) AND role.
   */
  const login = (email: string, role: 'admin' | 'customer'): boolean => {
    const allUsersStr = localStorage.getItem(STORAGE_KEY);
    const allUsers: User[] = allUsersStr ? JSON.parse(allUsersStr) : [];

    const matchedUser = allUsers.find(
      u =>
        u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
        u.role === role
    );

    if (matchedUser) {
      // Update lastActivity on successful login
      const updated = { ...matchedUser, lastActivity: new Date().toISOString() };
      const updatedAll = allUsers.map(u => (u.id === updated.id ? updated : u));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAll));
      localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      setUser(updated);
      return true;
    }

    return false;
  };

  /**
   * SIGNUP — saves to `caRyaUsers` (the same store SignFetch uses).
   * Deduplication is by email + role, so the same email can register
   * as both admin and customer separately.
   */
  const signup = (name: string, email: string, role: 'admin' | 'customer' = 'customer') => {
    const allUsersStr = localStorage.getItem(STORAGE_KEY);
    const allUsers: User[] = allUsersStr ? JSON.parse(allUsersStr) : [];

    // Check for duplicate (same email + same role)
    const alreadyExists = allUsers.some(
      u =>
        u.email.trim().toLowerCase() === email.trim().toLowerCase() &&
        u.role === role
    );

    const newUser: User = {
      id: 'user_' + Date.now(),
      name,
      email: email.trim().toLowerCase(),
      joinDate: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      status: 'active',
      stats: { savedCars: 0, inquiries: 0, testDrives: 0 },
      role,
    };

    if (!alreadyExists) {
      allUsers.push(newUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allUsers));
    }

    setUser(newUser);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
  };

  /**
   * LOGOUT — clears the active session but leaves `caRyaUsers` intact.
   */
  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  /**
   * UPDATE PROFILE — patches the current user in both session and main store.
   */
  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };

    // Sync back to the all-users store
    const allUsersStr = localStorage.getItem(STORAGE_KEY);
    const allUsers: User[] = allUsersStr ? JSON.parse(allUsersStr) : [];
    const synced = allUsers.map(u => (u.id === updated.id ? updated : u));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(synced));

    setUser(updated);
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── HOOK ─────────────────────────────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
