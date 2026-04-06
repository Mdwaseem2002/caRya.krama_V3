// ─────────────────────────────────────────────────────────────────────────────
// src/models/SellRequest.ts
// Mongoose schema for customer car sell requests.
// Mirrors the SellRequest interface from SellStorage.ts exactly.
// ─────────────────────────────────────────────────────────────────────────────

import mongoose, { Document, Model, Schema } from "mongoose";

// ── TypeScript Interface ──────────────────────────────────────────────────────

export interface ISellRequest extends Document {
  id: string;          // Custom SR-XXXXXXX identifier
  status: "pending" | "approved" | "rejected" | "rescheduled";
  createdAt: Date;

  owner: {
    name: string;
    phone: string;
    email: string;
    city: string;
  };

  car: {
    brand: string;
    model: string;
    year: string;
    mileage: string;
    fuelType: string;
    transmission: string;
    ownership: string;
    regCity: string;
    expectedPrice: string;
    images: string[];
    rcCopy?: string;
  };

  inspection: {
    date: string;
    time: string;
    location: "Home" | "Office";
    address: string;
  };
}

// ── Schema Definition ─────────────────────────────────────────────────────────

const SellRequestSchema = new Schema<ISellRequest>(
  {
    id: { type: String, required: true, unique: true, index: true },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "rescheduled"],
      default: "pending",
      index: true,
    },

    owner: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        // Basic email format validation
        validate: {
          validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
          message: (props: { value: string }) =>
            `${props.value} is not a valid email address`,
        },
      },
      city: { type: String, required: true, trim: true },
    },

    car: {
      brand: { type: String, required: true, trim: true },
      model: { type: String, required: true, trim: true },
      year: { type: String, required: true },
      mileage: { type: String, default: "" },
      fuelType: { type: String, default: "" },
      transmission: { type: String, default: "" },
      ownership: { type: String, default: "1st Owner" },
      regCity: { type: String, default: "" },
      expectedPrice: { type: String, default: "" },
      images: { type: [String], default: [] },
      rcCopy: { type: String },
    },

    inspection: {
      date: { type: String, required: true },
      time: { type: String, required: true },
      location: { type: String, enum: ["Home", "Office"], default: "Home" },
      address: { type: String, default: "" },
    },
  },
  {
    timestamps: true,
    collection: "sell_requests",
    toJSON: {
      transform: (_, ret) => {
        delete (ret as Record<string, unknown>).__v;
        return ret;
      },
    },
  }
);

// ── Indexing for Performance ────────────────────────────────────────────────────
SellRequestSchema.index({ status: 1, createdAt: -1 });

// ── Model Export ──────────────────────────────────────────────────────────────

const SellRequest: Model<ISellRequest> =
  mongoose.models.SellRequest ||
  mongoose.model<ISellRequest>("SellRequest", SellRequestSchema);

export default SellRequest;
