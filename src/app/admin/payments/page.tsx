"use client";

import React from "react";
import PaymentTraker from "@/Admin/PaymentTraking/PaymentTraker";

export default function AdminPaymentsPage() {
  return (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #f3f4f6' }}>Payment Tracking</h2>
      <div style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <PaymentTraker />
      </div>
    </div>
  );
}
