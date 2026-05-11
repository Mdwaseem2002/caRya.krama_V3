// ─────────────────────────────────────────────────────────────────────────────
// src/models/Car.ts
// Mongoose schema for the car inventory.
// Mirrors the StoredCar interface from CarStorage.ts exactly.
// ─────────────────────────────────────────────────────────────────────────────

import mongoose, { Document, Model, Schema } from "mongoose";

// ── TypeScript Interface ──────────────────────────────────────────────────────

export interface ICar extends Omit<Document, "model"> {
  id: string;          // Custom CK-XXXXXXX identifier
  title: string;
  brand: string;
  model: string;
  year: string;
  status: "draft" | "published";
  createdAt: Date;
  media: {
    coverImage: string;       // Full-quality (used in detail page)
    coverThumbnail?: string;  // Small 400px WebP (used in listing cards — fast!)
    images: string[];
  };
  pricing: {
    sellingPrice: string;
    actualPrice: string;
    savings: string;
  };
  specs: {
    fuelType: string;
    transmission: string;
    mileage: string;
    ownership: string;
    color: string;
    warranty: boolean;
  };
  condition: {
    conditionLabel: string;
    score: string;
    highlights: string[];
    inspectionPoints: { title: string; value: string; highlight?: boolean }[];
    serviceHistory: string[];
  };
  sellerDetails: {
    name: string;
    type: string;
    memberSince: string;
    contactNumber?: string;
  };
  location: {
    area: string;
    city: string;
  };
  tags: string[];
  updatedAt: Date;
}

// ── Schema Definition ─────────────────────────────────────────────────────────

const InspectionPointSchema = new Schema(
  { title: String, value: String, highlight: Boolean },
  { _id: false }
);

const CarSchema = new Schema<ICar>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true, index: true },
    model: { type: String, required: true, trim: true },
    year: { type: String, required: true },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
      index: true,
    },

    media: {
      coverImage:     { type: String, default: "" },
      coverThumbnail: { type: String, default: "" }, // Tiny 400px WebP for listing speed
      images:         { type: [String], default: [] },
    },

    pricing: {
      sellingPrice: { type: String, default: "" },
      actualPrice: { type: String, default: "" },
      savings: { type: String, default: "" },
    },

    specs: {
      fuelType: { type: String, default: "" },
      transmission: { type: String, default: "" },
      mileage: { type: String, default: "" },
      ownership: { type: String, default: "" },
      color: { type: String, default: "" },
      warranty: { type: Boolean, default: false },
    },

    condition: {
      conditionLabel: { type: String, default: "Good" },
      score: { type: String, default: "8.0" },
      highlights: { type: [String], default: [] },
      inspectionPoints: { type: [InspectionPointSchema], default: [] },
      serviceHistory: { type: [String], default: [] },
    },

    sellerDetails: {
      name: { type: String, default: "caRya.krama Verified" },
      type: { type: String, default: "Professional" },
      memberSince: { type: String, default: "2024" },
      contactNumber: { type: String, default: "" },
    },

    location: {
      area: { type: String, default: "" },
      city: { type: String, default: "" },
    },

    tags: { type: [String], default: ["New Arrival"] },
  },
  {
    timestamps: true,         // Adds createdAt + updatedAt automatically
    collection: "cars",
    toJSON: {
      virtuals: true,
      // Remove Mongoose's internal __v field from responses
      transform: (_, ret) => {
        delete (ret as Record<string, unknown>).__v;
        return ret;
      },
    },
  }
);

// ── Indexing for Performance ────────────────────────────────────────────────────
// Main listing query: WHERE status='published' ORDER BY createdAt DESC
CarSchema.index({ status: 1, createdAt: -1 });
// Tag-based filtering (Featured, New Arrival pills)
CarSchema.index({ tags: 1 });
// Brand filter (used in admin + future brand-page feature)
CarSchema.index({ brand: 1, status: 1 });

// ── Model Export (singleton pattern to avoid re-compilation on hot-reload) ────

const Car: Model<ICar> =
  mongoose.models.Car || mongoose.model<ICar>("Car", CarSchema);

export default Car;
