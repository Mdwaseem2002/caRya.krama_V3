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

// ── PUT /api/cars/:id ─────────────────────────────────────────────────────────
export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();

    const body = await req.json();

    // Remove fields that should not be overwritten via update
    delete body._id;
    delete body.id;
    delete body.createdAt;

    const updated = await Car.findOneAndUpdate(
      { id: params.id },
      { $set: body },
      { new: true, runValidators: true }           // Return updated doc + validate
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Car not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, car: updated }, { status: 200 });
  } catch (error) {
    console.error("[PUT /api/cars/:id] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update car" },
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
