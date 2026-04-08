"use client";

import React from "react";
import ReportManage from "@/Admin/ReportManagement/ReportManage";

export default function AdminReportsPage() {
  return (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #f3f4f6' }}>Report Management</h2>
      <div style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <ReportManage />
      </div>
    </div>
  );
}
