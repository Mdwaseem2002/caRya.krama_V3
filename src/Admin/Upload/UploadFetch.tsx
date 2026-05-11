"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShieldCheck, ArrowRight, CheckCircle2, Fuel, Settings2, MapPin, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useWishlist } from "@/context/WishlistContext";
// ✅ Same file, same key — guaranteed data match with Uploadcar.tsx
import { getPublishedStoredCars, StoredCar } from "./CarStorage";

// ─────────────────────────────────────────────────────────────────────────────
// FLOW:
//   Admin → Uploadcar.tsx → saveCarToStorage() → localStorage["carya_cars_db"]
//   Customer → UploadFetch.tsx → getPublishedStoredCars() → same key → renders
// ─────────────────────────────────────────────────────────────────────────────

export default function UploadFetch() {
  const [cars, setCars] = useState<StoredCar[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // ✅ useEffect = client-side only → MongoDB call works here, not during SSR
    getPublishedStoredCars().then(setCars).catch(console.error);
  }, []);

  // Don't render the section during SSR or if admin hasn't published any car yet
  if (!mounted || cars.length === 0) return null;

  return (
    <section className="relative bg-slate-50 text-gray-900 pt-8 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Header */}
        <div className="mb-12">
          <div className="inline-block px-4 py-1 rounded-full bg-emerald-100 border border-emerald-200 mb-6">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-600">Fresh Inventory</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 leading-tight text-gray-900">
            Just <span className="text-emerald-600">Arrived</span>.
          </h2>
          <p className="text-gray-500 text-sm md:text-base font-medium max-w-xl">
            Recently uploaded verified vehicles straight from our inspection centers.
          </p>
        </div>

        {/* Car Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car, index) => (
            <CarCard key={car.id} car={car} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Car Card
// ─────────────────────────────────────────────────────────────────────────────
function CarCard({ car, index }: { car: StoredCar; index: number }) {
  const { toggleWishlist, isInWishlist } = useWishlist();

  // Convert "CK-1234567" → numeric for wishlist compatibility
  const isSaved = isInWishlist(car.id);

  const fallbackImage = "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800";

  return (
    <div className="group flex flex-col h-full bg-white border border-gray-200 rounded-[2.5rem] overflow-hidden hover:bg-gray-50 transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-100/60 shadow-sm">

      {/* IMAGE */}
      <div className="relative aspect-[16/11] w-full overflow-hidden">
        <Image
          src={car.media?.coverImage || fallbackImage}
          alt={car.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
          unoptimized={car.media?.coverImage?.startsWith("data:")} // allow base64
        />

        {/* Badges - Hiding on hover to clear space for Audit Summary */}
        <div className="absolute top-6 left-6 right-6 flex items-start justify-between pointer-events-none z-50">
          <div className="flex flex-col gap-2 group-hover:opacity-0 transition-opacity duration-300">
            <span className="bg-emerald-600/90 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-emerald-400/30 shadow-xl">
              Newly Uploaded
            </span>
            <span className="bg-white/80 backdrop-blur-md text-gray-800 text-[9px] font-bold px-3 py-1.5 rounded-full border border-gray-200/60 flex items-center gap-2 shadow-xl pointer-events-auto">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-gray-400 uppercase tracking-widest text-[8px] font-black">Score</span>
              {car.condition?.score || "—"}
            </span>
          </div>

          {/* Wishlist Button - Interactive & ALWAYS VISIBLE */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist({ 
                id: car.id, 
                name: car.title,
                year: car.year,
                image: car.media?.coverImage,
                odometer: `${(car.specs?.mileage || "").replace(/km/gi, "").trim()} KM`,
                price: car.pricing?.sellingPrice,
                inspectionScore: `${car.condition?.score}/10`,
                make: car.brand 
              } as any);
            }}
            className="pointer-events-auto w-10 h-10 rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200/60 flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl group/wish z-50"
            title="Add to Wishlist"
          >
            <Heart size={18} className={`transition-colors ${isSaved ? "fill-rose-500 text-rose-500" : "text-gray-400 group-hover/wish:text-rose-500"}`} />
          </button>
        </div>

        {/* Hover Inspection Preview - Dark Theme */}
        <div
          className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col justify-center p-10 z-40 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none group-hover:pointer-events-auto"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shadow-lg">
              <ShieldCheck className="text-emerald-400" size={20} />
            </div>
            <h4 className="text-lg font-black tracking-tight text-white uppercase tracking-widest">Audit Summary</h4>
          </div>
          <ul className="space-y-4">
            {(car.condition?.highlights || []).slice(0, 4).map((point, i) => (
              <li key={i} className="text-white text-[13px] font-bold flex items-start gap-3 drop-shadow-sm">
                <CheckCircle2 size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CARD BODY */}
      <div className="p-8 flex flex-col flex-grow">
        <div className="mb-6">
          <h3 className="text-xl font-black tracking-tighter leading-tight group-hover:text-emerald-600 transition-colors uppercase text-gray-900">
            {car.title}
          </h3>
        </div>

        {/* Specs - USER SPECIFIC: Fuel, Transmission, Kilometers, Ownership */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            { icon: Fuel,      label: "ENERGY", value: car.specs?.fuelType },
            { icon: Settings2, label: "DRIVE",  value: car.specs?.transmission },
            { icon: CheckCircle2, label: "OWNER", value: car.specs?.ownership },
            { icon: Zap,       label: "KMS",    value: `${car.specs?.mileage} KMS` },
          ].map((spec, i) => (
            <div key={i} className="bg-gray-50 border border-gray-200 p-3.5 rounded-2xl hover:bg-emerald-50 hover:border-emerald-200 transition-colors overflow-hidden">
              <div className="flex items-center gap-1.5 mb-1">
                 <spec.icon size={11} className="text-emerald-400" />
                 <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{spec.label}</span>
              </div>
              <div className="text-[11px] font-black uppercase truncate text-gray-900">{spec.value || "—"}</div>
            </div>
          ))}
        </div>

        {/* Pricing & CTA */}
        <div className="mt-auto pt-6 border-t border-gray-100 flex items-end justify-between gap-2">
          <div>
            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Selling Price</div>
            <div className="text-2xl font-black tracking-tighter text-gray-900 leading-none">{car.pricing?.sellingPrice}</div>
          </div>
          
          <Link
            href={`/car/${car.id}`}
            className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-200 px-6 py-3.5 rounded-2xl transition-all group/btn shadow-sm active:scale-95"
          >
            <span className="text-[10px] font-black uppercase tracking-widest">View Car</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

    </div>
  );
}
