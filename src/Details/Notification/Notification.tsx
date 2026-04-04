"use client";

import React, { useState } from "react";
import {
  Bell, MessageSquare, Car, Gift, Settings, CheckCheck, ChevronRight,
  BellOff, Mail, Phone as PhoneIcon, ArrowLeft, Trash2, Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";

// ── Types ──
type NotifType = "inquiry" | "car" | "offer" | "system";
interface Notif {
  id: string;
  type: NotifType;
  title: string;
  message: string;
  time: string;
  timeSort: number; // 0=today, 1=yesterday, 2=earlier
  read: boolean;
  cta?: { label: string; href: string };
}

// ── Mock Data ──
const MOCK_NOTIFICATIONS: Notif[] = [
  { id: "1", type: "inquiry", title: "Dealer Responded", message: "AutoMax Motors replied to your inquiry about 2019 Hyundai Creta SX.", time: "2 mins ago", timeSort: 0, read: false, cta: { label: "View Details", href: "/BuyCar" } },
  { id: "2", type: "car", title: "Price Drop Alert 🔥", message: "Price dropped ₹45,000 on your saved Maruti Baleno Delta.", time: "1 hour ago", timeSort: 0, read: false, cta: { label: "View Car", href: "/BuyCar" } },
  { id: "3", type: "offer", title: "Special Deal Available", message: "Get ₹15,000 off on extended warranty — limited-time offer!", time: "3 hours ago", timeSort: 0, read: false, cta: { label: "Check Details", href: "/BuyCar" } },
  { id: "4", type: "inquiry", title: "Test Drive Scheduled", message: "Your test drive for Honda City V-CVT is confirmed for Mar 26.", time: "Yesterday", timeSort: 1, read: true, cta: { label: "View Details", href: "/BuyCar" } },
  { id: "5", type: "car", title: "New Car in Your Wishlist Category", message: "A 2022 Tata Nexon EV was just listed near your area.", time: "Yesterday", timeSort: 1, read: true, cta: { label: "View Car", href: "/BuyCar" } },
  { id: "6", type: "offer", title: "Limited-Time Discount", message: "Avail 0% processing fee on car loans this week.", time: "Yesterday", timeSort: 1, read: true },
  { id: "7", type: "system", title: "Profile Updated", message: "Your profile information was updated successfully.", time: "3 days ago", timeSort: 2, read: true },
  { id: "8", type: "system", title: "Password Changed", message: "Your password was changed. If this wasn't you, contact support.", time: "5 days ago", timeSort: 2, read: true },
  { id: "9", type: "car", title: "Saved Car Sold Out", message: "The 2020 Kia Seltos GTX+ you saved has been sold.", time: "1 week ago", timeSort: 2, read: true },
];

const TABS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "inquiry", label: "Inquiries" },
  { id: "offer", label: "Offers" },
  { id: "system", label: "System" },
] as const;

const TYPE_CONFIG: Record<NotifType, { icon: any; color: string; bg: string }> = {
  inquiry: { icon: MessageSquare, color: "#0059A3", bg: "#E8F0FE" },
  car: { icon: Car, color: "#16A34A", bg: "#DCFCE7" },
  offer: { icon: Gift, color: "#D97706", bg: "#FEF3C7" },
  system: { icon: Settings, color: "#6B7280", bg: "#F3F4F6" },
};

