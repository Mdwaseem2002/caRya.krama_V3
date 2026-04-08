"use client";

import React from 'react';
import Profile from '@/Profile/Profile';
import AdminProfile from '@/Admin/AdminUse/AdminProfile';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (user?.role === 'admin') {
      router.push('/admin/dashboard');
    }
  }, [user, router]);
  
  return (
    <div className="bg-gray-50/50 min-h-screen">
      {user?.role === 'admin' ? (
        <div className="flex items-center justify-center min-h-screen font-bold text-gray-400 uppercase tracking-widest animate-pulse">
           Redirecting to Admin Dashboard...
        </div>
      ) : <Profile />}
    </div>
  );
}
