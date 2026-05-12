"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  getNotifications, 
  NOTIF_EVENT, 
  NotificationData,
} from "./CustomerNotify";
import { 
    getAdminNotifications, 
    ADMIN_NOTIF_EVENT, 
    AdminNotificationData 
} from "./AdminNotify";

/**
 * Customerfetch.tsx
 * Custom hook to fetch and synchronize notifications for the active user.
 * Now supports preference-based filtering for admins.
 */

interface AdminPreferences {
  notifyUploads: boolean;
  notifyPayments: boolean;
  notifyReports: boolean;
  notifySignups: boolean;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [rawAdminNotifications, setRawAdminNotifications] = useState<AdminNotificationData[]>([]);
  const [adminPrefs, setAdminPrefs] = useState<AdminPreferences | null>(null);

  // Fetch admin preferences once if user is admin
  useEffect(() => {
    if (user?.role === 'admin' && !adminPrefs) {
      fetch(`/api/admin/profile?email=${user.email}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.profile) {
            const p = data.profile;
            setAdminPrefs({
              notifyUploads: p.notifications?.notifyUploads ?? true,
              notifyPayments: p.notifications?.notifyPayments ?? true,
              notifyReports: p.notifications?.notifyReports ?? false,
              notifySignups: p.notifications?.notifySignups ?? true,
            });
          }
        })
        .catch(err => console.error("Error fetching admin preferences for notifications", err));
    }
  }, [user, adminPrefs]);

  const refreshData = useCallback(async () => {
    if (user) {
      if (user.role === 'customer') {
        const data = await getNotifications(user.id);
        setNotifications(data);
      } else if (user.role === 'admin') {
        const data = await getAdminNotifications();
        setRawAdminNotifications(data);
      }
    } else {
        setNotifications([]);
        setRawAdminNotifications([]);
    }
  }, [user]);

  // Apply filtering based on preferences
  const adminNotifications = useMemo(() => {
    if (!adminPrefs) return rawAdminNotifications;

    return rawAdminNotifications.filter(notif => {
      // Core notifications always show
      if (notif.type === 'sell_request' || notif.type === 'system') return true;

      // Filtered based on preferences
      if (notif.type === 'upload' && !adminPrefs.notifyUploads) return false;
      if (notif.type === 'payment' && !adminPrefs.notifyPayments) return false;
      if (notif.type === 'report' && !adminPrefs.notifyReports) return false;
      if (notif.type === 'signup' && !adminPrefs.notifySignups) return false;

      return true;
    });
  }, [rawAdminNotifications, adminPrefs]);

  useEffect(() => {
    refreshData();

    // Listen for custom events to update UI in real-time
    const handleUpdate = () => refreshData();
    const handleStorage = (e: StorageEvent) => {
        if (e.key === "customer_notifications" || e.key === "admin_notifications") {
            refreshData();
        }
    };

    window.addEventListener(NOTIF_EVENT, handleUpdate);
    window.addEventListener(ADMIN_NOTIF_EVENT, handleUpdate);
    window.addEventListener("storage", handleStorage as any);

    return () => {
      window.removeEventListener(NOTIF_EVENT, handleUpdate);
      window.removeEventListener(ADMIN_NOTIF_EVENT, handleUpdate);
      window.removeEventListener("storage", handleStorage as any);
    };
  }, [refreshData]);

  return {
    notifications,
    adminNotifications,
    unreadCount: notifications.filter(n => !n.read).length,
    adminUnreadCount: adminNotifications.filter(n => !n.read).length,
    refreshNotifications: refreshData
  };
}
