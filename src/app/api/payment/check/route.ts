// ─────────────────────────────────────────────────────────────────────────────
// src/app/api/payment/check/route.ts
// GET /api/payment/check?carId=xxx&userId=yyy → Check if user has paid
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const carId = searchParams.get("carId");
    const userId = searchParams.get("userId");

    if (!carId || !userId) {
      return NextResponse.json(
        { success: false, error: "carId and userId are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const payment = await Payment.findOne({
      carId,
      userId,
      status: "completed",
    }).lean();

    if (payment) {
      return NextResponse.json(
        { success: true, paid: true, paymentId: (payment as any).id },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: true, paid: false },
      { status: 200 }
    );
  } catch (error) {
    console.error("[GET /api/payment/check] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check payment status" },
      { status: 500 }
    );
  }
}
