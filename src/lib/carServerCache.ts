// ─────────────────────────────────────────────────────────────────────────────
// src/lib/carServerCache.ts
// In-memory server cache for car listing and single car endpoints
// ─────────────────────────────────────────────────────────────────────────────

import connectDB from "@/lib/mongodb";
import Car from "@/models/Car";

interface CacheEntry {
  cars: any[];
  timestamp: number;
}

const serverCache: Record<string, CacheEntry> = {};
const singleCarCache: Record<string, { car: any; timestamp: number }> = {};
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

/** Get a cached single car document */
export function getCachedCarDetail(id: string): any | null {
  const entry = singleCarCache[id];
  if (entry && entry.car) {
    return entry.car;
  }
  return null;
}

/** Store a single car document in memory */
export function setCachedCarDetail(id: string, car: any) {
  if (!id || !car) return;
  singleCarCache[id] = {
    car,
    timestamp: Date.now(),
  };
}

/** In-flight deduplication for warming */
const inFlightWarming: Record<string, Promise<any> | null> = {};

/**
 * Background worker to warm up a single car with complete details and gallery
 */
export async function warmCarDetailInBackground(id: string): Promise<any | null> {
  if (inFlightWarming[id]) return inFlightWarming[id];

  inFlightWarming[id] = (async () => {
    try {
      await connectDB();
      const car = await Car.findOne({ id }).lean();
      if (car) {
        setCachedCarDetail(id, car);
        return car;
      }
    } catch (e) {
      console.error(`[warmCarDetailInBackground] Error warming ${id}:`, e);
    } finally {
      delete inFlightWarming[id];
    }
    return null;
  })();

  return inFlightWarming[id];
}

/**
 * Ultra-fast lookup for initial SSR rendering of /car/[id]
 * Checks in-memory cache first (0ms), public list cache (0ms),
 * or falls back to lightweight DB query (<300ms).
 */
export async function getCarForInitialRender(id: string): Promise<any | null> {
  // 1. Check if complete car detail is in RAM
  const cachedFull = getCachedCarDetail(id);
  if (cachedFull) {
    return cachedFull;
  }

  // 2. Check if car exists in public list cache (already has coverImage, title, specs, price, condition)
  const publicList = getCachedCars("public");
  if (publicList && publicList.length > 0) {
    const found = publicList.find((c: any) => c.id === id);
    if (found) {
      // Warm full gallery in background without blocking response
      warmCarDetailInBackground(id).catch(console.error);
      return found;
    }
  }

  // 3. Fallback: Fast DB query without heavy media.images (<300ms)
  try {
    await connectDB();
    const light = await Car.findOne({ id }).select("-media.images").lean();
    if (light) {
      warmCarDetailInBackground(id).catch(console.error);
      return light;
    }
  } catch (err) {
    console.error(`[getCarForInitialRender] DB fallback error for ${id}:`, err);
  }

  return null;
}

/** Immediately invalidate cached cars on server when any car is created, updated, or deleted */
export function invalidateServerCarCache(id?: string) {
  delete serverCache["public"];
  delete serverCache["admin"];
  if (id) {
    delete singleCarCache[id];
  } else {
    for (const key of Object.keys(singleCarCache)) {
      delete singleCarCache[key];
    }
  }
}
