"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ArrowRight, ShieldCheck, FileSearch } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaymentDoneProps {
  isOpen: boolean;
  onClose: () => void;
  carName?: string;
  carId?: string;
}

export default function PaymentDone({ isOpen, onClose, carName = "this vehicle", carId }: PaymentDoneProps) {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Popup Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
        >
          <div className="p-8 text-center">
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 3 }}
              transition={{ delay: 0.1, type: "spring", damping: 10, mass: 0.8 }}
              className="w-24 h-24 bg-gradient-to-br from-[#10b981] to-[#047857] rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-green-500/20"
            >
              <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={2.5} />
            </motion.div>

            <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Payment Validated.</h2>
            <p className="text-gray-500 mb-8 leading-relaxed font-medium">
              We've successfully generated the comprehensive inspection data for <span className="font-bold text-gray-900">{carName}</span>. Your report is securely ready for viewing.
            </p>

            <div className="space-y-3 mb-10">
              <div className="flex items-center justify-center gap-3 text-sm font-bold text-blue-700 bg-blue-50/80 hover:bg-blue-100 border border-blue-100 py-3 px-4 rounded-2xl transition-colors">
                <FileSearch className="w-5 h-5 text-blue-600" />
                <span>Inspection Complete</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-sm font-bold text-green-700 bg-green-50/80 hover:bg-green-100 border border-green-100 py-3 px-4 rounded-2xl transition-colors">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                <span>Verified by Platform Experts</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                router.push(`/details/report?id=${carId}`);
              }}
              className="w-full py-4 bg-gradient-to-r from-[#0059A3] to-[#1B4FD8] text-white rounded-[1.5rem] font-black text-lg hover:to-[#0A2A6E] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group shadow-xl shadow-blue-900/20"
            >
              Access Full Report
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
            <p className="text-xs text-gray-400 font-medium uppercase letter-spacing-wide">
              🔒 Securely stored in your dashboard
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
