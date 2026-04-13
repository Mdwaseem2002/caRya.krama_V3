"use client";

import React, { useState, useEffect, useMemo, useCallback, useRef, memo } from "react";
import { useRouter } from "next/navigation";
import { getAllStoredCars } from "@/Admin/Upload/CarStorage";
import { cars as staticCars } from "@/data/inventory";
import { ShieldCheck, User as UserIcon, Mail, Phone, MapPin, ClipboardCheck, Info, Check } from "lucide-react";
import { motion } from "framer-motion";

interface FillFormCarProps {
  carId: string;
}

// ── STABILITY FIX: Wrapped in React.memo and accepting carId as PROPS ──
// By passing carId as a prop instead of using useSearchParams locally, 
// we decouple this form from the Next.js router. This prevents the router 
// from triggering a full unmount/remount (and focus loss) on every keystroke.
const FillFormCar = memo(function FillFormCar({ carId }: FillFormCarProps) {
  const router = useRouter();
  
  // Isolated State for Car Details (Read-only after fetch)
  const [carName, setCarName] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carYear, setCarYear] = useState("");

  // Using Refs for typing inputs to avoid re-renders while typing
  const fullNameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const notesRef = useRef<HTMLTextAreaElement>(null);

  // Use state for non-typing selections
  const [purpose, setPurpose] = useState("");
  const [preferences, setPreferences] = useState<string[]>([]);
  const [consent1, setConsent1] = useState(false);
  const [consent2, setConsent2] = useState(false);

  // Derived state for the submit button
  const [isFormValid, setIsFormValid] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (!carId) return;
      try {
        const stored = (await getAllStoredCars()).find((c: any) => c.id === carId);
        const staticCar = staticCars.find((c: any) => c.id.toString() === carId);
        const activeCar: any = stored || staticCar;
        if (activeCar) {
          setCarName(stored ? stored.brand : activeCar.name.split(" ")[0]);
          setCarModel(stored ? (stored.model || "") : activeCar.name.substring(activeCar.name.indexOf(" ") + 1));
          setCarYear(stored ? stored.year.toString() : (activeCar.year?.toString() || "2023"));
        }
      } catch (err) {
        console.error("Failed to load car details:", err);
      }
    };
    init();
  }, [carId]);

  // Check validity
  const checkValidation = useCallback(() => {
    const isVal = (
      (fullNameRef.current?.value || "").length >= 2 &&
      (emailRef.current?.value || "").includes("@") &&
      (phoneRef.current?.value || "").length >= 10 &&
      (cityRef.current?.value || "").length >= 2 &&
      purpose !== "" &&
      consent1 &&
      consent2
    );
    setIsFormValid(isVal);
  }, [purpose, consent1, consent2]);

  // Validation timer (debounce)
  const validationTimer = useRef<NodeJS.Timeout | null>(null);
  const debouncedCheck = useCallback(() => {
    if (validationTimer.current) clearTimeout(validationTimer.current);
    validationTimer.current = setTimeout(() => {
      checkValidation();
    }, 500); 
  }, [checkValidation]);

  useEffect(() => {
    checkValidation();
  }, [purpose, consent1, consent2, checkValidation]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      alert("Please ensure all fields are filled correctly and terms are accepted.");
      return;
    }
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    router.push(`/details/report?id=${carId}`);
  }, [isFormValid, carId, router]);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        <div className="bg-white rounded-[2.5rem] shadow-[0_30px_90px_rgba(0,0,0,0.06)] overflow-hidden border border-gray-100/50">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#0059A3] to-[#1B4FD8] p-8 md:p-12 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-royal/20 rounded-full blur-[80px] -ml-32 -mb-32"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="p-4 bg-white/10 rounded-[1.5rem] backdrop-blur-xl border border-white/20 shadow-2xl shrink-0">
                <ShieldCheck className="w-10 h-10 text-white" strokeWidth={2} />
              </div>
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-white/20 text-[10px] font-black uppercase tracking-[0.2em] rounded-full backdrop-blur-md">Secure Protocol</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight mb-2">Inspection <span className="text-white/60 italic">Report.</span></h1>
                <p className="text-white/70 font-bold max-w-xl text-sm md:text-lg leading-relaxed">Please initialize the secure request form to deploy your detailed inspection analysis.</p>
              </div>
            </div>
          </motion.div>

          <form onSubmit={handleSubmit} className="p-6 md:p-12 space-y-12">
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="w-10 h-10 bg-royal/10 rounded-xl flex items-center justify-center text-royal">
                    <UserIcon size={20} strokeWidth={2.5} />
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-royal text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-lg">01</div>
                </div>
                <h2 className="text-sm md:text-base font-black text-[#0f172a] uppercase tracking-[0.1em]">Personal Credentials</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="flex flex-col gap-1.5 w-full">
                  <label htmlFor="fullName" className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Full Name</label>
                  <div className="relative group/input">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center group-focus-within/input:border-royal transition-colors">
                      <UserIcon className="w-[18px] h-[18px] text-slate-400 group-focus-within/input:text-royal transition-colors" />
                    </div>
                    <input 
                      id="fullName" name="fullName" type="text" autoComplete="name" required
                      ref={fullNameRef}
                      onChange={(e) => {
                        const filtered = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                        if (fullNameRef.current) fullNameRef.current.value = filtered;
                        debouncedCheck();
                      }}
                      onBlur={checkValidation}
                      placeholder="Ex: John Doe"
                      className="w-full pl-14 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-[1.25rem] text-sm md:text-base font-bold text-[#0f172a] outline-none focus:bg-white focus:border-royal/20 focus:ring-4 focus:ring-royal/5 transition-all placeholder:text-slate-300 placeholder:font-medium"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 w-full">
                  <label htmlFor="phoneNumber" className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                  <div className="relative group/input">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center group-focus-within/input:border-royal transition-colors">
                      <Phone className="w-[18px] h-[18px] text-slate-400 group-focus-within/input:text-royal transition-colors" />
                    </div>
                    <input 
                      id="phoneNumber" name="phoneNumber" type="tel" autoComplete="tel" required
                      ref={phoneRef}
                      onChange={(e) => {
                        const filtered = e.target.value.replace(/[^0-9\s+]/g, "");
                        if (phoneRef.current) phoneRef.current.value = filtered;
                        debouncedCheck();
                      }}
                      onBlur={checkValidation}
                      placeholder="+91 00000 00000"
                      className="w-full pl-14 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-[1.25rem] text-sm md:text-base font-bold text-[#0f172a] outline-none focus:bg-white focus:border-royal/20 focus:ring-4 focus:ring-royal/5 transition-all placeholder:text-slate-300 placeholder:font-medium"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 w-full">
                  <label htmlFor="email" className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                  <div className="relative group/input">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center group-focus-within/input:border-royal transition-colors">
                      <Mail className="w-[18px] h-[18px] text-slate-400 group-focus-within/input:text-royal transition-colors" />
                    </div>
                    <input 
                      id="email" name="email" type="email" autoComplete="email" required
                      ref={emailRef}
                      onChange={debouncedCheck}
                      onBlur={checkValidation}
                      placeholder="farhan@caryakrama.com"
                      className="w-full pl-14 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-[1.25rem] text-sm md:text-base font-bold text-[#0f172a] outline-none focus:bg-white focus:border-royal/20 focus:ring-4 focus:ring-royal/5 transition-all placeholder:text-slate-300 placeholder:font-medium"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 w-full">
                  <label htmlFor="city" className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">City / Location</label>
                  <div className="relative group/input">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center group-focus-within/input:border-royal transition-colors">
                      <MapPin className="w-[18px] h-[18px] text-slate-400 group-focus-within/input:text-royal transition-colors" />
                    </div>
                    <input 
                      id="city" name="city" type="text" required
                      ref={cityRef}
                      onChange={debouncedCheck}
                      onBlur={checkValidation}
                      placeholder="Ex: Bangalore"
                      className="w-full pl-14 pr-4 py-3.5 bg-slate-50 border border-transparent rounded-[1.25rem] text-sm md:text-base font-bold text-[#0f172a] outline-none focus:bg-white focus:border-royal/20 focus:ring-4 focus:ring-royal/5 transition-all placeholder:text-slate-300 placeholder:font-medium"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Read-only Car Details */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="w-10 h-10 bg-royal/10 rounded-xl flex items-center justify-center text-royal">
                    <Info size={20} strokeWidth={2.5} />
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-royal text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-lg">02</div>
                </div>
                <h2 className="text-sm md:text-base font-black text-[#0f172a] uppercase tracking-[0.1em]">Asset Target</h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                {[
                  { label: "Make/Brand", value: carName },
                  { label: "Model", value: carModel },
                  { label: "Year", value: carYear },
                  { label: "ID", value: carId, mono: true }
                ].map((item) => (
                  <div key={item.label} className="flex flex-col gap-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
                    <span className={`text-[13px] md:text-sm font-black text-[#0f172a] truncate ${item.mono ? 'font-mono' : ''}`}>{item.value || "Syncing..."}</span>
                  </div>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative">
                    <div className="w-10 h-10 bg-royal/10 rounded-xl flex items-center justify-center text-royal">
                      <ClipboardCheck size={20} strokeWidth={2.5} />
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-royal text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-lg">03</div>
                  </div>
                  <h2 className="text-sm md:text-base font-black text-[#0f172a] uppercase tracking-[0.1em]">Service Scope</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {["Personal Use", "Family Use", "Business", "Resale"].map((purposeName) => {
                    const isSelected = purpose === purposeName;
                    return (
                      <label key={purposeName} className={`
                        flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer relative group
                        ${isSelected ? 'bg-royal border-royal shadow-lg shadow-blue-500/20' : 'bg-white border-slate-100 hover:border-royal/30'}
                      `}>
                        <input 
                          type="radio" name="purpose" value={purposeName} 
                          checked={isSelected} 
                          onChange={(e) => { setPurpose(e.target.value); checkValidation(); }} 
                          required className="hidden" 
                        />
                        <div className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                          ${isSelected ? 'bg-white border-white' : 'border-slate-200 group-hover:border-royal/50'}
                        `}>
                          {isSelected && <div className="w-2.5 h-2.5 bg-royal rounded-full"></div>}
                        </div>
                        <span className={`text-xs md:text-sm font-black transition-colors ${isSelected ? 'text-white' : 'text-slate-600'}`}>{purposeName}</span>
                      </label>
                    );
                  })}
                </div>
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative">
                    <div className="w-10 h-10 bg-royal/10 rounded-xl flex items-center justify-center text-royal">
                      <ShieldCheck size={20} strokeWidth={2.5} />
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-royal text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-lg">04</div>
                  </div>
                  <h2 className="text-sm md:text-base font-black text-[#0f172a] uppercase tracking-[0.1em]">Focus Analysis</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Engine", "Accident", "Interior", "Electrical", "Suspension", "Full Report"].map((pref) => {
                    const isSelected = preferences.includes(pref);
                    return (
                      <button 
                        key={pref} type="button" 
                        onClick={() => {
                          const next = isSelected ? preferences.filter(p => p !== pref) : [...preferences, pref];
                          setPreferences(next);
                        }}
                        className={`
                          px-4 py-2 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest border transition-all
                          ${isSelected ? 'bg-royal text-white border-royal shadow-md shadow-blue-500/10' : 'bg-white text-slate-400 border-slate-100 hover:text-slate-600 hover:border-slate-200'}
                        `}
                      >
                        {pref}
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            <section className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="w-10 h-10 bg-royal/10 rounded-xl flex items-center justify-center text-royal">
                    <Info size={20} strokeWidth={2.5} />
                  </div>
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-royal text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-lg">05</div>
                </div>
                <h2 className="text-sm md:text-base font-black text-[#0f172a] uppercase tracking-[0.1em]">Module: Additional Context</h2>
              </div>
              <textarea 
                rows={3} 
                id="notes" name="notes"
                ref={notesRef}
                placeholder="Initialize custom analysis parameters or specific concerns..." 
                className="w-full px-6 py-5 rounded-[2rem] bg-slate-50 border border-transparent focus:bg-white focus:border-royal/20 focus:ring-4 focus:ring-royal/5 outline-none transition-all text-sm md:text-base font-bold text-[#0f172a] placeholder:text-slate-300 resize-none"
              ></textarea>
            </section>

            <div className="pt-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50 cursor-pointer hover:bg-slate-50 transition-all group">
                  <div className="relative">
                    <input 
                      type="checkbox" name="consent1" 
                      checked={consent1} 
                      onChange={(e) => setConsent1(e.target.checked)} 
                      required className="hidden" 
                    />
                    <div className={`
                      w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                      ${consent1 ? 'bg-royal border-royal' : 'bg-white border-slate-200 group-hover:border-royal/40'}
                    `}>
                      {consent1 && <Check size={14} className="text-white" strokeWidth={4} />}
                    </div>
                  </div>
                  <span className="text-[11px] md:text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-700 transition-colors">Accept Secure Transaction Terms</span>
                </label>

                <label className="flex items-center gap-4 p-5 bg-slate-50/50 rounded-2xl border border-slate-100/50 cursor-pointer hover:bg-slate-50 transition-all group">
                  <div className="relative">
                    <input 
                      type="checkbox" name="consent2" 
                      checked={consent2} 
                      onChange={(e) => setConsent2(e.target.checked)} 
                      required className="hidden" 
                    />
                    <div className={`
                      w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all
                      ${consent2 ? 'bg-royal border-royal' : 'bg-white border-slate-200 group-hover:border-royal/40'}
                    `}>
                      {consent2 && <Check size={14} className="text-white" strokeWidth={4} />}
                    </div>
                  </div>
                  <span className="text-[11px] md:text-xs font-black uppercase tracking-widest text-slate-500 group-hover:text-slate-700 transition-colors">Acknowledge Inspection Methodology</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`
                  w-full py-6 rounded-[2rem] font-black text-lg md:text-xl uppercase tracking-[0.2em] shadow-xl flex items-center justify-center gap-4 transition-all
                  ${isFormValid 
                    ? 'bg-gradient-to-r from-[#0059A3] to-[#1B4FD8] text-white hover:scale-[1.01] active:scale-[0.99] hover:shadow-2xl hover:shadow-blue-500/20' 
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none border border-slate-200'}
                `}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Deploying...
                  </div>
                ) : (
                  <>Preview Analysis <ShieldCheck size={24} strokeWidth={2.5} /></>
                )}
              </button>
            </div>
          </form>
        </div>
        
        <p className="text-center mt-12 text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-slate-400 opacity-60">
          Sync Status: Verified & Encrypted node 0x7E2
        </p>
      </div>
    </div>
  );
});

FillFormCar.displayName = "FillFormCar";

export default FillFormCar;
