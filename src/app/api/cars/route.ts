// ─────────────────────────────────────────────────────────────────────────────
// src/app/api/cars/route.ts
// GET  /api/cars  → Return all cars (admin: all, public: published only)
// POST /api/cars  → Create a new car listing
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Car from "@/models/Car";

// ── GET /api/cars ─────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");          // e.g. ?status=published
    const brand = searchParams.get("brand");            // e.g. ?brand=BMW
    const adminMode = searchParams.get("admin") === "true"; // ?admin=true

    // Build dynamic filter
    const filter: Record<string, string> = {};
    if (!adminMode) filter.status = "published";        // Public: published only
    if (status) filter.status = status;                 // Override if explicit
    if (brand) filter.brand = brand;

    const cars = await Car.find(filter)
      .sort({ createdAt: -1 })    // Newest first
      .lean();                     // Return plain JS objects (faster)

    return NextResponse.json({ success: true, cars }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/cars] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cars" },
      { status: 500 }
    );
  }
}

// ── POST /api/cars ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    // Validate required fields
    if (!body.title || !body.brand || !body.pricing?.sellingPrice) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: title, brand, sellingPrice" },
        { status: 400 }
      );
    }

    // Generate custom ID (same format as the old localStorage version)
    const id = `CK-${Math.floor(Math.random() * 10_000_000)}`;

    const newCar = await Car.create({ ...body, id });

    return NextResponse.json({ success: true, car: newCar }, { status: 201 });
  } catch (error: any) {
    // Handle duplicate key (race condition on the CK-ID)
    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Duplicate car ID — please retry" },
        { status: 409 }
      );
    }
    console.error("[POST /api/cars] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create car" },
      { status: 500 }
    );
  }
}
