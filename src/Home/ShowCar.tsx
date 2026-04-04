"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star, ShieldCheck, Zap } from "lucide-react";

const cars = [
  {
    id: 1,
    name: "BMW M5 Competition",
    price: "₹1.55 Cr",
    image: "/CarImages/BMW.jpg",
    tag: "High Performance",
    ownership: "1st Owner",
    specs: { drive: "Automatic" }
  },
  {
    id: 2,
    name: "Bugatti Chiron Sport",
    price: "₹28.50 Cr",
    image: "/CarImages/Bugattii car.webp",
    tag: "Ultimate Luxury",
    ownership: "1st Owner",
    specs: { drive: "Automatic" }
  },
  {
    id: 3,
    name: "Custom Sports Edition",
    price: "₹3.20 Cr",
    image: "/CarImages/Luxury car.jpg",
    tag: "Limited Series",
    ownership: "1st Owner",
    specs: { drive: "Automatic" }
  },
  {
    id: 4,
    name: "Toyota Land Cruiser",
    price: "₹2.10 Cr",
    image: "/CarImages/Toyota.jpg",
    tag: "Master of Terrain",
    ownership: "1st Owner",
    specs: { drive: "Automatic" }
  },
];

export default function ShowCar() {
  return (
    <section className="min-h-screen flex items-center py-12 md:py-20 bg-ghost overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* ── HEADING SECTION ── */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl md:text-6xl font-black mb-6 tracking-tight text-navy leading-tight"
          >
            Built on <span className="text-royal">Trust.</span> <br className="hidden md:block" />
            Designed for <span className="text-royal">Excellence.</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="text-base md:text-xl text-gray-400 font-bold max-w-2xl mx-auto uppercase tracking-widest"
          >
            Experience the pinnacle of automotive engineering with our curated collection of world-class vehicles.
          </motion.p>
        </div>

        {/* ── CARDS GRID ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
          {cars.map((car, index) => (
            <motion.div
              key={car.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ 
                duration: 0.8, 
                ease: "easeOut", 
                delay: 0.2 + (index * 0.1)
              }}
              whileHover={{ 
                y: -10, 
                scale: 1.03,
                boxShadow: "0 25px 50px -12px rgba(27, 79, 216, 0.25)"
              }}
              className="group relative bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-gray-100 p-3 sm:p-4 shadow-md"
            >
              {/* Image Box */}
              <div className="relative aspect-[4/3] rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden mb-4">
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                  <span className="glass-light glass-stroke px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-royal shadow-lg backdrop-saturate-150 block">
                    {car.tag}
                  </span>
                </div>
              </div>

               {/* Info Box */}
              <div className="px-2 sm:px-4 pb-4 sm:pb-6">
                <div className="flex justify-between items-start mb-6 gap-4">
                  <div className="min-w-0">
                    <h3 className="text-base sm:text-lg font-black text-navy group-hover:text-royal transition-colors duration-300 leading-tight truncate">
                      {car.name}
                    </h3>
                  </div>
                  <motion.div 
                    whileHover={{ rotate: 15 }}
                    className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-royal shrink-0 shadow-sm"
                  >
                    <Star size={14} fill="currentColor" strokeWidth={0} />
                  </motion.div>
                </div>

                {/* PREMIUM SPECS GRID */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[
                    { icon: ShieldCheck, label: "OWNER", value: car.ownership?.toUpperCase() || "1ST OWNER" },
                    { icon: Zap, label: "DRIVE", value: car.specs?.drive?.toUpperCase() || "AUTO" },
                  ].map((spec, i) => (
                    <div key={i} className="bg-slate-50/50 border border-slate-200/50 rounded-2xl p-4 flex flex-col gap-1.5 transition-all group-hover:bg-white group-hover:border-blue-100 group-hover:shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <spec.icon size={11} className="text-royal/60" />
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em]">{spec.label}</span>
                      </div>
                      <span className="text-[11px] font-black text-navy uppercase tracking-tight">{spec.value}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                  <div className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2.5">
                       <span className="text-[8px] font-black text-blue-600 uppercase tracking-[0.2em] bg-blue-50 px-3 py-1 rounded-lg border border-blue-100 shadow-sm">{car.ownership}</span>
                       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Price Est.</p>
                    </div>
                    <p className="text-lg font-black text-navy leading-none tracking-tight">{car.price}</p>
                  </div>
                </div>
              </div>

              {/* Subtle background glow on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-royal to-sky rounded-[2rem] sm:rounded-[2.5rem] opacity-0 group-hover:opacity-10 blur transition-opacity duration-500 -z-10" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
