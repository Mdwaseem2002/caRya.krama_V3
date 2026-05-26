"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ShieldCheck, CheckCircle2, ChevronRight } from "lucide-react";
import ViewReop from "@/Details/Popup/ViewReop";
import { hasPurchased } from "@/Admin/data/purchases";
import { cars as staticCars } from "@/data/inventory";
import { getAllStoredCars } from "@/Admin/Upload/CarStorage";

interface ViewFullReportProps {
  carId: string | number;
}

export default function ViewFullReport({ carId }: ViewFullReportProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [reportExists, setReportExists] = useState(false);
  const [reportPrice, setReportPrice] = useState(600);
  const [purchased, setPurchased] = useState(false);
  const [uploadedCars, setUploadedCars] = useState<any[]>([]);

  useEffect(() => {
    const init = async () => {
      setPurchased(hasPurchased(carId.toString()));
      try {
        setUploadedCars(await getAllStoredCars());
        
        // Fetch from the real API to see if the inspection report exists
        const res = await fetch(`/api/inspection-reports?carId=${carId}`);
        const data = await res.json();
        if (data.success && data.reports && data.reports.length > 0) {
          setReportExists(true);
          setReportPrice(data.reports[0].price || 600);
        } else {
          setReportExists(false);
        }
      } catch (e) {
        console.error("Failed to fetch report availability:", e);
      }
    };
    init();
  }, [carId]);

  // Find the car based on ID
  const foundUploaded = uploadedCars.find((c) => c.id === carId);
  const foundStatic = staticCars.find((c) => c.id.toString() === carId.toString());
  
  const car = foundUploaded || foundStatic || staticCars[0];
  const isUploaded = !!foundUploaded;

  const inspectionScore = isUploaded ? (car as any).condition?.score : (car as any).inspectionScore;
  const inspectionSummary = isUploaded && (car as any).condition?.inspectionPoints
    ? (car as any).condition.inspectionPoints.map((p: any) => `${p.title}: ${p.value}`)
    : (car as any).inspectionSummary;

  const reportCategories = [
    { label: "Exterior", status: "Passed" },
    { label: "Engine", status: "Passed" },
    { label: "Electricals", status: "Passed" },
    { label: "Suspension", status: "Passed" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8" style={{ background: "var(--background)" }}>
      
      {/* ── SECTION: INSPECTION REPORT (Floating Type) ── */}
      <div className="p-6 md:p-10 rounded-[2.5rem] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-all bg-white" style={{ backgroundColor: "var(--card-bg)" }}>
          {/* Left: Featured Card */}
        <div className="lg:col-span-12 xl:col-span-5 relative aspect-auto min-h-[320px] md:h-[400px] rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#166534] via-[#15803d] to-[#14532d] p-6 md:p-8 flex flex-col justify-between group shadow-xl">
          {/* Subtle patterns/glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110"></div>
          
          <h2 className="text-2xl md:text-5xl font-extrabold text-white relative z-10 leading-tight tracking-tighter">
            Inspection <br /> Report
          </h2>
 
          <div className="relative z-10 w-full mt-6 md:mt-auto">
             {/* Checklist/Report Graphic background */}
             <div className="absolute bottom-10 left-4 w-32 h-40 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 -rotate-6 transform translate-y-4 hidden md:block">
                <div className="p-4 space-y-3">
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full border-2 border-white/40"></div>
                      <div className="w-16 h-2 bg-white/20 rounded-full"></div>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full border-2 border-white/40"></div>
                      <div className="w-12 h-2 bg-white/20 rounded-full"></div>
                   </div>
                </div>
             </div>
 
             <div className="relative w-[85%] mx-auto md:w-[80%] mt-6 transform transition-transform duration-500 shadow-2xl rounded-3xl" style={{ perspective: "1500px" }}>
               
               <style>{`
                 @keyframes flipPage {
                   0%, 15% { transform: rotateY(0deg); }
                   35%, 65% { transform: rotateY(-145deg); }
                   85%, 100% { transform: rotateY(0deg); }
                 }
                 @keyframes shine {
                   0%, 15% { transform: translateX(-100%) skewX(-15deg); opacity: 0; }
                   20% { opacity: 0.5; }
                   35%, 100% { transform: translateX(200%) skewX(-15deg); opacity: 0; }
                 }
                 @keyframes floatUp {
                   0% { transform: translateY(30px) scale(0.5); opacity: 0; }
                   50% { opacity: 0.6; }
                   100% { transform: translateY(-50px) scale(1.2); opacity: 0; }
                 }
                 .page-flip {
                   animation: flipPage 8s cubic-bezier(0.645, 0.045, 0.355, 1) infinite;
                 }
                 .gloss-shine {
                   animation: shine 8s cubic-bezier(0.645, 0.045, 0.355, 1) infinite;
                 }
                 .particle-1 { animation: floatUp 5s ease-in infinite; left: 10%; animation-delay: 0s; }
                 .particle-2 { animation: floatUp 6s ease-in infinite; left: 80%; animation-delay: 2s; }
                 .particle-3 { animation: floatUp 4.5s ease-in infinite; left: 50%; animation-delay: 1s; }
               `}</style>

               {/* Ambient Floating Particles */}
               <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-[2rem] z-0">
                 <div className="particle-1 absolute bottom-0 w-2 h-2 bg-emerald-400 rounded-full blur-[1px]"></div>
                 <div className="particle-2 absolute bottom-0 w-3 h-3 bg-emerald-300 rounded-full blur-[2px]"></div>
                 <div className="particle-3 absolute bottom-0 w-1.5 h-1.5 bg-emerald-500 rounded-full blur-[1px]"></div>
               </div>

               {/* Binder rings/spine */}
               <div className="absolute left-0 top-3 bottom-3 w-4 md:w-6 bg-gradient-to-b from-slate-800 via-slate-700 to-slate-900 rounded-l-lg flex flex-col justify-evenly items-center z-30 shadow-[inset_-3px_0_8px_rgba(0,0,0,0.7),3px_0_10px_rgba(0,0,0,0.5)]">
                 {[...Array(5)].map((_, i) => (
                   <div key={i} className="w-6 md:w-8 h-2 md:h-3 bg-gradient-to-r from-gray-200 via-white to-gray-400 rounded-sm shadow-md -ml-2 border border-gray-400/50 relative">
                      <div className="absolute inset-0 rounded-sm bg-gradient-to-b from-white/40 to-transparent"></div>
                   </div>
                 ))}
               </div>

               {/* Book Body Container */}
               <div className="relative h-48 md:h-56 ml-3 md:ml-4 shadow-[15px_15px_40px_rgba(0,0,0,0.3)] rounded-r-[1.5rem]">
                 
                 {/* Page 2 (Inside Page - The Reveal) */}
                 <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white rounded-r-[1.5rem] pl-8 md:pl-10 p-5 border-y border-r border-gray-200 flex flex-col justify-center items-center shadow-inner z-10 overflow-hidden">
                    {/* Watermark */}
                    <ShieldCheck className="absolute w-40 h-40 text-emerald-50 opacity-50 -right-10 -bottom-10" />
                    
                    <ShieldCheck className="w-12 h-12 text-emerald-500 mb-2 relative z-10" strokeWidth={1.5} />
                    <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-emerald-700 mb-3 relative z-10">Verification Complete</p>
                    
                    {/* Animated Scanning Barcode */}
                    <div className="w-20 h-20 bg-white p-2 rounded-xl shadow-md border border-gray-100 relative z-10 overflow-hidden flex items-center justify-center">
                       <div className="absolute inset-x-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.5)] animate-[bounce_2s_ease-in-out_infinite]"></div>
                       <div className="grid grid-cols-3 gap-1 w-full h-full">
                         {[...Array(9)].map((_, i) => (
                           <div key={i} className={`bg-slate-800 ${i%2===0?'opacity-100':'opacity-20'} rounded-sm`}></div>
                         ))}
                       </div>
                    </div>
                 </div>

                 {/* Page 1 (The Flipping Cover) */}
                 <div className="absolute inset-0 origin-left z-20 page-flip" style={{ transformStyle: "preserve-3d" }}>
                   
                   {/* Front of Page 1 */}
                   <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-r-[1.5rem] pl-8 md:pl-10 p-6 flex flex-col justify-between overflow-hidden border-y border-r border-gray-200 shadow-[5px_5px_15px_rgba(0,0,0,0.1)]" style={{ backfaceVisibility: "hidden" }}>
                     
                     {/* Glossy Paper Shine */}
                     <div className="absolute top-0 bottom-0 w-full bg-gradient-to-r from-transparent via-white/80 to-transparent gloss-shine z-30"></div>

                     {/* Subtle grid pattern & emerald glow */}
                     <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px] z-0"></div>
                     <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-400/10 rounded-full blur-3xl -mt-10 -mr-10 z-0"></div>
                     
                     <div className="relative z-10 flex flex-col h-full w-full">
                       <div className="flex justify-between items-start w-full">
                         <div className="flex items-center gap-3 mb-2">
                           <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center shadow-[inset_0_2px_4px_rgba(255,255,255,0.8),0_2px_8px_rgba(16,185,129,0.3)] border border-emerald-50">
                             <ShieldCheck className="text-emerald-600 w-5 h-5 md:w-6 md:h-6" />
                           </div>
                           <div>
                             <div className="text-[11px] md:text-xs font-black text-slate-800 uppercase tracking-widest leading-none">Verified</div>
                             <div className="text-[10px] md:text-[11px] font-bold text-slate-400 uppercase mt-0.5">Digital Record</div>
                           </div>
                         </div>
                         <div className="bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full p-2 shadow-lg shadow-emerald-500/40 transform transition-transform">
                            <CheckCircle2 className="text-white w-5 h-5 md:w-6 md:h-6" />
                         </div>
                       </div>
                       
                       {/* Barcode / Authentication element */}
                       <div className="flex items-center gap-1.5 mt-2 opacity-70">
                          <div className="h-4 w-1 bg-slate-400 rounded-full"></div>
                          <div className="h-4 w-1.5 bg-slate-500 rounded-full"></div>
                          <div className="h-4 w-0.5 bg-slate-300 rounded-full"></div>
                          <div className="h-4 w-3 bg-slate-700 rounded-full"></div>
                          <div className="h-4 w-1 bg-slate-400 rounded-full"></div>
                          <div className="h-4 w-2 bg-slate-600 rounded-full"></div>
                          <span className="text-[9px] font-mono font-bold text-slate-500 ml-2 tracking-widest uppercase">Auth-RX9</span>
                       </div>

                       {/* Dummy Text lines */}
                       <div className="space-y-3 mt-auto">
                         <div className="h-2 md:h-2.5 w-full bg-gradient-to-r from-gray-200 to-gray-100 rounded-full shadow-inner"></div>
                         <div className="h-2 md:h-2.5 w-4/5 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full shadow-inner"></div>
                         <div className="h-2 md:h-2.5 w-3/5 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full shadow-inner"></div>
                       </div>
                     </div>
                   </div>

                   {/* Back of Page 1 (Revealed when flipped) */}
                   <div className="absolute inset-0 bg-gradient-to-bl from-gray-50 to-gray-200 rounded-l-[1.5rem] border-y border-l border-gray-300 shadow-[inset_15px_0_30px_rgba(0,0,0,0.1)] flex items-center justify-center" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                     {/* Reversed watermark for realism */}
                     <div className="opacity-5 scale-x-[-1]">
                       <ShieldCheck className="w-32 h-32 text-slate-900" />
                     </div>
                     <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/10 to-transparent"></div>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="lg:col-span-12 xl:col-span-7 space-y-8 lg:pl-6">
          {/* Status Tags Grid */}
          <div className="grid grid-cols-2 gap-4">
            {reportCategories.map((cat) => (
              <div 
                key={cat.label} 
                className="flex items-center gap-3 p-5 rounded-2xl bg-white border border-gray-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default group"
              >
                <div className="w-8 h-8 rounded-full bg-[#10b981] flex items-center justify-center shrink-0 shadow-lg shadow-[#10b981]/20 group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <span className="font-black text-[13px] md:text-base uppercase tracking-tight text-gray-800" style={{ color: "var(--foreground)" }}>{cat.label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <p className="text-base md:text-lg leading-relaxed font-semibold text-gray-600" style={{ color: "var(--foreground)" }}>
              Every car on <span className="text-[#0059A3] font-bold">caRya.krama</span> is carefully selected and thoroughly inspected to ensure top quality and reliability. From engine performance to interior condition, every detail is checked, so you get a transparent, verified, and ready-to-drive vehicle with complete confidence.
            </p>

            {!reportExists ? (
              <div className="flex items-center gap-2 text-amber-600 font-extrabold text-xl py-2 px-6 bg-amber-50 rounded-2xl w-fit border border-amber-100">
                Evaluating... Report Coming Soon
              </div>
            ) : purchased ? (
              <Link 
                href={`/details/report?id=${carId}`}
                className="flex items-center gap-3 bg-[#10b981] text-white px-8 py-4 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-emerald-500/20 group w-fit"
              >
                View Full Report
                <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <button 
                onClick={() => setIsPopupOpen(true)}
                className="flex items-center gap-3 bg-[#10b981] text-white px-8 py-4 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-emerald-500/20 group w-fit"
              >
                View Full Report
                <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── SECTION: OWNERSHIP & SERVICE HISTORY ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Service History */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
               <ShieldCheck className="text-blue-600" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight text-gray-900">Service History</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Verified Maintenance Logs</p>
            </div>
          </div>

          <div className="space-y-4">
            {(isUploaded ? ((car as any).condition?.serviceHistory || []) : ["Major service at 45,000 km", "Brake pads replaced", "Annual inspection completed"]).map((log: string, i: number) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group hover:border-blue-200 transition-colors">
                <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 shrink-0 group-hover:scale-125 transition-transform"></div>
                <p className="text-sm font-bold text-gray-700">{log}</p>
              </div>
            ))}
            {(!isUploaded || !(car as any).condition?.serviceHistory?.length) && (
              <p className="text-xs font-bold text-gray-400 italic px-2">
                {isUploaded ? "No digital service records found for this unit." : "Full digital service records available upon report unlock."}
              </p>
            )}
          </div>
        </div>

        {/* Seller Details */}
        <div className="bg-[#0f172a] p-8 rounded-[2.5rem] shadow-xl space-y-6 relative overflow-hidden flex flex-col justify-center">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-4 py-4">
             <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 flex items-center justify-center border border-emerald-500/30 mb-2">
                <ShieldCheck className="text-emerald-400 w-8 h-8" />
             </div>
             
             <h3 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
               Unlock Verified <br/> Seller Details
             </h3>
             
             <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
               <p className="text-[11px] md:text-xs font-bold text-emerald-300 tracking-wide uppercase">
                 Download the Premium Inspection Report for Just ₹499 + GST
               </p>
             </div>
             
             <p className="text-sm font-medium text-slate-400 max-w-sm leading-relaxed pt-2">
               Access complete seller verification, trust score, ownership insights, and authenticity checks before you buy.
             </p>
          </div>
        </div>
      </div>

      <ViewReop 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
        carId={carId.toString()}
      />
    </div>
  );
}
