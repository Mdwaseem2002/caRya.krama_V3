// ─────────────────────────────────────────────────────────────────────────────
// src/app/api/inspection-reports/route.ts
// GET  /api/inspection-reports → List all inspection reports
// POST /api/inspection-reports → Create a new inspection report
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import InspectionReport from "@/models/InspectionReport";

// ── GET /api/inspection-reports ───────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const carId = searchParams.get("carId");

    const filter: Record<string, string> = {};
    if (carId) filter.carId = carId;

    const reports = await InspectionReport.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return NextResponse.json({ success: true, reports }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/inspection-reports] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch inspection reports" },
      { status: 500 }
    );
  }
}

// ── POST /api/inspection-reports ──────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.carId || !body.reportType) {
      return NextResponse.json(
        { success: false, error: "carId and reportType are required" },
        { status: 400 }
      );
    }

    const id = `IR-${Math.floor(Math.random() * 10_000_000)}`;

    const newReport = await InspectionReport.create({ ...body, id });

    return NextResponse.json(
      { success: true, report: newReport },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Duplicate report ID — please retry" },
        { status: 409 }
      );
    }
    console.error("[POST /api/inspection-reports] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create inspection report" },
      { status: 500 }
    );
  }
}
