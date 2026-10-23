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
const CACHE_TTL = 15 * 1000; // 15 seconds – short cache to reflect newly uploaded cars immediately

// ── PUBLIC API ────────────────────────────────────────────────────────────────

/** Manually invalidate ALL caches (call after any direct API mutation) */
export function invalidateCarCache(id?: string) {
  // Always clear ALL list caches so the Buy page reflects changes immediately
  cache.adminCars.time = 0;
  cache.publishedCars.time = 0;
  cache.adminCars.data = null;
  cache.publishedCars.data = null;
  if (typeof window !== "undefined") {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(ADMIN_STORAGE_KEY);
      window.dispatchEvent(new CustomEvent("caryakrama:cars-updated"));
    } catch {}
  }
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

const ADMIN_STORAGE_KEY = "carya_admin_cars";

/** Get synchronously cached admin cars (for instant zero-latency UI rendering in Admin) */
export function getCachedAdminCars(): StoredCar[] {
  if (cache.adminCars.data && cache.adminCars.data.length > 0) {
    return cache.adminCars.data;
  }
  if (typeof window !== "undefined") {
    try {
      const stored = sessionStorage.getItem(ADMIN_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          cache.adminCars.data = parsed;
          cache.adminCars.time = Date.now();
          return parsed;
        }
      }
    } catch {}
  }
  return [];
}

/** Get ALL cars (admin view — includes drafts) */
export async function getAllStoredCars(forceRefresh = false): Promise<StoredCar[]> {
  const now = Date.now();
  if (!forceRefresh && cache.adminCars.data && now - cache.adminCars.time < CACHE_TTL) {
    return cache.adminCars.data;
  }

  try {
    const res = await fetch(`${getBaseUrl()}/api/cars/list?admin=true`, {
      cache: "no-store",   // Always fresh for admin
    });

    if (!res.ok) {
      const cached = getCachedAdminCars();
      return cached.length > 0 ? cached : [];
    }

    const data = await res.json();
    const cars = (data.cars || []) as StoredCar[];
    
    // Update cache
    cache.adminCars = { data: cars, time: now };
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(cars));
      } catch {}
    }
    return cars;
  } catch (err) {
    console.error("Failed to fetch admin cars:", err);
    return getCachedAdminCars();
  }
}

const STORAGE_KEY = "carya_published_cars";

/** Get synchronously cached cars (for instant zero-latency UI rendering) */
export function getCachedPublishedCars(): StoredCar[] {
  if (cache.publishedCars.data && cache.publishedCars.data.length > 0) {
    return cache.publishedCars.data;
  }
  if (typeof window !== "undefined") {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          cache.publishedCars.data = parsed;
          cache.publishedCars.time = Date.now();
          return parsed;
        }
      }
    } catch {}
  }
  return [];
}

// In-flight deduplication promise
let inFlightPublishedCars: Promise<StoredCar[]> | null = null;

/** Get only published cars (customer-facing) — uses the ultra-fast /list endpoint */
export async function getPublishedStoredCars(forceRefresh = false): Promise<StoredCar[]> {
  const now = Date.now();
  
  // Return in-memory cache if fresh and not forcing refresh
  if (!forceRefresh && cache.publishedCars.data && cache.publishedCars.data.length > 0 && now - cache.publishedCars.time < CACHE_TTL) {
    return cache.publishedCars.data;
  }

  // Check persistent browser storage (localStorage / sessionStorage) as fallback
  const cachedFromStorage = getCachedPublishedCars();

  // If a network request is already running, wait for it
  if (inFlightPublishedCars) {
    return inFlightPublishedCars;
  }

  inFlightPublishedCars = (async () => {
    try {
      const res = await fetch(`${getBaseUrl()}/api/cars/list`, {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        console.warn("⚠️ [CarStorage] API responded with error:", res.status);
        return cachedFromStorage.length > 0 ? cachedFromStorage : (cache.publishedCars.data || []);
      }

      const data = await res.json();
      const cars = (data.cars || []) as StoredCar[];
      
      if (Array.isArray(cars)) {
        cache.publishedCars = { data: cars, time: Date.now() };
        if (typeof window !== "undefined") {
          try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cars));
          } catch {}
        }
      }
      
      return cars;
    } catch (error) {
      console.error("❌ [CarStorage] getPublishedStoredCars failed:", error);
      return cachedFromStorage.length > 0 ? cachedFromStorage : (cache.publishedCars.data || []);
    } finally {
      inFlightPublishedCars = null;
    }
  })();

  return inFlightPublishedCars;
}

/** Get a single car by ID (Super fast for Detail pages) */
export async function getStoredCarById(id: string): Promise<StoredCar | null> {
  const now = Date.now();
  
  // 1. Check direct cache (singleProps)
  if (cache.singleProps[id] && now - cache.singleProps[id].time < CACHE_TTL) {
    return cache.singleProps[id].data;
  }

  // 2. Check list caches (adminCars or publishedCars or localStorage)
  const lists = [cache.adminCars.data, cache.publishedCars.data, getCachedPublishedCars()];
  for (const list of lists) {
    if (list) {
      const found = list.find(c => c.id === id);
      if (found && found.media?.images && found.media.images.length > 0) {
        return found;
      }
    }
  }

  // 3. Fallback: Network fetch for single DB document
  try {
    const res = await fetch(`${getBaseUrl()}/api/cars/${id}`);
    if (!res.ok) {
      const cachedPublished = getCachedPublishedCars();
      const fallback = cachedPublished.find(c => c.id === id);
      if (fallback) return fallback;
      return null;
    }
    
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
    const cachedPublished = getCachedPublishedCars();
    const fallback = cachedPublished.find(c => c.id === id);
    if (fallback) return fallback;
    return null;
  }
}
