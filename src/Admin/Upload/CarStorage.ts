// ─────────────────────────────────────────────────────────────────────────────
// CarStorage.ts  (MIGRATED TO MONGODB)
// Single source of truth for car data storage.
// Admin saves here → Customer fetches from here.
// All functions are now ASYNC and call /api/cars instead of localStorage.
// ─────────────────────────────────────────────────────────────────────────────

// ── TYPE DEFINITIONS (unchanged — kept for full backward compatibility) ────────

export interface StoredCar {
  id: string;
  title: string;
  brand: string;
  model: string;
  year: string;
  status: "draft" | "published";
  createdAt: string;
  media: {
    coverImage: string;
    images: string[];
  };
  pricing: {
    sellingPrice: string;
    actualPrice: string;
    savings: string;
  };
  specs: {
    fuelType: string;
    transmission: string;
    mileage: string;
    ownership: string;
    color: string;
    warranty: boolean;
  };
  condition: {
    conditionLabel: string;
    score: string;
    highlights: string[];
    inspectionPoints: { title: string; value: string; highlight?: boolean }[];
    serviceHistory: string[];
  };
  sellerDetails: {
    name: string;
    type: string;
    memberSince: string;
  };
  location: {
    area: string;
    city: string;
  };
  tags: string[];
}

// ── INTERNAL HELPER ───────────────────────────────────────────────────────────

/**
 * Returns the base URL for API calls.
 * Works in browser (relative) and server contexts (absolute via env).
 */
function getBaseUrl(): string {
  if (typeof window !== "undefined") return ""; // Browser: use relative URL
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
}

// ── PUBLIC API ────────────────────────────────────────────────────────────────

export async function saveCarToStorage(
  car: Omit<StoredCar, "createdAt"> | any
): Promise<StoredCar> {
  const res = await fetch(`${getBaseUrl()}/api/cars`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(car),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || "Failed to save car");
  }

  const data = await res.json();
  const savedCar = data.car as StoredCar;

  // Trigger Admin Notification
  if (typeof window !== "undefined") {
    import("@/Details/Notification/AdminNotify").then(({ addAdminNotification }) => {
      addAdminNotification({
        title: "Car Uploaded Successfully ✅",
        message: `You uploaded ${savedCar.title}.`,
        type: "upload"
      });
    });
  }

  return savedCar;
}

/** Update an existing car by ID (call from Uploadcar.tsx when editing) */
export async function updateCarInStorage(
  id: string,
  updates: Omit<StoredCar, "id" | "createdAt">
): Promise<StoredCar | null> {
  const res = await fetch(`${getBaseUrl()}/api/cars/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (res.status === 404) return null;

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || "Failed to update car");
  }

  const data = await res.json();
  return data.car as StoredCar;
}

/** Delete a car by ID */
export async function deleteCarFromStorage(id: string): Promise<void> {
  const res = await fetch(`${getBaseUrl()}/api/cars/${id}`, {
    method: "DELETE",
  });

  if (!res.ok && res.status !== 404) {
    const err = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(err.error || "Failed to delete car");
  }
}

/** Get ALL cars (admin view — includes drafts) */
export async function getAllStoredCars(): Promise<StoredCar[]> {
  const res = await fetch(`${getBaseUrl()}/api/cars?admin=true`, {
    cache: "no-store",   // Always fresh for admin
  });

  if (!res.ok) return [];

  const data = await res.json();
  return (data.cars || []) as StoredCar[];
}

/** Get only published cars (customer-facing) */
export async function getPublishedStoredCars(): Promise<StoredCar[]> {
  const res = await fetch(`${getBaseUrl()}/api/cars?status=published`, {
    next: { revalidate: 30 }, // Cache for 30s for public-facing pages
  });

  if (!res.ok) return [];

  const data = await res.json();
  return (data.cars || []) as StoredCar[];
}
