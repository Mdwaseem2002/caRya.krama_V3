"use client";

import React from 'react';
import EditProfile from '@/Profile/EditProfile';
import EditAdminProfile from '@/Admin/AdminUse/EditAdminProfile';
import { useAuth } from '@/context/AuthContext';

export default function EditProfilePageContent() {
  const { user } = useAuth();

  return (
    <div className="bg-gray-50/50 min-h-screen">
      {user?.role === 'admin' ? <EditAdminProfile /> : <EditProfile />}
    </div>
  );
}
