"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Heart, Phone, CreditCard, ShieldCheck, CheckCircle2, Calendar, Gauge, Award, Wrench, Car, Users } from "lucide-react";
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
  const sellingPrice = isUploaded ? (car as any).pricing?.sellingPrice : (car as any).price;
  const actualPrice = isUploaded ? (car as any).pricing?.actualPrice : null;
  const year = car.year;
  const odometer = isUploaded ? (car as any).specs.mileage : (car as any).odometer;
  
  const carImages = isUploaded 
    ? [(car as any).media.coverImage, ...(car as any).media.images.filter((img: string) => img !== (car as any).media.coverImage)]
    : [(car as any).image, "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1200&auto=format&fit=crop", "/car banner.png"];

  const isSaved = isInWishlist(car.id);

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
            <div className="grid grid-cols-2 gap-3 md:gap-5">
              {[
                { id: 'year', icon: Calendar,  color: "text-blue-600", bg: "bg-blue-50 border-blue-100", label: "Model",   value: year },
                { id: 'kms', icon: Gauge,     color: "text-teal-600", bg: "bg-teal-50 border-teal-100", label: "KM",   value: odometer },
                { id: 'owners', icon: Users, color: "text-purple-600", bg: "bg-purple-50 border-purple-100", label: "No.of Owner", value: isUploaded ? (car as any).specs?.owners || "1st Owner" : "1st Owner" },
              ].map(({ icon: Icon, color, bg, label, value }) => (
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
          <div className="p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] sticky top-24 z-10 relative overflow-hidden bg-white border border-gray-100">
            {/* Subtle background gradient glow */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

            {/* Promo Banner / Logo */}
            <div className="w-full h-[100px] md:h-[120px] bg-gradient-to-br from-gray-900 to-black relative rounded-2xl overflow-hidden mb-8 flex items-center justify-center p-4 shadow-xl border border-gray-800">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              <div className="relative w-full h-full z-10">
                <Image
                  src="/logo/carYakrama.png"
                  alt="caRya.krama Logo"
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-contain object-center drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                />
              </div>
            </div>

            {/* Header: Title & Heart */}
            <div className="flex justify-between items-start mb-4 relative z-10">
              <div>
                <div className="inline-block px-3 py-1 bg-blue-50 text-royal text-[10px] font-black uppercase tracking-widest rounded-full mb-3 border border-blue-100">
                  Verified Vehicle
                </div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-black leading-tight text-navy mb-2 tracking-tight">{name}</h1>
                <div className="flex items-center gap-2 text-[11px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">
                   <span>Stock: {id.toString().slice(-7)}</span>
                   <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                   <span>{year}</span>
                   <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                   <span>{odometer}</span>
                </div>
              </div>
              <button 
                onClick={() => toggleWishlist(car as any)}
                className="p-3 bg-white border border-gray-100 rounded-full transition-all hover:scale-110 shrink-0 ml-4 shadow-sm hover:shadow-md hover:border-gray-200" 
                aria-label="Toggle wishlist"
              >
                <Heart className={`w-5 h-5 transition-colors ${isSaved ? "fill-rose-500 text-rose-500" : "text-gray-300"}`} strokeWidth={isSaved ? 0 : 2.5} />
              </button>
            </div>

            <div className="w-full h-px bg-gradient-to-r from-gray-100 via-gray-200 to-transparent my-6"></div>

            {/* Price Area */}
            <div className="mb-8 relative z-10">
               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Market Value</p>
               <div className="flex items-baseline flex-wrap gap-3">
                 <div className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-navy to-royal tracking-tight">
                   {sellingPrice}
                 </div>
               </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 relative z-10">
               <button 
                 onClick={() => setIsBuyPopupOpen(true)}
                 className="w-full py-4 rounded-xl font-black text-sm md:text-base transition-all hover:-translate-y-1 flex items-center justify-center gap-2 group bg-gradient-to-r from-royal to-sky text-white shadow-[0_10px_20px_-10px_rgba(27,79,216,0.5)] hover:shadow-[0_15px_30px_-10px_rgba(27,79,216,0.6)] relative overflow-hidden"
               >
                 <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                 <CreditCard className="w-5 h-5 group-hover:scale-110 transition-transform" />
                 <span>View Full Report</span>
               </button>
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
