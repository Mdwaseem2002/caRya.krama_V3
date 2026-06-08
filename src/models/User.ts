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

export interface IAdminPermissions {
  uploadCars: boolean;
  editCars: boolean;
  deleteCars: boolean;
  manageReports: boolean;
  viewPayments: boolean;
}

export interface IAdminNotifications {
  notifyUploads: boolean;
  notifyPayments: boolean;
  notifyReports: boolean;
  notifySignups: boolean;
}

export interface IUser extends Document {
  id: string;              // Custom U-XXXX identifier
  name: string;
  email: string;
  password?: string;       // Hashed password for DB authentication
  phone?: string;
  profilePhoto?: string;   // Base64 or URL
  username?: string;
  twoFactor?: boolean;
  adminRole?: string;      // Super Admin, Admin, Manager
  permissions?: IAdminPermissions;
  companyName?: string;
  companyLogo?: string;
  supportEmail?: string;
  contactNumber?: string;
  address?: string;
  notifications?: IAdminNotifications;
  role: "admin" | "customer";
  status: "active" | "blocked";
  joinedDate: string;
  lastActive: string;
  reportsPurchased: IUserReport[];
  totalSpend: number;
  wishlist: any[];         // Added for wishlist persistence
  createdAt: Date;
  updatedAt: Date;
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
    phone: { type: String, default: "" },
    profilePhoto: { type: String, default: "" },
    username: { type: String, default: "" },
    twoFactor: { type: Boolean, default: false },
    adminRole: { type: String, default: "Super Admin" },
    permissions: {
      type: new Schema({
        uploadCars: { type: Boolean, default: true },
        editCars: { type: Boolean, default: true },
        deleteCars: { type: Boolean, default: false },
        manageReports: { type: Boolean, default: true },
        viewPayments: { type: Boolean, default: true },
      }, { _id: false }),
      default: () => ({}),
    },
    companyName: { type: String, default: "" },
    companyLogo: { type: String, default: "" },
    supportEmail: { type: String, default: "" },
    contactNumber: { type: String, default: "" },
    address: { type: String, default: "" },
    notifications: {
      type: new Schema({
        notifyUploads: { type: Boolean, default: true },
        notifyPayments: { type: Boolean, default: true },
        notifyReports: { type: Boolean, default: false },
        notifySignups: { type: Boolean, default: true },
      }, { _id: false }),
      default: () => ({}),
    },
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
    wishlist: { type: mongoose.Schema.Types.Mixed, default: [] },
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

if (process.env.NODE_ENV !== "production") {
  delete mongoose.models.User;
}

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
