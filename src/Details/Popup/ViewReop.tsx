"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface ViewReopProps {
  isOpen: boolean;
  onClose: () => void;
  carId: string | number;
  mode?: "pay" | "report";
}

export default function ViewReop({ isOpen, onClose, carId, mode = "pay" }: ViewReopProps) {
  const router = useRouter();
  const { user } = useAuth();

  const handleProceed = () => {
    onClose();
    if (mode === "report") {
      if (user) {
        import("@/Details/Notification/CustomerNotify").then(({ addNotification }) => {
          addNotification(user.id, {
            title: "Report Downloaded 📄",
            message: `Inspection report for car #${carId} downloaded.`,
            type: "report",
            cta: { label: "View Again", href: `/details/report?id=${carId}` }
          });
        });
      }
      router.push(`/details/report?id=${carId}`);
    } else {
      router.push(`/pay?id=${carId}`);
    }
  };

  const title = mode === "report" ? "Report Ready" : "Authorized Access";
  const desc = mode === "report" 
    ? "Your details have been verified. You can now securely access the complete Car Report breakdown."
    : "This vehicle's comprehensive data report requires secure validation. Please complete the transaction to instantly unlock the full inspection breakdown.";
  const btnText = mode === "report" ? "View Car Report" : "Authorize Payment";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Popup Container */}
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden pointer-events-auto"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              <div className="relative p-8 text-center space-y-6 pt-12">

                {/* Icon */}
                <motion.div 
                  initial={{ scale: 0, rotate: -5 }} animate={{ scale: 1, rotate: 2 }} transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
                  className="mx-auto w-24 h-24 rounded-[2rem] bg-gradient-to-br from-[#0059A3] to-[#1B4FD8] flex items-center justify-center shadow-xl shadow-blue-500/20"
                >
                  <Info className="w-12 h-12 text-white" strokeWidth={2.5} />
                </motion.div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-3xl font-black text-gray-900 tracking-tight">
                    {title}
                  </h3>
                  <p className="text-gray-500 text-sm md:text-base leading-relaxed font-bold px-2">
                    {desc}
                  </p>
                </div>

                {/* Action Button */}
                <button
                  onClick={handleProceed}
                  className="w-full py-4 mt-4 rounded-[1.5rem] bg-gradient-to-r from-[#0059A3] to-[#1B4FD8] text-white font-black text-lg hover:to-[#0A2A6E] active:scale-[0.98] transition-all shadow-xl shadow-blue-900/20"
                >
                  {btnText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
