"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart, Phone, CreditCard, ShieldCheck, CheckCircle2, Calendar, Gauge, Award, Wrench, Car } from "lucide-react";
import { cars as staticCars } from "@/data/inventory";
import { useWishlist } from "@/context/WishlistContext";
import { getStoredCarById } from "@/Admin/Upload/CarStorage";
import ViewFullReport from "./ViewFullReport";
import ViewReop from "@/Details/Popup/ViewReop";

export default function CarDetails({ id }: { id: string }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [mounted, setMounted] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [isBuyPopupOpen, setIsBuyPopupOpen] = useState(false);
  const [uploadedCar, setUploadedCar] = useState<any>(null);
  const [loadingCars, setLoadingCars] = useState(true);

  useEffect(() => {
    setMounted(true);
    getStoredCarById(id)
      .then(car => { setUploadedCar(car); setLoadingCars(false); })
      .catch(() => setLoadingCars(false));
  }, [id]);

  // Find the car based on string ID from params
  const foundUploaded = uploadedCar;
  const foundStatic = staticCars.find((c) => c.id.toString() === id);
  
  const car = foundUploaded || foundStatic || null;

  if (!mounted) return null;

  // ── LOADING SKELETON: don't flash mock car while DB fetches ───────────────────────
  if (loadingCars) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-[16/11] rounded-[2rem] bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
            <div className="rounded-[2rem] bg-white border border-gray-100 p-8">
              <div className="h-6 w-40 bg-gray-200 rounded-lg animate-pulse mb-6" />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}
              </div>
            </div>
          </div>
          {/* Right skeleton */}
          <div className="space-y-4">
            <div className="rounded-[2rem] bg-white border border-gray-100 p-8 space-y-4">
              <div className="h-24 w-full bg-gray-100 rounded-xl animate-pulse" />
              <div className="h-8 w-3/4 bg-gray-200 rounded-lg animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-100 rounded-lg animate-pulse" />
              <div className="h-10 w-36 bg-emerald-100 rounded-xl animate-pulse" />
              <div className="h-12 w-full bg-blue-50 rounded-2xl animate-pulse" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                <div className="h-12 bg-gray-100 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!car) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">Car not found.</div>;
  }

  // Normalize fields for rendering
  const isUploaded = !!foundUploaded;
  const name = isUploaded ? (car as any).title : (car as any).name;
  const price = isUploaded ? (car as any).pricing.sellingPrice : (car as any).price;
  const year = car.year;
  const odometer = isUploaded ? (car as any).specs.mileage : (car as any).odometer;
  
  const carImages = isUploaded 
    ? [(car as any).media.coverImage, ...(car as any).media.images.filter((img: string) => img !== (car as any).media.coverImage)]
    : [(car as any).image, "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop", "/car banner.png"];

  const isSaved = isInWishlist(Number(car.id));

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % carImages.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + carImages.length) % carImages.length);

  // ── Rendering the details ──────────────────────────────────

  return (
    <div className="max-w-7xl mx-auto px-4 py-2 md:py-12" style={{ background: "var(--background)" }}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── LEFT: GALLERY & SPECS ── */}
        <div className="lg:col-span-2 space-y-6 md:space-y-8 order-last lg:order-first">
          
          {/* Gallery Carousel */}
          <div className="relative aspect-[16/11] md:aspect-[16/10] rounded-[2rem] overflow-hidden group shadow-2xl border border-gray-100 bg-gray-50">
            <Image 
              src={carImages[currentImage]} 
              alt={name} 
              fill 
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 66vw"
              priority
              unoptimized={carImages[currentImage]?.startsWith('data:')}
            />
            
            {/* Soft inner shadow overlay to frame image */}
            <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.1)]"></div>
            
            {/* Bottom Gradient for Indicators */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>

            {/* Carousel Controls */}
            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <button 
                onClick={prevImage}
                className="w-12 h-12 bg-white/20 backdrop-blur-xl border border-white/40 text-white rounded-full flex items-center justify-center hover:bg-white/30 hover:scale-110 active:scale-95 transition-all shadow-lg"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
              </button>
              <button 
                onClick={nextImage}
                className="w-12 h-12 bg-white/20 backdrop-blur-xl border border-white/40 text-white rounded-full flex items-center justify-center hover:bg-white/30 hover:scale-110 active:scale-95 transition-all shadow-lg"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
              </button>
            </div>
            
            {/* Image Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {carImages.map((_, i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-500 ease-out shadow-sm ${i === currentImage ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60 cursor-pointer'}`} 
                  onClick={() => setCurrentImage(i)}
                />
              ))}
            </div>
          </div>

          {/* ── CAR OVERVIEW ── */}
          <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-gray-100 relative overflow-hidden">
            <h2 className="text-xl md:text-2xl font-black mb-6 text-gray-900 tracking-tight">Car Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
              {[
                { id: 'year', icon: Calendar,  color: "text-blue-600", bg: "bg-blue-50 border-blue-100", label: "Model Year",   value: year },
                { id: 'kms', icon: Gauge,     color: "text-teal-600", bg: "bg-teal-50 border-teal-100", label: "Kilometers",   value: odometer },
                { id: 'warranty', icon: Award,     color: "text-purple-600", bg: "bg-purple-50 border-purple-100", label: "Warranty", value: isUploaded ? "12 Months Comprehensive" : "Valued Warranty", show: isUploaded ? (car as any).specs?.warranty : true },
                { id: 'service', icon: ShieldCheck, color: "text-green-600", bg: "bg-green-50 border-green-100", label: "Service",    value: isUploaded ? "Contract Available" : "Certified History" },
                { id: 'specs', icon: Wrench,    color: "text-orange-600", bg: "bg-orange-50 border-orange-100", label: "Specification", value: isUploaded ? (car as any).specs?.transmission : "GCC SPECS" },
                { id: 'cylinders', icon: Car,       color: "text-rose-600", bg: "bg-rose-50 border-rose-100", label: "Cylinders",    value: isUploaded ? (car as any).specs?.fuelType : "V4 Engine" },
              ].filter(item => item.show !== false).map(({ icon: Icon, color, bg, label, value }) => (
                <div key={label} className="flex items-center gap-3 p-4 rounded-2xl border border-gray-50 hover:bg-gray-50 hover:shadow-sm hover:border-gray-200 transition-all group duration-300 cursor-default">
                  <div className={`w-12 h-12 rounded-[1rem] flex flex-shrink-0 items-center justify-center border ${bg} ${color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <Icon className="w-5 h-5" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</h3>
                    <p className="text-xs md:text-sm font-black text-gray-900">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Details & Inspection Section */}
          <ViewFullReport carId={id as any} />
        </div>

        {/* ── RIGHT: PRICING & CTA SIDEBAR ── */}
        <div className="space-y-6 order-first lg:order-last h-full">
          <div className="p-6 md:p-8 rounded-2xl md:rounded-[2rem] shadow-xl sticky top-24 z-10" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border)" }}>
            
            {/* Promo Banner */}
            <div className="w-full h-[100px] relative rounded-xl overflow-hidden mb-6">
              <Image
                src="/car banner.png"
                alt="Car Banner"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover object-center"
              />
            </div>

            {/* Header: Title & Heart */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <h1 className="text-xl md:text-3xl font-extrabold line-clamp-2" style={{ color: "var(--foreground)" }}>{name}</h1>
                <p className="text-[11px] md:text-sm font-semibold opacity-60 mt-1 uppercase tracking-wider" style={{ color: "var(--muted)" }}>
                   Stock no: {id.toString().slice(-7)} • {year} • {odometer}
                </p>
              </div>
              <button 
                onClick={() => toggleWishlist(car as any)}
                className="p-2.5 border rounded-full transition-colors hover:scale-110 shrink-0 ml-3 shadow-sm hover:shadow-md" 
                style={{ borderColor: "var(--border)", background: "var(--background)" }}
                aria-label="Toggle wishlist"
              >
                <Heart className={`w-5 h-5 transition-colors ${isSaved ? "fill-[#0059A3] text-[#0059A3]" : "text-gray-400"}`} />
              </button>
            </div>

            {/* Price Area */}
            <div className="mt-6 mb-5">
               <div className="text-2xl md:text-4xl font-black mb-1.5" style={{ color: "var(--foreground)" }}>
                 {price} <span className="text-[9px] md:text-xs font-bold opacity-50 uppercase align-middle ml-1 tracking-wider">(Exclusive of VAT)</span>
               </div>
               <div className="text-[#10b981] font-bold text-[13px] bg-[#10b981]/10 w-fit px-2.5 py-1 rounded-md border border-[#10b981]/20">
                 EMI starts @ ₹45,000/Month
               </div>
            </div>

            {/* Live Viewers Indicator */}
            <div className="flex items-center gap-3 mb-6 p-3 rounded-xl border border-[#0059A3]/20 bg-[#0059A3]/5">
               <span className="relative flex h-3 w-3 shrink-0">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0059A3] opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-[#0059A3]"></span>
               </span>
               <span className="text-[11px] md:text-xs font-bold text-[#0059A3] uppercase tracking-wide">
                 <span className="text-sm font-black mr-1">14</span> People are viewing right now
               </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                 <button className="py-3 rounded-xl font-bold transition-all hover:bg-[#0059A3] hover:text-white flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 group border border-[#0059A3]/20" style={{ backgroundColor: "color-mix(in srgb, #0059A3 5%, transparent)", color: "#0059A3" }}>
                   <Phone className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                   <span className="text-[11px] sm:text-xs md:text-sm">Call Us</span>
                 </button>
                 <button 
                   onClick={() => setIsBuyPopupOpen(true)}
                   className="py-3 rounded-xl font-bold transition-all hover:bg-[#0059A3] hover:text-white flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 group border border-[#0059A3]/20" style={{ backgroundColor: "color-mix(in srgb, #0059A3 5%, transparent)", color: "#0059A3" }}>
                   <CreditCard className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                   <span className="text-[11px] sm:text-xs md:text-sm">Access Report</span>
                 </button>
              </div>
            </div>

          </div>
        </div>

      </div>
      
      <ViewReop 
        isOpen={isBuyPopupOpen} 
        onClose={() => setIsBuyPopupOpen(false)} 
        carId={id}
      />
    </div>
  );
}
