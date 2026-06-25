export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    const { email, password } = body;
    const role = "customer"; // Currently only customers use DB auth

    const normalizedEmail = email.trim().toLowerCase();
    
    // Find customer by email
    const user = await User.findOne({ email: normalizedEmail, role }).lean();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found or invalid credentials" },
        { status: 401 }
      );
    }

    // If customer doesn't have a password set (legacy account)
    if (!user.password) {
      return NextResponse.json(
        { success: false, error: "Invalid legacy account. Please register again." },
        { status: 401 }
      );
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Update lastActive asynchronously
    User.updateOne({ email: normalizedEmail, role }, { lastActive: new Date().toISOString() }).exec();

    // Return user without password
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    return NextResponse.json({ success: true, user: userWithoutPassword }, { status: 200 });
  } catch (error) {
    console.error("[POST /api/auth/login] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to authenticate" },
      { status: 500 }
    );
  }
}
