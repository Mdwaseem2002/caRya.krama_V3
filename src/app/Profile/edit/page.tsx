"use client";

import { useState, useEffect } from 'react';
import EditProfile from '@/Profile/EditProfile';
import EditAdminProfile from '@/Admin/AdminUse/EditAdminProfile';
import { useAuth } from '@/context/AuthContext';

export default function EditProfilePage() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="min-h-screen flex items-center justify-center text-gray-500 font-semibold">Loading Profile...</div>;

  return (
    <div className="bg-gray-50/50 min-h-screen">
      {user?.role === 'admin' ? <EditAdminProfile /> : <EditProfile />}
    </div>
  );
}
