"use client";

// ─────────────────────────────────────────────────────────────────────────────
// AnalyticsStore.ts  (MIGRATED TO MONGODB)
// All functions are now ASYNC and call /api/analytics and /api/payments.
// ─────────────────────────────────────────────────────────────────────────────

// ── TYPE DEFINITIONS (unchanged) ──────────────────────────────────────────────

export interface PaymentRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  carId: string;
  amount: number;
  date: string;
  status: string;
}

export interface AnalyticsStats {
  totalVisitors: number;
  totalReportDownloads: number;
}

// ── INTERNAL HELPER ───────────────────────────────────────────────────────────

function getBaseUrl(): string {
  if (typeof window !== "undefined") return "";
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

// ── PUBLIC API ────────────────────────────────────────────────────────────────

/** Increment visitor count (called on page load) */
export const incrementVisitorCount = async (): Promise<void> => {
  try {
    await fetch(`${getBaseUrl()}/api/analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "visitor" }),
    });
  } catch (e) {
    // Silent fail — analytics should never break the UX
    console.warn("[Analytics] Failed to increment visitor count:", e);
  }
};

/** Increment report downloads count (called after successful report download) */
export const incrementReportDownloads = async (): Promise<void> => {
  try {
    await fetch(`${getBaseUrl()}/api/analytics`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "report" }),
    });
  } catch (e) {
    console.warn("[Analytics] Failed to increment report downloads:", e);
  }
};

/** Get current analytics stats */
export const getAnalyticsStats = async (): Promise<AnalyticsStats> => {
  try {
    const res = await fetch(`${getBaseUrl()}/api/analytics`, {
      cache: "no-store",
    });
    if (!res.ok) return { totalVisitors: 0, totalReportDownloads: 0 };
    const data = await res.json();
    return (data.stats as AnalyticsStats) || { totalVisitors: 0, totalReportDownloads: 0 };
  } catch {
    return { totalVisitors: 0, totalReportDownloads: 0 };
  }
};

/** Add payment record */
export const logPayment = async (
  payment: Omit<PaymentRecord, "id" | "date">
): Promise<PaymentRecord> => {
  const res = await fetch(`${getBaseUrl()}/api/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payment),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || "Failed to log payment");
  }

  const data = await res.json();
  return data.payment as PaymentRecord;
};

/** Get all payments */
export const getAllPayments = async (): Promise<PaymentRecord[]> => {
  try {
    const res = await fetch(`${getBaseUrl()}/api/payments`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.payments || []) as PaymentRecord[];
  } catch {
    return [];
  }
};
