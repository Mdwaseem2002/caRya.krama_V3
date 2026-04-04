"use client";

/**
 * SignFetch - A service layer for managing user data persistence.
 * This file handles the "saving" and "fetching" of admin and customer 
 * sign-up and login information in a persistent way using localStorage.
 */

export interface UserStats {
  savedCars: number;
  inquiries: number;
  testDrives: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  joinDate: string;
  stats: UserStats;
  role: 'admin' | 'customer';
  status: 'active' | 'inactive';
  lastActivity?: string;
}

const STORAGE_KEY = 'caRyaUsers';

/**
 * Fetches all registered users from local storage.
 * @returns An array of User objects.
 */
export const getAllUsers = (): User[] => {
  if (typeof window === 'undefined') return [];
  const usersJson = localStorage.getItem(STORAGE_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
};

/**
 * Saves a new user or updates an existing one.
 * @param userData The user information to save.
 * @returns The saved User object.
 */
export const saveUser = (userData: Omit<User, 'id' | 'joinDate' | 'stats' | 'status'>): User => {
  const users = getAllUsers();
  
  // Check if user already exists (by email and role)
  const existingUserIndex = users.findIndex(u => u.email === userData.email && u.role === userData.role);
  
  let userToSave: User;
  
  if (existingUserIndex >= 0) {
    // Update existing user metrics but keep original ID and join date
    userToSave = {
      ...users[existingUserIndex],
      ...userData,
      lastActivity: new Date().toISOString()
    };
    users[existingUserIndex] = userToSave;
  } else {
    // Create a new user
    userToSave = {
      ...userData,
      id: `user_${Date.now()}`,
      joinDate: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      status: 'active',
      stats: {
        savedCars: 0,
        inquiries: 0,
        testDrives: 0
      }
    };
    users.push(userToSave);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  return userToSave;
};

/**
 * Fetches a user by email and role for login validation.
 * Case-insensitive email check to match AuthContext's normalization.
 * @param email The user's email address.
 * @param role The user's role (admin or customer).
 * @returns The User object if found, otherwise undefined.
 */
export const getUserByEmail = (email: string, role: 'admin' | 'customer'): User | undefined => {
  const users = getAllUsers();
  return users.find(
    u => u.email.trim().toLowerCase() === email.trim().toLowerCase() && u.role === role
  );
};

/**
 * Get quick statistics about total users.
 */
export const getUserCounts = () => {
  const users = getAllUsers();
  return {
    total: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    customers: users.filter(u => u.role === 'customer').length,
    active: users.filter(u => u.status === 'active').length
  };
};
