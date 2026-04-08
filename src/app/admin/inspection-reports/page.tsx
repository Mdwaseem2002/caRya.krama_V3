"use client";

import React from "react";
import InspectionReportsList from "@/Admin/InspectionReports/InspectionReportsList";

export default function AdminInspectionReportsPage() {
  return (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #f3f4f6' }}>Inspection Reports</h2>
      <InspectionReportsList />
    </div>
  );
}
