// ─────────────────────────────────────────────────────────────────────────────
// src/app/api/users/route.ts
// GET  /api/users → Return all users (admin only)
// POST /api/users → Create a new user
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// ── GET /api/users ────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");     // ?role=admin | customer
    const status = searchParams.get("status"); // ?status=active | blocked

    const filter: Record<string, string> = {};
    if (role) filter.role = role;
    if (status) filter.status = status;

    const users = await User.find(filter)
      .sort({ joinedDate: -1 })
      .lean();

    return NextResponse.json({ success: true, users }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/users] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// ── POST /api/users ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.name || !body.email) {
      return NextResponse.json(
        { success: false, error: "Name and email are required" },
        { status: 400 }
      );
    }

    const id = `U-${Math.floor(Math.random() * 90000) + 10000}`;
    const now = new Date().toISOString();

    const newUser = await User.create({
      ...body,
      id,
      joinedDate: now,
      lastActive: now,
    });

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (error: any) {
    if (error?.code === 11000) {
      const field = Object.keys(error.keyValue || {})[0] || "field";
      return NextResponse.json(
        { success: false, error: `A user with this ${field} already exists` },
        { status: 409 }
      );
    }
    if (error?.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    console.error("[POST /api/users] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create user" },
      { status: 500 }
    );
  }
}
