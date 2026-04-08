"use client";

import React from "react";
import UserManage from "@/Admin/UserManagement/UserManage";

export default function AdminUsersPage() {
  return (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', marginBottom: '24px', paddingBottom: '16px', borderBottom: '2px solid #f3f4f6' }}>User Management</h2>
      <UserManage />
    </div>
  );
}
