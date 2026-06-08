// ─────────────────────────────────────────────────────────────────────────────
// src/models/Payment.ts
// Mongoose schema for payment records.
// Mirrors the PaymentRecord interface from AnalyticsStore.ts.
// ─────────────────────────────────────────────────────────────────────────────

import mongoose, { Document, Model, Schema } from "mongoose";

// ── TypeScript Interface ──────────────────────────────────────────────────────

export interface IPayment extends Document {
  id: string;          // Custom CK-XXXXXXX identifier
  userId: string;
  userName: string;
  userEmail: string;
  carId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  date: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// ── Schema Definition ─────────────────────────────────────────────────────────

const PaymentSchema = new Schema<IPayment>(
  {
    id: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true, trim: true },
    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    carId: { type: String, required: true, index: true },
    razorpayOrderId: { type: String, default: "" },
    razorpayPaymentId: { type: String, default: "" },
    razorpaySignature: { type: String, default: "" },
    amount: { type: Number, required: true, min: 0 },
    date: { type: String, default: () => new Date().toISOString() },
    status: {
      type: String,
      enum: ["completed", "pending", "failed", "refunded"],
      default: "completed",
    },
  },
  {
    timestamps: true,
    collection: "payments",
    toJSON: {
      transform: (_, ret) => {
        delete (ret as Record<string, unknown>).__v;
        return ret;
      },
    },
  }
);

// ── Model Export ──────────────────────────────────────────────────────────────

if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.Payment;
}

const Payment: Model<IPayment> =
  mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);

export default Payment;
