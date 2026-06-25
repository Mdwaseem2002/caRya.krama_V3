export const dynamic = 'force-dynamic';
// ─────────────────────────────────────────────────────────────────────────────
// src/app/api/admin/stats/route.ts
// GET /api/admin/stats → Real-time insights from MongoDB
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Car from "@/models/Car";
import Payment from "@/models/Payment";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // 1. Basic Totals
    const revenueResult = await Payment.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);
    const revenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    const liveAssets = await Car.countDocuments({ status: "published" });
    const totalUsers = await User.countDocuments({ role: "customer" });

    // 2. Chart Data (Last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Daily Revenue
    const dailyRevenue = await Payment.aggregate([
      { $match: { status: "completed", createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          amount: { $sum: "$amount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Daily Activity (Combined count of new users + car views/analytics)
    // For now, let's just use User signups as a proxy for activity growth if Analytics model is not fully ready
    const dailyActivity = await User.aggregate([
      { $match: { role: "customer", createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 3. Recent Activity (Latest 5 items)
    const [recentUsers, recentCars, recentPayments] = await Promise.all([
      User.find({ role: "customer" }).sort({ createdAt: -1 }).limit(5),
      Car.find().sort({ createdAt: -1 }).limit(5),
      Payment.find({ status: "completed" }).sort({ createdAt: -1 }).limit(5)
    ]);

    const activityList = [
      ...recentUsers.map(u => ({ type: 'user', text: `New user signed up: ${u.name}`, time: u.createdAt })),
      ...recentCars.map(c => ({ type: 'car', text: `New car added: ${c.title}`, time: c.createdAt })),
      ...recentPayments.map(p => ({ type: 'payment', text: `Payment received: ₹${p.amount}`, time: p.createdAt }))
    ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 5);

    return NextResponse.json({
      success: true,
      stats: {
        revenue,
        liveAssets,
        totalUsers,
        charts: {
          revenue: dailyRevenue,
          activity: dailyActivity
        },
        recentActivity: activityList
      }
    }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/admin/stats] Error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch admin stats" }, { status: 500 });
  }
}

