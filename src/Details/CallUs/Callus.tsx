"use client";

import React, { useState, useEffect } from "react";
import { Phone, MessageCircle, Calendar, X, Clock, ShieldCheck, ArrowRight, User, Smartphone, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/useIsMobile";

interface CallusProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FloatingInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  icon: React.ReactNode;
  required?: boolean;
}

function FloatingInput({ label, value, onChange, type = "text", icon, required }: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || value.length > 0;

  return (
    <div className="relative mb-4 group">
      <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 z-10 
        ${isFloating ? 'opacity-0 scale-50' : 'opacity-100 scale-100'}`}>
        {icon}
      </div>
      <label className={`absolute left-4 transition-all duration-300 pointer-events-none z-10
        ${isFloating 
          ? '-top-2.5 text-[11px] font-bold text-[#0059A3] bg-white px-2 left-3' 
          : 'top-1/2 -translate-y-1/2 text-[14px] text-gray-400 pl-7'}`}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        required={required}
        className={`w-full bg-white px-4 py-3.5 rounded-xl border-none outline-none text-[15px] font-medium transition-all duration-300
          shadow-[0_4px_12px_rgba(0,0,0,0.03)] focus:shadow-[0_8px_24px_rgba(0,89,163,0.12)]
          placeholder-transparent`}
      />
    </div>
  );
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
    padding: '14px 18px', borderRadius: '16px', border: 'none',
    cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textDecoration: 'none', color: 'inherit', boxSizing: 'border-box',
    boxShadow: '0 4px 15px rgba(0,0,0,0.04)',
    backgroundColor: '#ffffff'
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
            className="bg-white shadow-[0_32px_80px_rgba(0,0,0,0.35)] border-t border-white/5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: '24px 24px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 className="text-[22px] font-black text-[#111827] m-0 tracking-tight">Call Us</h2>
                <p className="text-[13px] text-[#6b7280] m-[2px_0_0] font-medium">How would you like to connect?</p>
              </div>
              <button onClick={onClose} className="w-[36px] h-[36px] rounded-full border-none bg-[#F3F4F6] text-[#374151] cursor-pointer flex items-center justify-center hover:bg-gray-200 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '12px 24px 24px' }}>
              
              {/* ── 1. CALL NOW ── */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={sectionLabel} className="text-[#0059A3] opacity-80">Call Now</h3>
                <a href="tel:+919900187847" style={btnStyle}
                   onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,89,163,0.12)'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.04)'; }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="bg-blue-50 text-[#0059A3]">
                    <Phone size={22} className="drop-shadow-sm" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="text-[18px] font-extrabold text-[#111827] mb-0.5">+91 99001 87847</div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[12px] text-[#16A34A] font-bold">9AM – 9PM (Available)</span>
                    </div>
                  </div>
                </a>
              </div>

              {/* ── 2. WHATSAPP ── */}
              <div style={{ marginBottom: '28px' }}>
                <h3 style={sectionLabel} className="text-[#0059A3] opacity-80">WhatsApp</h3>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" style={btnStyle}
                   onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px rgba(37,211,102,0.12)'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.04)'; }}
                >
                  <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: '#eefef4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#25D366' }}>
                    <MessageCircle size={24} className="drop-shadow-sm" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="text-[18px] font-extrabold text-[#111827] mb-0.5">Chat on WhatsApp</div>
                    <div className="text-[12px] text-[#6b7280] font-medium">Instant real-time support</div>
                  </div>
                </a>
              </div>

              {/* ── 3. CALLBACK FORM ── */}
              <div>
                <h3 style={sectionLabel} className="text-[#0059A3] opacity-80">Request Callback</h3>
                <div className="bg-white rounded-3xl p-1">
                  {isSubmitted ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      className="text-center py-8"
                    >
                      <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4 shadow-sm border border-green-100">
                        <ShieldCheck size={36} />
                      </div>
                      <h4 className="text-lg font-extrabold text-[#111827] mb-2">Request Received!</h4>
                      <p className="text-sm text-[#6b7280] leading-relaxed">
                        Thank you for reaching out. <br/>
                        Our experts will call you back shortly.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-1">
                      <FloatingInput 
                        label="Full Name" 
                        value={formName} 
                        onChange={setFormName} 
                        icon={<User size={16} className="text-gray-400" />} 
                        required 
                      />
                      <FloatingInput 
                        label="Phone Number" 
                        value={formPhone} 
                        onChange={setFormPhone} 
                        type="tel"
                        icon={<Smartphone size={16} className="text-gray-400" />} 
                        required 
                      />
                      
                      <div className="relative mb-6">
                        <div 
                          className={`w-full bg-white px-4 py-3.5 rounded-xl border-none outline-none transition-all duration-300 flex items-center justify-between cursor-pointer
                            shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.06)] 
                            ${isDropdownOpen ? 'ring-2 ring-[#0059A3]/10 ring-offset-0' : ''}`}
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        >
                          <div className="flex items-center gap-3">
                            <Clock size={16} className={`${formTime ? 'text-[#0059A3]' : 'text-gray-400'}`} />
                            <span className={`text-[15px] font-medium ${formTime ? 'text-[#111827]' : 'text-gray-400'}`}>
                              {formTime === 'asap' ? "ASAP (Now)" :
                               formTime === 'morning' ? "Morning (9AM - 12PM)" :
                               formTime === 'afternoon' ? "Afternoon (12PM - 4PM)" :
                               formTime === 'evening' ? "Evening (4PM - 8PM)" :
                               "Select Preferred Time"}
                            </span>
                          </div>
                          <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </div>

                        <AnimatePresence>
                          {isDropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: 8 }}
                              className="absolute bottom-full left-0 right-0 mb-2 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-100 shadow-[0_-20px_50px_rgba(0,0,0,0.2)] z-[1001] overflow-hidden p-2"
                            >
                              {[
                                { value: 'asap', label: "ASAP (Now)" },
                                { value: 'morning', label: "Morning (9AM - 12PM)" },
                                { value: 'afternoon', label: "Afternoon (12PM - 4PM)" },
                                { value: 'evening', label: "Evening (4PM - 8PM)" }
                              ].map((opt) => (
                                <div
                                  key={opt.value}
                                  className={`p-3.5 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 flex items-center gap-3
                                    ${formTime === opt.value ? 'bg-blue-50 text-[#0059A3]' : 'text-gray-700 hover:bg-gray-50'}`}
                                  onClick={() => {
                                    setFormTime(opt.value);
                                    setIsDropdownOpen(false);
                                  }}
                                >
                                  <Clock size={14} className={formTime === opt.value ? 'opacity-100' : 'opacity-40'} />
                                  {opt.label}
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <motion.button 
                        type="submit" 
                        className="w-full py-4 px-6 bg-[#1b4fd8] text-white rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(27,79,216,0.3)]"
                        whileHover={{ backgroundColor: '#1640b3', scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Request Callback <ArrowRight size={18} />
                      </motion.button>
                    </form>
                  )}
                </div>
              </div>
            </div>
            
            {/* Footer trust info */}
            <div className="p-4 bg-gray-50 text-center text-[10px] text-[#6b7280] font-bold tracking-widest rounded-b-3xl">
              🔒 DATA SECURED BY caRya.krama
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
