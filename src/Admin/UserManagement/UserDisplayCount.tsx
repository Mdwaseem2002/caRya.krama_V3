"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  Shield, 
  Activity, 
  MoreHorizontal, 
  User as UserIcon,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAllUsers, User, getUserCounts } from "../../Details/Sign/SignFetch/SignFetch";

/**
 * UserDisplayCount - A high-end dashboard component to manage and view users.
 * Displays counts for admins and customers and provides a searchable table.
 */
export default function UserDisplayCount() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "admin" | "customer">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [counts, setCounts] = useState({ total: 0, admins: 0, customers: 0, active: 0 });

  // Load users and counts on mount
  useEffect(() => {
    const allUsers = getAllUsers();
    setUsers(allUsers);
    setCounts(getUserCounts());
  }, []);

  // Filter logic
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        user.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  return (
    <div style={{ backgroundColor: '#ffffff', minHeight: '100%', padding: '24px' }}>
      
      {/* Search and Filters Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={{ 
          position: 'relative', 
          flex: 1,
          maxWidth: '600px'
        }}>
          <Search 
            size={20} 
            style={{ 
              position: 'absolute', 
              left: '16px', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: '#9ca3af'
            }} 
          />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 48px',
              backgroundColor: '#f9fafb',
              border: '1px solid #f3f4f6',
              borderRadius: '16px',
              fontSize: '15px',
              fontWeight: 500,
              outline: 'none',
              transition: 'all 0.2s',
              color: '#374151'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {/* Role Filter Button */}
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setRoleFilter(roleFilter === 'all' ? 'admin' : roleFilter === 'admin' ? 'customer' : 'all')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 18px',
                backgroundColor: '#f9fafb',
                border: '1px solid #f3f4f6',
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Shield size={18} style={{ color: '#9ca3af' }} />
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#374151' }}>
                {roleFilter === 'all' ? 'All Roles' : roleFilter.charAt(0).toUpperCase() + roleFilter.slice(1)}
              </span>
            </button>
          </div>

          {/* Status Filter Button */}
          <button 
            onClick={() => setStatusFilter(statusFilter === 'all' ? 'active' : statusFilter === 'active' ? 'inactive' : 'all')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 18px',
              backgroundColor: '#f9fafb',
              border: '1px solid #f3f4f6',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <Activity size={18} style={{ color: '#9ca3af' }} />
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#374151' }}>
              {statusFilter === 'all' ? 'All Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
            </span>
          </button>
        </div>
      </div>

      {/* User Table */}
      <div style={{ 
        width: '100%', 
        overflowX: 'auto',
        borderRadius: '24px',
        border: '1px solid #f3f4f6',
        backgroundColor: '#ffffff'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #f3f4f6', backgroundColor: '#fcfcfc' }}>
              <th style={headerStyle}>USER</th>
              <th style={headerStyle}>ROLE</th>
              <th style={headerStyle}>JOINED</th>
              <th style={headerStyle}>ACTIVITY</th>
              <th style={headerStyle}>STATUS</th>
              <th style={{ ...headerStyle, textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, idx) => (
                  <motion.tr 
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    style={{ borderBottom: '1px solid #f9fafb' }}
                  >
                    <td style={cellStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ 
                          width: '40px', height: '40px', borderRadius: '50%', 
                          backgroundColor: '#eff6ff', color: '#0059A3',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '14px'
                        }}>
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#111827', fontSize: '14px' }}>{user.name}</div>
                          <div style={{ color: '#6b7280', fontSize: '12px' }}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={cellStyle}>
                      <span style={{ 
                        color: user.role === 'admin' ? '#7c3aed' : '#374151',
                        fontWeight: 700, fontSize: '13px', textTransform: 'capitalize'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={cellStyle}>
                      <div style={{ color: '#6b7280', fontSize: '13px', fontWeight: 500 }}>
                        {new Date(user.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    <td style={cellStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} style={{ color: '#9ca3af' }} />
                        <span style={{ color: '#6b7280', fontSize: '13px', fontWeight: 500 }}>
                          {user.lastActivity ? 'Recent' : 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td style={cellStyle}>
                      <div style={{ 
                        display: 'flex', alignItems: 'center', gap: '6px',
                        color: user.status === 'active' ? '#10b981' : '#f43f5e',
                        fontSize: '12px', fontWeight: 700
                      }}>
                        <div style={{ 
                          width: '6px', height: '6px', borderRadius: '50%', 
                          backgroundColor: user.status === 'active' ? '#10b981' : '#f43f5e' 
                        }} />
                        {user.status.toUpperCase()}
                      </div>
                    </td>
                    <td style={{ ...cellStyle, textAlign: 'right' }}>
                      <button style={{ 
                        padding: '8px', borderRadius: '8px', border: 'none', 
                        backgroundColor: 'transparent', cursor: 'pointer', color: '#9ca3af' 
                      }}>
                        <MoreHorizontal size={20} />
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: '80px 0', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                      <div style={{ 
                        width: '64px', height: '64px', borderRadius: '50%', 
                        backgroundColor: '#f9fafb', display: 'flex', 
                        alignItems: 'center', justifyContent: 'center' 
                      }}>
                        <UserIcon size={32} style={{ color: '#e5e7eb' }} />
                      </div>
                      <div style={{ color: '#9ca3af', fontWeight: 700, fontSize: '15px' }}>
                        No users found matching your criteria
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Summary Footer for Stats */}
      <div style={{ 
        marginTop: '32px', 
        padding: '20px', 
        backgroundColor: '#f9fafb', 
        borderRadius: '20px',
        display: 'flex',
        gap: '40px'
      }}>
        <StatItem label="Total Registered" value={counts.total} />
        <StatItem label="Admins" value={counts.admins} />
        <StatItem label="Customers" value={counts.customers} />
        <StatItem label="Active Now" value={counts.active} />
      </div>

    </div>
  );
}

const headerStyle: React.CSSProperties = {
  padding: '16px 24px',
  fontSize: '11px',
  fontWeight: 900,
  color: '#9ca3af',
  letterSpacing: '0.05em'
};

const cellStyle: React.CSSProperties = {
  padding: '20px 24px'
};

function StatItem({ label, value }: { label: string, value: number }) {
  return (
    <div>
      <div style={{ fontSize: '12px', fontWeight: 700, color: '#9ca3af', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '24px', fontWeight: 900, color: '#111827' }}>{value}</div>
    </div>
  );
}
