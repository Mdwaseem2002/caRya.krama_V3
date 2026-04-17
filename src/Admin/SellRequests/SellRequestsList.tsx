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
import { useNotification } from "@/context/NotificationContext";
import { saveCarToStorage } from "../Upload/CarStorage";

export default function SellRequestsList() {
  const { showNotification } = useNotification();
  const [requests, setRequests] = useState<SellRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<SellRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getAllSellRequests()
      .then(setRequests)
      .catch(console.error)
      .finally(() => setIsLoading(false));
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
      showNotification(`Failed to update status: ${err?.message || 'Unknown error'}`, "error");
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

      // 3. Trigger User Notification (Lookup by email)
      if (typeof window !== "undefined") {
        const usersStr = localStorage.getItem('caRyaUsers');
        const users = usersStr ? JSON.parse(usersStr) : [];
        const targetUser = users.find((u: any) => u.email?.toLowerCase() === request.owner.email?.toLowerCase());

        if (targetUser) {
           import("@/Details/Notification/CustomerNotify").then(({ addNotification }) => {
             addNotification(targetUser.id, {
               title: "Sell Request Approved ✅",
               message: `Your listing for ${request.car.brand} ${request.car.model} has been approved and published.`,
               type: "system",
               cta: { label: "View Marketplace", href: "/BuyCar" }
             });
           });
        }
      }

      showNotification("Listing approved and published to marketplace!", "success");
    } catch (err: any) {
      showNotification(`Failed to approve listing: ${err?.message || 'Unknown error'}`, "error");
    }
  };


  const handleDelete = async (id: string) => {
    if (!confirm("Delete this request permanently?")) return;
    try {
      await deleteSellRequest(id);
      const updated = await getAllSellRequests();
      setRequests(updated);
      showNotification("Request deleted successfully", "success");
      if (selectedRequest?.id === id) setSelectedRequest(null);
    } catch (err: any) {
      showNotification(`Failed to delete: ${err?.message || 'Unknown error'}`, "error");
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
            <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Incoming Requests</h3>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{requests.length} Requests Total</span>
          </div>

          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-full p-5 rounded-[2rem] border group flex items-center justify-between bg-white border-gray-200 animate-pulse">
                    <div className="flex items-center gap-4 w-full">
                      <div className="w-12 h-12 rounded-2xl bg-gray-200 shrink-0" />
                      <div className="space-y-3 w-full max-w-[200px]">
                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                        <div className="h-2 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="w-16 h-5 rounded-full bg-gray-200 shrink-0" />
                  </div>
                ))}
              </>
            ) : requests.length === 0 ? (
              <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-[2rem] bg-gray-50">
                <Clock className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400 text-xs font-black uppercase tracking-widest leading-relaxed">No pending requests <br/>at the moment.</p>
              </div>
            ) : (
              requests.map((req) => (
                <button
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className={`w-full p-5 rounded-[2rem] text-left transition-all duration-300 border group flex items-center justify-between ${
                    selectedRequest?.id === req.id 
                      ? 'bg-blue-600 border-blue-400 shadow-xl shadow-blue-600/20' 
                      : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl overflow-hidden ${selectedRequest?.id === req.id ? 'bg-white/20 border border-white/20' : 'bg-gray-100 border border-gray-200'} flex items-center justify-center`}>
                      {req.car.images[0] ? (
                        <img src={req.car.images[0]} className="w-full h-full object-cover" />
                      ) : (
                        <Car className={`w-5 h-5 ${selectedRequest?.id === req.id ? 'text-white/50' : 'text-gray-300'}`} />
                      )}
                    </div>
                    <div>
                      <div className={`text-sm font-black tracking-tight ${selectedRequest?.id === req.id ? 'text-white' : 'text-gray-800'}`}>
                        {req.car.brand} {req.car.model}
                      </div>
                      <div className={`text-[9px] font-black uppercase tracking-widest mt-1 ${selectedRequest?.id === req.id ? 'text-white/70' : 'text-gray-400'}`}>
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
                className="bg-white border border-gray-200 rounded-[3rem] overflow-hidden sticky top-0 shadow-lg"
              >
                {/* Header Image */}
                <div className="relative h-48 bg-gray-100">
                   {selectedRequest.car.images[0] ? (
                     <img src={selectedRequest.car.images[0]} className="w-full h-full object-cover opacity-60" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center">
                        <Car className="w-16 h-16 text-gray-200" />
                     </div>
                   )}
                   <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
                   <div className="absolute bottom-6 left-8">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${statusColors[selectedRequest.status]}`}>
                          {selectedRequest.status}
                        </span>
                        <span className="text-[10px] font-black text-white/70 uppercase tracking-widest">
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
                         <h5 className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                           <User size={12} /> Contact Information
                         </h5>
                         <div className="space-y-2">
                            <div className="flex items-center gap-3 text-gray-600">
                               <Phone size={14} className="text-blue-500" />
                               <span className="text-xs font-bold leading-none">{selectedRequest.owner.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                               <Mail size={14} className="text-blue-500" />
                               <span className="text-xs font-bold leading-none truncate max-w-[150px]">{selectedRequest.owner.email}</span>
                            </div>
                         </div>
                      </div>
                      <div className="space-y-4">
                         <h5 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                           <MapPin size={12} /> Inspection Logistics
                         </h5>
                         <div className="space-y-2">
                            <div className="flex items-center gap-3 text-gray-600">
                               <Calendar size={14} className="text-emerald-500" />
                               <span className="text-xs font-bold leading-none">{selectedRequest.inspection.date} @ {selectedRequest.inspection.time}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                               <CheckCircle2 size={14} className="text-emerald-500" />
                               <span className="text-xs font-bold leading-none capitalize">{selectedRequest.inspection.location} Visit</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Address */}
                   <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                      <h6 className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-2">Detailed Address</h6>
                      <p className="text-xs text-gray-700 font-bold leading-relaxed">{selectedRequest.inspection.address}</p>
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
                        className="px-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 text-rose-500 hover:bg-rose-100 transition-all font-black text-xs uppercase tracking-widest"
                        title="Reject Selection"
                      >
                        <XCircle size={18} />
                      </button>

                      <button 
                        onClick={() => handleDelete(selectedRequest.id)}
                        className="px-6 py-4 rounded-2xl bg-gray-50 border border-gray-200 text-gray-400 hover:bg-gray-100 transition-all font-black"
                        title="Delete Permanently"
                      >
                        <Trash2 size={18} />
                      </button>
                   </div>
                </div>
              </motion.div>
            ) : (
              <div className="h-[500px] bg-gray-50 border border-dashed border-gray-200 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center">
                 <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <Eye size={32} className="text-blue-300" />
                 </div>
                 <h4 className="text-xl font-black text-gray-500 uppercase tracking-tight mb-2">Request Inspector</h4>
                 <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] max-w-xs leading-relaxed">Select a pending request from the queue to process the asset verification.</p>
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
