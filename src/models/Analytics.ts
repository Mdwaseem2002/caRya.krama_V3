// ─────────────────────────────────────────────────────────────────────────────
// src/models/Analytics.ts
// Singleton document for global platform analytics stats.
// Only ONE document exists in this collection (upserted on every update).
// ─────────────────────────────────────────────────────────────────────────────

import mongoose, { Document, Model, Schema } from "mongoose";

// ── TypeScript Interface ──────────────────────────────────────────────────────

export interface IAnalytics extends Document {
  totalVisitors: number;
  totalReportDownloads: number;
}

// ── Schema Definition ─────────────────────────────────────────────────────────

const AnalyticsSchema = new Schema<IAnalytics>(
  {
    totalVisitors: { type: Number, default: 0, min: 0 },
    totalReportDownloads: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    collection: "analytics",
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
  delete mongoose.models.Analytics;
}

const Analytics: Model<IAnalytics> =
  mongoose.models.Analytics ||
  mongoose.model<IAnalytics>("Analytics", AnalyticsSchema);

export default Analytics;
