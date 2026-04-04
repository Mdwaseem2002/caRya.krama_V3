"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShieldCheck, ArrowRight, CheckCircle2, SlidersHorizontal, ChevronDown, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useWishlist } from "@/context/WishlistContext";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export const cars = [
  // First 3
  {
    id: 1,
    name: "Infiniti QX60 Autograph",
    year: "2022",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop",
    price: "₹45.99 Lakh",
    odometer: "62,000 kms",
    condition: "Excellent",
    inspectionScore: "9.8/10",
    reportPrice: "₹299",
    inspectionSummary: [
      "Engine health: Perfect",
      "Transmission: Smooth",
      "Exterior: Scratch-free",
      "Interior: Like new"
    ],
    isNewArrival: true,
    ownership: "1st Owner",
  },
  {
    id: 2,
    name: "Jeep Wrangler Rubicon",
    year: "2024",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop",
    price: "₹65.50 Lakh",
    odometer: "14,000 kms",
    condition: "Like New",
    inspectionScore: "9.9/10",
    reportPrice: "₹299",
    inspectionSummary: [
      "4x4 System tested: 100%",
      "Suspension: Perfect",
      "Underbody: Rust-free",
      "Tires: 90% tread left"
    ],
    isNewArrival: true,
    ownership: "1st Owner",
  },
  {
    id: 3,
    name: "Audi Q3 Sportback",
    year: "2023",
    image: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=800&auto=format&fit=crop",
    price: "₹42.25 Lakh",
    odometer: "28,000 kms",
    condition: "Very Good",
    inspectionScore: "9.5/10",
    reportPrice: "₹199",
    inspectionSummary: [
      "No accident history",
      "Full service records",
      "Brakes: Recently replaced",
      "Electronics: All functional"
    ],
    isNewArrival: false,
    ownership: "1st Owner",
  },
  // Next 3
  {
    id: 4,
    name: "Mercedes-Benz GLE 450",
    year: "2023",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800&auto=format&fit=crop",
    price: "₹95.00 Lakh",
    odometer: "18,000 kms",
    condition: "Pristine",
    inspectionScore: "9.9/10",
    reportPrice: "₹499",
    inspectionSummary: [
      "Air suspension: Tested ok",
      "MBUX System: Updated",
      "Paint: Original ceramic",
      "Upholstery: Flawless"
    ],
    isNewArrival: false,
    ownership: "1st Owner",
  },
  {
    id: 5,
    name: "BMW X5 xDrive40i",
    year: "2022",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop",
    price: "₹82.50 Lakh",
    odometer: "32,000 kms",
    condition: "Excellent",
    inspectionScore: "9.6/10",
    reportPrice: "₹399",
    inspectionSummary: [
      "xDrive system verified",
      "Engine oil recently changed",
      "No warning lights",
      "Laser lights functional"
    ],
    isNewArrival: false,
    ownership: "1st Owner",
  },
  {
    id: 6,
    name: "Toyota Land Cruiser LC300",
    year: "2024",
    image: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=800&auto=format&fit=crop",
    price: "₹2.10 Crore",
    odometer: "5,000 kms",
    condition: "Brand New",
    inspectionScore: "10/10",
    reportPrice: "₹299",
    inspectionSummary: [
      "Factory fresh condition",
      "Still under OEM warranty",
      "Zero paint work",
      "Immaculate interior"
    ],
    isNewArrival: true,
    ownership: "1st Owner",
  }
];

