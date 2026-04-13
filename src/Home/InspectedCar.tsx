"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ShieldCheck, Lock, ArrowRight, Gauge, Activity, Cpu } from "lucide-react";
import Link from "next/link";

export default function InspectedCar() {
  const points = [
    "Engine Health",
    "Transmission",
    "Exterior Condition",
    "Interior Quality",
    "Electrical Systems",
    "Suspension Check",
  ];

  return (
    <section className="min-h-screen flex items-center py-8 md:py-20 bg-ghost overflow-hidden relative">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/30 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-50/40 blur-[100px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-24 items-center">
          
          {/* ── LEFT SIDE: CONTENT ── */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-royal text-xs font-black uppercase tracking-widest mb-6">
              <ShieldCheck size={14} />
              Verified Transparency
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tight text-navy leading-[1.1]">
              Know Every Detail <br />
              <span className="text-royal">Before You Buy.</span>
            </h2>
            
            <p className="text-base md:text-lg text-gray-500 font-medium mb-10 leading-relaxed max-w-xl">
              Get access to a comprehensive inspection report covering everything from the engine heart to the finest interior stitches.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 mb-8">
              {points.map((point, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-3 text-gray-700 font-bold"
                >
                  <div className="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <CheckCircle2 size={16} strokeWidth={3} />
                  </div>
                  {point}
                </motion.div>
              ))}
            </div>

            <Link href="/details/sample-report" className="group inline-flex items-center gap-3 bg-royal text-white px-8 py-4 rounded-[1.5rem] font-black tracking-tight shadow-xl hover:shadow-blue-200 transition-[transform,box-shadow] hover:scale-105 active:scale-95">
              View Sample Report
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* ── RIGHT SIDE: UI PREVIEW (LOCKED) ── */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: -10 }}
            whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative perspective-1000"
          >
            {/* Main Report Card */}
            <div className="glass-light rounded-[3rem] p-8 md:p-10 relative overflow-hidden">
              
              {/* Header Info */}
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h3 className="text-2xl font-black text-navy mb-1">Inspection Report</h3>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Report ID: #CK-99420</p>
                </div>
              </div>

              {/* Inspection Grid Preview */}
              <div className="space-y-6">
                <div className="p-5 rounded-3xl bg-gray-50/50 border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-royal">
                       <Cpu size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 leading-none">Engine Health</p>
                      <p className="text-xs font-bold text-green-600 mt-1.5 uppercase">Excellent</p>
                    </div>
                  </div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-[95%] h-full bg-green-500 rounded-full" />
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-gray-50/50 border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-indigo-500">
                       <Activity size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 leading-none">Fluid Levels</p>
                      <p className="text-xs font-bold text-green-600 mt-1.5 uppercase">Certified</p>
                    </div>
                  </div>
                  <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="w-[88%] h-full bg-green-500 rounded-full" />
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-gray-50/50 border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-400">
                       <Gauge size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 leading-none">Odometer Check</p>
                      <p className="text-xs font-bold text-green-600 mt-1.5 uppercase">Verified</p>
                    </div>
                  </div>
                  <CheckCircle2 className="text-green-500" size={24} />
                </div>
              </div>

              {/* Glass Lock Overlay */}
              <div className="absolute inset-x-0 bottom-0 h-[70%] glass-light !bg-gradient-to-t !from-white !via-white/95 !to-transparent border-none shadow-none flex flex-col items-center justify-end pb-12 px-8 text-center">
                 <div className="w-14 h-14 rounded-full bg-royal text-white flex items-center justify-center shadow-2xl mb-4 border-4 border-white">
                    <Lock size={24} fill="currentColor" strokeWidth={0} />
                 </div>
                 <h4 className="text-xl font-black text-gray-900 mb-2">Locked Preview</h4>
                 <p className="text-sm font-bold text-gray-500 max-w-xs leading-relaxed">
                   The full inspection report with HD photos is available only to verified buyers.
                 </p>
              </div>
            </div>

            {/* Decorative Floating Elements */}
            <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -top-6 -right-6 w-24 h-24 bg-royal/10 rounded-full blur-2xl" 
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
