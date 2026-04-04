"use client";

import React, { useState, useEffect } from "react";
import { 
  getAllSellRequests, 
  updateRequestStatus, 
  deleteSellRequest, 
  SellRequest 
} from "./SellStorage";
import { 
  CheckCircle2, XCircle, Clock, MapPin, 
  Phone, Mail, Trash2, ExternalLink, 
  ChevronRight, Calendar, User, Eye, 
  Sparkles, Check
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { saveCarToStorage } from "../Upload/CarStorage";

export default function SellRequestsList() {
  const [requests, setRequests] = useState<SellRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<SellRequest | null>(null);

  useEffect(() => {
    getAllSellRequests().then(setRequests).catch(console.error);
  }, []);


  const handleStatusChange = async (id: string, status: SellRequest["status"]) => {
    try {
      await updateRequestStatus(id, status);
      const updated = await getAllSellRequests();
      setRequests(updated);
      if (selectedRequest?.id === id) {
        setSelectedRequest({ ...selectedRequest, status });
      }
    } catch (err: any) {
      alert(`Failed to update status: ${err?.message || 'Unknown error'}`);
    }
  };


  const handleApprove = async (request: SellRequest) => {
    if (!confirm("Are you sure you want to approve this listing? It will be published to the marketplace.")) return;
    
    try {
      // 1. Move to CarStorage
      await saveCarToStorage({
        title: `${request.car.brand} ${request.car.model}`,
        brand: request.car.brand,
        model: request.car.model,
        year: request.car.year,
        status: "published",
        media: {
          coverImage: request.car.images[0] || "",
          images: request.car.images || []
        },
        pricing: {
          sellingPrice: request.car.expectedPrice,
          actualPrice: request.car.expectedPrice,
          savings: ""
        },
        specs: {
          fuelType: request.car.fuelType,
          transmission: request.car.transmission,
          mileage: request.car.mileage,
          ownership: request.car.ownership,
          color: "Not Specified",
          warranty: false
        },
        condition: {
          conditionLabel: "Inspected",
          score: "9.5",
          highlights: ["Professionally Inspected", "Verified Seller"],
          inspectionPoints: [
            { title: "Engine", value: "Verified" },
            { title: "Body", value: "Verified" }
          ],
          serviceHistory: []
        },
        sellerDetails: {
          name: request.owner.name,
          type: "Verified Owner",
          memberSince: new Date().getFullYear().toString()
        },
        location: {
          area: request.owner.city,
          city: request.owner.city
        },
        tags: ["Verified", "Just In"]
      });

      // 2. Update status
      await handleStatusChange(request.id, "approved");
      alert("Listing approved and published to marketplace!");
    } catch (err: any) {
      alert(`Failed to approve listing: ${err?.message || 'Unknown error'}`);
    }
  };


  const handleDelete = async (id: string) => {
    if (!confirm("Delete this request permanently?")) return;
    try {
      await deleteSellRequest(id);
      const updated = await getAllSellRequests();
      setRequests(updated);
      if (selectedRequest?.id === id) setSelectedRequest(null);
    } catch (err: any) {
      alert(`Failed to delete: ${err?.message || 'Unknown error'}`);
    }
  };


  const statusColors = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    approved: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    rejected: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    rescheduled: "bg-blue-500/10 text-blue-500 border-blue-500/20"
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* List View */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-4">
            <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Incoming Requests</h3>
            <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{requests.length} Requests Total</span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {requests.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-[2rem] bg-white/[0.02]">
                <Clock className="w-10 h-10 text-white/10 mx-auto mb-4" />
                <p className="text-white/30 text-xs font-black uppercase tracking-widest leading-relaxed">No pending requests <br/>at the moment.</p>
              </div>
            ) : (
              requests.map((req) => (
                <button
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className={`w-full p-5 rounded-[2rem] text-left transition-all duration-300 border group flex items-center justify-between ${
                    selectedRequest?.id === req.id 
                      ? 'bg-blue-600 border-blue-400 shadow-xl shadow-blue-600/20' 
                      : 'bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl overflow-hidden bg-white/5 border border-white/5 flex items-center justify-center`}>
                      {req.car.images[0] ? (
                        <img src={req.car.images[0]} className="w-full h-full object-cover" />
                      ) : (
                        <Car className="w-5 h-5 text-white/20" />
                      )}
                    </div>
                    <div>
                      <div className={`text-sm font-black tracking-tight ${selectedRequest?.id === req.id ? 'text-white' : 'text-white/90'}`}>
                        {req.car.brand} {req.car.model}
                      </div>
                      <div className={`text-[9px] font-black uppercase tracking-widest mt-1 ${selectedRequest?.id === req.id ? 'text-white/50' : 'text-white/20'}`}>
                        REF: {req.id} • {req.owner.name}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${statusColors[req.status]}`}>
                     {req.status === "rescheduled" ? <Clock className="w-2 h-2 inline mr-1" /> : null}
                     {req.status}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Detail View */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {selectedRequest ? (
              <motion.div
                key={selectedRequest.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white/[0.01] border border-white/5 rounded-[3rem] overflow-hidden sticky top-0"
              >
                {/* Header Image */}
                <div className="relative h-48 bg-white/5">
                   {selectedRequest.car.images[0] ? (
                     <img src={selectedRequest.car.images[0]} className="w-full h-full object-cover opacity-60" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center">
                        <Car className="w-16 h-16 text-white/5" />
                     </div>
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-[#050810] to-transparent" />
                   <div className="absolute bottom-6 left-8">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${statusColors[selectedRequest.status]}`}>
                          {selectedRequest.status}
                        </span>
                        <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">
                          Requested {new Date(selectedRequest.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-3xl font-black text-white tracking-tighter">
                        {selectedRequest.car.brand} {selectedRequest.car.model}
                      </h4>
                   </div>
                </div>

                <div className="p-8 space-y-10">
                   {/* Owner Info SECTION */}
                   <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                         <h5 className="text-[10px] font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                           <User size={12} /> Contact Information
                         </h5>
                         <div className="space-y-2">
                            <div className="flex items-center gap-3 text-white/60">
                               <Phone size={14} className="text-blue-500" />
                               <span className="text-xs font-bold leading-none">{selectedRequest.owner.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/60">
                               <Mail size={14} className="text-blue-500" />
                               <span className="text-xs font-bold leading-none truncate max-w-[150px]">{selectedRequest.owner.email}</span>
                            </div>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                           <MapPin size={12} /> Inspection Logistics
                         </h5>
                         <div className="space-y-2">
                            <div className="flex items-center gap-3 text-white/60">
                               <Calendar size={14} className="text-emerald-500" />
                               <span className="text-xs font-bold leading-none">{selectedRequest.inspection.date} @ {selectedRequest.inspection.time}</span>
                            </div>
                            <div className="flex items-center gap-3 text-white/60">
                               <CheckCircle2 size={14} className="text-emerald-500" />
                               <span className="text-xs font-bold leading-none capitalize">{selectedRequest.inspection.location} Visit</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Address */}
                   <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                      <h6 className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-2">Detailed Address</h6>
                      <p className="text-xs text-white/80 font-bold leading-relaxed">{selectedRequest.inspection.address}</p>
                   </div>

                   {/* Quick Actions */}
                   <div className="flex items-center gap-3">
                      {selectedRequest.status !== "approved" && (
                        <button 
                          onClick={() => handleApprove(selectedRequest)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/10 flex items-center justify-center gap-2"
                        >
                          <Sparkles size={16} /> Approve Listing
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleStatusChange(selectedRequest.id, "rejected")}
                        className="px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-rose-500 hover:bg-rose-500/10 transition-all font-black text-xs uppercase tracking-widest"
                        title="Reject Selection"
                      >
                        <XCircle size={18} />
                      </button>

                      <button 
                        onClick={() => handleDelete(selectedRequest.id)}
                        className="px-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-white/40 hover:bg-white/10 transition-all font-black"
                        title="Delete Permanently"
                      >
                        <Trash2 size={18} />
                      </button>
                   </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-[500px] bg-white/[0.01] border border-dashed border-white/10 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center">
                 <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mb-6">
                    <Eye size={32} className="text-white/10" />
                 </div>
                 <h4 className="text-xl font-black text-white/40 uppercase tracking-tight mb-2">Request Inspector</h4>
                 <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em] max-w-xs leading-relaxed">Select a pending request from the queue to process the asset verification.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

const Car = ({ className, size = 24, strokeWidth = 2 }: { className?: string; size?: number; strokeWidth?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v7h2"/>
    <circle cx="7" cy="17" r="2"/>
    <path d="M9 17h6"/>
    <circle cx="17" cy="17" r="2"/>
  </svg>
);
