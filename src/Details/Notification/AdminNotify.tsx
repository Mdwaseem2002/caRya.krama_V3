"use client";

/**
 * AdminNotify.tsx
 * Logic for Admin Notifications using localStorage.
 */

export type AdminNotifType = "sell_request" | "upload" | "system" | "report";

export interface AdminNotificationData {
  id: string;
  role: "admin";
  title: string;
  message: string;
  type: AdminNotifType;
  read: boolean;
  createdAt: string | Date;
}

const STORAGE_KEY = "admin_notifications";
export const ADMIN_NOTIF_EVENT = "caryakrama_admin_notification";

export const getAdminNotifications = (): AdminNotificationData[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    const allNotifs: AdminNotificationData[] = JSON.parse(stored);
    return allNotifs.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (e) {
    console.error("Error parsing admin notifications", e);
    return [];
  }
};

export const addAdminNotification = (data: Omit<AdminNotificationData, "id" | "role" | "read" | "createdAt">) => {
  if (typeof window === "undefined") return;

  const newNotif: AdminNotificationData = {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
    role: "admin",
    read: false,
    createdAt: new Date().toISOString(),
  };

  const stored = localStorage.getItem(STORAGE_KEY);
  const allNotifs: AdminNotificationData[] = stored ? JSON.parse(stored) : [];
  allNotifs.push(newNotif);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(allNotifs));

  window.dispatchEvent(new CustomEvent(ADMIN_NOTIF_EVENT, { detail: { notification: newNotif } }));
  window.dispatchEvent(new Event("storage"));
};

export const markAdminAsRead = (id: string) => {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;
  
  try {
    const allNotifs: AdminNotificationData[] = JSON.parse(stored);
    const updated = allNotifs.map((n) => 
      n.id === id ? { ...n, read: true } : n
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(ADMIN_NOTIF_EVENT));
  } catch (e) {
    console.error("Error updating admin notification", e);
  }
};

export const markAllAdminAsRead = () => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
  
    try {
      const allNotifs: AdminNotificationData[] = JSON.parse(stored);
      const updated = allNotifs.map((n) => ({ ...n, read: true }));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent(ADMIN_NOTIF_EVENT));
    } catch (e) {
      console.error("Error marking all admin as read", e);
    }
};

export const clearAllAdminNotifications = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent(ADMIN_NOTIF_EVENT));
};
