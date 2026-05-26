"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Star, ShieldCheck, Zap, MapPin, Gauge, Fuel } from "lucide-react";

const cars = [
  {
    id: 1,
    name: "TOYOTA INNOVA CRYSTA ZX",
    variant: "2.4 ZX AT",
    year: "2020",
    price: "₹18.90 Lakh",
    image: "/CarImages/Toyota innova crysta.png",
    tag: "FAMILY SUV",
    mileage: "48,000 KMS",
    ownership: "1ST OWNER",
    energy: "DIESEL",
    drive: "AUTOMATIC",
    location: "Bangalore",
  },
  {
    id: 2,
    name: "TATA NEXON",
    variant: "PETROL",
    year: "2024",
    price: "₹22.50 Lakh",
    image: "/CarImages/Tata Nexon.png",
    tag: "COMPACT SUV",
    mileage: "12,000 KMS",
    ownership: "1ST OWNER",
    energy: "PETROL",
    drive: "AUTOMATIC",
    location: "Bangalore",
  },
  {
    id: 3,
    name: "AUDI Q3",
    variant: "PLUS",
    year: "2017",
    price: "₹32.50 Lakh",
    image: "/CarImages/Audi Q3.png",
    tag: "LUXURY SUV",
    mileage: "38,000 KMS",
    ownership: "1ST OWNER",
    energy: "DIESEL",
    drive: "AUTOMATIC",
    location: "Bangalore",
  },
  {
    id: 4,
    name: "MARUTI SUZUKI ERTIGA",
    variant: "VXI",
    year: "2020",
    price: "₹9.80 Lakh",
    image: "/CarImages/Suzuki.png",
    tag: "FAMILY CAR ",
    mileage: "55,000 KMS",
    ownership: "1ST OWNER",
    energy: "PETROL",
    drive: "MANUAL",
    location: "Bangalore",
  },
];

export default function ShowCar() {
  return (
    <section className="md:min-h-screen flex items-center py-8 md:py-20 bg-ghost overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* ── HEADING SECTION ── */}
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-2xl md:text-6xl font-black mb-6 tracking-tight text-navy leading-tight"
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
                    <h3 className="text-base sm:text-lg font-black text-navy group-hover:text-royal transition-colors duration-300 leading-tight">
                      {car.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 min-w-0">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate">{car.variant}</span>
                      <div className="w-1 h-1 rounded-full bg-slate-300 shrink-0" />
                      <span className="text-[10px] font-black text-royal bg-blue-50 px-2 py-0.5 rounded-md shrink-0">{car.year}</span>
                    </div>
                  </div>
                  <motion.div 
                    whileHover={{ rotate: 15 }}
                    className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-royal shrink-0 shadow-sm"
                  >
                    <Star size={14} fill="currentColor" strokeWidth={0} />
                  </motion.div>
                </div>

                {/* CORE SPECS GRID */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[
                    { icon: Gauge, label: "MILEAGE", value: car.mileage },
                    { icon: ShieldCheck, label: "OWNER", value: car.ownership },
                    { icon: Fuel, label: "ENERGY", value: car.energy },
                    { icon: Zap, label: "DRIVE", value: car.drive },
                  ].map((spec, i) => (
                    <div key={i} className="bg-slate-50/50 border border-slate-200/50 rounded-2xl p-3 sm:p-4 flex flex-col gap-1.5 transition-all group-hover:bg-white group-hover:border-blue-100 group-hover:shadow-sm">
                      <div className="flex items-center gap-1.5">
                        <spec.icon size={11} className="text-royal/60" />
                        <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.15em]">{spec.label}</span>
                      </div>
                      <span className="text-[11px] font-black text-navy uppercase tracking-tight truncate">{spec.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-5 border-t border-gray-100 pt-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <MapPin size={12} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{car.location}</span>
                    </div>
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
