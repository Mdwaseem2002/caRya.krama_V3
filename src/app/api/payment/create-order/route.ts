// ─────────────────────────────────────────────────────────────────────────────
// src/app/api/payment/create-order/route.ts
// POST /api/payment/create-order → Create a Razorpay order for inspection report
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { carId, userId } = body;

    if (!carId || !userId) {
      return NextResponse.json(
        { success: false, error: "carId and userId are required" },
        { status: 400 }
      );
    }

    // Check if user already has a completed payment for this car
    await connectDB();
    const existingPayment = await Payment.findOne({
      carId,
      userId,
      status: "completed",
    });

    if (existingPayment) {
      return NextResponse.json(
        {
          success: false,
          error: "already_paid",
          message: "You have already purchased the report for this car.",
        },
        { status: 409 }
      );
    }

    // Create Razorpay order
    const timestamp = Date.now();
    // Receipt max 40 chars — use short prefix + truncated carId + timestamp suffix
    const shortCarId = String(carId).slice(-8);
    const receipt = `insp_${shortCarId}_${String(timestamp).slice(-10)}`.slice(0, 40);
    const order = await razorpay.orders.create({
      amount: 60000, // ₹600 in paise
      currency: "INR",
      receipt,
      notes: {
        carId,
        userId,
        reportType: "inspection",
      },
    });

    return NextResponse.json(
      {
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[POST /api/payment/create-order] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create payment order" },
      { status: 500 }
    );
  }
}
