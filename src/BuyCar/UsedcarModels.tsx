"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getPublishedStoredCars, StoredCar } from "@/Admin/Upload/CarStorage";
import { CheckCircle2, Navigation, Fuel, Calendar, MapPin, Heart, ChevronRight, Lock, ShieldCheck, SlidersHorizontal, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/context/WishlistContext";

export default function UsedcarModels() {
  const [allCars, setAllCars] = useState<StoredCar[]>([]);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Filter & Sort States
  const [activeFilter, setActiveFilter] = useState("All Cars");
  const [activeSort, setActiveSort] = useState("Price: Low to High");
  const [activeFuel, setActiveFuel] = useState("All Fuel Types");
  const [showFilters, setShowFilters] = useState(false);

  const filterOptions = ["All Cars", "New Arrivals", "Featured"];
  const sortOptions = ["Price: Low to High", "Price: High to Low", "Inspection Score", "Year: Newest"];
  const fuelOptions = ["All Fuel Types", "Petrol", "Diesel", "Electric"];

  useEffect(() => {
    getPublishedStoredCars()
      .then(data => { setAllCars(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Filtering Logic
  const filteredCars = allCars.filter((car) => {
    if (!car) return false;
    
    const byFilter =
      activeFilter === "All Cars" ? true :
        (car.tags || []).includes(activeFilter === "New Arrivals" ? "New Arrival" : "Featured");
    
    const byFuel = activeFuel === "All Fuel Types" ? true : car.specs?.fuelType === activeFuel;
    
    return byFilter && byFuel;
  });

  // Sorting Logic
  const sortedCars = [...filteredCars].sort((a, b) => {
    const priceA = parseInt((a.pricing?.sellingPrice || "0").replace(/[^\d]/g, ""));
    const priceB = parseInt((b.pricing?.sellingPrice || "0").replace(/[^\d]/g, ""));
    
    if (activeSort === "Price: Low to High") return priceA - priceB;
    if (activeSort === "Price: High to Low") return priceB - priceA;
    if (activeSort === "Inspection Score") return (parseFloat(b.condition?.score || "0")) - (parseFloat(a.condition?.score || "0"));
    if (activeSort === "Year: Newest") return parseInt(b.year || "0") - parseInt(a.year || "0");
    return 0;
  });

  // ── SKELETON LOADER ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <section className="py-24 bg-[#f8fafc] relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="mb-8">
            <div className="h-8 w-64 bg-gray-200 rounded-xl animate-pulse mb-3" />
            <div className="h-4 w-80 bg-gray-100 rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-[2rem] border border-gray-100 bg-white shadow-sm overflow-hidden flex flex-col"
                style={{ animation: `pulse 1.5s ease-in-out ${i * 0.08}s infinite alternate` }}
              >
                {/* Image placeholder */}
                <div className="aspect-[4/3] w-full bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
                {/* Content placeholder */}
                <div className="p-5 flex flex-col gap-3">
                  <div className="h-5 w-3/4 bg-gray-200 rounded-lg animate-pulse" />
                  <div className="grid grid-cols-2 gap-2">
                    {[...Array(4)].map((_, j) => (
                      <div key={j} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <div className="h-6 w-24 bg-gray-200 rounded-lg animate-pulse" />
                    <div className="h-9 w-24 bg-gray-100 rounded-xl animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-[#f8fafc] relative overflow-hidden">
      {/* Background radial gradients to make glass pop */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-100/30 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-100/30 blur-[100px] rounded-full -z-10" />

      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        
        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-[#0f172a]">
              Browse <span style={{ color: "#0059A3" }}>Inspected</span> Used Cars
            </h2>
            <p className="mt-1 text-[13px] sm:text-sm text-[#475569]">
              Every listing below has passed our rigorous inspection. Nothing less.
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold border border-[#e2e8f0] transition-all hover:scale-105 shrink-0 bg-white shadow-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters & Sort
            <ChevronDown className={`w-4 h-4 opacity-50 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* ── FILTER / SORT BAR ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6 sm:mb-8"
            >
              <div className="flex flex-col gap-6 p-4 sm:p-6 rounded-[1.5rem] bg-white border border-[#e2e8f0] shadow-sm">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">View:</span>
                  <div className="flex flex-wrap gap-2">
                    {filterOptions.map((f) => (
                      <button
                        key={f}
                        onClick={() => setActiveFilter(f)}
                        className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all border ${
                          activeFilter === f ? "bg-[#0059A3] text-white border-[#0059A3]" : "bg-gray-50 text-[#64748b] border-transparent hover:border-gray-200"
                        }`}
                      >{f}</button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">Fuel:</span>
                  <div className="flex flex-wrap gap-2">
                    {fuelOptions.map((f) => (
                      <button
                        key={f}
                        onClick={() => setActiveFuel(f)}
                        className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all border ${
                          activeFuel === f ? "bg-[#0059A3] text-white border-[#0059A3]" : "bg-gray-50 text-[#64748b] border-transparent hover:border-gray-200"
                        }`}
                      >{f}</button>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8]">Sort:</span>
                  <div className="flex flex-wrap gap-2">
                    {sortOptions.map((s) => (
                      <button
                        key={s}
                        onClick={() => setActiveSort(s)}
                        className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all border ${
                          activeSort === s ? "bg-[#0059A3] text-white border-[#0059A3]" : "bg-gray-50 text-[#64748b] border-transparent hover:border-gray-200"
                        }`}
                      >{s}</button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── RESULTS COUNT ── */}
        <p className="text-sm font-medium mb-10 text-[#64748b]">
          Showing <strong className="text-[#0f172a]">{sortedCars.length}</strong> cars near Bangalore
        </p>

        {/* Dynamic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {sortedCars.map((car, index) => {
            const isSaved = isInWishlist(car.id as any);
            
            return (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.035, 0.28), ease: [0.16, 1, 0.3, 1] }}
                className="group glass-card-light rounded-[1.5rem] sm:rounded-[2rem] border border-white/40 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col cursor-pointer relative"
                onMouseEnter={() => setHoveredCard(car.id as any)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* IMAGE SECTION */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={car.media?.coverImage || "/logo/carYakrama.png"}
                      alt={car.title || "Car"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                      loading={index < 4 ? "eager" : "lazy"}
                      unoptimized={car.media?.coverImage?.startsWith("data:")}
                    />

                  {/* Top Left Badges - Hide on Hover */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 group-hover:opacity-0 transition-opacity duration-300">
                    {(car.tags || []).includes("New Arrival") && (
                      <div className="bg-[#0059A3] text-white text-[9px] sm:text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg shadow-lg">
                        New Arrival
                      </div>
                    )}
                    <div className="glass-frost glass-stroke px-3 py-1.5 rounded-lg flex items-center gap-2">
                      <ShieldCheck size={12} className="text-[#34d399]" />
                      <span className="text-[10px] font-black text-white tracking-tight">Score: {car.condition?.score || "—"}</span>
                    </div>
                  </div>

                  {/* Top Right Wishlist - High Z-Index */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 z-50 items-end">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const normalizedCar = {
                          id: car.id as any,
                          name: car.title,
                          year: car.year,
                          image: car.media?.coverImage,
                          odometer: `${car.specs?.mileage || "0"} km`,
                          price: car.pricing?.sellingPrice,
                          condition: (car.condition?.score || "0") + "/10",
                          inspectionScore: (car.condition?.score || "0") + "/10",
                        };
                        toggleWishlist(normalizedCar as any);
                      }}
                      className="bg-white rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shadow-xl hover:scale-110 transition-all border border-gray-100 active:scale-95 group/heart pointer-events-auto"
                      title="Add to Wishlist"
                    >
                      <Heart 
                        size={18} 
                        className={`transition-colors duration-300 ${isSaved ? "fill-[#ef4444] text-[#ef4444]" : "text-[#94a3b8] group-hover/heart:text-[#ef4444]"}`} 
                      />
                    </button>
                  </div>

                  {/* Hover Overlay - Black Theme */}
                  <AnimatePresence>
                    {hoveredCard === car.id && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-black/70 backdrop-blur-md p-6 flex flex-col justify-center z-40 hidden md:flex transition-all duration-500"
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <CheckCircle2 size={20} className="text-[#10B981]" />
                          <h4 className="text-lg font-black text-white uppercase tracking-tight">Inspection</h4>
                        </div>
                        <div className="space-y-2.5">
                          {(car.condition?.inspectionPoints || []).slice(0, 3).map((point, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <CheckCircle2 size={14} className="text-[#10B981]" />
                              <span className="text-white/80 text-[10px] font-bold uppercase">{point.title}:</span>
                              <span className="text-white text-[10px] font-black uppercase">{point.value}</span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-6 pt-3 border-t border-white/10 text-center">
                          <span className="text-[9px] font-black uppercase tracking-widest text-white/50">Full Report Available</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* CONTENT SECTION */}
                <div className="p-4 sm:p-6 flex flex-col flex-1">
                  <div className="mb-5">
                    <h3 className="text-lg sm:text-xl font-black text-[#0f172a] uppercase tracking-tight leading-tight group-hover:text-[#0059A3] transition-colors truncate">
                      {car.title}
                    </h3>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    {[
                      { icon: Fuel, label: "ENERGY", value: car.specs?.fuelType },
                      { icon: Navigation, label: "DRIVE", value: car.specs?.transmission },
                      { icon: CheckCircle2, label: "OWNER", value: car.specs?.ownership },
                      { icon: Calendar, label: "MILEAGE", value: `${car.specs?.mileage || "0"} KMS` },
                    ].map((spec, i) => (
                      <div key={i} className="bg-white/30 backdrop-blur-sm border border-white/20 rounded-2xl p-3 flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <spec.icon size={10} className="text-[#0059A3]/60" />
                          <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{spec.label}</span>
                        </div>
                        <span className="text-[10px] font-black text-[#0f172a] uppercase truncate">{spec.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* ADDITIONAL INFO (Location & Quality) */}
                  <div className="flex items-center justify-between mb-6 px-1">
                     <div className="flex items-center gap-2">
                        <MapPin size={12} className="text-[#0059A3]" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{car.location?.area || "N/A"}, {car.location?.city || ""}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${car.specs?.warranty ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        <span className="text-[9px] font-black text-slate-400 uppercase">{car.specs?.warranty ? 'Warranty' : 'No Warranty'}</span>
                     </div>
                  </div>

                  <div className="mt-auto pt-5 border-t border-[#f1f5f9] flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <span className="block text-[8px] font-black text-[#94a3b8] uppercase tracking-widest mb-1">Selling Price</span>
                      <p className="text-lg sm:text-xl font-black text-[#0f172a] tracking-tighter leading-none whitespace-nowrap">{car.pricing?.sellingPrice || "Price TBD"}</p>
                    </div>
                    <button 
                      onClick={() => window.location.href = `/car/${car.id}`}
                      className="flex items-center gap-2 bg-royal/10 text-royal px-4 py-2.5 rounded-xl font-black uppercase text-[9px] tracking-widest hover:bg-royal hover:text-white transition-all shadow-sm active:scale-95 shrink-0 backdrop-blur-md border border-royal/10"
                    >
                      View Car
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
