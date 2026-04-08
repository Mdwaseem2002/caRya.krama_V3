"use client";

import React from "react";
import SellRequestsList from "@/Admin/SellRequests/SellRequestsList";

export default function AdminSellRequestsPage() {
  return (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #f3f4f6' }}>Sell Requests Queue</h2>
      <SellRequestsList />
    </div>
  );
}
