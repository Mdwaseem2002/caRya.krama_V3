// ─────────────────────────────────────────────────────────────────────────────
// SellStorage.ts  (MIGRATED TO MONGODB)
// Manages pending car sell requests from users.
// All functions are now ASYNC and call /api/sell-requests.
// ─────────────────────────────────────────────────────────────────────────────

// ── TYPE DEFINITIONS (unchanged — kept for full backward compatibility) ────────

export interface SellRequest {
  id: string;
  status: "pending" | "approved" | "rejected" | "rescheduled";
  createdAt: string;

  // Owner Details
  owner: {
    name: string;
    phone: string;
    email: string;
    city: string;
  };

  // Car Details
  car: {
    brand: string;
    model: string;
    year: string;
    mileage: string;
    fuelType: string;
    transmission: string;
    ownership: string;
    regCity: string;
    expectedPrice: string;
    images: string[];
    rcCopy?: string;
  };

  // Inspection Details
  inspection: {
    date: string;
    time: string;
    location: "Home" | "Office";
    address: string;
  };
}

// ── INTERNAL HELPER ───────────────────────────────────────────────────────────

function getBaseUrl(): string {
  if (typeof window !== "undefined") return "";
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

// ── PUBLIC API ────────────────────────────────────────────────────────────────

/** Save a new sell request (called from SellForm.tsx) */
export async function saveSellRequest(
  request: Omit<SellRequest, "id" | "status" | "createdAt">
): Promise<SellRequest> {
  const res = await fetch(`${getBaseUrl()}/api/sell-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || "Failed to submit sell request");
  }

  const data = await res.json();
  const savedRequest = data.request as SellRequest;

  // Trigger Admin Notification
  if (typeof window !== "undefined") {
    import("@/Details/Notification/AdminNotify").then(async ({ addAdminNotification }) => {
      await addAdminNotification({
        title: "New Sell Request 📝",
        message: `${savedRequest.owner.name} wants to sell their ${savedRequest.car.brand} ${savedRequest.car.model}.`,
        type: "sell_request",
        cta: { label: "View Request", href: "/admin/sell-requests" }
      });
    });
  }

  return savedRequest;
}

/** Update status of a request */
export async function updateRequestStatus(
  id: string,
  status: SellRequest["status"]
): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/api/sell-requests/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!res.ok && res.status !== 404) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || "Failed to update status");
  }
}

/** Reschedule a request (updates inspection details + sets status = rescheduled) */
export async function rescheduleRequest(
  id: string,
  newInspection: SellRequest["inspection"]
): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/api/sell-requests/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inspection: newInspection }),
  });

  if (!res.ok && res.status !== 404) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || "Failed to reschedule request");
  }
}

/** Get ALL requests (admin view) */
export async function getAllSellRequests(): Promise<SellRequest[]> {
  const res = await fetch(`${getBaseUrl()}/api/sell-requests`, {
    cache: "no-store",
  });

  if (!res.ok) return [];

  const data = await res.json();
  return (data.requests || []) as SellRequest[];
}

/** Get requests for a specific user email */
export async function getUserSellRequests(email: string): Promise<SellRequest[]> {
  const res = await fetch(`${getBaseUrl()}/api/sell-requests?email=${encodeURIComponent(email)}`, {
    cache: "no-store",
  });

  if (!res.ok) return [];

  const data = await res.json();
  return (data.requests || []) as SellRequest[];
}

/** Delete a request permanently */
export async function deleteSellRequest(id: string): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/api/sell-requests/${id}`, {
    method: "DELETE",
  });

  if (!res.ok && res.status !== 404) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || "Failed to delete sell request");
  }
}
