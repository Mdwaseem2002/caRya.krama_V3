// ─────────────────────────────────────────────────────────────────────────────
// src/app/api/payment/verify/route.ts
// POST /api/payment/verify → Verify Razorpay payment signature & save record
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import Payment from "@/models/Payment";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      carId,
      userId,
      userName,
      userEmail,
      amount,
    } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: "Missing payment verification fields" },
        { status: 400 }
      );
    }

    if (!carId || !userId) {
      return NextResponse.json(
        { success: false, error: "carId and userId are required" },
        { status: 400 }
      );
    }

    // ── Verify Signature ──────────────────────────────────────────────────────
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error(
        "[FRAUD ALERT] Payment signature mismatch:",
        { razorpay_order_id, razorpay_payment_id, userId, carId }
      );
      return NextResponse.json(
        { success: false, error: "Payment verification failed — signature mismatch" },
        { status: 400 }
      );
    }

    // ── Save Payment Record ───────────────────────────────────────────────────
    await connectDB();

    const paymentId = `CK-${Math.floor(Math.random() * 10_000_000)}`;
    const now = new Date().toISOString();

    const newPayment = await Payment.create({
      id: paymentId,
      userId,
      userName: userName || "Customer",
      userEmail: userEmail || "",
      carId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      amount: amount || 299,
      date: now,
      status: "completed",
    });

    return NextResponse.json(
      {
        success: true,
        paymentId: newPayment.id,
        message: "Payment verified and recorded successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[POST /api/payment/verify] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to verify payment" },
      { status: 500 }
    );
  }
}
