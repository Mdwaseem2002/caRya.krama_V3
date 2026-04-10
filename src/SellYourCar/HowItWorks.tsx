"use client";

import React from "react";
import { motion } from "framer-motion";
import { FileText, Calendar, Rocket, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    icon: <FileText className="w-8 h-8 text-royal" />,
    title: "Fill Details",
    description: "Add your vehicle information and upload photos in under 2 minutes.",
    step: "Step 01",
    color: "bg-blue-50"
  },
  {
    icon: <Calendar className="w-8 h-8 text-emerald-500" />,
    title: "Schedule",
    description: "Choose a convenient date and time for inspection with our Car Cardiologist.",
    step: "Step 02",
    color: "bg-emerald-50"
  },
  {
    icon: <Rocket className="w-8 h-8 text-indigo-500" />,
    title: "Get Listed",
    description: "Once the inspection passes our quality check, your car hits the marketplace.",
    step: "Step 03",
    color: "bg-indigo-50"
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white px-6">
      <div className="max-w-7xl mx-auto space-y-20">
        {/* Section Header */}
        <div className="text-center space-y-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black tracking-tight text-[#0f172a]"
          >
            How it <span className="text-royal">Works.</span>
          </motion.h2>
          <div className="flex items-center justify-center gap-3">
             <div className="h-px w-8 bg-slate-200" />
             <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] md:text-xs">
                A seamless path
             </p>
             <div className="h-px w-8 bg-slate-200" />
          </div>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Subtle connecting lines (Desktop) */}
          <div className="hidden md:block absolute top-[15%] left-[25%] right-[25%] h-px bg-slate-100 z-0" />

          {STEPS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative z-10 p-10 md:p-12 rounded-[3rem] bg-white border border-slate-100 hover:border-royal/20 hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.06)] transition-all group flex flex-col items-center text-center space-y-8"
            >
              {/* Step Badge */}
              <div className="absolute top-6 left-6">
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.step}</span>
              </div>

              {/* Icon Container */}
              <div className={`w-24 h-24 rounded-[2rem] ${item.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                {item.icon}
              </div>
              
              <div className="space-y-4">
                <h3 className="text-2xl font-black tracking-tight text-[#0f172a] group-hover:text-royal transition-colors">
                  {item.title}
                </h3>
                <p className="text-[15px] text-slate-500 font-bold leading-relaxed opacity-80">
                  {item.description}
                </p>
              </div>

              {/* Verified Marker */}
              <div className="pt-2">
                 <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 group-hover:bg-emerald-50 group-hover:border-emerald-100 group-hover:text-emerald-500 transition-colors">
                    <CheckCircle2 size={14} className="opacity-40 group-hover:opacity-100" />
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
