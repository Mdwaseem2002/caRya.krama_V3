"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, MessageSquare, Mail, ArrowLeft, RefreshCw, Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";
import RescheduleModal from "./RescheduleModal";
import Callus from "@/Details/CallUs/Callus";

export default function SellSuccess({ requestId }: { requestId: string }) {
  const [showReschedule, setShowReschedule] = useState(false);
  const [showCallus, setShowCallus] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-24 text-center space-y-12 bg-white min-h-[90vh] flex flex-col justify-center">
      {/* Success Badge - Refined Emerald Theme */}
      <div className="relative mx-auto w-32 h-32">
         <motion.div
           initial={{ scale: 0, rotate: -180 }}
           animate={{ scale: 1, rotate: 0 }}
           transition={{ type: "spring", damping: 15, stiffness: 200 }}
           className="w-full h-full bg-emerald-50 rounded-[3rem] border border-emerald-100 flex items-center justify-center shadow-xl shadow-emerald-500/5 relative z-10"
         >
           <CheckCircle2 className="w-16 h-16 text-emerald-500" strokeWidth={1.5} />
         </motion.div>
         {/* Decorative Ring */}
         <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute inset-[-12px] border-2 border-dashed border-emerald-100 rounded-[3.5rem] animate-spin-slow"
         />
      </div>

      {/* Headlines */}
      <div className="space-y-6">
        <motion.div
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-[10px] font-black uppercase tracking-widest"
        >
          <ShieldCheck size={12} /> Verification Pending
        </motion.div>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-black tracking-tight text-[#0f172a]"
        >
          Request <span className="text-emerald-500">Received.</span>
        </motion.h2>
        
        <p className="max-w-2xl mx-auto text-base md:text-xl text-slate-500 font-bold leading-relaxed px-4">
          Your inspection request is scheduled for processing. Our <span className="text-royal font-black underline decoration-royal/20 underline-offset-4">Car Cardiologist</span> will contact you within 24 hours.
        </p>
      </div>

      {/* Status Communication Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto pt-6">
        <motion.div 
           initial={{ opacity: 0, x: -20 }}
           animate={{ opacity: 1, x: 0 }}
           transition={{ delay: 0.2 }}
           onClick={() => setShowCallus(true)}
           className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex items-center gap-6 group hover:bg-white hover:shadow-xl transition-all cursor-pointer"
        >
          <div className="w-14 h-14 rounded-2xl bg-emerald-100/50 flex items-center justify-center shrink-0 shadow-sm">
             <MessageSquare className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">WhatsApp Sent</h4>
            <p className="text-[11px] text-slate-500 font-bold mt-1 leading-tight">Confirmed to your mobile.</p>
          </div>
        </motion.div>

        <Link href="/Contact" className="block">
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ delay: 0.3 }}
             className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 flex items-center gap-6 group hover:bg-white hover:shadow-xl transition-all h-full"
          >
            <div className="w-14 h-14 rounded-2xl bg-royal/10 flex items-center justify-center shrink-0 shadow-sm">
               <Mail className="w-6 h-6 text-royal" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Email Confirmation</h4>
              <p className="text-[11px] text-slate-500 font-bold mt-1 leading-tight">Sent to your inbox.</p>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-10 px-6">
        <Link 
          href="/BuyCar"
          className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-royal/10 text-royal font-black text-sm uppercase tracking-widest hover:bg-royal hover:text-white transition-all shadow-sm active:scale-95 border border-royal/10"
        >
          <ArrowLeft className="w-4 h-4" /> Browse Marketplace
        </Link>
        <button 
          onClick={() => setShowReschedule(true)}
          className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 rounded-2xl bg-white border-2 border-slate-100 text-slate-600 font-black text-sm uppercase tracking-widest hover:border-royal hover:text-royal transition-all active:scale-95 shadow-sm"
        >
          <RefreshCw className="w-4 h-4" /> Reschedule Visit
        </button>
      </div>

      {/* Footer Branding */}
      <div className="pt-16 pb-10 flex flex-col items-center gap-4">
        <div className="flex items-center gap-3 text-slate-300 font-black uppercase tracking-[0.2em] text-[11px]">
          <Sparkles size={12} className="text-royal" />
          Reference ID: <span className="text-royal/60 underline decoration-royal/10">{requestId}</span>
        </div>
        <div className="h-px w-20 bg-slate-100" />
      </div>

      <RescheduleModal 
        isOpen={showReschedule}
        onClose={() => setShowReschedule(false)}
        requestId={requestId}
      />

      <Callus 
        isOpen={showCallus}
        onClose={() => setShowCallus(false)}
      />
    </div>
  );
}
