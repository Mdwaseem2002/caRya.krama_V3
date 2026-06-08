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

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const adminMode = searchParams.get("admin") === "true";

    const filter: Record<string, string> = {};
    if (!adminMode) filter.status = "published";

    // ── CRITICAL OPTIMISATION ─────────────────────────────────────────────────
    // Select ONLY the absolute minimum fields required to render car listing cards.
    // Exclude media.images (potentially MBs of gallery data — not needed for cards).
    // ─────────────────────────────────────────────────────────────────────────
    const cars = await Car.find(filter)
      .select([
        "id",
        "title",
        "brand",
        "model",
        "year",
        "status",
        "tags",
        "isSold",
        "pricing",
        "specs",
        "location",
        "condition.score",
        "condition.highlights",
        "condition.conditionLabel",
        "media.coverThumbnail",   // Fast tiny thumbnail (post-migration)
        "media.coverImage",       // Fallback for pre-migration cars
        "createdAt",
      ])
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    // ── Serve thumbnail or fallback safely ────────────────────────────────────
    // Never truncate base64 — truncated data = broken image.
    // Instead: use coverThumbnail if present, else use coverImage.
    // ─────────────────────────────────────────────────────────────────────────
    const listCars = (cars as any[]).map((car) => {
      const thumb   = car.media?.coverThumbnail;
      const cover   = car.media?.coverImage;
      const display = (thumb && thumb.length > 50) ? thumb : (cover || "");

      return {
        ...car,
        media: {
          coverImage:     display,   // UI reads coverImage — we just serve the fastest version
          coverThumbnail: display,
          images:         [],        // Never send gallery on list pages
        },
      };
    });

    return NextResponse.json(
      { success: true, cars: listCars },
      {
        status: 200,
        headers: {
          // no-store: always fetch fresh data so sold/available status
          // is immediately reflected on the Buy page without stale cache.
          "Cache-Control": "no-store",
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
