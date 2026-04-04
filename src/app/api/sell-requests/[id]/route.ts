// ─────────────────────────────────────────────────────────────────────────────
// src/app/api/sell-requests/[id]/route.ts
// PATCH  /api/sell-requests/:id → Update status or reschedule inspection
// DELETE /api/sell-requests/:id → Permanently delete a sell request
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SellRequest from "@/models/SellRequest";

type RouteContext = { params: { id: string } };

const VALID_STATUSES = ["pending", "approved", "rejected", "rescheduled"];

// ── PATCH /api/sell-requests/:id ──────────────────────────────────────────────
export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();

    const body = await req.json();
    const { status, inspection } = body;

    // Build update payload
    const updatePayload: Record<string, unknown> = {};

    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return NextResponse.json(
          { success: false, error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
          { status: 400 }
        );
      }
      updatePayload.status = status;
    }

    // Allow rescheduling — update the inspection sub-document
    if (inspection) {
      updatePayload.inspection = inspection;
      updatePayload.status = "rescheduled";
    }

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const updated = await SellRequest.findOneAndUpdate(
      { id: params.id },
      { $set: updatePayload },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Sell request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, request: updated }, { status: 200 });
  } catch (error) {
    console.error("[PATCH /api/sell-requests/:id] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update sell request" },
      { status: 500 }
    );
  }
}

// ── DELETE /api/sell-requests/:id ─────────────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    await connectDB();

    const deleted = await SellRequest.findOneAndDelete({ id: params.id });

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Sell request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: `Sell request ${params.id} deleted` },
      { status: 200 }
    );
  } catch (error) {
    console.error("[DELETE /api/sell-requests/:id] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete sell request" },
      { status: 500 }
    );
  }
}
