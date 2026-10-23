// ─────────────────────────────────────────────────────────────────────────────
// src/app/api/inspection-reports/route.ts
// GET  /api/inspection-reports → List all inspection reports
// POST /api/inspection-reports → Create a new inspection report
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import InspectionReport from "@/models/InspectionReport";
import { getCachedReports, setCachedReports, invalidateReportsCache } from "@/lib/inspectionCache";

// ── GET /api/inspection-reports ───────────────────────────────────────────────
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const carId = searchParams.get("carId");
    const fullParam = searchParams.get("full");
    const full = fullParam === "false" ? false : (fullParam === "true" || Boolean(carId));

    // Fast-path: return cached list view in 1ms
    if (!carId && !full) {
      const cached = getCachedReports();
      if (cached && cached.length > 0) {
        return NextResponse.json({ success: true, reports: cached }, { status: 200 });
      }
    }

    await connectDB();

    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 500;

    const filter: Record<string, string> = {};
    if (carId) filter.carId = carId;

    // For list views without carId, select ONLY the minimal fields needed to render the list cards
    // When carId is provided or ?full=true is passed, include all fields
    const query = InspectionReport.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    if (!full) {
      query.select("id carId carName reportType uploadedFileName createdAt price");
    }

    const reports = await query;

    if (!carId && !full) {
      setCachedReports(reports);
    }

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
    invalidateReportsCache();

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
