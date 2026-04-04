"use client";

// ─────────────────────────────────────────────────────────────────────────────
// UserStore.ts  (MIGRATED TO MONGODB)
// All functions are now ASYNC and call /api/users.
// ─────────────────────────────────────────────────────────────────────────────

// ── TYPE DEFINITIONS (unchanged) ──────────────────────────────────────────────

export interface UserReport {
  id: string;
  carName: string;
  purchaseDate: string;
  amount: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  status: "active" | "blocked";
  joinedDate: string;
  lastActive: string;
  reportsPurchased: UserReport[];
  totalSpend: number;
}

// ── INTERNAL HELPER ───────────────────────────────────────────────────────────

function getBaseUrl(): string {
  if (typeof window !== "undefined") return "";
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

// ── PUBLIC API ────────────────────────────────────────────────────────────────

/** Get all users */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const res = await fetch(`${getBaseUrl()}/api/users`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.users || []) as User[];
  } catch {
    return [];
  }
};

/** Update a user by ID */
export const updateUser = async (
  id: string,
  updates: Partial<User>
): Promise<User | null> => {
  try {
    const res = await fetch(`${getBaseUrl()}/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.user as User;
  } catch {
    return null;
  }
};

/** Delete a user by ID */
export const deleteUser = async (id: string): Promise<void> => {
  try {
    await fetch(`${getBaseUrl()}/api/users/${id}`, { method: "DELETE" });
  } catch (e) {
    console.error("[UserStore] Failed to delete user:", e);
  }
};

/** Toggle user status between active ↔ blocked */
export const toggleUserStatus = async (id: string): Promise<User | null> => {
  const users = await getAllUsers();
  const user = users.find((u) => u.id === id);
  if (!user) return null;

  const newStatus = user.status === "active" ? "blocked" : "active";
  return updateUser(id, { status: newStatus });
};

/** Toggle user role between admin ↔ customer */
export const toggleUserRole = async (id: string): Promise<User | null> => {
  const users = await getAllUsers();
  const user = users.find((u) => u.id === id);
  if (!user) return null;

  const newRole = user.role === "admin" ? "customer" : "admin";
  return updateUser(id, { role: newRole });
};
