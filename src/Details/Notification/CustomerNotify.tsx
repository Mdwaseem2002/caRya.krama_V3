"use client";

/**
 * CustomerNotify.tsx
 * Logic for Customer Notifications using localStorage.
 */

export type NotificationType = "wishlist" | "payment" | "report" | "system" | "inquiry";

export interface NotificationData {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string | Date;
  cta?: { label: string; href: string };
}

const STORAGE_KEY = "customer_notifications";
export const NOTIF_EVENT = "caryakrama_new_notification";

// Helper to get current notifications from storage
export const getNotifications = (userId: string): NotificationData[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    const allNotifs: NotificationData[] = JSON.parse(stored);
    return allNotifs.filter((n) => n.userId === userId).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (e) {
    console.error("Error parsing notifications", e);
    return [];
  }
};

// Add a new notification
export const addNotification = (userId: string, data: Omit<NotificationData, "id" | "userId" | "read" | "createdAt">) => {
  if (typeof window === "undefined") return;

  const newNotif: NotificationData = {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
    userId,
    read: false,
    createdAt: new Date().toISOString(),
  };

  const stored = localStorage.getItem(STORAGE_KEY);
  const allNotifs: NotificationData[] = stored ? JSON.parse(stored) : [];
  allNotifs.push(newNotif);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(allNotifs));

  // Dispatch custom event for real-time updates
  window.dispatchEvent(new CustomEvent(NOTIF_EVENT, { detail: { userId, notification: newNotif } }));
  
  // Also dispatch a storage event for cross-tab sync if needed
  window.dispatchEvent(new Event("storage"));
};

// Mark a single notification as read
export const markAsRead = (notificationId: string) => {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;
  
  try {
    const allNotifs: NotificationData[] = JSON.parse(stored);
    const updated = allNotifs.map((n) => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(NOTIF_EVENT));
  } catch (e) {
    console.error("Error updating notification", e);
  }
};

// Mark all as read for a specific user
export const markAllAsRead = (userId: string) => {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;

  try {
    const allNotifs: NotificationData[] = JSON.parse(stored);
    const updated = allNotifs.map((n) => 
      n.userId === userId ? { ...n, read: true } : n
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(NOTIF_EVENT));
  } catch (e) {
    console.error("Error marking all as read", e);
  }
};

// Delete a notification
export const deleteNotification = (notificationId: string) => {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return;

  try {
    const allNotifs: NotificationData[] = JSON.parse(stored);
    const updated = allNotifs.filter((n) => n.id !== notificationId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(NOTIF_EVENT));
  } catch (e) {
    console.error("Error deleting notification", e);
  }
};
