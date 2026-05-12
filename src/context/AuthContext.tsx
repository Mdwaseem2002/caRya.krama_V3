"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ─── STORAGE KEY ──────────────────────────────────────────────────────────────
const SESSION_KEY = 'caRyaUser';

// ─── TYPES ────────────────────────────────────────────────────────────────────
// Synchronized with MongoDB IUser model
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  joinedDate: string; // Matches DB
  lastActive: string; // Matches DB
  stats: {
    savedCars: number;
    inquiries: number;
    testDrives: number;
  };
  role: 'admin' | 'customer';
  status: 'active' | 'blocked'; // Matches DB
  profilePhoto?: string;
  wishlist?: any[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role: 'admin' | 'customer', password?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, role: 'admin' | 'customer', password?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

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

  const login = async (email: string, role: 'admin' | 'customer', password?: string): Promise<{ success: boolean; error?: string }> => {
    if (role === 'admin') {
      const normalizedEmail = email.trim().toLowerCase();
      const isValidAdminEmail = normalizedEmail === 'admin@pentacloud.com' || normalizedEmail === 'admin@penta.com';

      if (isValidAdminEmail && password === 'Penta@123') {
        const adminUser: User = {
          id: 'admin_1',
          name: 'Admin',
          email: normalizedEmail,
          joinedDate: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          status: 'active',
          stats: { savedCars: 0, inquiries: 0, testDrives: 0 },
          role: 'admin',
          wishlist: []
        };

        try {
          const seedRes = await fetch('/api/admin/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: normalizedEmail, name: 'Admin', password: password }),
          });
          if (seedRes.ok) {
            const seedData = await seedRes.json();
            if (seedData.profile?.id) adminUser.id = seedData.profile.id;
            if (seedData.profile?.name) adminUser.name = seedData.profile.name;
          }
        } catch (seedErr) {
          console.warn('Admin DB seed failed:', seedErr);
        }
        
        setUser(adminUser);
        localStorage.setItem(SESSION_KEY, JSON.stringify(adminUser));
        return { success: true };
      }
      return { success: false, error: "Invalid admin credentials" };
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
        return { success: true };
      }
      return { success: false, error: data.error || "Failed to authenticate" };
    } catch (error) {
      return { success: false, error: "Network error" };
    }
  };

  const signup = async (name: string, email: string, role: 'admin' | 'customer' = 'customer', password?: string): Promise<{ success: boolean; error?: string }> => {
    if (role === 'customer') {
      try {
        const res = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
          localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));

          // Async notifications
          import("@/Details/Notification/CustomerNotify").then(({ addNotification }) => {
            addNotification(data.user.id, {
              title: "Account Created! 🎉",
              message: `Welcome to caRya.krama, ${data.user.name}.`,
              type: "system",
              cta: { label: "Explore Cars", href: "/BuyCar" }
            });
          });

          import("@/Details/Notification/AdminNotify").then(({ addAdminNotification }) => {
            addAdminNotification({
              title: "New User Signup! 👤",
              message: `${data.user.name} has joined.`,
              type: "signup" as any,
              cta: { label: "View Users", href: "/admin/users" }
            });
          }).catch(() => {});

          return { success: true };
        }
        return { success: false, error: data.error || "Failed to create account" };
      } catch (error) {
        return { success: false, error: "Network error" };
      }
    }
    return { success: false, error: "Invalid role for signup" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_KEY);
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem(SESSION_KEY, JSON.stringify(updated));
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
