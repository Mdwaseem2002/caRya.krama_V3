// ─────────────────────────────────────────────────────────────────────────────
// src/app/api/users/[id]/route.ts
// PATCH  /api/users/:id → Update user fields (role, status, lastActive, etc.)
// DELETE /api/users/:id → Delete user permanently
// ─────────────────────────────────────────────────────────────────────────────
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

type RouteContext = { params: { id: string } };

// ── PATCH /api/users/:id ──────────────────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();

    const body = await req.json();

    // Strip immutable fields
    delete body._id;
    delete body.id;
    delete body.email;   // Email changes require separate verification flow
    delete body.createdAt;

    const updated = await User.findOneAndUpdate(
      { id: params.id },
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, user: updated }, { status: 200 });
  } catch (error: any) {
    if (error?.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    console.error("[PATCH /api/users/:id] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// ── DELETE /api/users/:id ─────────────────────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();

    const deleted = await User.findOneAndDelete({ id: params.id });

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: `User ${params.id} deleted` },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DELETE /api/users/:id] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
