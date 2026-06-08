import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  userId?: string;          // User ID for customer notifications
  role?: "admin" | "customer"; // Role-based notifications (e.g. all admins)
  title: string;
  message: string;
  type: "sell_request" | "upload" | "system" | "report" | "payment" | "inquiry" | "wishlist";
  read: boolean;
  cta?: {
    label: string;
    href: string;
  };
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema({
  userId: { type: String },
  role: { type: String, enum: ["admin", "customer"] },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    required: true,
    enum: ["sell_request", "upload", "system", "report", "payment", "inquiry", "wishlist"] 
  },
  read: { type: Boolean, default: false },
  cta: {
    label: { type: String },
    href: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

// Index for fast fetching by user/role
NotificationSchema.index({ userId: 1, role: 1, createdAt: -1 });

if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.Notification;
}

export default mongoose.models.Notification || mongoose.model<INotification>("Notification", NotificationSchema);
