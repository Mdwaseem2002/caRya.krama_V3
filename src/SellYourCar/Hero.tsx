"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#f8fafc] py-20 px-6">
      {/* Seamless Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-50/50 to-transparent" />
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-100/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-100/20 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 md:space-y-12">
        {/* Modern Label */}
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-100 shadow-sm backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-royal" />
          <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-[#0f172a]/60">
            Seamless Selling Experience
          </span>
        </motion.div>

        {/* Cinematic Typography */}
        <div className="space-y-4 md:space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="text-5xl md:text-8xl font-black tracking-tighter text-[#0f172a] leading-[0.95]"
          >
            Sell Your Car <br />
            <span className="text-royal">With Confidence.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-sm md:text-xl text-slate-500 font-bold leading-relaxed"
          >
            Professionally inspected cars listed on <span className="text-[#0f172a] font-black italic">caRya.krama</span> ensure total transparency and trust for every buyer.
          </motion.p>
        </div>

        {/* Integrated Actions */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.3 }}
           className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4"
        >
          <button 
            onClick={onStart}
            className="group relative flex items-center justify-center gap-3 bg-royal text-white px-10 py-5 rounded-2xl font-black text-lg hover:scale-[1.03] active:scale-[0.98] transition-all shadow-xl shadow-blue-500/20 w-full md:w-auto"
          >
            Sell My Car
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-white border border-slate-100 shadow-sm w-full md:w-auto">
            <ShieldCheck className="w-5 h-5 text-emerald-500" />
            <span className="text-[11px] font-black text-[#0f172a]/40 uppercase tracking-widest whitespace-nowrap">
              Certified Inspections
            </span>
          </div>
        </motion.div>

        {/* Visual Anchor */}
        <motion.div
           initial={{ opacity: 0, y: 40 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.5, duration: 1.2 }}
           className="relative mt-16 md:mt-24"
        >
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-b from-blue-50/40 to-transparent rounded-[3rem]" />
           {/* Mobile-friendly spacing */}
           <div className="h-10 md:h-20" />
        </motion.div>
      </div>
    </section>
  );
}
