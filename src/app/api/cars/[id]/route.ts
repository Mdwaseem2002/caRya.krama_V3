// ─────────────────────────────────────────────────────────────────────────────
// src/app/api/cars/[id]/route.ts
// GET    /api/cars/:id → Fetch single car
// PUT    /api/cars/:id → Update car
// DELETE /api/cars/:id → Delete car
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Car from "@/models/Car";

type RouteContext = { params: { id: string } };

// ── GET /api/cars/:id ─────────────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();

    // Try custom id field first, fall back to MongoDB _id
    const car = await Car.findOne({ id: params.id }).lean();

    if (!car) {
      return NextResponse.json(
        { success: false, error: "Car not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, car }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/cars/:id] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch car" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();

    const body = await req.json();
    console.log(`📝 Updating car listing: ${params.id}`);

    // Remove fields that should not be overwritten via update
    delete body._id;
    delete body.id;
    delete body.createdAt;

    // ── Flatten nested objects into dot-notation keys ─────────────────────────
    const flatSet: Record<string, any> = {};
    for (const [key, value] of Object.entries(body)) {
      if (
        value !== null &&
        typeof value === "object" &&
        !Array.isArray(value)
      ) {
        for (const [subKey, subValue] of Object.entries(value as Record<string, any>)) {
          flatSet[`${key}.${subKey}`] = subValue;
        }
      } else {
        flatSet[key] = value;
      }
    }

    const updated = await Car.findOneAndUpdate(
      { id: params.id },
      { $set: flatSet },
      { new: true, runValidators: true } // Enabled runValidators for better reliability
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Car not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, car: updated }, { status: 200 });
  } catch (error: any) {
    console.error(`[PUT /api/cars/${params.id}] Error:`, error.message || error);
    
    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: `Update Failed: ${messages.join(", ")}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "Failed to update car" },
      { status: 500 }
    );
  }
}

// ── DELETE /api/cars/:id ──────────────────────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();

    const deleted = await Car.findOneAndDelete({ id: params.id });

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Car not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: `Car ${params.id} deleted` },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DELETE /api/cars/:id] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete car" },
      { status: 500 }
    );
  }
}