export default function Card() {
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All Cars");

  return (
    <section className="min-h-screen py-12 sm:py-20 px-4 md:px-8 max-w-7xl mx-auto overflow-hidden" style={{ background: "var(--background)" }}>
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div className="text-left max-w-3xl">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold mb-2 leading-tight tracking-tight items-baseline" style={{ color: "var(--foreground)" }}>
            Only Inspected Cars. <br className="hidden md:block"/>
            <span style={{ color: "#0059A3" }}>Every Detail Checked.</span>
          </h2>
          <p className="text-sm sm:text-lg md:text-xl font-medium" style={{ color: "var(--muted)" }}>
            Handpicked for Enthusiasts Who Demand the Best.
          </p>
        </div>
        
        {/* Filters Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-[18px] text-sm font-bold border transition-all hover:scale-105 shrink-0 self-start md:self-auto mt-2 md:mt-0"
          style={{ borderColor: "var(--border)", color: "var(--foreground)", background: "var(--card-bg)" }}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters & Sort
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>
      </div>

      {showFilters && (
        <motion.div
           initial={{ opacity: 0, y: -10 }}
           animate={{ opacity: 1, y: 0 }}
           className="flex flex-wrap gap-3 justify-center md:justify-start mb-12"
        >
          {["All Cars", "Price: Low to High", "Highest Rated", "SUVs", "Sedans"].map((filter, i) => (
            <button
              key={i}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-sm font-semibold border transition-all ${
                activeFilter === filter 
                  ? "border-[#0059A3] bg-[#0059A3] text-white shadow-md shadow-[#0059A3]/20" 
                  : "hover:border-[#0059A3] hover:text-[#0059A3]"
              }`}
              style={activeFilter === filter ? {} : { borderColor: "var(--border)", color: "var(--foreground)", background: "var(--card-bg)" }}
            >
              {filter}
            </button>
          ))}
        </motion.div>
      )}

      {/* ── GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cars.map((car, index) => (
          <CarCard key={car.id} car={car} index={index} />
        ))}
      </div>
    </section>
  );
}

// Extracted Component for Individual Car Cards
function CarCard({ car, index }: { car: typeof cars[0], index: number }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isSaved = isInWishlist(car.id);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!cardRef.current) return;

    const row = Math.floor(index / 3);
    const xOffset = row % 2 === 0 ? -100 : 100;

    gsap.fromTo(cardRef.current, 
      { 
        opacity: 0, 
        x: xOffset 
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          end: "bottom 20%",
          toggleActions: "play reverse play reverse",
          // markers: true, // Uncomment for debugging
        }
      }
    );
  }, { scope: cardRef });

  return (
    <div
      ref={cardRef}
      className="car-card group flex flex-col h-full"
    >
      {/* ── IMAGE SECTION ── */}
      <div className="relative aspect-[16/11] w-full overflow-hidden bg-gray-100">
        <Image
          src={car.image}
          alt={car.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out z-0"
        />
        
        {/* Badges container */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10 pointer-events-none">
          {car.isNewArrival && (
            <div className="glass-frost glass-stroke text-white text-[9px] font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-full shadow-lg w-fit">
              New Arrival
            </div>
          )}
          <div className="glass-frost glass-stroke text-white text-[10px] font-bold px-2.5 py-1.5 rounded-full flex items-center gap-1.5 w-fit">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            Score: {car.inspectionScore}
          </div>
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(car);
          }}
          className="glass-frost glass-stroke absolute top-4 right-4 p-2.5 rounded-full hover:scale-110 transition-transform z-20"
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              isSaved ? "fill-rose-400 text-rose-400" : "text-white"
            }`} 
          />
        </button>

        {/* ── HOVER: INSPECTION PREVIEW ── */}
        <div className="glass-dark glass-stroke absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center p-8 z-10">
          <h4 className="text-white font-bold mb-5 flex items-center gap-2 text-lg">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Inspection Summary
          </h4>
          <ul className="space-y-3">
            {car.inspectionSummary.map((point, i) => (
              <li key={i} className="text-gray-100 text-sm flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center gap-2 text-[11px] font-bold text-white uppercase tracking-widest border-t border-white/20 pt-4">
            <Lock className="w-3.5 h-3.5" />
            Full report available for {car.reportPrice || "₹299"}
          </div>
        </div>
      </div>
      
      {/* ── CONTENT SECTION ── */}
      <div className="p-5 flex flex-col flex-grow relative z-10 glass-light">
        
        <div className="flex justify-between items-start mb-2 gap-3">
          <h3 className="font-extrabold text-lg sm:text-xl leading-tight line-clamp-1 group-hover:text-[#0059A3] transition-colors" style={{ color: "var(--foreground)" }}>
            {car.name}
          </h3>
          <span className="font-bold text-[11px] sm:text-sm shrink-0 px-2 py-0.5 rounded-lg" style={{ background: "color-mix(in srgb, var(--foreground) 8%, transparent)", color: "var(--foreground)" }}>
            {car.year}
          </span>
        </div>

        {/* Specs Row */}
        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold mb-5 uppercase tracking-wider" style={{ color: "var(--muted)" }}>
          <span>{car.odometer}</span>
          <span className="w-1 h-1 rounded-full bg-gray-300"></span>
          <span>{car.condition}</span>
        </div>
        
        {/* Bottom Row / CTA */}
        <div className="mt-auto flex items-end justify-between pt-4" style={{ borderTop: "1px solid var(--border)" }}>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
               <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">{car.ownership}</span>
               <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--muted)" }}>Cash Price</p>
            </div>
            <p className="font-black text-xl sm:text-2xl leading-none" style={{ color: "var(--foreground)" }}>{car.price}</p>
          </div>
          
          {/* Quick CTA */}
          <Link
            href={`/car/${car.id}`}
            className="flex items-center gap-2 text-sm font-bold transition-colors group/link pb-1"
            style={{ color: "#0059A3" }}
          >
            View Details
            <span className="w-8 h-8 rounded-full flex items-center justify-center transition-all group-hover/link:translate-x-1" style={{ background: "color-mix(in srgb, #0059A3 10%, transparent)" }}>
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
