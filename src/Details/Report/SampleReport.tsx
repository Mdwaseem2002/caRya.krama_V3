"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  ChevronLeft, Download, ShieldCheck, CheckCircle2, 
  AlertTriangle, Settings, Layout, Droplets, Battery, 
  Car, Wifi, Activity, ThumbsUp, Wrench, Search, Star, X
} from "lucide-react";
import { useRouter } from "next/navigation";

const SampleReport = () => {
  const router = useRouter();

  // --- Static Sample Data ---
  const car = {
    name: "Mercedes-Benz G-Class (AMG G63)",
    year: 2024,
    odometer: "1,250 km",
    transmission: "Automatic",
    specs: { fuelType: "Petrol (Super 98)" },
    color: "Obsidian Black Metallic",
    id: "SAMPLE-99"
  };

  const report = {
    overallScore: 9.8,
    remarks: [
      { type: "info", text: "Vehicle is in showroom condition. No mechanical or electrical defects found." },
      { type: "info", text: "PPF (Paint Protection Film) installed on full front body." }
    ]
  };

  const currentDate = new Date().toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' });
  const reportId = "CK-SAMPLE-98742";

  // Reusable components
  const SectionHeader = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div className="flex items-center gap-4 mb-8 bg-slate-50 p-5 rounded-2xl border border-slate-100">
      <div className="w-12 h-12 bg-[#0059A3]/10 rounded-xl flex items-center justify-center shadow-sm">
        <Icon className="w-6 h-6 text-[#0059A3]" />
      </div>
      <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{title}</h2>
    </div>
  );

  const StatusItem = ({ label, status, desc }: { label: string, status: 'good' | 'issue' | 'neutral', desc?: string }) => (
    <div className="flex items-start gap-4 py-4 border-b border-slate-50 last:border-0 relative pl-10 group transition-colors hover:bg-slate-50/50 rounded-xl">
      <div className="absolute left-2 top-4.5">
        {status === 'good' && <CheckCircle2 className="w-6 h-6 text-green-500" />}
        {status === 'issue' && <AlertTriangle className="w-6 h-6 text-red-500" />}
        {status === 'neutral' && <div className="w-4 h-4 ml-1 rounded-full bg-slate-300 mt-1" />}
      </div>
      <div>
        <span className={`text-lg font-black ${status === 'issue' ? 'text-red-700' : 'text-slate-900'}`}>{label}</span>
        {desc && <p className="text-sm font-bold text-slate-500 mt-1 leading-relaxed opacity-90">{desc}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 pb-32 font-inter selection:bg-[#0059A3] selection:text-white">
      
      {/* HEADER OVERLAY FOR SAMPLE */}
      <div className="bg-[#0059A3] text-white py-3 text-center sticky top-0 z-[200] font-black uppercase tracking-[0.3em] text-[10px]">
        Sample Inspection Report · Preview Mode
      </div>

      <div className="w-full max-w-[210mm] mx-auto bg-white min-h-[297mm] shadow-[0_20px_50px_rgba(0,0,0,0.1)] md:mt-12 md:mb-12 print:m-0 print:shadow-none" style={{ boxSizing: "border-box" }}>
        
        {/* 🔥 STEP 1: REPORT PAGE HEADER */}
        <div className="px-6 md:px-10 pt-12 pb-8 border-b-4 border-[#0059A3] flex flex-col items-center text-center bg-slate-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#0059A3]"></div>
          
          {/* Branding Rectangle */}
          <div className="w-full border-2 border-[#0059A3] rounded-2xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-2 justify-center">
              <div className="w-12 h-12 bg-[#0059A3] rounded-2xl flex items-center justify-center shadow-lg shadow-[#0059A3]/20">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">caRya<span className="text-[#0059A3]">.krama</span></h1>
            </div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest px-4">Professional Vehicle Inspection Services</p>
          </div>
          
          <h2 className="text-4xl font-black text-[#0059A3] tracking-tighter mb-8 leading-tight uppercase">Sample Audit Report</h2>
          
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-sm font-bold text-slate-700 bg-white px-8 py-5 rounded-2xl shadow-sm border border-slate-100">
             <div className="flex flex-col"><span className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Date</span> {currentDate}</div>
             <div className="w-px h-10 bg-slate-100 hidden sm:block"></div>
             <div className="flex flex-col"><span className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Report ID</span> {reportId}</div>
             <div className="w-px h-10 bg-slate-100 hidden sm:block"></div>
             <div className="flex flex-col"><span className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Status</span> VERIFIED</div>
          </div>
        </div>

        <div className="px-6 md:px-10 py-10 space-y-12">
           
           {/* 🔥 VEHICLE HERO IMAGE */}
           <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-lg group">
              <Image 
                src="/CarImages/Suzuki.png" // Sample image
                alt="Suzuki"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 210mm) 100vw, 800px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-8">
                 <div className="bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2 rounded-xl text-white text-[10px] font-black uppercase tracking-widest">
                    Asset Visual Context
                 </div>
              </div>
           </div>
           
           {/* 🔥 VEHICLE INFO BLOCK */}
           <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                 <h3 className="font-black text-slate-900 text-lg flex items-center gap-2"><Car className="w-6 h-6 text-[#0059A3]" /> Vehicle Identification</h3>
                 <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Specimen Profile</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-y divide-slate-100">
                 <div className="p-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Make & Model</p>
                    <p className="font-extrabold text-slate-900 text-lg leading-tight">{car.name}</p>
                 </div>
                 <div className="p-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Year/Model</p>
                    <p className="font-extrabold text-slate-900 text-lg">{car.year}</p>
                 </div>
                 <div className="p-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Odometer</p>
                    <p className="font-extrabold text-slate-900 text-lg">{car.odometer}</p>
                 </div>
                 <div className="p-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Transmission</p>
                    <p className="font-extrabold text-slate-900 text-lg uppercase tracking-tight">{car.transmission}</p>
                 </div>
                 <div className="p-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fuel & Engine</p>
                    <p className="font-extrabold text-slate-900 text-lg">{car.specs.fuelType}</p>
                 </div>
                 <div className="p-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Audit Type</p>
                    <p className="font-extrabold text-[#0059A3] text-lg uppercase tracking-tight">Full Spec</p>
                 </div>
                 <div className="p-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Exterior Color</p>
                    <p className="font-extrabold text-slate-900 text-lg">{car.color}</p>
                 </div>
                 <div className="p-6">
                    <p className="text-[10px] font-black text-[#0059A3] uppercase tracking-widest mb-1">Verdict Score</p>
                    <p className="font-extrabold text-[#0059A3] text-lg uppercase tracking-tight">9.8 / 10</p>
                 </div>
              </div>
           </div>

           {/* 🔥 BODY & VISUAL INSPECTION */}
           <section>
              <SectionHeader icon={Search} title="1. Body & Visual Inspection" />
              <div className="px-2">
                 <StatusItem label="Paint Quality & Uniformity" status="good" desc="Paint thickness is factory set. No resprays or panel repairs found." />
                 <StatusItem label="Panel Alignment & Gaps" status="good" />
                 <StatusItem label="Glass & Mirrors" status="good" desc="All glass elements carry original manufacturer serial codes." />
                 <StatusItem label="Rust & Corrosion Check" status="good" desc="Zero corrosion found. Underbody shows factory-new condition." />
              </div>
           </section>

           {/* 🔥 ENGINE BAY */}
           <section>
              <SectionHeader icon={Settings} title="2. Engine Bay Mechanics" />
              <div className="px-2">
                 <StatusItem label="Fluid Integrity Scan" status="good" desc="Zero leaks recorded at engine block or transmission gasket." />
                 <StatusItem label="Mounts & Bushings" status="good" />
                 <StatusItem label="Drive Belts & Pulleys" status="good" />
                 <StatusItem label="Turbocharging Pressure" status="good" desc="Operating at perfect nominal bars." />
              </div>
           </section>

           {/* 🔥 BATTERY & ELECTRICAL */}
           <section>
              <SectionHeader icon={Battery} title="3. Electrical Performance" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                 <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Charge</p>
                    <p className="text-2xl font-black text-slate-900">12.8V</p>
                 </div>
                 <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Alternator</p>
                    <p className="text-2xl font-black text-slate-900">14.4V</p>
                 </div>
                 <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center shadow-sm col-span-2 flex items-center justify-center gap-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                    <div className="text-left">
                       <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Health Status</p>
                       <p className="text-xl font-black text-green-900 leading-tight">Excellent</p>
                    </div>
                 </div>
              </div>
           </section>

           {/* 🔥 OBD SCAN SAMPLE */}
           <section>
              <SectionHeader icon={Wifi} title="4. Digital Diagnostics" />
              <div className="bg-slate-900 text-green-400 rounded-2xl p-8 shadow-inner font-mono text-sm leading-relaxed border border-slate-800">
                 <div className="flex items-center gap-3 mb-6 text-white font-black pb-4 border-b border-slate-800 tracking-wide uppercase">
                    <Activity className="w-5 h-5 text-green-400" /> Diagnostic Stream Active
                 </div>
                 <ul className="space-y-3 opacity-90">
                    <li className="flex justify-between"><span>[PASS] SYSTEM MONITOR</span> <span className="text-green-500 font-black">OK</span></li>
                    <li className="flex justify-between"><span>[PASS] POWERTRAIN CONTROL</span> <span className="text-green-500 font-black">OK</span></li>
                    <li className="flex justify-between"><span>[PASS] CHASSIS MODULES</span> <span className="text-green-500 font-black">OK</span></li>
                    <li className="flex justify-between"><span>[PASS] BODY ELECTRONICS</span> <span className="text-green-500 font-black">OK</span></li>
                 </ul>
                 <p className="mt-8 pt-6 border-t border-slate-800 text-white font-black tracking-widest uppercase flex justify-between">TOTAL FAULT CODES: <span className="text-green-500 font-black">0</span></p>
              </div>
           </section>

           {/* 🔥 TEST DRIVE */}
           <section>
              <SectionHeader icon={Car} title="5. Dynamic Execution" />
              <div className="px-2">
                 <StatusItem label="Acceleration Curve" status="good" />
                 <StatusItem label="Gear Shift Smoothness" status="good" />
                 <StatusItem label="Braking Distance & Fade" status="good" />
                 <StatusItem label="Cornering Stability" status="good" />
              </div>
           </section>

           {/* 🔥 OVERALL VERDICT */}
           <section className="break-inside-avoid pt-6 pb-20">
              <div className="flex items-center gap-4 mb-10 justify-center">
                 <Star className="w-8 h-8 text-[#0059A3] fill-[#0059A3]" />
                 <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Specimen Verdict</h2>
                 <Star className="w-8 h-8 text-[#0059A3] fill-[#0059A3]" />
              </div>
              
              <div className="text-center bg-green-50 border-2 border-green-500/20 rounded-3xl p-10 shadow-xl shadow-green-500/5">
                <ShieldCheck className="w-16 h-16 text-green-500 mx-auto mb-6" />
                <h4 className="text-2xl font-black text-green-900 mb-4 tracking-tight">Grade A+ Certified</h4>
                <p className="text-lg font-bold text-green-700 leading-relaxed max-w-2xl mx-auto">
                    This sample report demonstrates the depth of our audit. Our technicians cover over 200+ safety and performance checkpoints.
                </p>
              </div>
           </section>

        </div>
        
        {/* FOOTER */}
        <div className="bg-[#0f172a] text-white px-6 md:px-10 py-10 text-center mt-auto rounded-b-[2.5rem] border-t-4 border-[#0059A3]">
           <p className="text-sm font-black tracking-[0.2em] uppercase text-white/90">© caRya.krama Inspection Services · Sample Report Preview</p>
        </div>

      {/* Floating Actions */}
      <div className="fixed bottom-10 left-6 md:auto md:top-1/3 md:-translate-y-1/2 md:left-[calc(50%-585px)] z-[100] flex items-center gap-3 no-print origin-left md:scale-90 xl:scale-100">
          <button 
            onClick={() => router.back()}
            className="w-14 h-14 bg-white border border-slate-200 text-slate-600 rounded-2xl shadow-2xl flex items-center justify-center hover:bg-slate-50 transition-all group"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
          <div className="bg-[#0059A3] text-white px-8 h-14 rounded-2xl flex items-center font-black uppercase tracking-widest text-[11px] shadow-2xl">
             Sample
          </div>
      </div>

      </div>

    </div>
  );
};

export default SampleReport;
