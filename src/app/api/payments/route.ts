export const dynamic = 'force-dynamic';
// ─────────────────────────────────────────────────────────────────────────────
// src/app/api/payments/route.ts
// GET  /api/payments → Return all payment records (admin view)
// POST /api/payments → Log a new payment record
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";

// ── GET /api/payments ─────────────────────────────────────────────────────────
export async function GET(_req: NextRequest) {
  try {
    await connectDB();

    const payments = await Payment.find({})
      .sort({ createdAt: -1 })
      .lean();

    // Also compute total revenue for dashboard convenience
    const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

    return NextResponse.json(
      { success: true, payments, totalRevenue },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/payments] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

// ── POST /api/payments ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    if (!body.userId || !body.carId || body.amount === undefined) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: userId, carId, amount" },
        { status: 400 }
      );
    }

    if (typeof body.amount !== "number" || body.amount < 0) {
      return NextResponse.json(
        { success: false, error: "amount must be a non-negative number" },
        { status: 400 }
      );
    }

    const id = `CK-${Math.floor(Math.random() * 10_000_000)}`;
    const now = new Date().toISOString();

    const newPayment = await Payment.create({
      ...body,
      id,
      date: now,
      status: body.status || "completed",
    });

    return NextResponse.json(
      { success: true, payment: newPayment },
      { status: 201 }
    );
  } catch (error: any) {
    if (error?.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    console.error("[POST /api/payments] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to log payment" },
      { status: 500 }
    );
  }
}
