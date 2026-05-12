/**
 * CustomerNotify.tsx
 * Logic for Customer Notifications using MongoDB API.
 */

export type NotificationType = "wishlist" | "payment" | "report" | "system" | "inquiry";

export interface NotificationData {
  _id: string; // MongoDB ID
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: string | Date;
  cta?: { label: string; href: string };
}

export const NOTIF_EVENT = "caryakrama_new_notification";

// Helper to get current notifications from storage
export const getNotifications = async (userId: string): Promise<NotificationData[]> => {
  try {
    const res = await fetch(`/api/notifications?userId=${userId}`);
    const data = await res.json();
    if (data.success) return data.notifications;
    return [];
  } catch (e) {
    console.error("Error fetching notifications", e);
    return [];
  }
};

// Add a new notification
export const addNotification = async (userId: string, data: Omit<NotificationData, "_id" | "userId" | "read" | "createdAt">) => {
  try {
    const res = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        userId,
        read: false,
      })
    });
    const result = await res.json();
    if (result.success) {
      window.dispatchEvent(new CustomEvent(NOTIF_EVENT, { detail: { userId, notification: result.notification } }));
    }
  } catch (e) {
    console.error("Error adding notification", e);
  }
};

// Mark a single notification as read
export const markAsRead = async (notificationId: string) => {
  try {
    const res = await fetch(`/api/notifications/${notificationId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read: true })
    });
    const result = await res.json();
    if (result.success) {
      window.dispatchEvent(new CustomEvent(NOTIF_EVENT));
    }
  } catch (e) {
    console.error("Error updating notification", e);
  }
};

// Mark all as read for a specific user
export const markAllAsRead = async (userId: string) => {
  try {
    const notifs = await getNotifications(userId);
    const unread = notifs.filter(n => !n.read);
    await Promise.all(unread.map(n => markAsRead(n._id)));
  } catch (e) {
    console.error("Error marking all as read", e);
  }
};

// Delete a notification
export const deleteNotification = async (notificationId: string) => {
  try {
    const res = await fetch(`/api/notifications/${notificationId}`, {
      method: 'DELETE'
    });
    const result = await res.json();
    if (result.success) {
      window.dispatchEvent(new CustomEvent(NOTIF_EVENT));
    }
  } catch (e) {
    console.error("Error deleting notification", e);
  }
};
