"use client";

import React from "react";
import { 
  User, Settings, LogOut, ShieldCheck, Lock, 
  Car, FileText, IndianRupee, Users, LayoutDashboard,
  ClipboardCheck, Sparkles, Bell
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";
import Link from "next/link";

interface AdminPagesProps {
  children: React.ReactNode;
}

export default function AdminPages({ children }: AdminPagesProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const mobile = useIsMobile();

  const [stats, setStats] = React.useState({ revenue: 0, liveAssets: 0, totalUsers: 0 });

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      }
    };
    fetchStats();
  }, []);

  const formatStat = (num: number, isCurrency = false) => {
    if (isCurrency) {
      if (num >= 1000000) return `₹${(num / 1000000).toFixed(1)}M`;
      if (num >= 1000) return `₹${(num / 1000).toFixed(1)}k`;
      return `₹${num}`;
    }
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toString();
  };

  // Don't show the layout for the main admin login page
  if (pathname === '/admin' || pathname === '/admin/') {
    return <>{children}</>;
  }

  if (!user || user.role !== 'admin') {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', backgroundColor: '#f9fafb' }}>
        <div style={{ width: '64px', height: '64px', backgroundColor: '#FEE2E2', color: '#EF4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <Lock size={32} />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>Access Denied</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '14px', textAlign: 'center' }}>You do not have administrative privileges.</p>
        <button onClick={() => router.push('/')} style={{ padding: '10px 24px', backgroundColor: '#0059A3', color: '#ffffff', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Go Home</button>
      </div>
    );
  }

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
    { id: "notifications", label: "Notifications", icon: Bell, href: "/details" },
    { id: "cars", label: "Car Management", icon: Car, href: "/admin/carmanagement" },
    { id: "reports", label: "Report Management", icon: FileText, href: "/admin/reports" },
    { id: "payments", label: "Payment Tracking", icon: IndianRupee, href: "/admin/payments" },
    { id: "sell_requests", label: "Sell Requests", icon: Sparkles, href: "/admin/sell-requests" },
    { id: "inspection_reports", label: "Inspection Reports", icon: ClipboardCheck, href: "/admin/inspection-reports" },
    { id: "users", label: "User Management", icon: Users, href: "/admin/users" },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: mobile ? '16px 12px' : '32px 16px', minHeight: '85vh', backgroundColor: '#fdfdfd' }}>
      
      {/* ═══ PROFILE HEADER ═══ */}
      <div style={{ 
        width: '100%', borderRadius: mobile ? '16px' : '24px', overflow: 'hidden', marginBottom: mobile ? '16px' : '32px',
        background: 'linear-gradient(135deg, #0059A3 0%, #0077D4 50%, #4DA3E8 100%)',
        boxShadow: '0 10px 40px rgba(0, 89, 163, 0.25)'
      }}>
        <div style={{ padding: mobile ? '24px 16px 16px' : '40px 32px 24px', display: 'flex', alignItems: mobile ? 'flex-start' : 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: mobile ? '12px' : '20px', flexDirection: mobile ? 'column' : 'row' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? '14px' : '20px' }}>
            <div style={{ 
              width: mobile ? '64px' : '100px', height: mobile ? '64px' : '100px', borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)', flexShrink: 0
            }}>
              {user.profilePhoto ? (
                <img 
                  src={user.profilePhoto} 
                  alt="Admin" 
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                />
              ) : (
                <ShieldCheck size={mobile ? 28 : 44} style={{ color: '#ffffff' }} strokeWidth={1.5} />
              )}
            </div>
            <div>
              <h1 style={{ fontSize: mobile ? '20px' : '28px', fontWeight: 800, color: '#ffffff', margin: 0, lineHeight: 1.3 }}>Insight Center</h1>
              <p style={{ fontSize: mobile ? '12px' : '14px', color: 'rgba(255,255,255,0.8)', margin: '4px 0 0 0', fontWeight: 500 }}>
                {user.name || 'Admin'} &nbsp;•&nbsp; Operational Node 01
              </p>
            </div>
          </div>
          <Link href="/admin/edit" style={{ textDecoration: 'none' }}>
            <button style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', padding: mobile ? '8px 16px' : '10px 20px',
              backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '50px', fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(10px)', fontSize: mobile ? '12px' : '14px'
            }}>
              <Settings size={14} /> System Config
            </button>
          </Link>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', backgroundColor: 'rgba(255,255,255,0.1)', borderTop: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
          {[
            { value: formatStat(stats.revenue, true), label: "Revenue" },
            { value: formatStat(stats.liveAssets), label: "Live Assets" },
            { value: formatStat(stats.totalUsers), label: "Users" },
          ].map((stat, i) => (
            <div key={stat.label} style={{ padding: mobile ? '12px 8px' : '20px', textAlign: 'center', borderRight: i < 2 ? '1px solid rgba(255,255,255,0.15)' : 'none' }}>
              <h4 style={{ fontSize: mobile ? '20px' : '28px', fontWeight: 800, color: '#ffffff', margin: 0 }}>{stat.value}</h4>
              <p style={{ fontSize: mobile ? '9px' : '11px', color: 'rgba(255,255,255,0.7)', margin: '4px 0 0', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>


      {/* ═══ CONTENT GRID ═══ */}
      <div style={{ display: mobile ? 'flex' : 'grid', flexDirection: 'column', gridTemplateColumns: '280px 1fr', gap: '16px' }}>
        
        {/* ─── SIDEBAR / TABS ─── */}
        <div style={{ display: 'flex', flexDirection: mobile ? 'row' : 'column', gap: mobile ? '12px' : '20px', width: '100%', minWidth: 0, overflowX: mobile ? 'auto' : 'visible' }}>
          {/* Tab Navigation */}
          <div style={{ 
            backgroundColor: '#ffffff', borderRadius: mobile ? '14px' : '20px', padding: '8px',
            border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', width: '100%', boxSizing: 'border-box',
            display: mobile ? 'flex' : 'block', gap: mobile ? '4px' : undefined,
            overflowX: mobile ? 'auto' : 'visible', flexShrink: 0,
          }}>
            {tabs.map((tab) => (
              <Link key={tab.id} href={tab.href} style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    width: mobile ? 'auto' : '100%', whiteSpace: 'nowrap',
                    display: 'flex', alignItems: 'center', gap: mobile ? '6px' : '12px',
                    padding: mobile ? '10px 14px' : '14px 16px', borderRadius: mobile ? '10px' : '14px',
                    border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: mobile ? '12px' : '14px',
                    marginBottom: mobile ? 0 : '4px', transition: 'all 0.2s', flexShrink: 0,
                    backgroundColor: isActive(tab.href) ? '#0059A3' : 'transparent',
                    color: isActive(tab.href) ? '#ffffff' : '#374151',
                  }}
                >
                  <tab.icon size={mobile ? 14 : 18} style={{ color: isActive(tab.href) ? '#ffffff' : '#9ca3af' }} />
                  {tab.label}
                </button>
              </Link>
            ))}

            {!mobile && <div style={{ width: '100%', height: '1px', backgroundColor: '#f3f4f6', margin: '8px 0' }} />}
            
            <button 
              onClick={() => { logout(); router.push('/'); }}
              style={{
                width: mobile ? 'auto' : '100%', whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: mobile ? '6px' : '12px',
                padding: mobile ? '10px 14px' : '14px 16px', borderRadius: mobile ? '10px' : '14px',
                border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: mobile ? '12px' : '14px',
                backgroundColor: 'transparent', color: '#EF4444', flexShrink: 0,
              }}
            >
              <LogOut size={mobile ? 14 : 18} style={{ color: '#EF4444' }} />
              Log Out
            </button>
          </div>

          {/* Trust Badges */}
          {!mobile && (
            <div style={{ background: 'linear-gradient(135deg, #ECFDF5, #F0FDF4)', borderRadius: '20px', padding: '24px', border: '1px solid #BBF7D0', width: '100%', boxSizing: 'border-box' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#166534', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Trust & Safety</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={20} style={{ color: '#16A34A' }} />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#166534' }}>Admin Privileges</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Lock size={20} style={{ color: '#16A34A' }} />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#166534' }}>Secure Node</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ─── MAIN CONTENT ─── */}
        <main style={{ width: '100%', minWidth: 0 }}>
          <div style={{ 
            backgroundColor: '#ffffff', borderRadius: mobile ? '14px' : '20px', padding: mobile ? '20px 16px' : '32px',
            border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', minHeight: mobile ? '200px' : '400px',
            width: '100%', boxSizing: 'border-box'
          }}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
