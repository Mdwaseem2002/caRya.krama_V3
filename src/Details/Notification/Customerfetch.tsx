"use client";

import { useEffect, useState, useCallback } from "react";
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
 */

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [adminNotifications, setAdminNotifications] = useState<AdminNotificationData[]>([]);

  const refreshData = useCallback(() => {
    if (user) {
      if (user.role === 'customer') {
        setNotifications(getNotifications(user.id));
      } else if (user.role === 'admin') {
        setAdminNotifications(getAdminNotifications());
      }
    } else {
        setNotifications([]);
        setAdminNotifications([]);
    }
  }, [user]);

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
