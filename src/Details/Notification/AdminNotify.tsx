/**
 * AdminNotify.tsx
 * Logic for Admin Notifications using MongoDB API.
 */

export type AdminNotifType = "sell_request" | "upload" | "system" | "report" | "payment" | "signup";

export interface AdminNotificationData {
  _id: string; // MongoDB ID
  role: "admin";
  title: string;
  message: string;
  type: AdminNotifType;
  read: boolean;
  createdAt: string | Date;
  cta?: { label: string; href: string };
}

export const ADMIN_NOTIF_EVENT = "caryakrama_admin_notification";

export const getAdminNotifications = async (): Promise<AdminNotificationData[]> => {
  try {
    const res = await fetch('/api/notifications?role=admin');
    const data = await res.json();
    if (data.success) return data.notifications;
    return [];
  } catch (e) {
    console.error("Error fetching admin notifications", e);
    return [];
  }
};

export const addAdminNotification = async (data: Omit<AdminNotificationData, "_id" | "role" | "read" | "createdAt">) => {
  try {
    const res = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        role: "admin",
        read: false,
      })
    });
    const result = await res.json();
    if (result.success) {
      window.dispatchEvent(new CustomEvent(ADMIN_NOTIF_EVENT, { detail: { notification: result.notification } }));
    }
  } catch (e) {
    console.error("Error adding admin notification", e);
  }
};

export const markAdminAsRead = async (id: string) => {
  try {
    const res = await fetch(`/api/notifications/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true })
    });
    const result = await res.json();
    if (result.success) {
      window.dispatchEvent(new CustomEvent(ADMIN_NOTIF_EVENT));
    }
  } catch (e) {
    console.error("Error updating admin notification", e);
  }
};

export const markAllAdminAsRead = async () => {
    // Note: To be fully efficient, this should have a dedicated bulk update endpoint
    // For now, we'll fetch and update, but a bulk endpoint would be better.
    try {
        const notifs = await getAdminNotifications();
        const unread = notifs.filter(n => !n.read);
        await Promise.all(unread.map(n => markAdminAsRead(n._id)));
    } catch (e) {
      console.error("Error marking all admin as read", e);
    }
};

export const clearAllAdminNotifications = async () => {
  try {
    const notifs = await getAdminNotifications();
    await Promise.all(notifs.map(n => 
        fetch(`/api/notifications/${n._id}`, { method: 'DELETE' })
    ));
    window.dispatchEvent(new CustomEvent(ADMIN_NOTIF_EVENT));
  } catch (e) {
    console.error("Error clearing admin notifications", e);
  }
};
