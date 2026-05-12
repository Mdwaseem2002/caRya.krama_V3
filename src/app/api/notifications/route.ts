import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const role = searchParams.get("role");

    const filter: any = {};
    if (userId) {
        filter.$or = [{ userId }, { role: "customer" }]; // Notifications for specific user or all customers
    } else if (role) {
        filter.role = role;
    }

    const notifications = await Notification.find(filter)
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ success: true, notifications });
  } catch (error: any) {
    console.error("[GET /api/notifications] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const newNotification = await Notification.create(body);

    return NextResponse.json({ success: true, notification: newNotification }, { status: 201 });
  } catch (error: any) {
    console.error("[POST /api/notifications] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
