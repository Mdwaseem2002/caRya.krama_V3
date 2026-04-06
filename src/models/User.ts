// ─────────────────────────────────────────────────────────────────────────────
// src/models/User.ts
// Mongoose schema for platform users (admin + customers).
// Mirrors the User interface from UserStore.ts exactly.
// ─────────────────────────────────────────────────────────────────────────────

import mongoose, { Document, Model, Schema } from "mongoose";

// ── TypeScript Interfaces ─────────────────────────────────────────────────────

export interface IUserReport {
  id: string;
  carName: string;
  purchaseDate: string;
  amount: number;
}

export interface IUser extends Document {
  id: string;              // Custom U-XXXX identifier
  name: string;
  email: string;
  password?: string;       // Hashed password for DB authentication
  role: "admin" | "customer";
  status: "active" | "blocked";
  joinedDate: string;
  lastActive: string;
  reportsPurchased: IUserReport[];
  totalSpend: number;
}

// ── Schema Definition ─────────────────────────────────────────────────────────

const UserReportSchema = new Schema<IUserReport>(
  {
    id: { type: String, required: true },
    carName: { type: String, required: true },
    purchaseDate: { type: String, required: true },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: (props: { value: string }) =>
          `${props.value} is not a valid email address`,
      },
    },
    password: { type: String, required: false },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
      index: true,
    },
    status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
      index: true,
    },
    joinedDate: { type: String, default: () => new Date().toISOString() },
    lastActive: { type: String, default: () => new Date().toISOString() },
    reportsPurchased: { type: [UserReportSchema], default: [] },
    totalSpend: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    collection: "users",
    toJSON: {
      transform: (_, ret) => {
        delete (ret as Record<string, unknown>).__v;
        return ret;
      },
    },
  }
);

// ── Model Export ──────────────────────────────────────────────────────────────

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
