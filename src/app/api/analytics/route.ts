// ─────────────────────────────────────────────────────────────────────────────
// src/app/api/analytics/route.ts
// GET  /api/analytics        → Return current platform stats
// POST /api/analytics        → Increment a counter
//   body: { type: "visitor" | "report" }
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Analytics from "@/models/Analytics";

// ── GET /api/analytics ────────────────────────────────────────────────────────
export async function GET(_req: NextRequest) {
  try {
    await connectDB();

    // Upsert: create the singleton document if it doesn't exist yet
    const stats = await Analytics.findOneAndUpdate(
      {},                                                   // Match any doc (singleton)
      { $setOnInsert: { totalVisitors: 0, totalReportDownloads: 0 } },
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json({ success: true, stats }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/analytics] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}

// ── POST /api/analytics ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { type } = body;

    if (!["visitor", "report"].includes(type)) {
      return NextResponse.json(
        { success: false, error: 'type must be "visitor" or "report"' },
        { status: 400 }
      );
    }

    // Build atomic increment based on type
    const increment =
      type === "visitor"
        ? { totalVisitors: 1 }
        : { totalReportDownloads: 1 };

    const updated = await Analytics.findOneAndUpdate(
      {},                                 // Singleton pattern
      { $inc: increment },               // Atomic increment — safe for concurrent requests
      { upsert: true, new: true }
    ).lean();

    return NextResponse.json({ success: true, stats: updated }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/analytics] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to increment analytics" },
      { status: 500 }
    );
  }
}
