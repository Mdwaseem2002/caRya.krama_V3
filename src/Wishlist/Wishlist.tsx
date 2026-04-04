"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  Heart, ArrowLeft, Bell, Lock, AlertCircle, ArrowDown, 
  Share2, Trash2, Eye, Sparkles, TrendingUp, Tag, ArrowRight 
} from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { cars as allCars } from "@/data/inventory"; // Using shared inventory data for recommendations

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  
  // Mock login state for demonstration
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Mock notification preference state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Recommendations: Get 3 cars that are NOT in the wishlist
  const recommendations = useMemo(() => {
    const wishlistIds = new Set(wishlist.map(c => c.id));
    return allCars
      .filter(c => !wishlistIds.has(c.id))
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  }, [wishlist]);

  const handleShare = (car: any) => {
    if (navigator.share) {
      navigator.share({
        title: `Check out this ${car.name}!`,
        text: `I'm eyeing this ${car.name} on caRyakrama.`,
        url: window.location.origin + `/car/${car.id}`,
      });
    } else {
      alert("Sharing link: " + window.location.origin + `/car/${car.id}`);
    }
  };

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 py-8 md:py-16" style={{ background: "var(--background)" }}>
      

      {/* ── HEADER SECTION ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-6">
          <Link href="/" className="group p-3 rounded-2xl transition-all hover:bg-[#0059A3] hover:text-white shadow-sm flex items-center justify-center w-12 h-12 border border-gray-100 bg-white">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black mb-2 tracking-tight" style={{ color: 'var(--foreground)' }}>
              Save What <span className="text-[#0059A3]">Moves You.</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl font-bold flex items-center gap-2" style={{ color: 'var(--muted)' }}>
              <span className="w-2 h-2 rounded-full bg-[#0059A3]"></span>
              Track Your Favorite Cars Effortlessly.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all border ${
              notificationsEnabled 
                ? 'bg-blue-50 text-blue-600 border-blue-200' 
                : 'bg-gray-50 text-gray-400 border-gray-200'
            }`}
          >
            <Bell className={`w-4 h-4 ${notificationsEnabled ? 'fill-current' : ''}`} />
            {notificationsEnabled ? 'Alerts On' : 'Alerts Off'}
          </button>
          
          {!isLoggedIn && (
            <button 
              onClick={() => setIsLoggedIn(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all text-white shadow-lg bg-[#0059A3] hover:shadow-blue-200 hover:-translate-y-1"
            >
              <Lock className="w-4 h-4" />
              Sign In to Save
            </button>
          )}
        </div>
      </div>

      {/* ── ALERTS BAR ── */}
      <AnimatePresence>
        {notificationsEnabled && wishlist.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-10 p-5 rounded-3xl flex items-center gap-4 bg-blue-50 border border-blue-100 shadow-sm"
          >
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-500 shadow-sm border border-blue-50">
               <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-black text-blue-900 uppercase tracking-widest">Price Drop Alerts Enabled</p>
              <p className="text-sm text-blue-700 font-medium mt-0.5">We'll notify you immediately if any of your saved cars receive a price reduction.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CONTENT AREA ── */}
      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 sm:py-32 text-center bg-white rounded-[2rem] sm:rounded-[3rem] border-2 border-dashed border-gray-100 shadow-sm px-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-blue-50 flex items-center justify-center mb-6 sm:mb-8 relative">
             <Heart className="w-10 h-10 sm:w-16 sm:h-16 text-[#0059A3] animate-pulse" />
             <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 bg-[#0059A3] rounded-full border-4 border-white flex items-center justify-center text-white font-black text-[10px] sm:text-xs">?</div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black mb-3 italic tracking-tight" style={{ color: 'var(--foreground)' }}>Your garage is empty</h2>
          <p className="max-w-md mb-8 sm:mb-10 text-base sm:text-lg font-medium" style={{ color: 'var(--muted)' }}>
            Keep track of the cars you love. Add them to your wishlist to get instant price drop alerts!
          </p>
          <Link
            href="/"
            className="group flex items-center gap-3 text-white px-8 py-4 sm:px-10 sm:py-5 rounded-[2rem] font-black transition-all hover:scale-105 shadow-xl bg-[#0059A3] hover:shadow-blue-200 w-full sm:w-auto justify-center"
          >
            Explore Collection
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      ) : (
        <div className="space-y-12 sm:space-y-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">
            {wishlist.map((car, index) => (
              <motion.div
                key={car.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full bg-white border border-gray-100"
              >
                {/* Image Section */}
                <Link href={`/car/${car.id}`} className="relative aspect-[16/11] w-full overflow-hidden block">
                  <Image
                    src={car.image || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=800"}
                    alt={car.name || 'Car Image'}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    unoptimized={car.image?.startsWith("data:")}
                  />
                  
                  {/* Status Badges - TOP LEFT (COMPACT) */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                    {index === 0 && (
                      <span className="px-3 py-1.5 bg-[#10b981] text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-md border border-white/20">
                        <ArrowDown className="w-3 h-3" strokeWidth={3} />
                        Drop
                      </span>
                    )}
                    {index === 1 && (
                      <span className="px-3 py-1.5 bg-orange-500 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-md border border-white/20">
                        <TrendingUp className="w-3 h-3" strokeWidth={3} />
                        Hot
                      </span>
                    )}
                    {index === 2 && (
                       <span className="px-3 py-1.5 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-md border border-white/20">
                        <Tag className="w-3 h-3" strokeWidth={3} />
                        Best
                      </span>
                    )}
                  </div>

                  {/* HEART ICON - TOP RIGHT CORNER (COMPACT) */}
                  <div className="absolute top-4 right-4 z-20">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(car);
                      }}
                      className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-rose-500 shadow-xl border border-white/60 hover:scale-110 active:scale-95 transition-all group/heart"
                      title="Remove"
                    >
                       <Heart size={18} className="fill-current" />
                    </button>
                  </div>

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </Link>
                
                {/* Content Section - Compact Padding (p-6) */}
                <div className="p-6 flex flex-col flex-grow relative bg-white">
                  <Link href={`/car/${car.id}`} className="block">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="font-extrabold text-xl tracking-tight leading-tight group-hover:text-[#0059A3] transition-colors uppercase truncate max-w-[200px]">{car.name}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <p className="text-[10px] font-bold text-[#0059A3] bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-[0.05em]">{car.year}</p>
                          <span className="w-1 h-1 rounded-full bg-gray-200" />
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.05em]">{car.odometer?.toUpperCase().replace("KM KM", "KM")}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Price Box - Compact p-5 */}
                    <div className="mb-6 p-5 rounded-3xl flex justify-between items-center bg-gray-50 border border-gray-100 group-hover:bg-blue-50/50 transition-all duration-500">
                      <div>
                        <p className="text-[9px] font-black uppercase tracking-[0.1em] text-gray-400 mb-1">Price</p>
                        <p className="font-black text-xl text-gray-900 tracking-tight">{car.price || car.fullPrice}</p>
                      </div>
                      <div className="text-right">
                         <div className="bg-[#0059A3] text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest mb-1 inline-block shadow-md shadow-blue-500/10">Score</div>
                         <p className="font-black text-lg text-[#0059A3] leading-none">{car.inspectionScore || "9.8/10"}</p>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Quick Actions Bar - Compact */}
                  <div className="mt-auto grid grid-cols-3 gap-2 border-t border-gray-100 pt-5">
                    <Link href={`/car/${car.id}`} className="flex flex-col items-center gap-2 p-2 rounded-2xl hover:bg-blue-100/50 transition-all group/btn">
                       <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover/btn:scale-110 group-hover/btn:bg-blue-200 group-hover/btn:text-blue-900 shadow-sm transition-all border border-blue-200/50">
                          <Eye size={18} />
                       </div>
                       <span className="text-[8px] font-black uppercase tracking-widest text-[#64748b] group-hover/btn:text-blue-800">View</span>
                    </Link>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(car);
                      }}
                      className="flex flex-col items-center gap-2 p-2 rounded-2xl hover:bg-rose-100/50 transition-all group/btn"
                    >
                       <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center group-hover/btn:scale-110 group-hover/btn:bg-rose-200 group-hover/btn:text-rose-900 shadow-sm transition-all border border-rose-200/50">
                          <Trash2 size={18} />
                       </div>
                       <span className="text-[8px] font-black uppercase tracking-widest text-[#64748b] group-hover/btn:text-rose-800">Remove</span>
                    </button>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleShare(car);
                      }}
                      className="flex flex-col items-center gap-2 p-2 rounded-2xl hover:bg-indigo-100/50 transition-all group/btn"
                    >
                       <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover/btn:scale-110 group-hover/btn:bg-indigo-200 group-hover/btn:text-indigo-900 shadow-sm transition-all border border-indigo-200/50">
                          <Share2 size={18} />
                       </div>
                       <span className="text-[8px] font-black uppercase tracking-widest text-[#64748b] group-hover/btn:text-indigo-800">Share</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* ── RECOMMENDATIONS ── */}
          <div className="pt-20 border-t border-gray-100">
             <div className="flex items-center gap-3 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-sm">
                   <Sparkles className="w-6 h-6" />
                </div>
                <div>
                   <h2 className="text-3xl font-black tracking-tight">You May Also <span className="text-indigo-600">Like.</span></h2>
                   <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">Smart Suggestions Based on Your Style</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {recommendations.map((car, i) => (
                   <div key={car.id} className="group relative bg-white rounded-[2.5rem] border border-gray-100 p-3 shadow-sm hover:shadow-xl transition-all h-full">
                      <Link href={`/car/${car.id}`} className="block relative aspect-[16/10] rounded-[2rem] overflow-hidden mb-4">
                         <Image src={car.image} alt={car.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                         <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                      
                      {/* Separate Wishlist Button to avoid nesting issues */}
                      <div className="absolute top-6 right-6 z-10">
                        <button 
                          onClick={() => toggleWishlist(car as any)}
                          className="w-10 h-10 bg-white/95 shadow-xl border border-white rounded-full flex items-center justify-center text-rose-500 hover:scale-110 active:scale-95 transition-all group/rec"
                        >
                           <Heart size={18} className="transition-colors group-hover/rec:fill-current" />
                        </button>
                      </div>

                      <div className="px-4 pb-4">
                         <Link href={`/car/${car.id}`} className="block">
                           <h4 className="font-extrabold text-lg mb-1 group-hover:text-[#0059A3] transition-colors">{car.name}</h4>
                         </Link>
                         <div className="flex justify-between items-center mt-2">
                            <p className="font-black text-[#0059A3] text-lg">{car.price}</p>
                            <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{car.year}</span>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        </div>
      )}
    </main>
  );
}

