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
  wishlist?: any[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role: 'admin' | 'customer', password?: string) => Promise<boolean>;
  signup: (name: string, email: string, role: 'admin' | 'customer', password?: string) => Promise<boolean>;
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
   * LOGIN
   */
  const login = async (email: string, role: 'admin' | 'customer', password?: string): Promise<boolean> => {
    if (role === 'admin') {
      const normalizedEmail = email.trim().toLowerCase();
      const isValidAdminEmail = normalizedEmail === 'admin@pentacloud.com' || normalizedEmail === 'admin@penta.com';

      if (isValidAdminEmail && password === 'Penta@123') {
        const adminUser: User = {
          id: 'admin_1',
          name: 'Admin',
          email: 'admin@Pentacloud.com', // Keep correct format in user object
          joinDate: new Date().toISOString(),
          lastActivity: new Date().toISOString(),
          status: 'active',
          stats: { savedCars: 0, inquiries: 0, testDrives: 0 },
          role: 'admin',
          wishlist: []
        };
        
        setUser(adminUser);
        localStorage.setItem(SESSION_KEY, JSON.stringify(adminUser));
        return true;
      }
      return false;
    }

    if (role === 'customer') {
      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
          return true;
        }
      } catch (error) {
        console.error('Login error:', error);
      }
      return false;
    }

    return false;
  };

  /**
   * SIGNUP
   */
  const signup = async (name: string, email: string, role: 'admin' | 'customer' = 'customer', password?: string): Promise<boolean> => {
    if (role === 'customer') {
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        if (res.ok) {
          const data = await res.json();
          // Auto login by setting the user session immediately
          setUser(data.user);
          localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
          return true;
        }
      } catch (error) {
        console.error('Signup error:', error);
      }
      return false;
    }
    return false;
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
