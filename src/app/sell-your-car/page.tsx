"use client";

import React, { useState } from "react";
import Hero from "@/SellYourCar/Hero";
import HowItWorks from "@/SellYourCar/HowItWorks";
import SellForm from "@/SellYourCar/SellForm";
import SellSuccess from "@/SellYourCar/SellSuccess";
import { motion, AnimatePresence } from "framer-motion";

export default function SellYourCarPage() {
  const [successRequestId, setSuccessRequestId] = useState<string | null>(null);

  const scrollToForm = () => {
    const el = document.getElementById("sell-form-container");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-white">

      <AnimatePresence mode="wait">
        {!successRequestId ? (
          <motion.div
            key="funnel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero onStart={scrollToForm} />
            <HowItWorks />
            <div className="bg-slate-50 py-8 md:py-16">
               <div className="max-w-7xl mx-auto px-6 text-center mb-6 md:mb-10">
                  <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Begin Your <span className="text-royal">Submission.</span></h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Fill in your details to schedule a professional inspection.</p>
               </div>
               <SellForm onSuccess={(id) => {
                 setSuccessRequestId(id);
                 window.scrollTo({ top: 0, behavior: "smooth" });
               }} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
             <SellSuccess requestId={successRequestId} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
