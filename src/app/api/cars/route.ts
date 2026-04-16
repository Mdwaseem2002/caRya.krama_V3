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

    const limitParams = searchParams.get("limit");
    const limit = limitParams ? parseInt(limitParams, 10) : 100;

    const cars = await Car.find(filter)
      .select("-media.images")    // EXCLUDE heavy base64 array payload for list optimizations
      .sort({ createdAt: -1 })    // Newest first
      .limit(limit)               // Limit to prevent huge payloads
      .lean();                    // Return plain JS objects (faster)

    return NextResponse.json({ success: true, cars }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/cars] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch cars" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    // Validate required fields (including those required by the schema)
    const requiredFields = ["title", "brand", "model", "year"];
    const missing = requiredFields.filter((f) => !body[f]);
    
    // Also check for pricing
    if (!body.pricing?.sellingPrice) missing.push("pricing.sellingPrice");

    if (missing.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    // Generate custom ID (or use provided one)
    const id = body.id || `CK-${Math.floor(Math.random() * 10_000_000)}`;

    console.log(`🚀 Creating new car listing: ${body.title} (ID: ${id})`);
    const newCar = await Car.create({ ...body, id });

    return NextResponse.json({ success: true, car: newCar }, { status: 201 });
  } catch (error: any) {
    // Detailed error logging
    console.error("[POST /api/cars] Error:", error.message || error);
    
    // Handle duplicate key (race condition on the CK-ID)
    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Duplicate car ID — please retry" },
        { status: 409 }
      );
    }

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: `Validation Failed: ${messages.join(", ")}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "Failed to create car" },
      { status: 500 }
    );
  }
}
