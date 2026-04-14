// ─────────────────────────────────────────────────────────────────────────────
// src/app/api/inspection-reports/[id]/route.ts
// GET    /api/inspection-reports/[id] → Get single report
// PUT    /api/inspection-reports/[id] → Update report
// DELETE /api/inspection-reports/[id] → Delete report
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import InspectionReport from "@/models/InspectionReport";

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const report = await InspectionReport.findOne({ id: params.id }).lean();
    if (!report) {
      return NextResponse.json(
        { success: false, error: "Report not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, report }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/inspection-reports/[id]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch report" },
      { status: 500 }
    );
  }
}

// ── PUT ───────────────────────────────────────────────────────────────────────
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await req.json();

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

    const updated = await InspectionReport.findOneAndUpdate(
      { id: params.id },
      { $set: flatSet },
      { returnDocument: "after", lean: true, runValidators: false, strict: false }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, report: updated }, { status: 200 });
  } catch (error) {
    console.error("[PUT /api/inspection-reports/[id]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update report" },
      { status: 500 }
    );
  }
}

// ── DELETE ────────────────────────────────────────────────────────────────────
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const deleted = await InspectionReport.findOneAndDelete({ id: params.id });

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("[DELETE /api/inspection-reports/[id]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete report" },
      { status: 500 }
    );
  }
}
