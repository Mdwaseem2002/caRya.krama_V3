"use client";

import React from "react";
import DashboardView from "@/Admin/Dashboard/DashboardView";
import { useRouter } from "next/navigation";

export default function AdminDashboardPage() {
  const router = useRouter();

  const handleDashboardAction = (tab: string, action?: string) => {
    if (tab === "cars") {
      router.push("/admin/carmanagement" + (action === "upload" ? "?action=upload" : ""));
    } else if (tab === "reports") {
      router.push("/admin/reports");
    } else if (tab === "payments") {
      router.push("/admin/payments");
    }
  };

  return (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #f3f4f6' }}>Dashboard Overview</h2>
      <DashboardView onAction={handleDashboardAction} />
    </div>
  );
}
