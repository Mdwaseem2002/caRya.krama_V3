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
    coverThumbnail?: string; // Fast thumbnail for listing cards
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
    contactNumber?: string;
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

// ── IN-MEMORY CACHE (Client-side fast navigation) ─────────────────────────
const cache = {
  adminCars: { data: null as StoredCar[] | null, time: 0 },
  publishedCars: { data: null as StoredCar[] | null, time: 0 },
  singleProps: {} as Record<string, { data: StoredCar, time: number }>
};
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes – in-memory cache for SPA navigation

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
        type: "upload",
        cta: { label: "View Inventory", href: "/admin/inventory" }
      });
    });
  }

  // Invalidate cache
  cache.adminCars.time = 0;
  cache.publishedCars.time = 0;
  cache.singleProps = {};

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
  
  // Invalidate cache
  cache.adminCars.time = 0;
  cache.publishedCars.time = 0;
  if (cache.singleProps[id]) delete cache.singleProps[id];

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
export async function getAllStoredCars(forceRefresh = false): Promise<StoredCar[]> {
  const now = Date.now();
  if (!forceRefresh && cache.adminCars.data && now - cache.adminCars.time < CACHE_TTL) {
    return cache.adminCars.data;
  }

  const res = await fetch(`${getBaseUrl()}/api/cars?admin=true`, {
    cache: "no-store",   // Always fresh for admin
  });

  if (!res.ok) return [];

  const data = await res.json();
  const cars = (data.cars || []) as StoredCar[];
  
  // Update cache
  cache.adminCars = { data: cars, time: now };
  return cars;
}

/** Get only published cars (customer-facing) — uses the ultra-fast /list endpoint */
export async function getPublishedStoredCars(): Promise<StoredCar[]> {
  const now = Date.now();
  if (cache.publishedCars.data && now - cache.publishedCars.time < CACHE_TTL) {
    return cache.publishedCars.data;
  }

  // /api/cars/list is purpose-built: minimal fields, no gallery images.
  // next: { revalidate: 30 } lets Next.js cache the fetch response for 30s
  // AND lets the browser cache it too — avoids a cold MongoDB hit on every load.
  try {
    const res = await fetch(`${getBaseUrl()}/api/cars/list`, {
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      console.warn("⚠️ [CarStorage] API responded with error:", res.status);
      return [];
    }

    const data = await res.json();
    const cars = (data.cars || []) as StoredCar[];
    
    cache.publishedCars = { data: cars, time: now };
    return cars;
  } catch (error) {
    console.error("❌ [CarStorage] getPublishedStoredCars failed:", error);
    return []; // Return empty array instead of throwing to prevent component crash
  }
}

/** Get a single car by ID (Super fast for Detail pages) */
export async function getStoredCarById(id: string): Promise<StoredCar | null> {
  // 1. Check direct cache
  const now = Date.now();
  if (cache.singleProps[id] && now - cache.singleProps[id].time < CACHE_TTL) {
    return cache.singleProps[id].data;
  }

  // 2. Check list caches (ONLY if they contain full images)
  const lists = [cache.publishedCars.data, cache.adminCars.data];
  for (const list of lists) {
    if (list) {
      const found = list.find(c => c.id === id);
      // Ensure the cached version has images (isn't the lightweight /list version)
      if (found && found.media?.images?.length > 0) return found;
    }
  }

  // 3. Fallback: Network fetch for single DB document (Fast!)
  try {
    const res = await fetch(`${getBaseUrl()}/api/cars/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && data.car) {
      cache.singleProps[id] = { data: data.car, time: now };
      return data.car;
    }
    return null;
  } catch(e) {
    return null;
  }
}
