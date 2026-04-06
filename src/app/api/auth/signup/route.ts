import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.name || !body.email || !body.password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    const { name, email, password } = body;
    const role = "customer"; // Force role to customer for external signups

    // Check if user exists
    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: normalizedEmail, role });
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const id = `U-${Math.floor(Math.random() * 90000) + 10000}`;
    const now = new Date().toISOString();

    const newUser = await User.create({
      id,
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
      joinedDate: now,
      lastActive: now,
    });

    const userObj = newUser.toObject();
    delete userObj.password; // Don't return password

    return NextResponse.json({ success: true, user: userObj }, { status: 201 });
  } catch (error: any) {
    if (error?.code === 11000) {
      return NextResponse.json(
        { success: false, error: "A user with this email already exists" },
        { status: 409 }
      );
    }
    console.error("[POST /api/auth/signup] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create customer account" },
      { status: 500 }
    );
  }
}
