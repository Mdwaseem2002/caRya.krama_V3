"use client";

import React, { useState, useEffect } from "react";
import { User, Heart, MessageSquare, Settings, LogOut, ShieldCheck, Lock, Edit3, Car, Phone, MapPin, Mail, Clock, RefreshCw, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";
import { getUserSellRequests, SellRequest } from "@/Admin/SellRequests/SellStorage";

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<"personal" | "settings" | "requests">("personal");
  const [requests, setRequests] = useState<SellRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Deep Link Handling
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'requests') setActiveTab('requests');
  }, [searchParams]);

  // Fetch Requests
  useEffect(() => {
    if (activeTab === "requests" && user?.email) {
      setLoadingRequests(true);
      getUserSellRequests(user.email).then(data => {
        setRequests(data);
        setLoadingRequests(false);
      });
    }
  }, [activeTab, user?.email]);

  if (!user) {
    return (
      <div style={{ minHeight: '50vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '64px', height: '64px', backgroundColor: '#E8F0FE', color: '#0059A3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <User size={32} />
        </div>
        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>Not Logged In</h2>
        <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '14px', textAlign: 'center' }}>Please log in to view your profile dashboard.</p>
        <button onClick={() => router.push('/')} style={{ padding: '10px 24px', backgroundColor: '#0059A3', color: '#ffffff', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Go Home</button>
      </div>
    );
  }

  const tabs = [
    { id: "personal" as const, label: "Personal Info", icon: User },
    { id: "requests" as const, label: "My Requests", icon: Car },
    { id: "settings" as const, label: "Settings", icon: Settings },
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: mobile ? '16px 12px' : '32px 16px', minHeight: '85vh' }}>
      
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
              <User size={mobile ? 28 : 44} style={{ color: '#ffffff' }} strokeWidth={1.5} />
            </div>
            <div>
              <h1 style={{ fontSize: mobile ? '20px' : '28px', fontWeight: 800, color: '#ffffff', margin: 0, lineHeight: 1.3 }}>{user.name}</h1>
              <p style={{ fontSize: mobile ? '12px' : '14px', color: 'rgba(255,255,255,0.8)', margin: '4px 0 0 0', fontWeight: 500 }}>
                {user.email} &nbsp;•&nbsp; Joined {new Date(user.joinDate).getFullYear()}
              </p>
            </div>
          </div>
          <button onClick={() => router.push('/Profile/edit')} style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', padding: mobile ? '8px 16px' : '10px 20px',
            backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '50px', fontWeight: 700, cursor: 'pointer', backdropFilter: 'blur(10px)', fontSize: mobile ? '12px' : '14px'
          }}>
            <Edit3 size={14} /> Edit Profile
          </button>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', backgroundColor: 'rgba(255,255,255,0.1)', borderTop: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
          {[
            { value: user.stats?.savedCars || 0, label: "Saved Cars" },
            { value: user.stats?.inquiries || 0, label: "Inquiries" },
            { value: user.stats?.testDrives || 0, label: "Test Drives" },
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

          {/* Trust Badges — hide on mobile, shown after content */}
          {!mobile && (
            <div style={{ background: 'linear-gradient(135deg, #ECFDF5, #F0FDF4)', borderRadius: '20px', padding: '24px', border: '1px solid #BBF7D0', width: '100%', boxSizing: 'border-box' }}>
              <h3 style={{ fontSize: '12px', fontWeight: 800, color: '#166534', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Trust & Safety</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <ShieldCheck size={20} style={{ color: '#16A34A' }} />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#166534' }}>Verified Account</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Lock size={20} style={{ color: '#16A34A' }} />
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#166534' }}>Data Protected</span>
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

                {/* ── PERSONAL INFO ── */}
                {activeTab === "personal" && (
                  <div>
                    <h2 style={{ fontSize: mobile ? '18px' : '22px', fontWeight: 800, color: '#111827', marginBottom: mobile ? '16px' : '24px', paddingBottom: '16px', borderBottom: '2px solid #f3f4f6' }}>Personal Information</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: mobile ? '1fr' : '1fr 1fr', gap: mobile ? '12px' : '24px' }}>
                      {[
                        { icon: User, label: "Full Name", value: user.name },
                        { icon: Mail, label: "Email Address", value: user.email },
                        { icon: Phone, label: "Phone Number", value: user.phone || "Not provided", muted: !user.phone },
                        { icon: MapPin, label: "Location", value: user.location || "Bengaluru, IN" },
                      ].map((item) => (
                        <div key={item.label} style={{ padding: mobile ? '14px' : '20px', backgroundColor: '#F9FAFB', borderRadius: mobile ? '12px' : '16px', border: '1px solid #f3f4f6' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                            <item.icon size={14} style={{ color: '#0059A3' }} />
                            <span style={{ fontSize: '11px', fontWeight: 800, color: '#0059A3', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.label}</span>
                          </div>
                          <p style={{ fontSize: mobile ? '15px' : '17px', fontWeight: 600, color: item.muted ? '#9ca3af' : '#111827', margin: 0 }}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── SELL REQUESTS ── */}
                {activeTab === "requests" && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: mobile ? '16px' : '24px', paddingBottom: '16px', borderBottom: '2px solid #f3f4f6' }}>
                      <h2 style={{ fontSize: mobile ? '18px' : '22px', fontWeight: 800, color: '#111827', margin: 0 }}>Sell Requests</h2>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#6b7280', backgroundColor: '#F3F4F6', padding: '4px 10px', borderRadius: '50px' }}>
                        {requests.length} Total
                      </span>
                    </div>

                    {loadingRequests ? (
                      <div style={{ padding: '60px 0', textAlign: 'center', color: '#9ca3af' }}>
                        <RefreshCw size={32} className="animate-spin mx-auto mb-4 opacity-20" />
                        <p style={{ fontSize: '14px', fontWeight: 700 }}>Synchronizing with database...</p>
                      </div>
                    ) : requests.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {requests.map((req) => (
                          <div key={req.id} style={{ 
                            padding: mobile ? '16px' : '20px', backgroundColor: '#F9FAFB', borderRadius: '20px', border: '1px solid #f3f4f6',
                            display: 'flex', flexDirection: mobile ? 'column' : 'row', gap: '16px', alignItems: mobile ? 'flex-start' : 'center',
                            transition: 'all 0.2s'
                          }} className="hover:bg-white hover:shadow-lg hover:shadow-slate-200/50">
                            {/* Car Thumbnail */}
                            <div style={{ width: mobile ? '100%' : '140px', height: '90px', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#e5e7eb', flexShrink: 0 }}>
                              {req.car.images?.[0] ? (
                                <img src={req.car.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={req.car.model} />
                              ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <Car size={24} style={{ color: '#d1d5db' }} />
                                </div>
                              )}
                            </div>

                            {/* Details */}
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span style={{ fontSize: '10px', fontWeight: 900, color: '#0059A3', backgroundColor: '#E8F0FE', padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase' }}>{req.id}</span>
                                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: 0 }}>{req.car.brand} {req.car.model}</h3>
                              </div>
                              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>
                                  <Clock size={12} /> {new Date(req.createdAt).toLocaleDateString()}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>
                                  <MapPin size={12} /> {req.inspection.location} Inspection
                                </div>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <div style={{ 
                              padding: '8px 16px', borderRadius: '50px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px',
                              backgroundColor: 
                                req.status === 'pending' ? '#FEF3C7' : 
                                req.status === 'approved' ? '#DCFCE7' : 
                                req.status === 'rejected' ? '#FEE2E2' : '#E0F2FE',
                              color: 
                                req.status === 'pending' ? '#D97706' : 
                                req.status === 'approved' ? '#16A34A' : 
                                req.status === 'rejected' ? '#EF4444' : '#0369A1',
                              minWidth: '100px', textAlign: 'center'
                            }}>
                              {req.status}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ textAlign: 'center', padding: '60px 24px', backgroundColor: '#F9FAFB', borderRadius: '20px', border: '1px dashed #d1d5db' }}>
                        <Car size={40} style={{ color: '#d1d5db', marginBottom: '16px' }} />
                        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>No Sell Requests</h3>
                        <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '24px' }}>You haven't submitted any cars for sale yet.</p>
                        <button onClick={() => router.push('/sell-your-car')} style={{ padding: '12px 28px', backgroundColor: '#0059A3', color: '#ffffff', border: 'none', borderRadius: '14px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>Sell Your Car</button>
                      </div>
                    )}
                  </div>
                )}

                {/* ── SETTINGS ── */}
                {activeTab === "settings" && (
                  <div>
                    <h2 style={{ fontSize: mobile ? '18px' : '22px', fontWeight: 800, color: '#111827', marginBottom: mobile ? '16px' : '24px', paddingBottom: '16px', borderBottom: '2px solid #f3f4f6' }}>Account Settings</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #f3f4f6' }}>
                        <div>
                          <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Change Password</h4>
                          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>Update your account security</p>
                        </div>
                        <button style={{ padding: '8px 20px', border: '1px solid #e5e7eb', borderRadius: '12px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', backgroundColor: '#ffffff', color: '#374151' }}>Update</button>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #f3f4f6' }}>
                        <div>
                          <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>Email Notifications</h4>
                          <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>Receive alerts on price drops</p>
                        </div>
                        <div style={{ width: '48px', height: '26px', backgroundColor: '#0059A3', borderRadius: '50px', position: 'relative', cursor: 'pointer' }}>
                          <div style={{ width: '22px', height: '22px', backgroundColor: '#ffffff', borderRadius: '50%', position: 'absolute', right: '2px', top: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', marginTop: '24px' }}>
                        <div>
                          <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#EF4444', margin: '0 0 4px' }}>Delete Account</h4>
                          <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>Permanently remove your data</p>
                        </div>
                        <button style={{ padding: '8px 20px', border: '1px solid #FCA5A5', borderRadius: '12px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', backgroundColor: '#ffffff', color: '#EF4444' }}>Delete</button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Trust badges on mobile — shown at bottom */}
      {mobile && (
        <div style={{ background: 'linear-gradient(135deg, #ECFDF5, #F0FDF4)', borderRadius: '14px', padding: '16px', border: '1px solid #BBF7D0', marginTop: '16px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldCheck size={16} style={{ color: '#16A34A' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#166534' }}>Verified</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={16} style={{ color: '#16A34A' }} />
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#166534' }}>Protected</span>
          </div>
        </div>
      )}
    </div>
  );
}
