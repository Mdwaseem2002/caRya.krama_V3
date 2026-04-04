"use client";

import React, { useState, useEffect } from "react";
import { Phone, MessageCircle, Calendar, X, Clock, ShieldCheck, ArrowRight, User, Smartphone, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";

interface CallusProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Callus({ isOpen, onClose }: CallusProps) {
  const mobile = useIsMobile();
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formTime, setFormTime] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTime) return; // Ensure time is selected
    // In a real app, this would hit an API
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2500);
  };

  const whatsappLink = `https://wa.me/919900187847?text=${encodeURIComponent("Hi, I'm interested in a car on your website.")}`;

  // ── Styles ──
  const overlayStyle: React.CSSProperties = {
    position: 'fixed', inset: 0, top: 0,
    backgroundColor: 'rgba(0,0,0,0.70)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    zIndex: 1000, display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    padding: '16px',
  };

  const cardStyle: React.CSSProperties = {
    width: '100%', maxWidth: '400px',
    borderRadius: '24px',
    overflow: 'hidden', position: 'relative',
    boxSizing: 'border-box',
    margin: 'auto',
  };

  const sectionLabel: React.CSSProperties = {
    fontSize: '11px', fontWeight: 800,
    textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px'
  };

  const btnStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '10px', width: '100%',
    padding: '12px 16px', borderRadius: '14px', border: '1px solid',
    cursor: 'pointer', transition: 'all 0.2s',
    textDecoration: 'none', color: 'inherit', boxSizing: 'border-box'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: '10px',
    border: '1px solid',
    fontSize: '14px', fontWeight: 500, outline: 'none', marginBottom: '10px',
    boxSizing: 'border-box', transition: 'all 0.2s',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={overlayStyle} onClick={onClose}
        >
            <motion.div
            initial={mobile ? { y: '100%' } : { scale: 0.9, opacity: 0 }}
            animate={mobile ? { y: 0 } : { scale: 1, opacity: 1 }}
            exit={mobile ? { y: '100%' } : { scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={cardStyle} 
            className="bg-white shadow-[0_24px_60px_rgba(0,0,0,0.30)] border-t border-white/5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: '18px 20px 10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 className="text-[20px] font-black text-[#111827] m-0">Call Us</h2>
                <p className="text-[13px] text-[#6b7280] m-[2px_0_0]">How would you like to connect?</p>
              </div>
              <button onClick={onClose} className="w-[34px] h-[34px] rounded-full border-none bg-[#F3F4F6] text-[#374151] cursor-pointer flex items-center justify-center shrink-0">
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '12px 20px 20px' }}>
              
              {/* ── 1. CALL NOW ── */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={sectionLabel} className="text-[#0059A3]">Call Now</h3>
                <a href="tel:+919900187847" style={btnStyle}
                   className="bg-white border-[#e5e7eb]"
                   onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#0059A3'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,89,163,0.1)'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center' }} className="bg-[#E8F0FE] text-[#0059A3]">
                    <Phone size={22} style={{ filter: 'drop-shadow(0 0 4px rgba(27,79,216,0.3))' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="text-[17px] font-[800] text-[#111827]">+91 99001 87847</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                      <Clock size={12} style={{ color: '#16A34A' }} />
                      <span className="text-[12px] text-[#16A34A] font-[700]">Available 9AM – 9PM</span>
                    </div>
                  </div>
                </a>
              </div>

              {/* ── 2. WHATSAPP ── */}
              <div style={{ marginBottom: '24px' }}>
                <h3 style={sectionLabel} className="text-[#0059A3]">WhatsApp</h3>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={btnStyle}
                   className="bg-white border-[#e5e7eb]"
                   onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#25D366'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(37,211,102,0.1)'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25D366' }}>
                    <MessageCircle size={24} style={{ filter: 'drop-shadow(0 0 4px rgba(37,211,102,0.3))' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="text-[17px] font-[800] text-[#111827]">Chat on WhatsApp</div>
                    <div className="text-[12px] text-[#6b7280] mt-[2px]">Instant response from our team</div>
                  </div>
                </a>
              </div>

              {/* ── 3. CALLBACK FORM ── */}
              <div>
                <h3 style={sectionLabel} className="text-[#0059A3]">Request Callback</h3>
                <div className="bg-[#F9FAFB] rounded-[20px] p-[20px] border border-solid border-[#e5e7eb]">
                  {isSubmitted ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      style={{ textAlign: 'center', padding: '20px 0' }}
                    >
                      <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#DCFCE7', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 20px rgba(22,163,74,0.15)' }}>
                        <ShieldCheck size={36} />
                      </div>
                      <h4 className="text-[18px] font-[800] text-[#111827] m-[0_0_8px]">Request Received!</h4>
                      <p className="text-[14px] text-[#6b7280] m-0 leading-normal">
                        Thank you for reaching out. <br/>
                        Our team will call you back very shortly.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div style={{ position: 'relative' }}>
                        <User size={14} style={{ position: 'absolute', left: '16px', top: '16px', color: '#9ca3af' }} />
                        <input className="form-input bg-white border-[#e5e7eb] text-[#111827]" style={{ ...inputStyle, paddingLeft: '40px' }} type="text" placeholder="Full Name" value={formName} onChange={(e) => setFormName(e.target.value)} required />
                      </div>
                      <div style={{ position: 'relative' }}>
                        <Smartphone size={14} style={{ position: 'absolute', left: '16px', top: '16px', color: '#9ca3af' }} />
                        <input className="form-input bg-white border-[#e5e7eb] text-[#111827]" style={{ ...inputStyle, paddingLeft: '40px' }} type="tel" placeholder="Phone Number" value={formPhone} onChange={(e) => setFormPhone(e.target.value)} required />
                      </div>
                      <div style={{ position: 'relative' }}>
                        <Clock size={14} style={{ position: 'absolute', left: '16px', top: '16px', color: '#9ca3af', zIndex: 10 }} />
                        <div 
                          className="form-input bg-white border-[#e5e7eb]"
                          style={{ 
                            ...inputStyle, 
                            paddingLeft: '40px', 
                            cursor: 'pointer', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between',
                            marginBottom: isDropdownOpen ? '4px' : '16px',
                            borderColor: isDropdownOpen ? '#0059A3' : '#e5e7eb'
                          }} 
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                          <span style={{ color: formTime ? '#111827' : '#9ca3af' }}>
                            {formTime === 'asap' ? "ASAP (Now)" :
                             formTime === 'morning' ? "Morning (9AM - 12PM)" :
                             formTime === 'afternoon' ? "Afternoon (12PM - 4PM)" :
                             formTime === 'evening' ? "Evening (4PM - 8PM)" :
                             "Preferred Time"}
                          </span>
                          <ChevronDown size={14} style={{ color: '#9ca3af', transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                        </div>

                        <AnimatePresence>
                          {isDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '16px',
                                border: '1px solid #e5e7eb',
                                boxShadow: '0 15px 45px rgba(0,0,0,0.18)',
                                zIndex: 1000,
                                overflow: 'hidden',
                                padding: '8px'
                              }}
                            >
                              {[
                                { value: 'asap', label: "ASAP (Now)" },
                                { value: 'morning', label: "Morning (9AM - 12PM)" },
                                { value: 'afternoon', label: "Afternoon (12PM - 4PM)" },
                                { value: 'evening', label: "Evening (4PM - 8PM)" }
                              ].map((opt, idx, arr) => (
                                <React.Fragment key={opt.value}>
                                  <div
                                    style={{
                                      padding: '14px 16px',
                                      borderRadius: '10px',
                                      fontSize: '14px',
                                      fontWeight: 600,
                                      color: formTime === opt.value ? '#0059A3' : '#374151',
                                      backgroundColor: formTime === opt.value ? 'rgba(0, 89, 163, 0.08)' : 'transparent',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '12px'
                                    }}
                                    onClick={() => {
                                      setFormTime(opt.value);
                                      setIsDropdownOpen(false);
                                    }}
                                    onMouseEnter={(e) => {
                                      if (formTime !== opt.value) e.currentTarget.style.backgroundColor = 'rgba(249, 250, 251, 0.8)';
                                    }}
                                    onMouseLeave={(e) => {
                                      if (formTime !== opt.value) e.currentTarget.style.backgroundColor = 'transparent';
                                    }}
                                  >
                                    <Clock size={14} style={{ opacity: formTime === opt.value ? 1 : 0.4 }} />
                                    {opt.label}
                                  </div>
                                  {idx < arr.length - 1 && (
                                    <div className="h-[1px] bg-[#f1f1f1] my-[4px] mx-[8px]" />
                                  )}
                                </React.Fragment>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <motion.button 
                        type="submit" 
                        style={{ width: '100%', padding: '14px', backgroundColor: 'var(--color-royal)', color: '#ffffff', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(27,79,216,0.3)', marginTop: '4px' }}
                        whileHover={{ backgroundColor: '#004a87', scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Request Call <ArrowRight size={18} />
                      </motion.button>
                    </form>
                  )}
                </div>
              </div>
            </div>
            
            {/* Footer trust info */}
            <div className="p-[16px_24px] bg-[#F3F4F6] text-center text-[11px] text-[#6b7280] font-[700] tracking-[1px] rounded-[0_0_28px_28px]">
              🔒 YOUR DATA IS SAFE WITH caRya.krama
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ── FLOATING ACTION BUTTON COMPONENT ──
export function FloatingCallButton({ onOpen }: { onOpen: () => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const mobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) setIsExpanded(true);
      else setIsExpanded(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fabStyle: React.CSSProperties = {
    position: 'fixed', bottom: mobile ? '20px' : '30px', right: mobile ? '20px' : '30px',
    zIndex: 900, display: 'flex', alignItems: 'center', gap: '10px',
    background: 'linear-gradient(135deg, var(--color-royal) 0%, var(--color-sky) 100%)',
    color: '#ffffff', border: 'none', cursor: 'pointer',
    padding: isExpanded ? '12px 24px' : '15px',
    borderRadius: '50px', boxShadow: '0 8px 30px rgba(0, 89, 163, 0.4)',
    fontWeight: 800, fontSize: '15px', transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  };

  return (
    <>
      <style>{`
        @keyframes fab-pulse {
          0% { box-shadow: 0 0 0 0 rgba(0, 89, 163, 0.6); }
          70% { box-shadow: 0 0 0 15px rgba(0, 89, 163, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 89, 163, 0); }
        }
        .form-input:focus {
          border-color: #0059A3 !important;
          background-color: #ffffff !important;
          box-shadow: 0 0 0 4px rgba(0, 89, 163, 0.1);
        }
        .form-input::placeholder {
          color: #9ca3af;
          font-weight: 500;
        }
      `}</style>
      <motion.button
        style={{ ...fabStyle, animation: 'fab-pulse 2s infinite' }}
        onClick={onOpen}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <Phone size={isExpanded ? 18 : 22} style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }} />
        <AnimatePresence>
          {isExpanded && (
            <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: 'auto', opacity: 1 }} exit={{ width: 0, opacity: 0 }} style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
              Call Us
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}
