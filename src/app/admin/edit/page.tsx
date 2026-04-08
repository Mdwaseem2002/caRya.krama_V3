"use client";

import React from "react";
import EditAdminProfile from "@/Admin/AdminUse/EditAdminProfile";

export default function AdminEditPage() {
  return (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #f3f4f6' }}>System Configuration</h2>
      <EditAdminProfile />
    </div>
  );
}
