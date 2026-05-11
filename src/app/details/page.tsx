"use client";

import React from 'react';
import Notification from '@/Details/Notification/Notification';
import { useAuth } from '@/context/AuthContext';
import AdminPages from '@/Admin/AdminPages/AdminPages';

export default function NotificationsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  if (isAdmin) {
    return (
      <AdminPages>
        <Notification />
      </AdminPages>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--background, #fdfdfd)', minHeight: '100vh' }}>
      <Notification />
    </div>
  );
}
