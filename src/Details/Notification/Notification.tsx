"use client";

import React, { useState, useEffect } from "react";
import {
  Bell, MessageSquare, Car, Gift, Settings, CheckCheck, ChevronRight,
  BellOff, Mail, Phone as PhoneIcon, ArrowLeft, Trash2, Filter, CreditCard, FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "./Customerfetch";
import { markAsRead, markAllAsRead, deleteNotification, NotificationType } from "./CustomerNotify";
import { markAdminAsRead, markAllAdminAsRead, clearAllAdminNotifications, AdminNotifType } from "./AdminNotify";

// ── Types mapping ──
const TABS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "inquiry", label: "Inquiries" },
  { id: "offers", label: "Offers" },
  { id: "system", label: "System" },
  { id: "payment", label: "Payments" },
  { id: "report", label: "Reports" },
] as const;

const ADMIN_TABS = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "sell_request", label: "Requests" },
  { id: "upload", label: "Uploads" },
  { id: "report", label: "Reports" },
  { id: "system", label: "System" },
] as const;

const TYPE_CONFIG: Record<string, { icon: any; color: string; bg: string }> = {
  inquiry: { icon: MessageSquare, color: "#0059A3", bg: "#E8F0FE" },
  wishlist: { icon: HeartIcon, color: "#EF4444", bg: "#FEE2E2" },
  payment: { icon: CreditCard, color: "#16A34A", bg: "#DCFCE7" },
  report: { icon: FileText, color: "#D97706", bg: "#FEF3C7" },
  system: { icon: Settings, color: "#6B7280", bg: "#F3F4F6" },
  sell_request: { icon: Car, color: "#0059A3", bg: "#E8F0FE" },
  upload: { icon: CheckCheck, color: "#16A34A", bg: "#DCFCE7" },
};

function HeartIcon({ size, style }: any) {
  return <span style={{ ...style, fontSize: size, display: 'flex' }}>❤️</span>;
}

export default function Notification() {
  const router = useRouter();
  const mobile = useIsMobile();
  const { user } = useAuth();
  const { notifications, adminNotifications, unreadCount, adminUnreadCount } = useNotifications();
  
  const [activeTab, setActiveTab] = useState<string>("all");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [whatsappNotifs, setWhatsappNotifs] = useState(false);

  const isAdmin = user?.role === "admin";
  const currentNotifs = isAdmin ? adminNotifications : notifications;
  const currentUnread = isAdmin ? adminUnreadCount : unreadCount;
  const currentTabs = isAdmin ? ADMIN_TABS : TABS;

  const handleMarkAllRead = () => {
    if (isAdmin) {
      markAllAdminAsRead();
    } else if (user) {
      markAllAsRead(user.id);
    }
  };

  const handleMarkOneRead = (id: string) => {
    if (isAdmin) {
      markAdminAsRead(id);
    } else {
      markAsRead(id);
    }
  };

  const handleDelete = (id: string) => {
    if (isAdmin) {
       // Optional: implement delete for admin if needed
    } else {
      deleteNotification(id);
    }
  };

  // Filtering
  const filtered = currentNotifs.filter(n => {
    if (activeTab === "all") return true;
    if (activeTab === "unread") return !n.read;
    return n.type === activeTab;
  });

  // Grouping by date
  const groups = [
    { 
      label: "Today", 
      items: filtered.filter(n => {
        const date = new Date(n.createdAt);
        const today = new Date();
        return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
      }) 
    },
    { 
      label: "Yesterday", 
      items: filtered.filter(n => {
        const date = new Date(n.createdAt);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();
      }) 
    },
    { 
      label: "Earlier", 
      items: filtered.filter(n => {
        const date = new Date(n.createdAt);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return date < yesterday;
      }) 
    },
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
            {isAdmin ? "Admin Notifications" : "Notifications"}
            {currentUnread > 0 && (
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', backgroundColor: '#EF4444', borderRadius: '50px', padding: '2px 10px', lineHeight: '20px' }}>{currentUnread}</span>
            )}
          </h1>
          <p style={{ fontSize: mobile ? '13px' : '15px', color: '#6b7280', margin: 0 }}>{isAdmin ? "System alerts and user requests" : "Stay updated with your activity"}</p>
        </div>
        {currentUnread > 0 && (
          <button onClick={handleMarkAllRead} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: mobile ? '8px 14px' : '10px 20px', backgroundColor: '#0059A3', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: mobile ? '12px' : '14px', cursor: 'pointer' }}>
            <CheckCheck size={16} /> Mark all as read
          </button>
        )}
      </div>

      {/* ═══ 2. FILTER TABS ═══ */}
      <div style={{ display: 'flex', gap: mobile ? '6px' : '8px', marginBottom: mobile ? '16px' : '24px', overflowX: 'auto', paddingBottom: '4px' }}>
        {currentTabs.map(tab => (
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
            {tab.id === 'unread' && currentUnread > 0 && (
              <span style={{ marginLeft: '6px', fontSize: '11px', backgroundColor: activeTab === 'unread' ? 'rgba(255,255,255,0.3)' : '#EF4444', color: '#ffffff', borderRadius: '50px', padding: '1px 7px' }}>{currentUnread}</span>
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
                    const cfg = TYPE_CONFIG[notif.type] || TYPE_CONFIG.system;
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
                          handleMarkOneRead(notif.id);
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
                            <span style={{ fontSize: mobile ? '11px' : '12px', color: '#9ca3af', fontWeight: 500 }}>
                                {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {notif.cta && (
                                <span style={{ fontSize: mobile ? '11px' : '12px', color: '#0059A3', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                                  {notif.cta.label} <ChevronRight size={12} />
                                </span>
                              )}
                              {!isAdmin && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(notif.id); }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#d1d5db', display: 'flex' }}
                                >
                                    <Trash2 size={14} />
                                </button>
                              )}
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
      {!isAdmin && (
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
      )}

      {isAdmin && (
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
               <button 
                onClick={clearAllAdminNotifications}
                style={{ fontSize: '12px', color: '#EF4444', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
               >
                 Clear all admin logs
               </button>
          </div>
      )}
    </div>
  );
}
