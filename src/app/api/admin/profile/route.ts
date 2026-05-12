// ─────────────────────────────────────────────────────────────────────────────
// src/app/api/admin/profile/route.ts
// GET  /api/admin/profile?email=... → Fetch admin profile
// PATCH /api/admin/profile         → Update admin profile fields
// POST  /api/admin/profile         → Seed / Upsert admin user
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// ── GET /api/admin/profile ────────────────────────────────────────────────────
export const dynamic = "force-dynamic";

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

    const normalizedEmail = email.trim().toLowerCase();

    // Find by email only (don't filter by role — the user may exist as "customer")
    let user = await User.findOne({ email: normalizedEmail }).lean();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Admin user not found" },
        { status: 404 }
      );
    }

    // If user exists but isn't admin, promote them
    if ((user as any).role !== "admin") {
      await User.updateOne(
        { email: normalizedEmail },
        { $set: { role: "admin", lastActive: new Date().toISOString() } }
      );
      user = await User.findOne({ email: normalizedEmail }).lean();
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

    const normalizedEmail = email.trim().toLowerCase();

    // Strip immutable fields
    delete updateData._id;
    delete updateData.id;
    delete updateData.email;
    delete updateData.password;
    delete updateData.createdAt;

    // Find by email only, and ensure role is set to admin
    const updated = await User.findOneAndUpdate(
      { email: normalizedEmail },
      { $set: { ...updateData, role: "admin", lastActive: new Date().toISOString() } },
      { new: true, runValidators: true, returnDocument: 'after' }
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

    // Check if user already exists (any role)
    const existing = await User.findOne({ email: normalizedEmail }).lean();

    if (existing) {
      // Update to admin role and refresh lastActive
      await User.updateOne(
        { email: normalizedEmail },
        { $set: { role: "admin", lastActive: new Date().toISOString() } }
      );
      const { password, ...profile } = existing as any;
      profile.role = "admin"; // reflect the update in response
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
      // Race condition: user was created between check and create — just find and return
      const normalizedEmail = (error.keyValue?.email || "").trim().toLowerCase();
      const existing = await User.findOne({ email: normalizedEmail }).lean();
      if (existing) {
        await User.updateOne(
          { email: normalizedEmail },
          { $set: { role: "admin", lastActive: new Date().toISOString() } }
        );
        const { password, ...profile } = existing as any;
        profile.role = "admin";
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
