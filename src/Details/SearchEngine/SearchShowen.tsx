"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Gauge, 
  ShieldCheck, 
  Fuel, 
  Settings2, 
  ArrowRight, 
  SearchX, 
  Sparkles,
  ChevronRight,
  Zap,
  User
} from "lucide-react";
import { motion } from "framer-motion";
import { StoredCar } from "@/Admin/Upload/CarStorage";

interface SearchShowenProps {
  filteredCars: StoredCar[];
  query: string;
}

export default function SearchShowen({ filteredCars, query }: SearchShowenProps) {
  if (filteredCars.length === 0) {
    return (
      <div className="w-full py-24 text-center bg-white rounded-[3rem] border border-slate-100 mx-auto max-w-4xl px-8 mt-8 shadow-xl">
        <SearchX className="w-16 h-16 text-blue-500/30 mx-auto mb-6" />
        <h3 className="text-2xl font-black text-[#0f172a] mb-3 tracking-tight">No Matching Units Found</h3>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-widest max-w-md mx-auto leading-loose">
          Our specialized sourcing protocol is standing by. Try adjusting your search query or filters.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full mt-12 pb-24">
      {/* ── RESULTS HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8 px-2 text-center md:text-left">
        <div>
          <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-3 flex items-center justify-center md:justify-start gap-2">
            <Sparkles size={14} className="animate-pulse" /> Results Synchronized
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-[#0f172a]">
            Available <span className="text-royal">Inventory.</span>
          </h2>
        </div>
        <div className="text-slate-400 font-black uppercase tracking-widest text-[11px] mb-2 leading-loose">
           Showing {filteredCars.length} Verified Units <br className="md:hidden" /> Ready for Deployment
        </div>
      </div>

      {/* ── RESULTS GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredCars.map((car, index) => (
          <motion.div
            key={car.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.6 }}
            className="group bg-[#F4F7FF] rounded-[3rem] overflow-hidden border border-white/50 hover:shadow-2xl hover:shadow-blue-200/40 transition-all duration-700 relative flex flex-col h-full shadow-lg"
          >
            {/* Image Section */}
            <div className="relative aspect-[16/10] overflow-hidden m-4 rounded-[2.5rem]">
               <Image 
                 src={car.media.coverImage || "/placeholder-car.jpg"} 
                 alt={car.title} 
                 fill 
                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                 className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
               />
               <div className="absolute top-6 left-6">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-white/20">
                    {car.year} Model
                  </span>
               </div>
            </div>

            {/* Content Section */}
            <div className="px-8 pb-8 flex flex-col flex-grow">
               <div className="mb-8">
                  <div className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-2">{car.brand}</div>
                  <h3 className="text-2xl font-black text-[#0f172a] tracking-tighter uppercase leading-tight group-hover:text-blue-600 transition-colors">
                    {car.title}
                  </h3>
               </div>

               {/* Specs Grid (2x2) */}
               <div className="grid grid-cols-2 gap-4 mb-10">
                  {[ 
                    { icon: Fuel, label: "ENERGY", value: car.specs.fuelType, color: "#10b981" },
                    { icon: Settings2, label: "DRIVE", value: car.specs.transmission, color: "#0ea5e9" },
                    { icon: ShieldCheck, label: "OWNER", value: car.specs.ownership || "1ST OWNER", color: "#6366f1" },
                    { icon: Zap, label: "KMS", value: `${car.specs.mileage} KMS`, color: "#f59e0b" },
                  ].map((s, i) => (
                    <div key={i} className="bg-white/80 border border-white p-4 rounded-3xl flex flex-col gap-2 shadow-sm">
                       <div className="flex items-center justify-between">
                          <s.icon size={16} style={{ color: s.color }} strokeWidth={2.5} />
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
                       </div>
                       <div className="text-[12px] font-black text-[#0f172a] uppercase tracking-tighter truncate">{s.value}</div>
                    </div>
                  ))}
               </div>

                {/* Price & CTA */}
                <div className="mt-auto pt-6 border-t border-slate-200/50 flex items-center justify-between gap-4">
                  <div className="flex flex-col min-w-0">
                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Selling Price</span>
                     <span className="text-2xl md:text-3xl font-black text-[#0f172a] tracking-tighter truncate">{car.pricing.sellingPrice}</span>
                  </div>
                  <Link 
                    href={`/car/${car.id}`}
                    className="flex items-center gap-2 bg-[#EFFFFA] text-[#00D094] px-4 md:px-8 py-3 md:py-4 rounded-[1.2rem] md:rounded-[1.5rem] font-extrabold uppercase text-[10px] md:text-[11px] tracking-widest hover:bg-[#00D094] hover:text-white transition-all border border-[#00D094]/10 shadow-sm group/btn whitespace-nowrap shrink-0"
                  >
                    View Car
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
