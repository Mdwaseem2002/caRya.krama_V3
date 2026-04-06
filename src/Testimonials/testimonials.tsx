"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote, Car, ArrowRight, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import StatisticsSection from "./StatisticsSection";

// ── Types ──────────────────────────────────────────────
export type BadgeKey = "Verified Buyer" | "Repeat Customer" | "Referred Customer" | "New Customer";

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  photo: string;
  rating: number;
  text: string;
  car: string;
  badge: BadgeKey;
}

// ── Data ───────────────────────────────────────────────
export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Aditya Sharma",
    role: "First-Time Car Buyer",
    location: "Dubai, UAE",
    photo: "https://i.pravatar.cc/150?img=12",
    rating: 5,
    text: "I was terrified of buying a used car — stories of hidden damage and fake paperwork scared me for years. caRya.krama changed everything. The inspection report was thorough, the team was honest, and I drove away in my dream car without a single worry.",
    car: "2021 BMW 3 Series",
    badge: "Verified Buyer",
  },
  {
    id: 2,
    name: "Priya Nair",
    role: "Entrepreneur",
    location: "Abu Dhabi, UAE",
    photo: "https://i.pravatar.cc/150?img=47",
    rating: 5,
    text: "What I appreciated most was the transparency. They presented every flaw, every service record, every detail — no sugarcoating. That level of honesty is rare. I've bought three cars through them now and I will never go anywhere else.",
    car: "2022 Range Rover Evoque",
    badge: "Repeat Customer",
  },
  {
    id: 3,
    name: "Khalid Al Mansouri",
    role: "Business Executive",
    location: "Sharjah, UAE",
    photo: "https://i.pravatar.cc/150?img=33",
    rating: 5,
    text: "The difference between caRya.krama and other dealers? Respect. They respected my time, my budget, and my intelligence. No pushy sales tactics — just honest guidance. My Audi A6 is exactly as described: pristine condition, fair price.",
    car: "2020 Audi A6",
    badge: "Verified Buyer",
  },
  {
    id: 4,
    name: "Fatima Al Hassan",
    role: "Doctor",
    location: "Dubai, UAE",
    photo: "https://i.pravatar.cc/150?img=44",
    rating: 5,
    text: "As a woman, I often felt intimidated at car dealerships. caRya.krama's team treated me with full professionalism and gave me complete confidence in my decision. The car was exactly as listed — no surprises, no regrets. I got a fantastic deal on a beautiful Porsche Cayenne.",
    car: "2023 Mercedes GLC",
    badge: "Verified Buyer",
  },
  {
    id: 5,
    name: "Rohan Mehta",
    role: "Software Engineer",
    location: "Dubai, UAE",
    photo: "https://i.pravatar.cc/150?img=15",
    rating: 5,
    text: "I did months of research online and kept hitting shady listings. Then a friend recommended caRya.krama. Within one week I found, inspected, and purchased my perfect car. The process was seamless — like buying from a trusted friend who happens to be a car expert.",
    car: "2021 Toyota Land Cruiser",
    badge: "Referred Customer",
  },
  {
    id: 6,
    name: "Sara Johnson",
    role: "Marketing Director",
    location: "Abu Dhabi, UAE",
    photo: "https://i.pravatar.cc/150?img=39",
    rating: 5,
    text: "I relocated to UAE and had no local knowledge of the car market. caRya.krama guided me through every step, explained regulations, helped me compare options, and never pressured me. I got a fantastic deal on a beautiful Porsche Cayenne.",
    car: "2020 Porsche Cayenne",
    badge: "New Customer",
  },
];

const badgeStyles: Record<BadgeKey, { color: string; bg: string }> = {
  "Verified Buyer":   { color: "text-emerald-600", bg: "bg-emerald-50" },
  "Repeat Customer":  { color: "text-blue-600", bg: "bg-blue-50" },
  "Referred Customer":{ color: "text-indigo-600", bg: "bg-indigo-50" },
  "New Customer":     { color: "text-teal-600", bg: "bg-teal-50" },
};

// ── Sub-components ─────────────────────────────────────
function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-1 mb-2">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} className="fill-blue-500 text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
      ))}
    </div>
  );
}