export default function Notification() {
  const router = useRouter();
  const mobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [notifications, setNotifications] = useState<Notif[]>(MOCK_NOTIFICATIONS);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [whatsappNotifs, setWhatsappNotifs] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markOneRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const deleteNotif = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));

  // Filtering
  const filtered = notifications.filter(n => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !n.read;
    return n.type === activeTab;
  });

  // Grouping
  const groups = [
    { label: "Today", items: filtered.filter(n => n.timeSort === 0) },
    { label: "Yesterday", items: filtered.filter(n => n.timeSort === 1) },
    { label: "Earlier", items: filtered.filter(n => n.timeSort === 2) },
  ].filter(g => g.items.length > 0);

  // ── Responsive styles ──
  const pageP = mobile ? '16px 12px' : '32px 16px';

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: pageP, minHeight: '85vh' }}>
      
      {/* ═══ BACK (mobile) ═══ */}
      {mobile && (
        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: 'none', cursor: 'pointer', color: '#0059A3', fontWeight: 700, fontSize: '13px', marginBottom: '16px', padding: 0 }}>
          <ArrowLeft size={16} /> Back
        </button>
      )}

      {/* ═══ 1. HEADER ═══ */}
      <div style={{ display: 'flex', alignItems: mobile ? 'flex-start' : 'center', justifyContent: 'space-between', flexDirection: mobile ? 'column' : 'row', gap: mobile ? '12px' : '0', marginBottom: mobile ? '20px' : '28px' }}>
        <div>
          <h1 style={{ fontSize: mobile ? '24px' : '30px', fontWeight: 800, color: '#111827', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            Notifications
            {unreadCount > 0 && (
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', backgroundColor: '#EF4444', borderRadius: '50px', padding: '2px 10px', lineHeight: '20px' }}>{unreadCount}</span>
            )}
          </h1>
          <p style={{ fontSize: mobile ? '13px' : '15px', color: '#6b7280', margin: 0 }}>Stay updated with your activity</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: mobile ? '8px 14px' : '10px 20px', backgroundColor: '#0059A3', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: mobile ? '12px' : '14px', cursor: 'pointer' }}>
            <CheckCheck size={16} /> Mark all as read
          </button>
        )}
      </div>

      {/* ═══ 2. FILTER TABS ═══ */}
      <div style={{ display: 'flex', gap: mobile ? '6px' : '8px', marginBottom: mobile ? '16px' : '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: mobile ? '8px 14px' : '10px 20px',
              borderRadius: '50px', border: 'none', cursor: 'pointer',
              fontWeight: 700, fontSize: mobile ? '12px' : '13px',
              whiteSpace: 'nowrap', flexShrink: 0,
              transition: 'all 0.2s',
              backgroundColor: activeTab === tab.id ? '#0059A3' : '#F3F4F6',
              color: activeTab === tab.id ? '#ffffff' : '#374151',
            }}
          >
            {tab.label}
            {tab.id === 'unread' && unreadCount > 0 && (
              <span style={{ marginLeft: '6px', fontSize: '11px', backgroundColor: activeTab === 'unread' ? 'rgba(255,255,255,0.3)' : '#EF4444', color: '#ffffff', borderRadius: '50px', padding: '1px 7px' }}>{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* ═══ 3 & 4. GROUPED NOTIFICATIONS ═══ */}
      {groups.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: mobile ? '20px' : '28px' }}>
          {groups.map(group => (
            <div key={group.label}>
              <h3 style={{ fontSize: mobile ? '12px' : '13px', fontWeight: 800, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: mobile ? '10px' : '14px', paddingLeft: '4px' }}>{group.label}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: mobile ? '8px' : '10px' }}>
                <AnimatePresence>
                  {group.items.map(notif => {
                    const cfg = TYPE_CONFIG[notif.type];
                    const Icon = cfg.icon;
                    return (
                      <motion.div
                        key={notif.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => {
                          markOneRead(notif.id);
                          if (notif.cta) router.push(notif.cta.href);
                        }}
                        style={{
                          display: 'flex', alignItems: mobile ? 'flex-start' : 'center', gap: mobile ? '12px' : '16px',
                          padding: mobile ? '14px' : '18px 20px',
                          backgroundColor: notif.read ? '#ffffff' : '#F0F7FF',
                          borderLeft: notif.read ? '3px solid transparent' : '3px solid #0059A3',
                          borderRadius: mobile ? '14px' : '16px',
                          border: `1px solid ${notif.read ? '#e5e7eb' : '#BFDBFE'}`,
                          borderLeftWidth: '3px',
                          borderLeftColor: notif.read ? 'transparent' : '#0059A3',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        }}
                        whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(0,89,163,0.1)' }}
                      >
                        {/* Icon */}
                        <div style={{ width: mobile ? '40px' : '48px', height: mobile ? '40px' : '48px', borderRadius: '14px', backgroundColor: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Icon size={mobile ? 18 : 22} style={{ color: cfg.color }} />
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                            <h4 style={{ fontSize: mobile ? '14px' : '15px', fontWeight: notif.read ? 600 : 800, color: '#111827', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{notif.title}</h4>
                            {!notif.read && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#0059A3', flexShrink: 0 }} />}
                          </div>
                          <p style={{ fontSize: mobile ? '12px' : '13px', color: '#6b7280', margin: '0 0 6px', lineHeight: 1.4 }}>{notif.message}</p>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                            <span style={{ fontSize: mobile ? '11px' : '12px', color: '#9ca3af', fontWeight: 500 }}>{notif.time}</span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {notif.cta && (
                                <span style={{ fontSize: mobile ? '11px' : '12px', color: '#0059A3', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                                  {notif.cta.label} <ChevronRight size={12} />
                                </span>
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); deleteNotif(notif.id); }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#d1d5db', display: 'flex' }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ═══ 5. EMPTY STATE ═══ */
        <div style={{ textAlign: 'center', padding: mobile ? '40px 16px' : '60px 32px', backgroundColor: '#ffffff', borderRadius: '20px', border: '1px dashed #d1d5db', marginBottom: '24px' }}>
          <div style={{ width: mobile ? '64px' : '80px', height: mobile ? '64px' : '80px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <BellOff size={mobile ? 28 : 36} style={{ color: '#d1d5db' }} />
          </div>
          <h3 style={{ fontSize: mobile ? '18px' : '22px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>No notifications yet</h3>
          <p style={{ fontSize: mobile ? '13px' : '15px', color: '#9ca3af', marginBottom: '24px', maxWidth: '360px', margin: '0 auto 24px' }}>
            {activeTab === 'unread' ? "You're all caught up! No unread notifications." : "When there's activity on your account, you'll see it here."}
          </p>
          <button onClick={() => router.push('/BuyCar')} style={{ padding: mobile ? '10px 24px' : '12px 28px', backgroundColor: '#0059A3', color: '#ffffff', border: 'none', borderRadius: '14px', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>
            Explore Cars
          </button>
        </div>
      )}

      {/* ═══ 6. SETTINGS SHORTCUT ═══ */}
      <div style={{ marginTop: mobile ? '24px' : '40px', backgroundColor: '#ffffff', borderRadius: mobile ? '14px' : '20px', padding: mobile ? '20px 16px' : '28px 32px', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <h3 style={{ fontSize: mobile ? '14px' : '16px', fontWeight: 800, color: '#111827', marginBottom: mobile ? '16px' : '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Settings size={18} style={{ color: '#0059A3' }} /> Notification Preferences
        </h3>
        
        {/* Email toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Mail size={18} style={{ color: '#6b7280' }} />
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>Email Notifications</h4>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Receive updates via email</p>
            </div>
          </div>
          <div
            onClick={() => setEmailNotifs(!emailNotifs)}
            style={{ width: '48px', height: '26px', backgroundColor: emailNotifs ? '#0059A3' : '#d1d5db', borderRadius: '50px', position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s' }}
          >
            <motion.div animate={{ right: emailNotifs ? '2px' : '24px' }} style={{ width: '22px', height: '22px', backgroundColor: '#ffffff', borderRadius: '50%', position: 'absolute', top: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
          </div>
        </div>

        {/* WhatsApp toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <PhoneIcon size={18} style={{ color: '#6b7280' }} />
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', margin: '0 0 2px' }}>WhatsApp Alerts</h4>
              <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>Get instant alerts on WhatsApp</p>
            </div>
          </div>
          <div
            onClick={() => setWhatsappNotifs(!whatsappNotifs)}
            style={{ width: '48px', height: '26px', backgroundColor: whatsappNotifs ? '#16A34A' : '#d1d5db', borderRadius: '50px', position: 'relative', cursor: 'pointer', transition: 'background-color 0.2s' }}
          >
            <motion.div animate={{ right: whatsappNotifs ? '2px' : '24px' }} style={{ width: '22px', height: '22px', backgroundColor: '#ffffff', borderRadius: '50%', position: 'absolute', top: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
