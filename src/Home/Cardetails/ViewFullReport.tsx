"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ShieldCheck, CheckCircle2, ChevronRight } from "lucide-react";
import ViewReop from "@/Details/Popup/ViewReop";
import { hasPurchased } from "@/Admin/data/purchases";
import { cars as staticCars } from "../Card";
import { getAllStoredCars } from "@/Admin/Upload/CarStorage";

interface ViewFullReportProps {
  carId: string | number;
}

export default function ViewFullReport({ carId }: ViewFullReportProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [reportExists, setReportExists] = useState(false);
  const [reportPrice, setReportPrice] = useState(299);
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
          setReportPrice(data.reports[0].price || 299);
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
        <div className="lg:col-span-12 xl:col-span-5 relative aspect-square md:aspect-auto md:h-[400px] rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-[#166534] via-[#15803d] to-[#14532d] p-8 flex flex-col justify-between group shadow-xl">
          {/* Subtle patterns/glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110"></div>
          
          <h2 className="text-3xl md:text-5xl font-extrabold text-white relative z-10 leading-tight tracking-tighter">
            Inspection <br /> Report
          </h2>

          <div className="relative z-10 w-full mt-auto">
             {/* Checklist/Report Graphic background */}
             <div className="absolute bottom-10 left-4 w-32 h-40 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 -rotate-6 transform translate-y-4">
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

             <div className="relative transform hover:scale-105 transition-transform duration-500 rounded-[2rem] overflow-hidden shadow-2xl">
                <Image 
                  src="/About%20car.png" 
                  alt="Inspection Car" 
                  width={600} 
                  height={300} 
                  className="w-full object-cover"
                />
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
                Access Full Report
                <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <button 
                onClick={() => setIsPopupOpen(true)}
                className="flex items-center gap-4 bg-[#0059A3] text-white px-8 py-4 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-500/20 w-fit"
              >
                Unlock Report ₹{reportPrice}
                <ChevronRight className="w-6 h-6" />
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
        <div className="bg-[#0f172a] p-8 rounded-[2.5rem] shadow-xl space-y-8 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                 <CheckCircle2 className="text-blue-400" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tight text-white">Seller Profile</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Verified Listing Hub</p>
              </div>
            </div>
            <div className="px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-[9px] font-black uppercase tracking-widest text-blue-300">
               PRO SELLER
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 relative z-10">
            <div className="space-y-1">
               <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Entity Name</div>
               <div className="text-lg font-black text-white tracking-tight">{isUploaded ? (car as any).sellerDetails?.name : "caRya.krama Premium"}</div>
            </div>
            <div className="space-y-1">
               <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Certification</div>
               <div className="text-lg font-black text-white tracking-tight">{isUploaded ? (car as any).sellerDetails?.type : "Verified Dealer"}</div>
            </div>
            <div className="space-y-1">
               <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Member Since</div>
               <div className="text-lg font-black text-white tracking-tight">{isUploaded ? (car as any).sellerDetails?.memberSince : "2024"}</div>
            </div>
            <div className="space-y-1">
               <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Trust Score</div>
               <div className="text-lg font-black text-emerald-400 tracking-tight">PLATINUM</div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5 relative z-10">
             <div className="text-[11px] font-bold text-slate-400 leading-relaxed">
                This seller has cleared our multi-level verification protocol, including document validation and physical premises audit.
             </div>
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
