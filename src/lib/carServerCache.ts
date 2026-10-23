// ─────────────────────────────────────────────────────────────────────────────
// src/lib/carServerCache.ts
// In-memory server cache for car listing endpoints
// ─────────────────────────────────────────────────────────────────────────────

interface CacheEntry {
  cars: any[];
  timestamp: number;
}

const serverCache: Record<string, CacheEntry> = {};
const CACHE_FRESH_MS = 60 * 1000; // 60s background freshness

export function getCachedCars(key: "public" | "admin"): any[] | null {
  const entry = serverCache[key];
  if (entry && entry.cars && entry.cars.length > 0) {
    return entry.cars;
  }
  return null;
}

export function isCacheStale(key: "public" | "admin"): boolean {
  const entry = serverCache[key];
  if (!entry) return true;
  return Date.now() - entry.timestamp > CACHE_FRESH_MS;
}

export function setCachedCars(key: "public" | "admin", cars: any[]) {
  serverCache[key] = {
    cars,
    timestamp: Date.now(),
  };
}

/** Immediately invalidate all cached cars on server when any car is created, updated, or deleted */
export function invalidateServerCarCache() {
  delete serverCache["public"];
  delete serverCache["admin"];
}