function TestimonialCard({ item }: { item: Testimonial }) {
  const badge = badgeStyles[item.badge] ?? badgeStyles["Verified Buyer"];
  return (
    <div className="bg-white border border-slate-100 rounded-[2.25rem] p-8 group hover:border-blue-500/20 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full shadow-sm hover:shadow-xl">
      <div className="flex items-center justify-between mb-8">
         <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-slate-100 shadow-inner">
            <Quote size={20} className="text-blue-500 opacity-80" />
         </div>
         <div className={`px-4 py-1.5 rounded-full ${badge.bg} ${badge.color} text-[10px] font-black uppercase tracking-widest border border-slate-100 shadow-sm`}>
            {item.badge}
         </div>
      </div>

      <StarRating count={item.rating} />
      <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8 flex-grow font-medium leading-[1.8]">
        &ldquo;{item.text}&rdquo;
      </p>

      <div className="mb-8 p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-3 group-hover:bg-blue-500/5 transition-colors">
         <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-white/5">
            <Car size={18} className="text-blue-400" />
         </div>
         <div>
            <div className="text-[10px] font-black text-white/30 uppercase tracking-widest">Asset Secured</div>
            <div className="text-sm font-black tracking-tight">{item.car}</div>
         </div>
      </div>

      <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
        <div className="relative w-12 h-12 rounded-2xl overflow-hidden ring-1 ring-slate-200 shrink-0">
          <Image src={item.photo} alt={item.name} fill className="object-cover" sizes="48px" />
        </div>
        <div className="min-w-0">
          <p className="font-black text-sm tracking-tight text-[#0f172a]">{item.name}</p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em]">{item.role}</p>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────
export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLElement>(null);

  const prev = () => setActiveIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const next = () => setActiveIndex((i) => (i + 1) % testimonials.length);

  const featured = testimonials[activeIndex];

  return (
    <main ref={containerRef} className="relative min-h-screen bg-[#F8FAFC] text-[#0f172a] pt-24 pb-32 overflow-hidden">
      {/* Background radial gradients */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-indigo-500/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── HEADER ── */}
        <section className="text-center mb-24">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-500/10 mb-6 group">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              Wall of Excellence
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.1]">
            Trusted by those who <br />
            <span className="text-blue-500">Refuse Compromise.</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium">
            Real stories from real buyers who found confidence, ease, and their perfect car through caRya.krama.
          </p>
        </section>

        {/* ── FEATURED CAROUSEL ── */}
        <div className="mb-40 flex items-center gap-4 lg:gap-12 flex-col lg:flex-row">
            
            {/* Nav Arrows - Desktop only side */}
            <div className="hidden lg:flex flex-col gap-4">
               <button onClick={prev} className="w-14 h-14 rounded-2xl bg-white border border-slate-200 hover:border-blue-500/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm">
                  <ChevronLeft size={24} className="text-[#0f172a]" />
               </button>
               <button onClick={next} className="w-14 h-14 rounded-2xl bg-white border border-slate-200 hover:border-blue-500/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-sm">
                  <ChevronRight size={24} className="text-[#0f172a]" />
               </button>
            </div>

            <div className="flex-1 w-full relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={featured.id}
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: "circOut" }}
                  className="bg-white border border-slate-100 rounded-[3rem] p-8 md:p-16 relative overflow-hidden group shadow-2xl"
                >
                  <div className="absolute top-0 right-0 p-12 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                     <Quote size={200} strokeWidth={1} />
                  </div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                     <div className="relative w-32 h-32 md:w-56 md:h-56 rounded-[2.5rem] overflow-hidden rotate-3 group-hover:rotate-0 transition-transform duration-700 ring-4 ring-slate-100 shrink-0">
                        <Image src={featured.photo} alt={featured.name} fill className="object-cover" sizes="224px" />
                     </div>
                     <div className="flex-1 text-center md:text-left">
                        <StarRating count={featured.rating} />
                        <blockquote className="text-xl md:text-4xl font-black mb-8 leading-tight tracking-tight">
                           &ldquo;{featured.text}&rdquo;
                        </blockquote>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-6">
                           <div className="flex items-center gap-2 text-blue-400">
                              <Car size={18} />
                              <span className="text-sm font-black uppercase tracking-widest">{featured.car}</span>
                           </div>
                           <div className="text-white/30 text-xs font-bold uppercase tracking-[0.2em]">
                              {featured.name} · {featured.location}
                           </div>
                        </div>
                     </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Mobile Nav */}
            <div className="lg:hidden flex gap-4 mt-6">
               <button onClick={prev} className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center transition-all shadow-sm">
                  <ChevronLeft size={20} className="text-[#0f172a]" />
               </button>
               <button onClick={next} className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center transition-all shadow-sm">
                  <ChevronRight size={20} className="text-[#0f172a]" />
               </button>
            </div>
        </div>

        {/* ── MASONRY GRID ── */}
        <section className="mb-40">
           <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
              <div>
                <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4">Community</h2>
                <h3 className="text-3xl md:text-5xl font-black tracking-tighter">Voices of <span className="text-blue-500">Satisfaction.</span></h3>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((item) => (
                <div key={item.id}>
                  <TestimonialCard item={item} />
                </div>
              ))}
           </div>
        </section>

        {/* ── STATS BAR ── */}
        <StatisticsSection />

        {/* ── CTA ── */}
        <section className="mt-32 text-center">
            <h4 className="text-2xl md:text-4xl font-black mb-10 tracking-tighter">Ready to write your <span className="text-blue-500">own story?</span></h4>
            <button className="bg-gradient-to-br from-[#0A2A6E] to-[#1B4FD8] text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:scale-[1.05] active:scale-[0.95] transition-all shadow-2xl shadow-blue-900/40 flex items-center gap-3 mx-auto group">
               Start My Journey
               <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </section>

      </div>
    </main>
  );
}
