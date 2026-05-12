"use client";

import React, { useState, useRef, useCallback, memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Phone, MapPin, 
  Car, Calendar, Gauge, Fuel, Settings2, 
  CreditCard, Upload, X, Check, ArrowRight, ArrowLeft,
  Clock, CheckCircle2, AlertCircle, Sparkles, Star
} from "lucide-react";
import { saveSellRequest } from "@/Admin/SellRequests/SellStorage";
import { useAuth } from "@/context/AuthContext";
import { addAdminNotification } from "@/Details/Notification/AdminNotify";
import { addNotification } from "@/Details/Notification/CustomerNotify";
import { useNotification } from "@/context/NotificationContext";
import { convertToWebP } from "@/Details/ImageConvert/ImageConvert";

const STEPS = ["Owner Details", "Car Details", "Inspection"];

// ── STABILITY FIX: Moved Input component outside of SellForm ──
// Defining components inside other components causes them to be 
// re-created on every render, which is the #1 cause of focus loss.
const FormInput = memo(({ label, value, onChange, placeholder, icon: Icon, type = "text", name }: any) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    
    // Strict Character Filtering as requested
    if (name?.toLowerCase().includes("name")) {
      val = val.replace(/[^a-zA-Z\s]/g, ""); // Only letters and spaces for names
    } else if (name === "phone") {
      val = val.replace(/[^0-9\s+]/g, ""); // Only numbers, spaces, and +
    }
    
    onChange(val);
  };

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] ml-1">{label}</label>
      <div className="relative group min-h-[64px]">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center group-focus-within:border-royal group-focus-within:bg-blue-50/50 transition-all">
              <Icon className="w-4 h-4 md:w-5 md:h-5 text-[#94a3b8] group-focus-within:text-royal transition-colors" />
            </div>
          </div>
        )}
        <input 
          type={type}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          style={{ paddingLeft: Icon ? (typeof window !== 'undefined' && window.innerWidth < 768 ? '60px' : '74px') : '24px' }}
          className={`w-full bg-white border border-slate-100 py-3.5 pr-5 rounded-[1.25rem] outline-none focus:border-royal focus:ring-4 focus:ring-royal/5 transition-all text-sm font-bold text-gray-900 ${Icon ? 'pl-[60px] md:pl-[74px]' : 'pl-6'}`}
        />
      </div>
    </div>
  );
});
FormInput.displayName = "FormInput";

