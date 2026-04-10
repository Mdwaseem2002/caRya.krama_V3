"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  Lock,
  Fuel,
  Settings2,
  MapPin,
  Calendar,
  Zap,
  Gauge,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useWishlist } from "@/context/WishlistContext";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ── Types ──────────────────────────────────────────────────────────────────────
interface UsedCarData {
  id: number;
  name: string;
  make: string;
  model: string;
  year: string;
  kms: string;
  fuel: string;
  transmission: string;
  price: string;
  originalPrice: string;
  savings: string;
  location: string;
  image: string;
  inspectionScore: string;
  condition: string;
  inspectionSummary: string[];
  isNewArrival: boolean;
  isFeatured: boolean;
  reportPrice: string;
  ownerType: string;
  warranty: boolean;
}

// ── Car Data ───────────────────────────────────────────────────────────────────
const usedCars: UsedCarData[] = [
  {
    id: 101,
    name: "2020 Honda City ZX CVT",
    make: "Honda", model: "City", year: "2020",
    kms: "38,500 kms", fuel: "Petrol", transmission: "Automatic",
    price: "₹9.75 Lakh", originalPrice: "₹10.20 Lakh", savings: "Save ₹45,000",
    location: "Koramangala, Bangalore",
    image: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800&auto=format&fit=crop",
    inspectionScore: "9.4/10", condition: "Excellent",
    inspectionSummary: ["Engine oil fresh, no leaks", "Accident-free history", "Interior like new", "All electronics functional"],
    isNewArrival: true, isFeatured: false, reportPrice: "₹299",
    ownerType: "1st Owner", warranty: true,
  },
  {
    id: 102,
    name: "2019 Hyundai Creta SX+ AT",
    make: "Hyundai", model: "Creta", year: "2019",
    kms: "52,000 kms", fuel: "Petrol", transmission: "Automatic",
    price: "₹13.50 Lakh", originalPrice: "₹14.00 Lakh", savings: "Save ₹50,000",
    location: "Indiranagar, Bangalore",
    image: "https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?q=80&w=800&auto=format&fit=crop",
    inspectionScore: "9.1/10", condition: "Very Good",
    inspectionSummary: ["Single owner, full service records", "Tires 80% tread left", "Sunroof functional", "Brakes recently serviced"],
    isNewArrival: false, isFeatured: true, reportPrice: "₹299",
    ownerType: "1st Owner", warranty: false,
  },
  {
    id: 103,
    name: "2021 Maruti Swift ZXI+",
    make: "Maruti", model: "Swift", year: "2021",
    kms: "22,400 kms", fuel: "Petrol", transmission: "Manual",
    price: "₹6.85 Lakh", originalPrice: "₹7.10 Lakh", savings: "Save ₹25,000",
    location: "Whitefield, Bangalore",
    image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=800&auto=format&fit=crop",
    inspectionScore: "9.7/10", condition: "Like New",
    inspectionSummary: ["Zero paint work", "Original tyres intact", "Verified audio working", "AC cooling excellent"],
    isNewArrival: true, isFeatured: true, reportPrice: "₹199",
    ownerType: "1st Owner", warranty: true,
  },
  {
    id: 104,
    name: "2018 Toyota Fortuner 4x4 AT",
    make: "Toyota", model: "Fortuner", year: "2018",
    kms: "88,000 kms", fuel: "Diesel", transmission: "Automatic",
    price: "₹28.50 Lakh", originalPrice: "₹30.00 Lakh", savings: "Save ₹1.5 Lakh",
    location: "Hebbal, Bangalore",
    image: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=800&auto=format&fit=crop",
    inspectionScore: "8.8/10", condition: "Good",
    inspectionSummary: ["4x4 system verified", "Chassis underbody checked", "Minor exterior scratches noted", "All safety systems tested"],
    isNewArrival: false, isFeatured: false, reportPrice: "₹499",
    ownerType: "2nd Owner", warranty: false,
  },
  {
    id: 105,
    name: "2022 Tata Nexon EV Max",
    make: "Tata", model: "Nexon EV", year: "2022",
    kms: "18,700 kms", fuel: "Electric", transmission: "Automatic",
    price: "₹16.40 Lakh", originalPrice: "₹17.00 Lakh", savings: "Save ₹60,000",
    location: "HSR Layout, Bangalore",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=800&auto=format&fit=crop",
    inspectionScore: "9.6/10", condition: "Excellent",
    inspectionSummary: ["Battery health 97%", "Charging port A-OK", "Warranty still active", "Regenerative braking optimal"],
    isNewArrival: true, isFeatured: false, reportPrice: "₹399",
    ownerType: "1st Owner", warranty: true,
  },
  {
    id: 106,
    name: "2017 Volkswagen Polo GT TSI",
    make: "Volkswagen", model: "Polo GT", year: "2017",
    kms: "72,100 kms", fuel: "Petrol", transmission: "Automatic",
    price: "₹8.20 Lakh", originalPrice: "₹8.75 Lakh", savings: "Save ₹55,000",
    location: "JP Nagar, Bangalore",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=800&auto=format&fit=crop",
    inspectionScore: "8.9/10", condition: "Very Good",
    inspectionSummary: ["DSG gearbox tested OK", "Full service history available", "Original paint body", "New battery installed"],
    isNewArrival: false, isFeatured: true, reportPrice: "₹299",
    ownerType: "2nd Owner", warranty: false,
  },
  {
    id: 107,
    name: "2021 Kia Seltos GTX+ DCT",
    make: "Kia", model: "Seltos", year: "2021",
    kms: "31,200 kms", fuel: "Petrol", transmission: "Automatic",
    price: "₹15.75 Lakh", originalPrice: "₹16.50 Lakh", savings: "Save ₹75,000",
    location: "Koramangala, Bangalore",
    image: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=800&auto=format&fit=crop",
    inspectionScore: "9.3/10", condition: "Excellent",
    inspectionSummary: ["Turbo engine performance verified", "360-cam operational", "Ventilated seats functional", "New brake pads installed"],
    isNewArrival: true, isFeatured: true, reportPrice: "₹349",
    ownerType: "1st Owner", warranty: true,
  },
  {
    id: 108,
    name: "2019 Toyota Innova Crysta 2.4V",
    make: "Toyota", model: "Innova", year: "2019",
    kms: "68,000 kms", fuel: "Diesel", transmission: "Manual",
    price: "₹18.90 Lakh", originalPrice: "₹19.50 Lakh", savings: "Save ₹60,000",
    location: "Indiranagar, Bangalore",
    image: "https://images.unsplash.com/photo-1567818735868-e71b99932e29?q=80&w=800&auto=format&fit=crop",
    inspectionScore: "9.0/10", condition: "Very Good",
    inspectionSummary: ["Suspension overhauled recently", "Clutch plate in good health", "Zero underbody rust", "Service records up-to-date"],
    isNewArrival: false, isFeatured: false, reportPrice: "₹499",
    ownerType: "1st Owner", warranty: false,
  },
  {
    id: 109,
    name: "2022 MG ZS EV Exclusive",
    make: "MG", model: "ZS EV", year: "2022",
    kms: "14,500 kms", fuel: "Electric", transmission: "Automatic",
    price: "₹19.25 Lakh", originalPrice: "₹20.50 Lakh", savings: "Save ₹1.25 Lakh",
    location: "HSR Layout, Bangalore",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?q=80&w=800&auto=format&fit=crop",
    inspectionScore: "9.8/10", condition: "Pristine",
    inspectionSummary: ["Battery health at 99%", "Software up-to-date", "Fast charging module tested", "Panaromic sunroof smooth"],
    isNewArrival: true, isFeatured: true, reportPrice: "₹399",
    ownerType: "1st Owner", warranty: true,
  },
  {
    id: 110,
    name: "2018 Jeep Compass Limited PLUS",
    make: "Jeep", model: "Compass", year: "2018",
    kms: "55,400 kms", fuel: "Diesel", transmission: "Manual",
    price: "₹12.45 Lakh", originalPrice: "₹13.20 Lakh", savings: "Save ₹75,000",
    location: "Whitefield, Bangalore",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=800&auto=format&fit=crop",
    inspectionScore: "8.7/10", condition: "Good",
    inspectionSummary: ["4x2 transmission smooth", "Infotainment updated", "Leather seats cleaned & polished", "Tires good for 15k kms more"],
    isNewArrival: false, isFeatured: false, reportPrice: "₹349",
    ownerType: "2nd Owner", warranty: false,
  },
  {
    id: 111,
    name: "2021 BMW 3 Series 330i M Sport",
    make: "BMW", model: "3 Series", year: "2021",
    kms: "28,000 kms", fuel: "Petrol", transmission: "Automatic",
    price: "₹42.00 Lakh", originalPrice: "₹45.00 Lakh", savings: "Save ₹3 Lakh",
    location: "Lavelle Road, Bangalore",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800&auto=format&fit=crop",
    inspectionScore: "9.5/10", condition: "Excellent",
    inspectionSummary: ["Full BMW service history", "Insurance valid till 2025", "BSI package active", "M-Sport features verified"],
    isNewArrival: false, isFeatured: true, reportPrice: "₹999",
    ownerType: "1st Owner", warranty: true,
  },
  {
    id: 112,
    name: "2020 Mahindra XUV500 W11",
    make: "Mahindra", model: "XUV500", year: "2020",
    kms: "42,800 kms", fuel: "Diesel", transmission: "Automatic",
    price: "₹14.85 Lakh", originalPrice: "₹15.50 Lakh", savings: "Save ₹65,000",
    location: "Hebbal, Bangalore",
    image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=800&auto=format&fit=crop",
    inspectionScore: "8.9/10", condition: "Very Good",
    inspectionSummary: ["Engine noise within limits", "A/C cooling optimized", "Reverse camera crystal clear", "Brakes recently checked"],
    isNewArrival: true, isFeatured: false, reportPrice: "₹299",
    ownerType: "1st Owner", warranty: false,
  },
];

