"use client";

import React, { useState } from "react";
import { Search, ChevronDown, ShieldCheck, CheckCircle2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";

// ── Mock Options ──
const quickChips = [
  { id: "suv", label: "SUV" },
  { id: "sedan", label: "Sedan" },
  { id: "budget", label: "Under ₹10L" },
  { id: "auto", label: "Automatic" },
  { id: "lowkms", label: "Low KMs" },
];

const trustItems = [
  { icon: ShieldCheck, label: "Verified & Inspected Cars Only" },
  { icon: CheckCircle2, label: "Save Time, Buy With Confidence" },
  { icon: Sparkles, label: "Handpicked for Discerning Buyers" },
];

export default function GuidedBuyingExperience() {
  const isMobile = useIsMobile();
  const [search, setSearch] = useState("");

  const sectionStyle: React.CSSProperties = {
    width: '100%',
    padding: isMobile ? '40px 0 20px' : '60px 0 40px',
    backgroundColor: '#ffffff',
    position: 'relative',
    overflow: 'hidden'
  };

  const pillContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'stretch',
    backgroundColor: '#ffffff',
    borderRadius: isMobile ? '24px' : '999px',
    padding: '8px',
    boxShadow: '0 15px 40px rgba(0, 89, 163, 0.08)',
    border: '1px solid #f1f5f9',
    maxWidth: '1000px',
    margin: '0 auto 40px',
    position: 'relative',
    zIndex: 10
  };

  const inputGroupStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '0 20px',
    gap: '12px',
    flex: 2,
    borderBottom: isMobile ? '1px solid #f1f5f9' : 'none',
    borderRight: !isMobile ? '1px solid #f1f5f9' : 'none',
    minHeight: '60px'
  };

  const selectGroupStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '0 24px',
    flex: 1,
    borderBottom: isMobile ? '1px solid #f1f5f9' : 'none',
    borderRight: !isMobile ? '1px solid #f1f5f9' : 'none',
    cursor: 'pointer',
    position: 'relative',
    minHeight: '60px'
  };

  const searchBtnStyle: React.CSSProperties = {
    backgroundColor: '#0059A3',
    color: '#ffffff',
    border: 'none',
    borderRadius: isMobile ? '16px' : '999px',
    padding: isMobile ? '16px' : '0 40px',
    fontSize: '14px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: isMobile ? '12px' : '0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 8px 20px rgba(0, 89, 163, 0.25)'
  };

  return (
    <section style={sectionStyle}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* ═══ HERO ═══ */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ 
              fontSize: isMobile ? '32px' : '56px', 
              fontWeight: 900, 
              color: '#111827', 
              margin: '0 0 12px',
              letterSpacing: '-1.5px'
            }}
          >
            Find Your Perfect Car
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{ fontSize: isMobile ? '14px' : '18px', color: '#6b7280', fontWeight: 500 }}
          >
            Handpicked, inspected, and ready for you
          </motion.p>
        </div>

        {/* ═══ SEARCH PILL ═══ */}
        <div style={pillContainerStyle}>
          <div style={inputGroupStyle}>
            <Search size={20} color="#9ca3af" />
            <input 
              type="text" 
              placeholder="Search cars, brands, styles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ 
                border: 'none', outline: 'none', width: '100%', 
                fontSize: '15px', fontWeight: 600, color: '#374151' 
              }}
            />
          </div>

          {!isMobile && (
            <>
              <div style={selectGroupStyle}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '2px' }}>Budget</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937' }}>Select Range</span>
                  <ChevronDown size={16} color="#9ca3af" />
                </div>
              </div>

              <div style={selectGroupStyle}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '2px' }}>Brand</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937' }}>Any Brand</span>
                  <ChevronDown size={16} color="#9ca3af" />
                </div>
              </div>

              <div style={selectGroupStyle}>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '2px' }}>Fuel</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#1f2937' }}>Any Fuel</span>
                  <ChevronDown size={16} color="#9ca3af" />
                </div>
              </div>
            </>
          )}

          {isMobile && (
            <div style={{ padding: '0 12px' }}>
               <div style={{ display: 'flex', gap: '8px', padding: '12px 0' }}>
                  <div style={{ flex: 1, backgroundColor: '#f8fafc', padding: '8px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Budget</span>
                    <ChevronDown size={14} color="#9ca3af" />
                  </div>
                  <div style={{ flex: 1, backgroundColor: '#f8fafc', padding: '8px 16px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Brand</span>
                    <ChevronDown size={14} color="#9ca3af" />
                  </div>
               </div>
            </div>
          )}

          <button style={searchBtnStyle} 
            onMouseOver={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.backgroundColor = '#004a88'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.backgroundColor = '#0059A3'; }}
          >
            Search
          </button>
        </div>

        {/* ═══ POPULAR CHIPS ═══ */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: isMobile ? 'flex-start' : 'center', 
          gap: '12px',
          marginBottom: '50px',
          overflowX: isMobile ? 'auto' : 'visible',
          paddingBottom: isMobile ? '10px' : '0',
          WebkitOverflowScrolling: 'touch',
        }}>
          <span style={{ 
            fontSize: '11px', 
            fontWeight: 900, 
            color: '#9ca3af', 
            textTransform: 'uppercase', 
            letterSpacing: '1px',
            whiteSpace: 'nowrap',
            marginRight: '8px'
          }}>Popular:</span>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            {quickChips.map((chip) => (
              <button
                key={chip.id}
                style={{
                  padding: '10px 22px',
                  borderRadius: '999px',
                  border: '1px solid #f1f5f9',
                  backgroundColor: '#ffffff',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#4b5563',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#0059A3'; e.currentTarget.style.color = '#0059A3'; e.currentTarget.style.backgroundColor = '#f0f7ff'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.color = '#4b5563'; e.currentTarget.style.backgroundColor = '#ffffff'; }}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* ═══ TRUST STRIP ═══ */}
        <div style={{ 
          borderTop: '1px solid #f1f5f9', 
          paddingTop: '30px',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: isMobile ? '20px 30px' : '40px'
        }}>
          {trustItems.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <item.icon size={isMobile ? 14 : 16} color="#0059A3" strokeWidth={2.5} />
              <span style={{ fontSize: isMobile ? '10px' : '11px', fontWeight: 800, color: '#4b5563', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>

      </div>
      
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}
