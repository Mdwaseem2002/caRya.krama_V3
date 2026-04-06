"use client";

import React, { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  ChevronLeft, Download, Share2, ShieldCheck, CheckCircle2, 
  AlertTriangle, Settings, Layout, Droplets, Battery, 
  Car, Wifi, Activity, ThumbsUp, Wrench, Search, Star, X, Users
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { getReportByCarId } from "@/Admin/data/reports";
import { hasPurchased } from "@/Admin/data/purchases";
import { cars } from "@/Home/Card";
import { generatePDF } from "./PDFGeneration";
import { incrementReportDownloads } from "@/Admin/DataSaver/AnalyticsStore";
import { getAllStoredCars } from "@/Admin/Upload/CarStorage";

function ReportContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const carId = searchParams.get('id');
  const [report, setReport] = useState<any>(null);
  const [car, setCar] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const init = async () => {
    if (!carId) {
      router.push('/BuyCar');
      return;
    }

    const isPaid = hasPurchased(carId);
    if (!isPaid) {
      router.push(`/car/${carId}`);
      return;
    }

    let uploadedCars: any[] = [];
    try {
      uploadedCars = await getAllStoredCars();
    } catch (e) {}
    
    const foundUploaded = uploadedCars.find((c: any) => c.id === carId);
    const foundStatic = cars.find(c => c.id.toString() === carId.toString());
    const carData = foundUploaded || foundStatic || cars[0];

    let reportData = getReportByCarId(carId);

    // Provide mock report to prevent crash if a static car report doesn't exist
    if (!reportData) {
      reportData = {
        carId: carId,
        overallScore: 9.5,
        sections: [],
        detailed: [],
        remarks: [{ type: "info", text: "Minor scratch on rear bumper, polished during prep." }],
        isApproved: true,
        price: 299
      };
    }

    if (!reportData.isApproved) {
      router.push('/BuyCar');
      return;
    }

    setReport(reportData);
    setCar(carData);
    };
    init();
  }, [carId, router]);

  const handleDownload = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
    incrementReportDownloads();
    await generatePDF("report-content", `${car?.name || car?.title}-Inspection-Report.pdf`);
    setIsGenerating(false);
  };

  if (!report || !car) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-[#0059A3] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // --- Dynamic Data Mapping ---
  const carName = car.name || car.title || "Luxury Vehicle";
  const carYear = car.year || new Date().getFullYear();
  const carOdometer = car.odometer || car?.specs?.mileage || "N/A";
  const carFuel = car?.specs?.fuelType || "Petrol";
  const carTransmission = car.transmission || car?.specs?.transmission || "Automatic";
  
  const currentDate = new Date().toLocaleDateString('en-AE', { day: 'numeric', month: 'short', year: 'numeric' });
  const reportId = `CK-INS-${Math.random().toString(36).substring(2, 7).toUpperCase()}-${carId || '0'}`;

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
    <div className="min-h-screen bg-slate-100 pb-32 font-inter selection:bg-[#0059A3] selection:text-white" id="report-content">
      
      {/* A4 PAPER CONTAINER - Responsive wrapper */}
      <div className="w-full max-w-[210mm] mx-auto bg-white min-h-[297mm] shadow-[0_20px_50px_rgba(0,0,0,0.1)] md:mt-12 md:mb-12 print:m-0 print:shadow-none" style={{ boxSizing: "border-box" }}>
        
        {/* 🔥 STEP 1: REPORT PAGE HEADER */}
        <div className="px-6 md:px-10 pt-12 pb-8 border-b-4 border-[#0059A3] flex flex-col items-center text-center bg-slate-50 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#0059A3]"></div>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-[#0059A3] rounded-2xl flex items-center justify-center shadow-lg shadow-[#0059A3]/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">caRya<span className="text-[#0059A3]">.krama</span></h1>
          </div>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6 px-4">Professional Vehicle Inspection Services</p>
          
          <h2 className="text-4xl font-black text-[#0059A3] tracking-tighter mb-8 leading-tight">VEHICLE INSPECTION REPORT</h2>
          
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-sm font-bold text-slate-700 bg-white px-8 py-5 rounded-2xl shadow-sm border border-slate-100">
             <div className="flex flex-col"><span className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Date</span> {currentDate}</div>
             <div className="w-px h-10 bg-slate-100 hidden sm:block"></div>
             <div className="flex flex-col"><span className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Report ID</span> {reportId}</div>
             <div className="w-px h-10 bg-slate-100 hidden sm:block"></div>
             <div className="flex flex-col"><span className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Inspector</span> Master Tech Z.K.</div>
          </div>
        </div>

        <div className="px-6 md:px-10 py-10 space-y-12">
           
           {/* 🔥 VEHICLE HERO IMAGE */}
           <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-lg group">
              <Image 
                src={car.image || (car.images && car.images[0]) || "/placeholder-car.png"} 
                alt={carName}
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
           
           {/* 🔥 STEP 2: VEHICLE INFO BLOCK */}
           <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-6 py-5 border-b border-slate-200 flex justify-between items-center">
                 <h3 className="font-black text-slate-900 text-lg flex items-center gap-2"><Car className="w-6 h-6 text-[#0059A3]" /> Vehicle Identification</h3>
                 <span className="bg-green-100 text-green-700 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Verified Profile</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-y divide-slate-100">
                 <div className="p-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Make & Model</p>
                    <p className="font-extrabold text-slate-900 text-lg leading-tight">{carName}</p>
                 </div>
                 <div className="p-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Year/Model</p>
                    <p className="font-extrabold text-slate-900 text-lg">{carYear}</p>
                 </div>
                 <div className="p-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Odometer</p>
                    <p className="font-extrabold text-slate-900 text-lg">{carOdometer}</p>
                 </div>
                 <div className="p-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Transmission</p>
                    <p className="font-extrabold text-slate-900 text-lg uppercase tracking-tight">{carTransmission}</p>
                 </div>
                 <div className="p-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Fuel & Engine</p>
                    <p className="font-extrabold text-slate-900 text-lg">{carFuel}</p>
                 </div>
                 <div className="p-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">VIN Number</p>
                    <p className="font-extrabold text-slate-900 text-lg tracking-wider">CK-{(carId || '0').toString().padStart(6, '0')}</p>
                 </div>
                 <div className="p-6">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Exterior Color</p>
                    <p className="font-extrabold text-slate-900 text-lg">{car.color || "Premium Metallic"}</p>
                 </div>
                 <div className="p-6">
                    <p className="text-[10px] font-black text-[#0059A3] uppercase tracking-widest mb-1">Inspection Goal</p>
                    <p className="font-extrabold text-[#0059A3] text-lg uppercase tracking-tight">Standard Audit</p>
                 </div>
              </div>
           </div>

           {/* 🔥 STEP 3: BODY & VISUAL INSPECTION */}
           <section>
              <SectionHeader icon={Search} title="1. Body & Visual Inspection" />
              <div className="px-2">
                 <StatusItem label="Paint Quality & Uniformity" status="good" desc="Paint thickness is consistent across all major panels. No signs of major overspray." />
                 <StatusItem label="Panel Alignment & Gaps" status="good" />
                 <StatusItem label="Glass & Mirrors" status="issue" desc="Minor rock chip on the passenger side windshield. Not currently spreading." />
                 <StatusItem label="Rust & Corrosion Check" status="good" desc="Zero rust found on undercarriage or door sills." />
              </div>
           </section>

           {/* 🔥 STEP 4: ENGINE BAY */}
           <section>
              <SectionHeader icon={Settings} title="2. Engine Bay Mechanics" />
              <div className="px-2">
                 <StatusItem label="No visible oil or coolant leaks" status="good" />
                 <StatusItem label="Hoses & Radiator Pipes intact" status="good" />
                 <StatusItem label="Engine Mounts" status="neutral" desc="Showing minor wear but no excessive vibration in cabin." />
                 <StatusItem label="Drive Belts Condition" status="issue" desc="Serpentine belt shows slight cracking; replacement recommended soon." />
              </div>
           </section>

           {/* 🔥 STEP 5: FLUIDS TABLE */}
           <section>
              <SectionHeader icon={Droplets} title="3. Fluids & Lubricants" />
              <div className="overflow-hidden rounded-3xl border border-slate-200">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                          <th className="p-5 border-b border-slate-200">Fluid Type</th>
                          <th className="p-5 border-b border-slate-200">Current Status</th>
                          <th className="p-5 border-b border-slate-200">Action Required</th>
                       </tr>
                    </thead>
                    <tbody className="text-sm font-bold text-slate-700">
                       <tr className="border-b border-slate-100 bg-white">
                          <td className="p-5 text-slate-900">Engine Oil</td>
                          <td className="p-5 text-amber-600 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> Dark - Needs Service</td>
                          <td className="p-5 text-slate-500">Replace Oil & Filter</td>
                       </tr>
                       <tr className="border-b border-slate-100 bg-slate-50/30">
                          <td className="p-5 text-slate-900">Coolant Antifreeze</td>
                          <td className="p-5 text-green-600 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Clean / Full</td>
                          <td className="p-5 text-slate-500">None</td>
                       </tr>
                       <tr className="bg-white">
                          <td className="p-5 text-slate-900">Brake Fluid</td>
                          <td className="p-5 text-green-600 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> 1% Moisture</td>
                          <td className="p-5 text-slate-500">None</td>
                       </tr>
                    </tbody>
                 </table>
              </div>
           </section>

           {/* 🔥 STEP 6: BATTERY & ELECTRICAL */}
           <section>
              <SectionHeader icon={Battery} title="4. Battery & Electrical Systems" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                 <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Resting Voltage</p>
                    <p className="text-2xl font-black text-slate-900">12.6V</p>
                 </div>
                 <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Charging Voltage</p>
                    <p className="text-2xl font-black text-slate-900">14.2V</p>
                 </div>
                 <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center shadow-sm col-span-2 flex items-center justify-center gap-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                    <div className="text-left">
                       <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Health Status</p>
                       <p className="text-xl font-black text-green-900 leading-tight">Good / Acceptable</p>
                    </div>
                 </div>
              </div>
              <p className="text-[11px] font-bold text-slate-400 italic pl-2 leading-relaxed whitespace-pre-line">* Battery cranking amp test passed. Alternator charging sequence is perfectly within manufacturer parameters.</p>
           </section>

           {/* 🔥 STEP 7: INTERIOR INSPECTION */}
           <section>
              <SectionHeader icon={Layout} title="5. Interior & Cabin Quality" />
              <div className="px-2">
                 <StatusItem label="Seats & Upholstery Condition" status="good" desc="Leather is supple with no tears. Minimal bolter wear on driver's side." />
                 <StatusItem label="Steering & Dashboard" status="good" />
                 <StatusItem label="Infotainment & Displays" status="issue" desc="Nav screen has a localized cluster of dead pixels on the bottom right." />
                 <StatusItem label="AC & Climate Control" status="good" desc="Blowing ice-cold within 30 seconds." />
              </div>
           </section>

           {/* 🔥 STEP 8: OBD SCAN */}
           <section>
              <SectionHeader icon={Wifi} title="6. OBD II Diagnostics Scan" />
              <div className="bg-slate-900 text-green-400 rounded-2xl p-8 shadow-inner font-mono text-sm leading-relaxed border border-slate-800">
                 <div className="flex items-center gap-3 mb-6 text-white font-black pb-4 border-b border-slate-800 tracking-wide uppercase">
                    <Activity className="w-5 h-5 text-green-400" /> System Scan Initiated...
                 </div>
                 <ul className="space-y-3 opacity-90">
                    <li className="flex justify-between"><span>[08:42:12] ENGINE ECU</span> <span className="text-green-500 font-black">NO FAULTS</span></li>
                    <li className="flex justify-between"><span>[08:42:15] TRANSMISSION TCM</span> <span className="text-green-500 font-black">NO FAULTS</span></li>
                    <li className="flex justify-between"><span>[08:42:18] ABS/ESP MODULE</span> <span className="text-green-500 font-black">NO FAULTS</span></li>
                    <li className="flex justify-between text-amber-400"><span>[08:42:21] AIRBAG SRS</span> <span className="text-amber-500 font-black">1 STORED CODE</span></li>
                 </ul>
                 <p className="mt-8 pt-6 border-t border-slate-800 text-white font-black tracking-widest uppercase flex justify-between">DIAGNOSTIC STATUS: <span className="text-green-500 underline underline-offset-4">PASS</span></p>
              </div>
           </section>

           {/* 🔥 STEP 9: TEST DRIVE */}
           <section className="break-inside-avoid">
              <SectionHeader icon={Car} title="7. Dynamic Test Drive" />
              <div className="overflow-hidden rounded-3xl border border-slate-200">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-slate-50 text-[11px] font-black text-slate-500 uppercase tracking-widest">
                          <th className="p-5 border-b border-slate-200">Component</th>
                          <th className="p-5 border-b border-slate-200">Observation</th>
                          <th className="p-5 border-b border-slate-200 text-center">Rating</th>
                       </tr>
                    </thead>
                    <tbody className="text-sm font-bold text-slate-700">
                       <tr className="border-b border-slate-100 bg-white">
                          <td className="p-5 text-slate-900">Engine Performance</td>
                          <td className="p-5 text-slate-500 font-bold">Smooth delivery through RPM range.</td>
                          <td className="p-5 text-center">
                            <span className="inline-block bg-green-100 text-green-800 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">Pass</span>
                          </td>
                       </tr>
                       <tr className="bg-slate-50/30">
                          <td className="p-5 text-slate-900">Braking Stability</td>
                          <td className="p-5 text-slate-500 font-bold">Minor shudder from front rotors at speed.</td>
                          <td className="p-5 text-center">
                            <span className="inline-block bg-amber-100 text-amber-800 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">Caution</span>
                          </td>
                       </tr>
                    </tbody>
                 </table>
              </div>
           </section>

           {/* 🔥 STEP 10: SERVICE HISTORY */}
           <section className="break-inside-avoid">
              <SectionHeader icon={Wrench} title="8. Service & Maintenance History" />
              <div className="space-y-4 px-2">
                 {car.condition?.serviceHistory && car.condition.serviceHistory.map((log: string, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100 group">
                       <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" />
                       <span className="text-sm font-bold text-slate-700">{log}</span>
                    </div>
                 ))}
                 {!car.condition?.serviceHistory?.length && !String(car.id || '').startsWith('CK-') && (
                    <p className="text-xs font-bold text-slate-400 italic mt-2">Verified digital service records are pulled from authorized centers.</p>
                 )}
              </div>
           </section>

           {/* 🔥 STEP 11: SELLER DETAILS */}
           <section className="break-inside-avoid">
              <SectionHeader icon={Users} title="9. Verified Seller Information" />
              <div className="bg-[#0f172a] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-xl">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Seller Name</p>
                       <p className="text-lg font-black text-white tracking-tight">{car.sellerDetails?.name || "caRya.krama Verified"}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Account Type</p>
                       <p className="text-lg font-black text-blue-400 tracking-tight">{car.sellerDetails?.type || "Professional"}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Member Since</p>
                       <p className="text-lg font-black text-white tracking-tight">{car.sellerDetails?.memberSince || "2024"}</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Trust Status</p>
                       <p className="text-lg font-black text-emerald-400 tracking-tight">PLATINUM</p>
                    </div>
                 </div>
                 <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
                    <p className="text-xs font-bold text-slate-400 leading-relaxed italic">
                       Professional Seller Audit: Verified Identity, Document Compliance, and Physical Inspection cleared.
                    </p>
                 </div>
              </div>
           </section>

           {/* 🔥 STEP 12: OVERALL VERDICT */}
           <section className="break-inside-avoid pt-6">
              <div className="flex items-center gap-4 mb-10 justify-center">
                 <Star className="w-8 h-8 text-[#0059A3] fill-[#0059A3]" />
                 <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Overall Audit Verdict</h2>
                 <Star className="w-8 h-8 text-[#0059A3] fill-[#0059A3]" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-green-50 border-2 border-green-500/20 rounded-3xl p-8 text-center shadow-lg shadow-green-500/5">
                    <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white shadow-md">
                       <ShieldCheck className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-black text-green-900 mb-3 tracking-tight">Mechanically Sound</h4>
                    <p className="text-sm font-bold text-green-700 leading-relaxed opacity-90">Vehicle passes all major powertrain and safety criteria.</p>
                 </div>
                 
                 <div className="bg-amber-50 border-2 border-amber-500/20 rounded-3xl p-8 text-center shadow-lg shadow-amber-500/5">
                    <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-5 text-white shadow-md">
                       <Wrench className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-black text-amber-900 mb-3 tracking-tight">Needs Attention</h4>
                    <p className="text-sm font-bold text-amber-700 leading-relaxed opacity-90">Brake shudder and minor fluids require addressing soon.</p>
                 </div>
 
                 <div className="bg-[#0059A3]/5 border-2 border-[#0059A3]/20 rounded-3xl p-8 text-center shadow-lg shadow-[#0059A3]/5">
                    <div className="w-16 h-16 bg-[#0059A3] rounded-2xl flex items-center justify-center mx-auto mb-5 text-white shadow-md">
                       <ThumbsUp className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-black text-[#0059A3] mb-3 tracking-tight">Recommendation</h4>
                    <p className="text-sm font-bold text-[#004a87] leading-relaxed opacity-90">A solid purchase. Factor in minor maintenance costs.</p>
                 </div>
              </div>
           </section>

           {/* 🔥 STEP 11: PRECAUTIONS & RECOMMENDATIONS */}
           <section className="break-inside-avoid pt-4">
              <div className="flex flex-col md:flex-row gap-6">
                 <div className="w-full md:w-1/2 bg-slate-50 border border-slate-200 rounded-3xl p-8">
                    <h4 className="font-black text-slate-900 text-xl border-b border-slate-200 pb-4 mb-6 uppercase tracking-tight">Immediate Action Items</h4>
                    <ul className="space-y-4 font-bold text-base text-slate-700">
                       {report.remarks?.filter((r: any) => r.type === 'issue' || r.type === 'warning').length > 0 ? (
                          report.remarks.filter((r: any) => r.type === 'issue' || r.type === 'warning').map((r: any, i: number) => (
                             <li key={i} className="flex gap-3"><div className="w-2 h-2 mt-2 rounded-full bg-red-500 shrink-0"/> {r.text}</li>
                          ))
                       ) : (
                          <li className="flex gap-3"><div className="w-1.5 h-1.5 mt-2 rounded-full bg-slate-400 shrink-0"/> No immediate mechanical failures detected.</li>
                       )}
                       <li className="flex gap-3"><div className="w-2 h-2 mt-2 rounded-full bg-amber-500 shrink-0"/> Perform basic fluids audit in next 5,000 km.</li>
                    </ul>
                 </div>
                 <div className="w-full md:w-1/2 bg-slate-50 border border-slate-200 rounded-3xl p-8">
                    <h4 className="font-black text-slate-900 text-xl border-b border-slate-200 pb-4 mb-6 uppercase tracking-tight">Long-Term Advisory</h4>
                    <ul className="space-y-4 font-bold text-base text-slate-700">
                       {report.remarks?.filter((r: any) => r.type === 'info').length > 0 ? (
                          report.remarks.filter((r: any) => r.type === 'info').map((r: any, i: number) => (
                             <li key={i} className="flex gap-3"><div className="w-2 h-2 mt-2 rounded-full bg-[#0059A3] shrink-0"/> {r.text}</li>
                          ))
                       ) : (
                          <li className="flex gap-3"><div className="w-1.5 h-1.5 mt-2 rounded-full bg-slate-400 shrink-0"/> Service history is up-to-date with factory parameters.</li>
                       )}
                       <li className="flex gap-3"><div className="w-2 h-2 mt-2 rounded-full bg-[#0059A3] shrink-0"/> Regular inspection recommended every 12 months.</li>
                    </ul>
                 </div>
              </div>
           </section>

           {/* 🔥 STEP 12: SIGNATURE SECTION */}
           <section className="break-inside-avoid pt-12 mt-12 border-t-2 border-dashed border-slate-100">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Inspected By</p>
                    <p className="text-lg font-black text-slate-900 border-b border-slate-200 pb-2">Master Tech Z. Khan</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Date Completed</p>
                    <p className="text-lg font-black text-slate-900 border-b border-slate-200 pb-2">{currentDate}</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Inspection Centre</p>
                    <p className="text-lg font-black text-slate-900 border-b border-slate-200 pb-2">Dubai HQ - Bay 4</p>
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Official Signature</p>
                    <div className="border-b border-slate-200 h-[38px] flex items-end pb-1">
                       <span className="font-[cursive] text-lg text-[#0059A3] opacity-80">ZK. Inspections</span>
                    </div>
                 </div>
              </div>
           </section>

        </div>
        
        {/* 🔥 STEP 13: FOOTER */}
        <div className="bg-[#0f172a] text-white px-6 md:px-10 py-10 text-center mt-auto rounded-b-[2.5rem] border-t-4 border-[#0059A3] print:absolute print:bottom-0 print:w-full">
           <p className="text-xs font-medium text-slate-400 max-w-2xl mx-auto leading-relaxed mb-6 italic opacity-80">
              DISCLAIMER: This inspection report constitutes an evaluation based on the technical and visual condition of the vehicle at the specific time of inspection. caRya.krama does not hold liability for future mechanical failures post-purchase. This document is digitally certified.
           </p>
           <p className="text-sm font-black tracking-[0.2em] uppercase text-white/90">© {new Date().getFullYear()} caRya.krama Dealerships</p>
        </div>

      {/* Floating Actions (FAB) - Improved Positioning */}
      <div className="fixed bottom-10 left-10 md:left-28 z-[100] no-print flex items-center gap-5">
          {/* Close Button */}
          <button 
            onClick={() => router.back()}
            className="w-14 h-14 bg-white border border-slate-200 text-slate-600 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex items-center justify-center hover:bg-slate-50 active:scale-95 hover:scale-105 transition-all group"
            title="Close Report"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* Download Button */}
          <button 
            onClick={handleDownload}
            disabled={isGenerating}
            className={`w-16 h-16 rounded-2xl shadow-[0_15px_35px_rgba(0,89,163,0.3)] flex items-center justify-center active:scale-95 hover:scale-105 transition-all ${isGenerating ? 'bg-slate-400' : 'bg-[#0059A3] hover:bg-[#004a87]'}`}
            title="Download PDF"
          >
            <Download className={`w-7 h-7 text-white ${isGenerating ? 'animate-bounce' : ''}`} />
          </button>
      </div>

      </div>

    </div>
  );
}

export default function CarReport() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-[#0059A3] border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ReportContent />
    </Suspense>
  );
}
