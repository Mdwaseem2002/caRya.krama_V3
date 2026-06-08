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
  isSold?: boolean;
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

/** Manually invalidate ALL caches (call after any direct API mutation) */
export function invalidateCarCache(id?: string) {
  // Always clear ALL list caches so the Buy page reflects changes immediately
  cache.adminCars.time = 0;
  cache.publishedCars.time = 0;
  cache.adminCars.data = null;
  cache.publishedCars.data = null;
  // Also clear single-car cache
  if (id && cache.singleProps[id]) delete cache.singleProps[id];
  else cache.singleProps = {};
}

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
    import("@/Details/Notification/AdminNotify").then(async ({ addAdminNotification }) => {
      await addAdminNotification({
        title: "New Car Uploaded 🚗",
        message: `${savedCar.title} is now live.`,
        type: "upload",
        cta: { label: "View Car", href: `/car/${savedCar.id}` }
      });
    });
  }

  // Invalidate all caches
  invalidateCarCache();

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
  
  // Invalidate all caches
  invalidateCarCache(id);

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

  // Invalidate all caches
  invalidateCarCache(id);
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
  try {
    const res = await fetch(`${getBaseUrl()}/api/cars/list`, {
      cache: "no-store", // Always fetch fresh data — sold status must update immediately
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
  const now = Date.now();
  
  // 1. Check direct cache (singleProps)
  // If it exists and has images, use it.
  if (cache.singleProps[id] && now - cache.singleProps[id].time < CACHE_TTL) {
    const cached = cache.singleProps[id].data;
    if (cached.media?.images && cached.media.images.length > 0) {
      return cached;
    }
  }

  // 2. Check list caches (adminCars or publishedCars)
  // Only use if they contain full images (rare for list caches due to optimization)
  const lists = [cache.adminCars.data, cache.publishedCars.data];
  for (const list of lists) {
    if (list) {
      const found = list.find(c => c.id === id);
      // We need images for the edit/detail views
      if (found && found.media?.images && found.media.images.length > 0) {
        return found;
      }
    }
  }

  // 3. Fallback: Network fetch for single DB document
  // This endpoint (/api/cars/[id]) ALWAYS returns the full document with images.
  try {
    const res = await fetch(`${getBaseUrl()}/api/cars/${id}`, {
      cache: "no-store" // Always get fresh data when requested by ID
    });
    if (!res.ok) return null;
    
    const data = await res.json();
    if (data.success && data.car) {
      const fullCar = data.car as StoredCar;
      // Update the singleProps cache with the full version
      cache.singleProps[id] = { data: fullCar, time: now };
      return fullCar;
    }
    return null;
  } catch(e) {
    console.error(`[CarStorage] Failed to fetch car ${id}:`, e);
    return null;
  }
}
