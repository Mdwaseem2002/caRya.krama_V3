// ─────────────────────────────────────────────────────────────────────────────
// src/app/api/admin/profile/route.ts
// GET  /api/admin/profile?email=... → Fetch admin profile
// PATCH /api/admin/profile         → Update admin profile fields
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// ── GET /api/admin/profile ────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email parameter is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
      role: "admin",
    }).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Admin user not found" },
        { status: 404 }
      );
    }

    // Remove password from response
    const { password, ...profile } = user as any;

    return NextResponse.json({ success: true, profile }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/admin/profile] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch admin profile" },
      { status: 500 }
    );
  }
}

// ── PATCH /api/admin/profile ──────────────────────────────────────────────────
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, ...updateData } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required to identify admin" },
        { status: 400 }
      );
    }

    // Strip immutable fields
    delete updateData._id;
    delete updateData.id;
    delete updateData.email;
    delete updateData.password;
    delete updateData.role;
    delete updateData.createdAt;

    const updated = await User.findOneAndUpdate(
      { email: email.trim().toLowerCase(), role: "admin" },
      { $set: { ...updateData, lastActive: new Date().toISOString() } },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "Admin user not found" },
        { status: 404 }
      );
    }

    // Remove password from response
    const { password, ...profile } = updated as any;

    return NextResponse.json({ success: true, profile }, { status: 200 });
  } catch (error: any) {
    if (error?.name === "ValidationError") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    console.error("[PATCH /api/admin/profile] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update admin profile" },
      { status: 500 }
    );
  }
}

// ── POST /api/admin/profile (Seed / Upsert) ──────────────────────────────────
// Called on admin login to ensure the admin user exists in the DB
export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { email, name, password: rawPassword } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if admin already exists
    const existing = await User.findOne({ email: normalizedEmail, role: "admin" }).lean();

    if (existing) {
      // Just update lastActive
      await User.updateOne(
        { email: normalizedEmail, role: "admin" },
        { $set: { lastActive: new Date().toISOString() } }
      );
      const { password, ...profile } = existing as any;
      return NextResponse.json({ success: true, profile, isNew: false }, { status: 200 });
    }

    // Create new admin user in DB
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword || "Penta@123", salt);
    const id = `ADMIN-${Math.floor(Math.random() * 90000) + 10000}`;
    const now = new Date().toISOString();

    const newAdmin = await User.create({
      id,
      name: name || "Admin",
      email: normalizedEmail,
      password: hashedPassword,
      role: "admin",
      status: "active",
      joinedDate: now,
      lastActive: now,
      phone: "",
      profilePhoto: "",
      username: "",
      twoFactor: false,
      adminRole: "Super Admin",
      permissions: {
        uploadCars: true,
        editCars: true,
        deleteCars: false,
        manageReports: true,
        viewPayments: true,
      },
      companyName: "",
      companyLogo: "",
      supportEmail: "",
      contactNumber: "",
      address: "",
      notifications: {
        notifyUploads: true,
        notifyPayments: true,
        notifyReports: false,
        notifySignups: true,
      },
    });

    const adminObj = newAdmin.toObject();
    delete (adminObj as any).password;

    return NextResponse.json({ success: true, profile: adminObj, isNew: true }, { status: 201 });
  } catch (error: any) {
    if (error?.code === 11000) {
      // Race condition: user was created between check and create
      const existing = await User.findOne({ email: error.keyValue?.email, role: "admin" }).lean();
      if (existing) {
        const { password, ...profile } = existing as any;
        return NextResponse.json({ success: true, profile, isNew: false }, { status: 200 });
      }
    }
    console.error("[POST /api/admin/profile] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to seed admin profile" },
      { status: 500 }
    );
  }
}