const filterOptions = ["All Cars", "New Arrivals", "Featured"];
const sortOptions = ["Price: Low to High", "Price: High to Low", "Inspection Score", "Year: Newest"];
const fuelOptions = ["All Fuel Types", "Petrol", "Diesel", "Electric"];

// ── Main Component ─────────────────────────────────────────────────────────────
export default function UsedCar() {
  const [activeFilter, setActiveFilter] = useState("All Cars");
  const [activeFuel, setActiveFuel] = useState("All Fuel Types");
  const [warrantyOnly, setWarrantyOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".car-reveal", {
      opacity: 0,
      y: 40,
      duration: 1,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".car-reveal",
        start: "top 90%",
      }
    });
  }, { scope: containerRef });

  const filteredCars = usedCars.filter((car) => {
    const byFilter =
      activeFilter === "All Cars" ? true :
        activeFilter === "New Arrivals" ? car.isNewArrival :
          activeFilter === "Featured" ? car.isFeatured : true;
    const byFuel = activeFuel === "All Fuel Types" ? true : car.fuel === activeFuel;
    const byWarranty = warrantyOnly ? car.warranty : true;
    return byFilter && byFuel && byWarranty;
  });

  return (
    <section id="used-cars" ref={containerRef} className="relative min-h-screen bg-slate-50 text-gray-900 pt-24 pb-32 overflow-hidden">
      {/* Background radial gradients */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/40 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-indigo-200/40 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-16 car-reveal">
          <div>
            <div className="inline-block px-4 py-1 rounded-full bg-blue-100 border border-blue-200 mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">Curated Inventory</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-tight text-gray-900">
              Browse <span className="text-blue-600">Inspected</span> Assets.
            </h2>
            <p className="text-gray-500 text-sm md:text-base font-medium max-w-xl">
              Every listing below has completed a detailed mechanical and structural audit. Verified by experts, ready for deployment.
            </p>
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-3 px-8 py-4 rounded-[2rem] bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all font-black uppercase tracking-widest text-[11px] text-gray-700 shadow-sm group"
          >
            <SlidersHorizontal size={16} className="text-blue-500" />
            Control Panel
            <ChevronDown size={16} className={`transition-transform duration-500 text-gray-500 ${showFilters ? "rotate-180" : ""}`} />
          </button>
        </div>

        {/* ── FILTER / SORT BAR ── */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-16"
            >
              <div className="bg-white border border-gray-200 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 shadow-sm">
                

                {/* Fuel Options */}
                <div className="space-y-4">
                   <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Energy Protocol</div>
                   <div className="flex flex-wrap gap-3">
                    {fuelOptions.map((f) => (
                      <button
                        key={f}
                        onClick={() => setActiveFuel(f)}
                        className={`px-6 py-3 rounded-2xl text-[11px] font-black transition-all border ${
                          activeFuel === f 
                            ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-200" 
                            : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-100"
                        }`}
                      >{f}</button>
                    ))}
                  </div>
                </div>

                {/* Info Text */}
                <div className="flex flex-col gap-6">
                   <div className="space-y-4">
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Protection</div>
                      <button
                        onClick={() => setWarrantyOnly(!warrantyOnly)}
                        className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl text-[11px] font-black transition-all border ${
                          warrantyOnly 
                            ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-200" 
                            : "bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 size={16} />
                          Warranty Available
                        </div>
                        <div className={`w-4 h-4 rounded-md border-2 flex items-center justify-center transition-colors ${warrantyOnly ? "bg-white border-white" : "border-gray-300"}`}>
                          {warrantyOnly && <div className="w-2 h-2 bg-emerald-600 rounded-sm" />}
                        </div>
                      </button>
                   </div>

                   <div className="flex items-center gap-4 bg-blue-50 p-6 rounded-3xl border border-blue-100">
                      <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center border border-blue-200 shrink-0">
                         <Sparkles size={20} className="text-blue-500" />
                      </div>
                      <div className="text-[11px] font-medium text-gray-500 leading-relaxed uppercase tracking-widest">
                         Algorithms prioritize high-score units with complete service logs.
                      </div>
                   </div>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── RESULTS COUNT ── */}
        <div className="flex items-center gap-3 mb-12 car-reveal">
           <div className="h-px flex-1 bg-gray-200"></div>
           <div className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em]">
              Showing {filteredCars.length} Verified Units
           </div>
           <div className="h-px flex-1 bg-gray-200"></div>
        </div>

        {/* ── GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {filteredCars.map((car, index) => (
            <div key={car.id} className="car-reveal">
               <UsedCarCard car={car} index={index} />
            </div>
          ))}
        </div>

        {/* ── EMPTY STATE ── */}
        {filteredCars.length === 0 && (
          <div className="text-center py-40 bg-white border border-dashed border-gray-300 rounded-[3rem] car-reveal">
            <ShieldCheck className="w-16 h-16 mx-auto mb-6 text-gray-300" />
            <h3 className="text-2xl font-black mb-2 tracking-tight text-gray-800">No matching units found.</h3>
            <p className="text-gray-400 text-[11px] font-black uppercase tracking-widest leading-loose">
               Reset your protocols to view the complete inventory.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}

// ── Car Card Sub-Component ─────────────────────────────────────────────────────
function UsedCarCard({ car, index }: { car: UsedCarData; index: number }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isSaved = isInWishlist(car.id);
  
  return (
    <div className="group flex flex-col h-full glass-light border border-white/40 rounded-[2.5rem] overflow-hidden hover:bg-white/60 transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-200/40 shadow-sm relative">
      {/* Absolute background to ensure blur works over gradients */}
      <div className="absolute inset-0 bg-white/10 -z-10" />
      
      {/* ── IMAGE SECTION ── */}
      <div className="relative aspect-[16/11] w-full overflow-hidden">
        <Image
          src={car.image} alt={car.name} fill sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out"
        />
        
        {/* Floating Badges */}
        <div className="absolute top-6 left-6 right-6 flex flex-wrap items-start justify-between pointer-events-none z-20">
          <div className="flex flex-col gap-2">
            {car.isNewArrival && (
              <div className="bg-blue-600/90 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-blue-400/30 shadow-xl pointer-events-auto">
                New Arrival
              </div>
            )}
            {car.warranty && (
              <div className="bg-emerald-600/90 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full border border-emerald-400/30 shadow-xl pointer-events-auto">
                Warranty
              </div>
            )}
          </div>

          <button
            onClick={(e) => {
               e.preventDefault();
               toggleWishlist({ ...car, odometer: car.kms } as any);
            }}
            className="w-10 h-10 rounded-2xl bg-white/80 backdrop-blur-xl border border-gray-200/60 flex items-center justify-center hover:scale-110 active:scale-95 transition-all pointer-events-auto shadow-2xl group/wish z-40 group-hover:bg-transparent group-hover:border-transparent group-hover:shadow-none transition-all duration-300"
          >
            <Heart size={18} className={`transition-colors ${isSaved ? "fill-rose-500 text-rose-500" : "text-gray-400 group-hover/wish:text-gray-700 group-hover:text-white drop-shadow-md"}`} />
          </button>
        </div>

        {/* Inspection Preview on Hover */}
        <motion.div 
           initial={{ opacity: 0 }} whileHover={{ opacity: 1 }}
           className="absolute inset-0 bg-white/20 backdrop-blur-sm flex flex-col justify-center p-10 z-30 transition-opacity pointer-events-none group-hover:pointer-events-auto"
        >
          <div className="flex items-center gap-3 mb-8">
             <div className="w-10 h-10 rounded-xl bg-white/90 flex items-center justify-center border border-blue-200 shadow-md">
                <ShieldCheck className="text-blue-600" size={20} />
             </div>
             <h4 className="text-lg font-black tracking-tight text-gray-950 drop-shadow-lg">Audit Summary</h4>
          </div>
          <ul className="space-y-4 mb-10">
            {car.inspectionSummary.map((point, i) => (
              <li key={i} className="text-gray-900 text-xs font-bold flex items-start gap-3 drop-shadow-sm">
                <CheckCircle2 size={14} className="text-blue-600 mt-0.5 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-3 bg-white/90 p-4 rounded-2xl border border-gray-200 shadow-xl">
             <Lock size={14} className="text-gray-500" />
             <div className="text-[10px] font-black uppercase tracking-widest text-gray-700">
                Unlock full report for <span className="text-blue-600 font-black">{car.reportPrice}</span>
             </div>
          </div>
        </motion.div>
      </div>

      {/* ── CARD CONTENT ── */}
      <div className="p-8 flex flex-col flex-grow relative">
        
        {/* Title & Year */}
        <div className="flex justify-between items-start mb-6 gap-6">
          <h3 className="text-xl font-black tracking-tighter leading-none group-hover:text-blue-600 transition-colors uppercase text-gray-900">
            {car.name.startsWith(car.year) ? car.name.replace(car.year, "").trim() : car.name}
          </h3>
          <div className="bg-gray-100 px-3 py-1.5 rounded-xl text-xs font-black tracking-tight border border-gray-200 text-gray-500">
             {car.year}
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-3 mb-10 overflow-hidden">
           {[
             { icon: Gauge, label: "MILEAGE", value: car.kms },
             { icon: ShieldCheck, label: "OWNER", value: car.ownerType?.toUpperCase() || "1ST OWNER" },
             { icon: Fuel, label: "ENERGY", value: car.fuel?.toUpperCase() },
             { icon: Settings2, label: "DRIVE", value: car.transmission?.toUpperCase() },
           ].map((spec, i) => (
             <div key={i} className="bg-white/20 backdrop-blur-md border border-white/30 p-3 rounded-2xl group/spec hover:bg-blue-50/50 hover:border-blue-200 transition-colors overflow-hidden">
                <div className="flex items-center justify-between mb-1">
                  <spec.icon size={14} className="text-gray-400 group-hover/spec:text-blue-500 transition-colors shrink-0" />
                  <span className="text-[8px] font-black uppercase tracking-widest text-gray-500">{spec.label}</span>
                </div>
                <div className="text-[13px] font-black tracking-tighter uppercase whitespace-nowrap overflow-hidden text-ellipsis text-gray-800">{spec.value}</div>
             </div>
           ))}
        </div>

        {/* Bottom Metrics */}
        <div className="mt-auto space-y-8">
           <div className="flex items-center justify-between">
              <div className="space-y-1">
                 <div className="flex items-center gap-3">
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-100 shadow-sm">{car.ownerType || "1st Owner"}</span>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Market Value</span>
                 </div>
                 <div className="text-2xl font-black tracking-tighter text-gray-900">{car.price}</div>
              </div>
           </div>

           <div className="flex items-center justify-end pt-8 border-t border-gray-100">
              <Link
                href={`/car/${car.id}`}
                className="flex items-center gap-3 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-600/10 px-6 py-3 rounded-2xl transition-all group/btn backdrop-blur-md"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Analysis</span>
                <ArrowRight size={14} className="text-blue-500 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
           </div>
        </div>

      </div>
    </div>
  );
}