const CustomSelect = ({ value, onChange, options, placeholder }: { value: string, onChange: (val: string) => void, options: string[], placeholder: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full z-20">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border-[3px] py-4 px-6 rounded-full outline-none font-bold text-sm transition-all cursor-pointer flex justify-between items-center ${isOpen ? 'border-[#93c5fd]' : 'border-transparent ring-1 ring-slate-100 hover:ring-slate-200'}`}
      >
        <span className={value ? 'text-[#001736]' : 'text-slate-900 font-extrabold'}>{value || placeholder}</span>
      </div>

      {isOpen && (
        <div className="absolute top-full mt-[-2px] left-0 w-full bg-white border border-gray-400 z-50">
          <div 
            onClick={() => { onChange(""); setIsOpen(false); }}
            className={`px-4 py-2 text-[15px] cursor-pointer transition-colors ${!value ? 'bg-[#0059A3] text-white' : 'text-[#0059A3] hover:bg-slate-100'}`}
          >
            {placeholder}
          </div>
          {options.map((opt) => (
            <div 
              key={opt}
              onClick={() => { onChange(opt); setIsOpen(false); }}
              className={`px-4 py-2 text-[15px] cursor-pointer transition-colors ${value === opt ? 'bg-[#0059A3] text-white' : 'text-[#0059A3] hover:bg-slate-100'}`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function SellForm({ onSuccess }: { onSuccess: (id: string) => void }) {
  const { showNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Simplified Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    brand: "",
    model: "",
    mileage: "",
    images: [] as string[],
    coverImageIndex: 0
  });

  const updateField = useCallback((field: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const currentCount = formData.images.length;
    const remainingSlots = 15 - currentCount;
    
    if (remainingSlots <= 0) {
      showNotification("Maximum limit of 15 images reached.", "warning");
      return;
    }

    const validFiles = Array.from(files).filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        showNotification(`${file.name} exceeds the 5MB size limit.`, "error");
        return false;
      }
      return true;
    });

    const filesToUpload = validFiles.slice(0, remainingSlots);
    if (filesToUpload.length < validFiles.length) {
      showNotification("Only 15 images can be uploaded. Extra files were ignored.", "info");
    }

    filesToUpload.forEach(async (file) => {
      try {
        const webpString = await convertToWebP(file);
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, webpString].slice(0, 15),
        }));
      } catch (err) {
        console.error("Failed to convert image to WebP", err);
      }
    });
  };

  const { user } = useAuth();

  const handleSubmit = async () => {
    // Basic Validation
    if (!formData.firstName || !formData.lastName || !formData.phone || !formData.brand || !formData.model) {
      showNotification("Please fill in all the required fields.", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      // Map simplified UI state back to the expected SellRequest structure for backend
      const payload = {
        owner: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          email: formData.email,
          city: "Not specified",
        },
        car: {
          brand: formData.brand,
          model: formData.model,
          year: new Date().getFullYear().toString(),
          mileage: formData.mileage,
          fuelType: "Not specified",
          transmission: "Not specified",
          ownership: "1st Owner",
          regCity: "Not specified",
          expectedPrice: "Not specified",
          images: formData.images,
        },
        inspection: {
          date: new Date().toISOString().split('T')[0],
          time: "ASAP",
          location: "Home" as const,
          address: "Contact for inspection detail",
        }
      };

      const saved = await saveSellRequest(payload as any);
      
      // Trigger Admin Notification
      addAdminNotification({
        title: "New Sell Request 🚗",
        message: `${formData.firstName} ${formData.lastName} requested to sell a ${formData.brand} ${formData.model}.`,
        type: "sell_request",
        cta: { label: "Review Request", href: "/admin/requests" }
      });

      // Trigger Customer Notification (System)
      if (user) {
        addNotification(user.id, {
          title: "Sell Request Submitted 🚗",
          message: `Your request for ${formData.brand} ${formData.model} is pending review.`,
          type: "system",
          cta: { label: "View Status", href: "/Profile?tab=requests" }
        });
      }

      onSuccess(saved.id);
      // showNotification("Sell request submitted successfully!", "success"); // Removed redundant notification
    } catch (err: any) {
      showNotification(`Failed to save request: ${err?.message || 'Unknown error'}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-4 md:py-8" id="sell-form-container">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight mb-2">Sell Your Car</h2>
        <p className="text-slate-500 font-medium tracking-wide text-sm sm:text-base">Fill in the details below and we'll handle the rest.</p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-slate-50 overflow-hidden flex flex-col group/form">
        <div className="flex-1 p-5 sm:p-10 space-y-8">
          {/* Owner Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormInput label="First Name" name="firstName" icon={User} value={formData.firstName} onChange={(v:any) => updateField("firstName", v)} placeholder="Ex: John" />
            <FormInput label="Last Name" name="lastName" icon={User} value={formData.lastName} onChange={(v:any) => updateField("lastName", v)} placeholder="Ex: Doe" />
            <FormInput label="Phone Number" name="phone" icon={Phone} value={formData.phone} onChange={(v:any) => updateField("phone", v)} placeholder="+91 00000 00000" />
            <FormInput label="Email Address" name="email" type="email" icon={Mail} value={formData.email} onChange={(v:any) => updateField("email", v)} placeholder="farhan@caryakrama.com" />
          </div>

          <div className="h-px bg-slate-100 w-full" />

          {/* Car Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <FormInput label="Car Brand" icon={Car} value={formData.brand} onChange={(v:any) => updateField("brand", v)} placeholder="Ex: BMW" />
            <FormInput label="Car Name / Model" icon={Settings2} value={formData.model} onChange={(v:any) => updateField("model", v)} placeholder="Ex: 5 Series" />
            <FormInput label="Kilometres Driven" icon={Gauge} value={formData.mileage} onChange={(v:any) => updateField("mileage", v)} placeholder="Ex: 12,000" />
          </div>

          <div className="h-px bg-slate-100 w-full" />

          {/* Car Uploaded Section */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] ml-1">Vehicle Media Portfolio</label>
            <div 
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-slate-100 rounded-[2rem] p-8 text-center hover:border-[#0059A3] hover:bg-blue-50/30 transition-all cursor-pointer group"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100 group-hover:scale-110 group-hover:bg-white transition-all">
                <Upload className="w-5 h-5 text-slate-300 group-hover:text-[#0059A3]" />
              </div>
              <p className="text-sm font-black text-gray-900">Drop files or <span className="text-[#0059A3]">browse device</span></p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Max 15 images • 5MB per image</p>
              <input type="file" multiple hidden ref={fileRef} onChange={handleImageUpload} accept="image/*" />
            </div>
            {formData.images.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '16px', padding: '4px', marginTop: '24px' }}>
                {formData.images.map((img, i) => {
                  const isCover = formData.coverImageIndex === i;
                  return (
                    <div 
                      key={i} 
                      onClick={() => updateField("coverImageIndex", i)}
                      style={{ 
                        position: 'relative', height: '100px', borderRadius: '12px', overflow: 'hidden', 
                        cursor: 'pointer', border: isCover ? '3px solid #0059A3' : '1px solid #e5e7eb',
                        transition: 'all 0.2s', transform: isCover ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: isCover ? '0 10px 15px -3px rgba(0, 89, 163, 0.2)' : 'none',
                        zIndex: isCover ? 10 : 1
                      }}
                    >
                      <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isCover ? 1 : 0.8 }} className="hover:opacity-100 transition-opacity" />
                      
                      {isCover ? (
                        <div style={{ position: 'absolute', top: '8px', left: '8px', backgroundColor: '#0059A3', color: 'white', padding: '4px 8px', borderRadius: '6px', fontSize: '8px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                          <Star size={10} fill="white" /> COVER
                        </div>
                      ) : (
                        <div className="opacity-0 hover:opacity-100 transition-opacity" style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           <span style={{ color: 'white', fontSize: '9px', fontWeight: 800, textAlign: 'center', width: '100%' }}>SET AS COVER</span>
                        </div>
                      )}

                      <button 
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          const newImages = formData.images.filter((_, idx) => idx !== i);
                          const newCoverIndex = isCover ? 0 : (formData.coverImageIndex > i ? formData.coverImageIndex - 1 : formData.coverImageIndex);
                          setFormData(prev => ({ ...prev, images: newImages, coverImageIndex: newCoverIndex }));
                        }}
                        style={{ position: 'absolute', top: '6px', right: '6px', padding: '4px', background: 'white', borderRadius: '50%', border: 'none', cursor: 'pointer', color: '#EF4444', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                        className="hover:scale-110 active:scale-95 transition-transform"
                        title="Remove Image"
                      >
                        <X size={12} />
                      </button>
                    </div>
                )})}
              </div>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-slate-50/50 px-6 py-10 flex justify-center items-center border-t border-slate-100 rounded-b-[2rem]">
           <button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="group bg-[#0059A3] text-white px-12 py-5 rounded-full font-black uppercase tracking-[0.1em] text-xs hover:bg-[#004a87] hover:shadow-2xl hover:shadow-[#0059A3]/40 hover:-translate-y-1 active:scale-95 transition-all shadow-xl shadow-[#0059A3]/20 disabled:opacity-50 flex items-center justify-center gap-3 min-w-[240px]"
            >
              {isSubmitting ? (
                <>Processing... <RefreshCw className="w-4 h-4 animate-spin" /></>
              ) : (
                <>Finalize Request <Car className="w-5 h-5 mb-0.5 transition-transform duration-300 group-hover:translate-x-2" /></>
              )}
            </button>
        </div>
      </div>

      <div className="mt-12 flex items-center justify-center gap-3 text-slate-300">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-100 bg-white">
           <AlertCircle className="w-3.5 h-3.5" />
           <span className="text-[9px] font-black tracking-widest opacity-80">caRya.krama</span>
        </div>
      </div>
    </div>
  );
}

const RefreshCw = ({ className }: { className?: string }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 1 1-15 6.7L3 16"/></svg>
);
