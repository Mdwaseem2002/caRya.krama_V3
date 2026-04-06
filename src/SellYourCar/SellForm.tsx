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

const STEPS = ["Owner Details", "Car Details", "Inspection"];

// ── STABILITY FIX: Moved Input component outside of SellForm ──
// Defining components inside other components causes them to be 
// re-created on every render, which is the #1 cause of focus loss.
const FormInput = memo(({ label, value, onChange, placeholder, icon: Icon, type = "text", name }: any) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    
    // Strict Character Filtering as requested
    if (name === "name") {
      val = val.replace(/[^a-zA-Z\s]/g, ""); // Only letters and spaces
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
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center group-focus-within:border-royal group-focus-within:bg-blue-50/50 transition-all">
              <Icon className="w-5 h-5 text-[#94a3b8] group-focus-within:text-royal transition-colors" />
            </div>
          </div>
        )}
        <input 
          type={type}
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          style={{ paddingLeft: Icon ? '84px' : '24px' }}
          className="w-full bg-white border border-slate-100 py-5 pr-5 rounded-[1.25rem] outline-none focus:border-royal focus:ring-4 focus:ring-royal/5 transition-all text-sm font-bold text-gray-900"
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
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    owner: { name: "", phone: "", email: "", city: "" },
    car: {
      brand: "", model: "", year: "", mileage: "", 
      fuelType: "", transmission: "", ownership: "1st Owner", 
      regCity: "", expectedPrice: "", images: [] as string[], coverImageIndex: 0
    },
    inspection: { date: "", time: "", location: "Home" as "Home" | "Office", address: "" }
  });

  const updateOwner = useCallback((fields: Partial<typeof formData.owner>) => 
    setFormData(prev => ({ ...prev, owner: { ...prev.owner, ...fields } })), []);
  
  const updateCar = useCallback((fields: Partial<typeof formData.car>) => 
    setFormData(prev => ({ ...prev, car: { ...prev.car, ...fields } })), []);
  
  const updateInspection = useCallback((fields: Partial<typeof formData.inspection>) => 
    setFormData(prev => ({ ...prev, inspection: { ...prev.inspection, ...fields } })), []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const currentCount = formData.car.images.length;
    const remainingSlots = 15 - currentCount;
    
    if (remainingSlots <= 0) {
      alert("Maximum limit of 15 images reached.");
      return;
    }

    const validFiles = Array.from(files).filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} exceeds the 5MB size limit.`);
        return false;
      }
      return true;
    });

    const filesToUpload = validFiles.slice(0, remainingSlots);
    if (filesToUpload.length < validFiles.length) {
      alert("Only 15 images can be uploaded. Extra files were ignored.");
    }

    filesToUpload.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          car: { ...prev.car, images: [...prev.car.images, reader.result as string].slice(0, 15) }
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    if (!formData.inspection.date || !formData.inspection.time || !formData.inspection.address) {
      alert("Please fill in all inspection details before submitting.");
      return;
    }
    setIsSubmitting(true);
    try {
      const saved = await saveSellRequest(formData);
      onSuccess(saved.id);
    } catch (err: any) {
      alert(`Failed to save request: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep === 0) {
      if (!formData.owner.name || !formData.owner.phone || !formData.owner.email || !formData.owner.city) {
        alert("Please fill in all owner details to continue.");
        return;
      }
    } else if (currentStep === 1) {
      if (!formData.car.brand || !formData.car.model || !formData.car.year) {
        alert("Please fill in the required car details (Brand, Model, Year) to continue.");
        return;
      }
    }
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-12" id="sell-form-container">
      {/* Progress Tracker */}
      <div className="flex items-center justify-between mb-16 relative px-4 text-[#0059A3]">
        <div className="absolute top-[1.25rem] left-0 w-full h-[3px] bg-slate-100 -translate-y-1/2 z-0" />
        <motion.div 
           className="absolute top-[1.25rem] left-0 h-[3px] bg-current -translate-y-1/2 z-0 origin-left"
           initial={{ scaleX: 0 }}
           animate={{ scaleX: currentStep / (STEPS.length - 1) }}
           transition={{ duration: 0.5, ease: "easeInOut" }}
        />
        {STEPS.map((step, i) => (
          <div key={step} className="relative z-10 flex flex-col items-center gap-4">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 ${
                 i <= currentStep ? 'bg-[#0059A3] text-white shadow-[#0059A3]/20' : 'bg-slate-50 text-slate-400 border border-slate-100'
               }`}>
              {i < currentStep ? <Check className="w-5 h-5" /> : <span className="text-[12px] font-black">{i + 1}</span>}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${i <= currentStep ? 'text-[#0059A3]' : 'text-slate-300'}`}>
              {step}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-slate-50 overflow-hidden min-h-[500px] flex flex-col group/form">
        <div className="flex-1 p-8 md:p-14">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-10"
              >
                <FormInput label="Full Name" name="name" icon={User} value={formData.owner.name} onChange={(v:any) => updateOwner({name: v})} placeholder="Ex: John Doe" />
                <FormInput label="Phone Number" name="phone" icon={Phone} value={formData.owner.phone} onChange={(v:any) => updateOwner({phone: v})} placeholder="+91 00000 00000" />
                <FormInput label="Email Address" name="email" type="email" icon={Mail} value={formData.owner.email} onChange={(v:any) => updateOwner({email: v})} placeholder="hello@example.com" />
                <FormInput label="City / Location" name="city" icon={MapPin} value={formData.owner.city} onChange={(v:any) => updateOwner({city: v})} placeholder="Ex: Bangalore" />
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="space-y-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <FormInput label="Brand" value={formData.car.brand} onChange={(v:any) => updateCar({brand: v})} placeholder="Ex: BMW" />
                  <FormInput label="Model" value={formData.car.model} onChange={(v:any) => updateCar({model: v})} placeholder="Ex: 5 Series" />
                  <FormInput label="Year" value={formData.car.year} onChange={(v:any) => updateCar({year: v})} placeholder="Ex: 2022" />
                  <FormInput label="Mileage" value={formData.car.mileage} onChange={(v:any) => updateCar({mileage: v})} placeholder="Ex: 12,000" />
                  <FormInput label="Expected Price" value={formData.car.expectedPrice} onChange={(v:any) => updateCar({expectedPrice: v})} placeholder="Ex: ₹ 45.5 Lakh" />
                  <FormInput label="Reg. City" value={formData.car.regCity} onChange={(v:any) => updateCar({regCity: v})} placeholder="Ex: KA-01" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] ml-1">Fuel Type</label>
                    <CustomSelect 
                      value={formData.car.fuelType} 
                      onChange={val => updateCar({fuelType: val})}
                      options={["Petrol", "Diesel", "Electric", "Hybrid"]}
                      placeholder="Select..."
                    />
                   </div>
                   <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] ml-1">Transmission</label>
                    <CustomSelect 
                      value={formData.car.transmission} 
                      onChange={val => updateCar({transmission: val})}
                      options={["Automatic", "Manual"]}
                      placeholder="Select..."
                    />
                   </div>
                   <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] ml-1">Ownership</label>
                    <CustomSelect 
                      value={formData.car.ownership} 
                      onChange={val => updateCar({ownership: val})}
                      options={["1st Owner", "2nd Owner", "3rd Owner"]}
                      placeholder="Select..."
                    />
                   </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] ml-1">Vehicle Media Portfolio</label>
                  <div 
                    onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-slate-100 rounded-[2rem] p-12 text-center hover:border-royal hover:bg-blue-50/30 transition-all cursor-pointer group"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100 group-hover:scale-110 group-hover:bg-white transition-all">
                      <Upload className="w-6 h-6 text-slate-300 group-hover:text-royal" />
                    </div>
                    <p className="text-sm font-black text-gray-900">Drop files or <span className="text-royal">browse device</span></p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Max 15 images • 5MB per image</p>
                    <input type="file" multiple hidden ref={fileRef} onChange={handleImageUpload} accept="image/*" />
                  </div>
                  {formData.car.images.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '16px', padding: '4px', marginTop: '24px' }}>
                      {formData.car.images.map((img, i) => {
                        const isCover = formData.car.coverImageIndex === i;
                        return (
                          <div 
                            key={i} 
                            onClick={() => updateCar({ coverImageIndex: i })}
                            style={{ 
                              position: 'relative', height: '100px', borderRadius: '12px', overflow: 'hidden', 
                              cursor: 'pointer', border: isCover ? '3px solid #0059A3' : '1px solid #e5e7eb',
                              transition: 'all 0.2s', transform: isCover ? 'scale(1.05)' : 'scale(1)',
                              boxShadow: isCover ? '0 10px 15px -3px rgba(0, 89, 163, 0.2)' : 'none',
                              zIndex: isCover ? 10 : 1
                            }}
                          >
                            <img src={img} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isCover ? 1 : 0.8 }} className="hover:opacity-100 transition-opacity" />
                            
                            {/* Selection Indicator */}
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
                                const newImages = formData.car.images.filter((_, idx) => idx !== i);
                                const newCoverIndex = isCover ? 0 : (formData.car.coverImageIndex > i ? formData.car.coverImageIndex - 1 : formData.car.coverImageIndex);
                                updateCar({ images: newImages, coverImageIndex: newCoverIndex }); 
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
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="space-y-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 [&_input::-webkit-calendar-picker-indicator]:cursor-pointer">
                  <FormInput label="Preferred Date" type="date" value={formData.inspection.date} onChange={(v:any) => updateInspection({date: v})} />
                  <FormInput label="Preferred Time" type="time" value={formData.inspection.time} onChange={(v:any) => updateInspection({time: v})} />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] ml-1">Inspection Venue</label>
                  <div className="flex gap-4">
                    {["Home", "Office"].map((loc) => (
                      <button
                        key={loc}
                        onClick={() => updateInspection({ location: loc as any })}
                        className={`flex-1 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all border ${
                          formData.inspection.location === loc 
                            ? 'bg-[#0059A3] border-[#0059A3] text-white shadow-lg shadow-[#0059A3]/20' 
                            : 'bg-white border-slate-100 text-slate-400 hover:border-royal/30'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] ml-1">Full Service Address</label>
                  <div className="relative group">
                    <div className="absolute left-4 top-4 w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center group-focus-within:border-royal group-focus-within:bg-blue-50/50 transition-all pointer-events-none z-10">
                      <MapPin className="w-5 h-5 text-[#94a3b8] group-focus-within:text-royal transition-colors" />
                    </div>
                    <textarea 
                      value={formData.inspection.address} 
                      onChange={e => updateInspection({address: e.target.value})}
                      placeholder="Enter detailed address for the inspection visit"
                      style={{ paddingLeft: "88px" }}
                      className="w-full bg-white border border-slate-100 py-6 pr-6 rounded-[1.25rem] outline-none focus:border-royal focus:ring-4 focus:ring-royal/5 transition-all text-sm font-bold text-gray-900 min-h-[140px] resize-none"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Bar */}
        <div className="bg-slate-50/50 px-8 md:px-14 py-8 flex justify-between items-center border-t border-slate-100">
          <button 
            onClick={prevStep}
            disabled={currentStep === 0 || isSubmitting}
            className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest transition-all ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:text-gray-900 hover:-translate-x-1'}`}
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>

          {currentStep === STEPS.length - 1 ? (
             <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#0059A3] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:scale-[1.03] active:scale-[0.98] transition-all shadow-xl shadow-[#0059A3]/20 disabled:opacity-50 flex items-center gap-3"
              >
                {isSubmitting ? (
                  <>Processing... <RefreshCw className="w-4 h-4 animate-spin" /></>
                ) : (
                  <>Finalize Request <Sparkles className="w-4 h-4" /></>
                )}
              </button>
          ) : (
            <button 
              onClick={nextStep}
              className="bg-[#0059A3] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] hover:scale-[1.03] active:scale-[0.98] transition-all shadow-xl shadow-[#0059A3]/20 flex items-center gap-3"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          )}
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
