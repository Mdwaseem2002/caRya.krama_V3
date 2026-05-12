"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useIsMobile } from "@/hooks/useIsMobile";
import { Car, Activity, AlertTriangle, CheckCircle2, ChevronRight, Gauge } from "lucide-react";

interface SplashProps {
  onComplete: () => void;
}

// Refined animation presets for a high-end feel
const fadeUp = {
  initial: { opacity: 0, y: 10, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -10, filter: "blur(8px)" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }
};

export default function ValuePropSplash({ onComplete }: SplashProps) {
  const [step, setStep] = useState(1);
  const mobile = useIsMobile();

  useEffect(() => {
    const timeline = [
      { s: 2, t: 2500 }, // Phase 1: car.diologist Inspection
      { s: 3, t: 5000 }, // Phase 2: The Rejection/Problem
      { s: 4, t: 8000 }, // Phase 3: caRya.krama Solution
      { s: 5, t: 10500 }, // Phase 4: Final Call to Action
    ];

    const timers = timeline.map((phase) =>
      setTimeout(() => setStep(phase.s), phase.t)
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      className="fixed inset-0 z-[99999] bg-[#030303] flex items-center justify-center overflow-hidden font-sans"
    >
      {/* Background Glow - Shifts from Warning Red to Trust Blue */}
      <motion.div
        animate={{
          background: step <= 2 
            ? "radial-gradient(circle at center, rgba(239, 68, 68, 0.08) 0%, transparent 70%)" 
            : "radial-gradient(circle at center, rgba(59, 130, 246, 0.12) 0%, transparent 70%)"
        }}
        className="absolute inset-0 transition-colors duration-1000"
      />

      <AnimatePresence mode="wait">
        {/* PHASE 1: car.diologist (The Inspection) */}
        {step === 1 && (
          <motion.div key="p1" {...fadeUp} className="flex flex-col items-center">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white/90">
              car.<span className="text-red-500">diologist</span>
            </h2>
            <p className="text-sm md:text-xl font-black uppercase tracking-[0.4em] text-blue-500 mt-6 shadow-blue-500/20 drop-shadow-lg">
              ONLY INSPECTED CARS
            </p>
          </motion.div>
        )}

        {/* PHASE 2: REJECTION (The Persisting Problem) */}
        {step === 2 && (
          <motion.div key="p2" {...fadeUp} className="text-center max-w-xs md:max-w-sm px-6">
            <AlertTriangle className="w-12 h-12 md:w-16 md:h-16 text-red-600 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase leading-tight italic">
              REJECTED.
            </h2>
            <p className="text-red-500/80 text-sm md:text-base font-medium mt-4 tracking-wide leading-relaxed">
              Many cars got rejected and the issue still remains.
            </p>
            <p className="text-white/40 text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] mt-3">
              Solution not provided.
            </p>
            <div className="mt-8 h-[1px] w-full bg-gradient-to-r from-transparent via-red-900 to-transparent" />
          </motion.div>
        )}

        {/* PHASE 3: caRya.krama (The Solution) */}
        {step === 3 && (
          <motion.div key="p3" {...fadeUp} className="flex flex-col items-center px-6 text-center">
             
             <div className="relative mb-8">
                <Image 
                   src="/logo/carYakrama.png" 
                   alt="caRya.krama" 
                   width={mobile ? 240 : 340} 
                   height={mobile ? 80 : 110} 
                   className="brightness-150"
                   priority 
                />
                <motion.div 
                   initial={{ width: 0 }} 
                   animate={{ width: "100%" }} 
                   transition={{ delay: 0.5, duration: 1 }}
                   className="absolute -bottom-2 left-0 h-[2px] bg-blue-600"
                />
             </div>
             <div className="flex items-center gap-3 px-5 py-2.5 bg-blue-500/10 border border-blue-500/20 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.15)]">
                <CheckCircle2 className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em]">And now, caRya.krama is the solution.</span>
             </div>
          </motion.div>
        )}

        {/* PHASE 4: FINAL IMPACT & CLEAN REVEAL */}
        {step >= 4 && (
          <motion.div key="p4" {...fadeUp} className="text-center z-10 px-4">
            <div className="relative inline-block">
               <motion.h1 
                  className="text-4xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]"
                  initial={{ letterSpacing: "-0.05em", opacity: 0 }}
                  animate={{ letterSpacing: "0.02em", opacity: 1 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
               >
                 DRIVE WITH<br />
                 <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-blue-700">
                   TOTAL CLARITY.
                 </span>
               </motion.h1>
               
               {/* Clean Cinematic Scan Reveal (Replaces Car) */}
               <motion.div 
                 initial={{ top: "-100%" }}
                 animate={{ top: "200%" }}
                 transition={{ 
                   delay: 0.8, 
                   duration: 2.5, 
                   ease: [0.16, 1, 0.3, 1] 
                 }}
                 onAnimationComplete={() => {
                   setTimeout(onComplete, 500);
                 }}
                 className="absolute left-[-20%] right-[-20%] h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent blur-[2px] opacity-80"
               >
                  {/* Subtle Glow Trail */}
                  <div className="absolute inset-0 bg-blue-500/20 blur-xl h-2" />
               </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="mt-12 text-blue-500/40 text-[9px] md:text-[10px] font-bold tracking-[0.6em]"
            >
              caRya.krama
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Navigation Arrow */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="fixed right-6 bottom-12 md:right-12 md:top-1/2 md:-translate-y-1/2 flex flex-col items-center gap-4 z-[100000]"
      >
        <div className="flex flex-col items-center gap-1 group">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20 group-hover:text-blue-500 transition-colors duration-500">Wait</span>
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <ChevronRight className="w-5 h-5 text-white/30" />
          </motion.div>
        </div>
      </motion.div>

      {/* Subtle Progress Bar */}
      <div className="fixed bottom-0 left-0 w-full h-[2px] bg-white/5">
        <motion.div 
          className="h-full bg-gradient-to-r from-red-600 to-blue-600"
          initial={{ width: "0%" }}
          animate={{ width: `${(step / 5) * 100}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>
    </motion.div>
  );
}