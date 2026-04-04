"use client";

import React from 'react';
import Profile from '@/Profile/Profile';
import AdminProfile from '@/Admin/AdminUse/AdminProfile';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  
  return (
    <div className="bg-gray-50/50 min-h-screen">
      {user?.role === 'admin' ? <AdminProfile /> : <Profile />}
    </div>
  );
}
