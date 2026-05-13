"use client";

import React, { useState } from "react";
import { 
  User, Settings, LogOut, ShieldCheck, Lock, Edit3, 
  Car, FileText, IndianRupee, Users, LayoutDashboard,
  Plus, ClipboardCheck
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";
import AdminPanel from "./AdminPanel";
import Uploadcar from "../Upload/Uploadcar";
import ReportManage from "../ReportManagement/ReportManage";
import PaymentTraker from "../PaymentTraking/PaymentTraker";
import DashboardView from "../Dashboard/DashboardView";
import { getAllStoredCars, deleteCarFromStorage, StoredCar } from "../Upload/CarStorage";
import UserManage from "../UserManagement/UserManage";
import SellRequestsList from "../SellRequests/SellRequestsList";
import InspectionReportsList from "../InspectionReports/InspectionReportsList";
import { Sparkles } from "lucide-react";
import ImageMigrationTool from "@/Details/ImageConvert/ImageConvert";

export default function AdminProfile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const mobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<"dashboard" | "cars" | "reports" | "payments" | "users" | "sell_requests" | "inspection_reports">("dashboard");

  const [showUpload, setShowUpload] = useState(false);
  const [editingCar, setEditingCar] = useState<StoredCar | undefined>(undefined);
  const [cars, setCars] = useState<StoredCar[]>([]);
  const [isCarsLoading, setIsCarsLoading] = useState(true);

  const [stats, setStats] = useState({ revenue: 0, liveAssets: 0, totalUsers: 0 });

  React.useEffect(() => {
    if (activeTab === 'cars' && !showUpload) {
      setIsCarsLoading(true);
      getAllStoredCars()
        .then(setCars)
        .catch(console.error)
        .finally(() => setIsCarsLoading(false));
    }
  }, [activeTab, showUpload]);

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


  const handleDashboardAction = (tab: "cars" | "reports" | "payments" | "sell_requests", action?: string) => {
    setActiveTab(tab);
    if (tab === "cars" && action === "upload") {
      setShowUpload(true);
      setEditingCar(undefined);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this car?")) {
      try {
        await deleteCarFromStorage(id);
        const updated = await getAllStoredCars();
        setCars(updated);
      } catch (err: any) {
        alert(`Failed to delete car: ${err?.message || 'Unknown error'}`);
      }
    }
  };


  if (!user || user.role !== 'admin') {
    return (
      <div style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
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
    { id: "dashboard" as const, label: "Dashboard", icon: LayoutDashboard },
    { id: "cars" as const, label: "Car Management", icon: Car },
    { id: "reports" as const, label: "Report Management", icon: FileText },
    { id: "payments" as const, label: "Payment Tracking", icon: IndianRupee },
    { id: "sell_requests" as const, label: "Sell Requests", icon: Sparkles },
    { id: "inspection_reports" as const, label: "Inspection Reports", icon: ClipboardCheck },
    { id: "users" as const, label: "User Management", icon: Users },
  ];

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
                {user.name} &nbsp;•&nbsp; Operational Node 01
              </p>
            </div>
          </div>
          <button onClick={() => router.push('/Profile/edit')} style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', padding: mobile ? '8px 16px' : '10px 20px',
            backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '50px', fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(10px)', fontSize: mobile ? '12px' : '14px'
          }}>
            <Settings size={14} /> System Config
          </button>
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
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  width: mobile ? 'auto' : '100%', whiteSpace: 'nowrap',
                  display: 'flex', alignItems: 'center', gap: mobile ? '6px' : '12px',
                  padding: mobile ? '10px 14px' : '14px 16px', borderRadius: mobile ? '10px' : '14px',
                  border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: mobile ? '12px' : '14px',
                  marginBottom: mobile ? 0 : '4px', transition: 'all 0.2s', flexShrink: 0,
                  backgroundColor: activeTab === tab.id ? '#0059A3' : 'transparent',
                  color: activeTab === tab.id ? '#ffffff' : '#374151',
                }}
              >
                <tab.icon size={mobile ? 14 : 18} style={{ color: activeTab === tab.id ? '#ffffff' : '#9ca3af' }} />
                {tab.label}
              </button>
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
            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>

                {/* ── DASHBOARD ── */}
                {activeTab === "dashboard" && (
                  <div>
                    <h2 style={{ fontSize: mobile ? '18px' : '22px', fontWeight: 800, color: '#111827', marginBottom: mobile ? '16px' : '24px', paddingBottom: '16px', borderBottom: '2px solid #f3f4f6' }}>Dashboard Overview</h2>
                    <DashboardView onAction={handleDashboardAction} />
                  </div>
                )}

                {/* ── CARS ── */}
                {activeTab === "cars" && (
                  <div>
                    <AnimatePresence mode="wait">
                      {showUpload ? (
                        <motion.div key={editingCar?.id || "upload"} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                          <Uploadcar onBack={() => { setShowUpload(false); setEditingCar(undefined); }} onSuccess={() => { setShowUpload(false); setEditingCar(undefined); }} editCar={editingCar} />
                        </motion.div>

                      ) : (
                        <motion.div key="list" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: mobile ? '16px' : '24px', paddingBottom: '16px', borderBottom: '2px solid #f3f4f6' }}>
                            <h2 style={{ fontSize: mobile ? '18px' : '22px', fontWeight: 800, color: '#111827', margin: 0 }}>Asset Inventory</h2>
                            <div style={{ display: 'flex', gap: '12px' }}>
                              <ImageMigrationTool />
                              <button onClick={() => { setEditingCar(undefined); setShowUpload(true); }} style={{ padding: '8px 16px', backgroundColor: '#0059A3', color: '#ffffff', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                                <Plus size={16} /> Upload
                              </button>
                            </div>
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {isCarsLoading ? (
                              <>
                                <style>{`
                                  @keyframes shimmerskeleton {
                                    0% { background-position: -200px 0; }
                                    100% { background-position: calc(200px + 100%) 0; }
                                  }
                                  .skeleton-box {
                                    background: #f3f4f6;
                                    background-image: linear-gradient(90deg, #f3f4f6 0px, #e5e7eb 40px, #f3f4f6 80px);
                                    background-size: 200px 100%;
                                    animation: shimmerskeleton 1.5s infinite linear;
                                  }
                                `}</style>
                                {[1, 2, 3].map((i) => (
                                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '12px', backgroundColor: '#ffffff' }}>
                                    <div className="skeleton-box" style={{ width: '80px', height: '60px', borderRadius: '8px' }} />
                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                      <div className="skeleton-box" style={{ height: '16px', width: '40%', borderRadius: '4px' }} />
                                      <div className="skeleton-box" style={{ height: '12px', width: '25%', borderRadius: '4px' }} />
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                      <div className="skeleton-box" style={{ width: '34px', height: '34px', borderRadius: '8px' }} />
                                      <div className="skeleton-box" style={{ width: '34px', height: '34px', borderRadius: '8px' }} />
                                    </div>
                                  </div>
                                ))}
                              </>
                            ) : cars.length === 0 ? (
                              <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#F9FAFB', borderRadius: '12px', border: '1px dashed #d1d5db', color: '#6b7280' }}>
                                No cars uploaded yet. Click "Upload" to add your first car.
                              </div>
                            ) : (
                              cars.map((item) => (
                                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '1px solid #e5e7eb', borderRadius: '12px', backgroundColor: '#F9FAFB' }}>
                                  <img src={item.media.coverImage} alt={item.title} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                                  <div style={{ flex: 1 }}>
                                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>{item.title}</h4>
                                    <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>{item.id} • <span style={{ color: '#0059A3', fontWeight: 600 }}>{item.pricing.sellingPrice}</span></p>
                                  </div>
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <button 
                                      onClick={async (e) => {
                                        const btn = e.currentTarget;
                                        btn.disabled = true;
                                        btn.style.opacity = '0.5';
                                        try {
                                          const { getStoredCarById } = await import("../Upload/CarStorage");
                                          // The improved getStoredCarById automatically handles fetching fresh data if images are missing in cache
                                          const fullCar = await getStoredCarById(item.id);

                                          if (fullCar) {
                                            setEditingCar(fullCar);
                                            setShowUpload(true);
                                          } else {
                                            alert("Failed to load car details. Please try again.");
                                          }
                                        } catch (err) {
                                          console.error("Edit fetch failed:", err);
                                          alert("Error loading car data.");
                                        } finally {
                                          btn.disabled = false;
                                          btn.style.opacity = '1';
                                        }
                                      }} 
                                      style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', color: '#6b7280', cursor: 'pointer' }}
                                    >
                                      <Edit3 size={16} />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} style={{ padding: '8px', backgroundColor: '#ffffff', border: '1px solid #FCA5A5', borderRadius: '8px', color: '#EF4444', cursor: 'pointer' }}><Trash2 size={16} /></button>
                                  </div>

                                </div>
                              ))
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* ── REPORTS ── */}
                {activeTab === "reports" && (
                  <div>
                    <h2 style={{ fontSize: mobile ? '18px' : '22px', fontWeight: 800, color: '#111827', marginBottom: mobile ? '16px' : '24px', paddingBottom: '16px', borderBottom: '2px solid #f3f4f6' }}>Report Management</h2>
                    <div style={{ borderRadius: '16px', overflow: 'hidden' }}>
                      <ReportManage />
                    </div>
                  </div>
                )}

                {/* ── PAYMENTS ── */}
                {activeTab === "payments" && (
                  <div>
                    <h2 style={{ fontSize: mobile ? '18px' : '22px', fontWeight: 800, color: '#111827', marginBottom: mobile ? '16px' : '24px', paddingBottom: '16px', borderBottom: '2px solid #f3f4f6' }}>Payment Tracking</h2>
                    <div style={{ borderRadius: '16px', overflow: 'hidden' }}>
                      <PaymentTraker />
                    </div>
                  </div>
                )}

                {/* ── SELL REQUESTS ── */}
                {activeTab === "sell_requests" && (
                   <div>
                      <h2 style={{ fontSize: mobile ? '18px' : '22px', fontWeight: 800, color: '#111827', marginBottom: mobile ? '16px' : '24px', paddingBottom: '16px', borderBottom: '2px solid #f3f4f6' }}>Sell Requests Queue</h2>
                      <SellRequestsList />
                   </div>
                )}

                {/* ── INSPECTION REPORTS ── */}
                {activeTab === "inspection_reports" && (
                  <div>
                    <h2 style={{ fontSize: mobile ? '18px' : '22px', fontWeight: 800, color: '#111827', marginBottom: mobile ? '16px' : '24px', paddingBottom: '16px', borderBottom: '2px solid #f3f4f6' }}>Inspection Reports</h2>
                    <InspectionReportsList />
                  </div>
                )}

                {/* ── USERS ── */}

                {activeTab === "users" && (
                  <div>
                    <h2 style={{ fontSize: mobile ? '18px' : '22px', fontWeight: 800, color: '#111827', marginBottom: mobile ? '16px' : '24px', paddingBottom: '16px', borderBottom: '2px solid #f3f4f6' }}>User Management</h2>
                    <UserManage />
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

const Trash2 = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
);
