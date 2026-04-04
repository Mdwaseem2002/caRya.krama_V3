"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, MapPin, CheckCircle2 } from "lucide-react";
import { rescheduleRequest } from "@/Admin/SellRequests/SellStorage";

export default function RescheduleModal({ 
  isOpen, 
  onClose, 
  requestId 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  requestId: string;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState<"Home" | "Office">("Home");
  const [address, setAddress] = useState("");
  const [isDone, setIsDone] = useState(false);

  const handleReschedule = () => {
    rescheduleRequest(requestId, { date, time, location, address });
    setIsDone(true);
    setTimeout(() => {
      onClose();
      setIsDone(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6">
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           onClick={onClose}
           className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        <motion.div
           initial={{ scale: 0.9, opacity: 0, y: 30 }}
           animate={{ scale: 1, opacity: 1, y: 0 }}
           exit={{ scale: 0.9, opacity: 0, y: 30 }}
           className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
           onClick={(e) => e.stopPropagation()}
        >
          {isDone ? (
            <div className="p-16 text-center space-y-6">
               <motion.div
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto"
               >
                 <CheckCircle2 className="w-10 h-10 text-white" />
               </motion.div>
               <h3 className="text-2xl font-black text-gray-900">Successfully Rescheduled.</h3>
               <p className="text-slate-500 font-bold">Our team has been notified of the changes.</p>
            </div>
          ) : (
            <>
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Reschedule Inspection</h3>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Date</label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 font-bold text-sm outline-none focus:border-royal" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400">Time</label>
                    <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-slate-50 p-3 rounded-xl border border-slate-100 font-bold text-sm outline-none focus:border-royal" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-400">Location</label>
                  <div className="flex gap-3">
                    {["Home", "Office"].map((loc) => (
                      <button
                        key={loc}
                        onClick={() => setLocation(loc as any)}
                        className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest ${
                          location === loc ? 'bg-royal text-white shadow-xl shadow-blue-500/20' : 'bg-slate-50 text-slate-400 border border-slate-100'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400">Update Address</label>
                  <textarea 
                    value={address} 
                    onChange={e => setAddress(e.target.value)} 
                    placeholder="Enter your detailed address"
                    className="w-full bg-slate-50 p-4 rounded-xl border border-slate-100 font-bold text-sm outline-none focus:border-royal h-24 resize-none"
                  />
                </div>

                <button 
                  onClick={handleReschedule}
                  className="w-full py-4 bg-royal text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-blue-500/20"
                >
                  Save Changes
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
