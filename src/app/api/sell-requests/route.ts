// ─────────────────────────────────────────────────────────────────────────────
// src/app/api/sell-requests/route.ts
// GET  /api/sell-requests → Return all sell requests (admin view)
// POST /api/sell-requests → Submit new sell request (customer form)
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SellRequest from "@/models/SellRequest";

// ── GET /api/sell-requests ────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const email = searchParams.get("email");

    const filter: any = {};
    if (status) filter.status = status;
    if (email) filter["owner.email"] = email;

    const limitParams = searchParams.get("limit");
    const limit = limitParams ? parseInt(limitParams, 10) : 100;

    const requests = await SellRequest.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)               // Limit to prevent huge payloads
      .lean();

    return NextResponse.json({ success: true, requests }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/sell-requests] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch sell requests" },
      { status: 500 }
    );
  }
}

// ── POST /api/sell-requests ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    // Validate required fields
    if (
      !body.owner?.name ||
      !body.owner?.phone ||
      !body.owner?.email ||
      !body.car?.brand ||
      !body.car?.model ||
      !body.inspection?.date ||
      !body.inspection?.time
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: owner details, car brand/model, inspection date/time",
        },
        { status: 400 }
      );
    }

    const id = `SR-${Math.floor(Math.random() * 10_000_000)}`;

    const newRequest = await SellRequest.create({
      ...body,
      id,
      status: "pending",
    });

    return NextResponse.json(
      { success: true, request: newRequest },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Duplicate request ID — please retry" },
        { status: 409 }
      );
    }
    // Mongoose validation error
    if (error?.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    console.error("[POST /api/sell-requests] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit sell request" },
      { status: 500 }
    );
  }
}
