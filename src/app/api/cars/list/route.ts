// ─────────────────────────────────────────────────────────────────────────────
// src/app/api/cars/list/route.ts
// GET /api/cars/list → Ultra-fast listing endpoint
//
// Returns ONLY the fields needed to render a car card.
// Uses `media.coverThumbnail` (tiny 400px WebP) when available.
// Falls back to `media.coverImage` for older cars not yet migrated.
// `media.images` gallery is NEVER sent here.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Car from "@/models/Car";

export const dynamic = "force-dynamic";

// ── In-Memory Server Cache with Background Revalidation ─────────────────────
interface CacheEntry {
  cars: any[];
  timestamp: number;
}
const serverCache: Record<string, CacheEntry> = {};
const pendingRefresh: Record<string, Promise<any[]> | null> = {};
const CACHE_FRESH_MS = 60 * 1000; // 60 seconds fresh

/**
 * Worker to fetch cars from MongoDB and update server cache.
 * Deduplicates in-flight database requests so only one MongoDB query runs at a time.
 */
async function fetchCarsFromDB(adminMode: boolean): Promise<any[]> {
  const cacheKey = adminMode ? "admin" : "public";

  if (pendingRefresh[cacheKey]) {
    return pendingRefresh[cacheKey]!;
  }

  pendingRefresh[cacheKey] = (async () => {
    try {
      await connectDB();

      const filter: Record<string, any> = {};
      if (!adminMode) filter.status = "published";

      const listCars = await Car.aggregate([
        { $match: filter },
        { $sort: { createdAt: -1 } },
        { $limit: 100 },
        {
          $project: {
            id: 1,
            title: 1,
            brand: 1,
            model: 1,
            year: 1,
            status: 1,
            tags: 1,
            isSold: 1,
            pricing: 1,
            specs: 1,
            location: 1,
            condition: 1,
            createdAt: 1,
            coverPhoto: {
              $ifNull: [
                {
                  $cond: [
                    { $gt: [{ $strLenCP: { $ifNull: ["$media.coverThumbnail", ""] } }, 50] },
                    "$media.coverThumbnail",
                    null,
                  ],
                },
                "$media.coverImage",
              ],
            },
          },
        },
      ]);

      const formattedCars = listCars.map((car: any) => ({
        ...car,
        media: {
          coverImage: car.coverPhoto || "",
          coverThumbnail: car.coverPhoto || "",
          images: [],
        },
      }));

      serverCache[cacheKey] = {
        cars: formattedCars,
        timestamp: Date.now(),
      };

      return formattedCars;
    } catch (error) {
      console.error("[cars/list] fetchCarsFromDB Error:", error);
      return serverCache[cacheKey]?.cars || [];
    } finally {
      pendingRefresh[cacheKey] = null;
    }
  })();

  return pendingRefresh[cacheKey]!;
}

// Warm up cache on module load in background
if (process.env.NODE_ENV !== "test") {
  fetchCarsFromDB(false).catch(() => {});
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const adminMode = searchParams.get("admin") === "true";
  const cacheKey = adminMode ? "admin" : "public";
  const now = Date.now();

  const cached = serverCache[cacheKey];

  // 1. If we have any cached cars in server memory:
  if (cached && cached.cars && cached.cars.length > 0) {
    // If cache is getting older than 60s, refresh in background without blocking the response
    if (now - cached.timestamp > CACHE_FRESH_MS) {
      fetchCarsFromDB(adminMode).catch(console.error);
    }

    // Return the cached response INSTANTLY (< 5ms)
    return NextResponse.json(
      { success: true, cars: cached.cars, cached: true },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=30, stale-while-revalidate=300",
        },
      }
    );
  }

  // 2. Cold start (first time ever): wait for database
  try {
    const cars = await fetchCarsFromDB(adminMode);
    return NextResponse.json(
      { success: true, cars },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, max-age=30, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("[GET /api/cars/list] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cars" },
      { status: 500 }
    );
  }
}
