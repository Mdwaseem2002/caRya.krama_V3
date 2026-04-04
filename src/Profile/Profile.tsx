"use client";

import React, { useState } from "react";
import { User, Heart, MessageSquare, Settings, LogOut, ShieldCheck, Lock, Edit3, Car, Phone, MapPin, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function Profile() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const mobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<"personal" | "wishlist" | "inquiries" | "settings">("personal");

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
    { id: "wishlist" as const, label: "My Wishlist", icon: Heart },
    { id: "inquiries" as const, label: "My Inquiries", icon: MessageSquare },
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

                {/* ── WISHLIST ── */}
                {activeTab === "wishlist" && (
                  <div>
                    <h2 style={{ fontSize: mobile ? '18px' : '22px', fontWeight: 800, color: '#111827', marginBottom: mobile ? '16px' : '24px', paddingBottom: '16px', borderBottom: '2px solid #f3f4f6' }}>My Wishlist</h2>
                    <div style={{ padding: mobile ? '24px 16px' : '40px', textAlign: 'center', backgroundColor: '#F9FAFB', borderRadius: '16px', border: '1px dashed #d1d5db' }}>
                      <Heart style={{ margin: '0 auto', width: mobile ? '36px' : '48px', height: mobile ? '36px' : '48px', color: '#d1d5db', marginBottom: '12px' }} />
                      <h3 style={{ fontSize: mobile ? '16px' : '18px', fontWeight: 700, color: '#374151', marginBottom: '4px' }}>
                        {(user.stats?.savedCars || 0) > 0 ? "Your wishlist looks good!" : "No saved cars yet"}
                      </h3>
                      <p style={{ fontSize: mobile ? '12px' : '14px', color: '#9ca3af', marginBottom: '16px' }}>
                        {(user.stats?.savedCars || 0) > 0 ? `You have ${user.stats.savedCars} saved cars.` : "Start browsing and save cars you love."}
                      </p>
                      <button onClick={() => router.push('/wishlist')} style={{ padding: '10px 24px', backgroundColor: '#0059A3', color: '#ffffff', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                        {(user.stats?.savedCars || 0) > 0 ? "View Wishlist" : "Browse Cars"}
                      </button>
                    </div>
                  </div>
                )}

                {/* ── INQUIRIES ── */}
                {activeTab === "inquiries" && (
                  <div>
                    <h2 style={{ fontSize: mobile ? '18px' : '22px', fontWeight: 800, color: '#111827', marginBottom: mobile ? '16px' : '24px', paddingBottom: '16px', borderBottom: '2px solid #f3f4f6' }}>My Inquiries</h2>
                    {(user.stats?.inquiries || 0) > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: mobile ? 'flex-start' : 'center', justifyContent: 'space-between', flexDirection: mobile ? 'column' : 'row', gap: mobile ? '8px' : '0', padding: mobile ? '14px' : '20px', backgroundColor: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                          <div>
                            <h4 style={{ fontSize: mobile ? '14px' : '16px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>2019 Hyundai Creta SX</h4>
                            <p style={{ fontSize: '13px', color: '#6b7280', margin: 0 }}>Inquired on Mar 20, 2026</p>
                          </div>
                          <span style={{ padding: '4px 14px', backgroundColor: '#FEF3C7', color: '#B45309', fontWeight: 800, fontSize: '11px', borderRadius: '50px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pending</span>
                        </div>
                      </div>
                    ) : (
                      <p style={{ color: '#6b7280' }}>You have no active inquiries.</p>
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
