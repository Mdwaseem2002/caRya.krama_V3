"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Star, Quote, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
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
  instagramUrl?: string;
}

// ── Data ───────────────────────────────────────────────
export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Happy 4x4 Driver",
    role: "Off-Road Enthusiast",
    location: "Bengaluru",
    photo: "/Testimonials/Testimonial 1.webp",
    rating: 5,
    text: "I am very happy with the inspection, Farhan checked everything from Engine, transmission, we even took the car for test drive where he checked 4*4 too.",
    car: "4x4 Specialist",
    badge: "Verified Buyer",
    instagramUrl: "https://www.instagram.com/reel/DWOpdmaEzvl/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
  },
  {
    id: 2,
    name: "First-Time Buyer",
    role: "Used Car Buyer",
    location: "Bengaluru",
    photo: "/Testimonials/Testimonial 2.webp",
    rating: 5,
    text: "I first saw Farhan on Instagram, i called him to checked first car which he was not satisfied. He not only checked all components of the car, he also explains everything in details. I definitely recommend him.",
    car: "Full Audit",
    badge: "New Customer",
    instagramUrl: "https://www.instagram.com/reel/DVk6xDRk_pS/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
  },
  {
    id: 3,
    name: "Reliant Owner",
    role: "Verified Client",
    location: "Bengaluru",
    photo: "/Testimonials/Testimonial 3.webp",
    rating: 5,
    text: "You have tested everything, even those we forgot to check, you are not like others who get upset when questions asked. You make sure everything is inspected. God bless you in all aspect.",
    car: "Deep Inspection",
    badge: "Verified Buyer",
    instagramUrl: "https://www.instagram.com/reel/DR_WS0Qkwe5/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
  },
  {
    id: 4,
    name: "Overseas Client",
    role: "Expat Buyer",
    location: "Australia / Bengaluru",
    photo: "/Testimonials/Testimonial 4.webp",
    rating: 5,
    text: "I found Farhan on Instagram when I was in Australia. We are very happy with the service and highly recommend, he is true to his name car.diologist, he is very kind and we are greatful to get the service.",
    car: "Remote Inspection",
    badge: "Referred Customer",
    instagramUrl: "https://www.instagram.com/reel/DRgxC1ak_Ga/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
  },
  {
    id: 5,
    name: "Intercity Buyer",
    role: "Smart Investor",
    location: "Delhi to Bengaluru",
    photo: "/Testimonials/Testimonial 5.webp",
    rating: 5,
    text: "I purchased a car from Delhi, I contacted Farhan and he explained me what all needs to be checked before purchasing car. He has inspected the car and list down the repairs and replacements which are suppose to be done immediately and which can be done later.",
    car: "Delhi Segment",
    badge: "Verified Buyer",
    instagramUrl: "https://www.instagram.com/reel/DTCO7qZE0NZ/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
  },
  {
    id: 6,
    name: "Protected Buyer",
    role: "Aware Customer",
    location: "Bengaluru",
    photo: "/Testimonials/Testimonial 6.webp",
    rating: 5,
    text: "I car I saw looks very attractive from outside but when Farhan inspected the car he found out car is accidental, he explains everything in details, I would have purchased car if Farhan wasn’t there today. I am happy with his inspection.",
    car: "Accident Check",
    badge: "Verified Buyer",
    instagramUrl: "https://www.instagram.com/reel/DTNOvDyk0E6/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
  },
  {
    id: 7,
    name: "Bengaluru Local",
    role: "Regular Client",
    location: "Bengaluru",
    photo: "/Testimonials/Testimonial 7.webp",
    rating: 5,
    text: "There is no one in Bengaluru who explains car like Farhan, who every wants to buy used car must consult Farhan.",
    car: "Expert Consult",
    badge: "Repeat Customer",
    instagramUrl: "https://www.instagram.com/reel/DUcerQsk-Xd/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
  },
  {
    id: 8,
    name: "Astute Buyer",
    role: "Detailed Reviewer",
    location: "Bengaluru",
    photo: "/Testimonials/Testimonial 8.webp",
    rating: 5,
    text: "Farhan did a thorough inspection for 3hrs including car hydraulics, he has pointed out some repairs which gave me negotiation point. Every penny I spent on Inspection is worth.",
    car: "Negotiation Support",
    badge: "Verified Buyer",
    instagramUrl: "https://www.instagram.com/reel/DU5gMJZE-Ho/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
  },
];

const badgeStyles: Record<BadgeKey, { color: string; bg: string }> = {
  "Verified Buyer":   { color: "text-emerald-600", bg: "bg-emerald-50" },
  "Repeat Customer":  { color: "text-blue-600", bg: "bg-blue-50" },
  "Referred Customer":{ color: "text-indigo-600", bg: "bg-indigo-50" },
  "New Customer":     { color: "text-teal-600", bg: "bg-teal-50" },
};

// ── Sub-components ─────────────────────────────────────


function TestimonialCard({ item, direction }: { item: Testimonial; direction: number }) {
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <motion.a 
      layout
      layoutId={String(item.id)}
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      href={item.instagramUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      whileHover={{ y: -8 }}
      transition={{ 
        layout: { duration: 0.5, ease: "easeInOut" },
        x: { duration: 0.5, ease: "easeInOut" },
        opacity: { duration: 0.4 },
        y: { duration: 0.3 }
      }}
      style={{ isolation: "isolate" }}
      className="group relative h-[450px] w-full rounded-[2.5rem] overflow-hidden bg-black shadow-2xl flex flex-col justify-end p-8 border border-white/10 block will-change-transform"
    >
      {/* Video/Story Background Placeholder */}
      <div className="absolute inset-0 opacity-60 group-hover:opacity-40 transition-opacity">
         <Image 
           src={item.photo} 
           alt="Testimonial Background"
           fill
           sizes="(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 50vw"
           className="object-cover"
         />
      </div>
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-between p-6">
          {/* Top badge */}
          <div className="flex justify-end w-full">
            <div className={`px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 text-[9px] font-black uppercase tracking-widest shadow-sm`}>
               {item.badge}
            </div>
          </div>
      </div>
      
      {/* Play Button Icon Overlay */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
         <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl">
            <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
         </div>
      </div>

      <div className="relative z-10 space-y-4">
        <div className="flex gap-1 mb-2">
          {Array.from({ length: item.rating }).map((_, i) => (
            <Star key={i} size={12} className="fill-blue-500 text-blue-500" />
          ))}
        </div>
        
        <p className="text-white font-bold leading-relaxed line-clamp-3 text-sm italic">
          &ldquo;{item.text}&rdquo;
        </p>

        <div className="flex items-center gap-4 py-4 border-t border-white/10">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20">
            <Image src={item.photo} alt={item.name} width={40} height={40} className="object-cover" />
          </div>
          <div>
            <h4 className="font-black text-white text-xs tracking-tight text-left">{item.name}</h4>
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest truncate">{item.car.split(" ").slice(-1)} Driver</p>
          </div>
        </div>
      </div>
    </motion.a>
  );
}

// ── Main Component ─────────────────────────────────────
export default function Testimonials() {
  const [startIndex, setStartIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [visibleCount, setVisibleCount] = useState(6);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setVisibleCount(2);
      else if (window.innerWidth < 1024) setVisibleCount(4);
      else setVisibleCount(6);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const next = () => {
    setDirection(1);
    setStartIndex(prev => Math.min(prev + 2, testimonials.length - visibleCount));
  };
  const prev = () => {
    setDirection(-1);
    setStartIndex(prev => Math.max(prev - 2, 0));
  };

  const visibleItems = testimonials.slice(startIndex, startIndex + visibleCount);

  return (
    <main ref={containerRef} className="relative min-h-screen bg-[#F8FAFC] text-[#0f172a] pt-10 md:pt-24 pb-16 md:pb-32 overflow-hidden">
      {/* Background radial gradients */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-indigo-500/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* ── HEADER ── */}
        <section className="text-center mb-10 md:mb-16">
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



        {/* ── TESTIMONIAL SLIDING WINDOW CAROUSEL ── */}
        <section className="mb-20 md:mb-32 relative px-4 md:px-12">
           <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
              <div>
                <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4">Community</h2>
                <h3 className="text-3xl md:text-5xl font-black tracking-tighter">Voices of <span className="text-blue-500">Satisfaction.</span></h3>
              </div>
           </div>
           
           <div className="relative flex items-center justify-center group/carousel">
              {/* Navigation Arrows */}
              <button 
                onClick={prev}
                disabled={startIndex === 0}
                className="absolute left-[-20px] md:left-[-60px] z-20 w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                <ChevronLeft size={20} className="text-[#0f172a] group-hover:text-blue-500 transition-colors" />
              </button>

              <div className="flex-1 max-w-6xl py-8 overflow-hidden">
                <LayoutGroup>
                  <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12"
                  >
                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                      {visibleItems.map((item) => (
                        <motion.div 
                          key={item.id} 
                          layout
                          className="flex justify-center flex-1"
                        >
                          <TestimonialCard item={item} direction={direction} />
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </motion.div>
                </LayoutGroup>
              </div>

              <button 
                onClick={next}
                disabled={startIndex >= testimonials.length - visibleCount}
                className="absolute right-[-20px] md:right-[-60px] z-20 w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg disabled:opacity-30 disabled:cursor-not-allowed group"
              >
                <ChevronRight size={20} className="text-[#0f172a] group-hover:text-blue-500 transition-colors" />
              </button>
           </div>

           {/* Dots Indicator */}
           <div className="flex items-center justify-center gap-3 mt-12">
              {[0, 2].map((step) => (
                <button 
                  key={step}
                  onClick={() => setStartIndex(step)}
                  className={`h-1.5 transition-all duration-300 rounded-full ${startIndex === step ? 'w-8 bg-blue-500' : 'w-2 bg-slate-200 hover:bg-slate-300'}`}
                  aria-label={`Go to step ${step}`}
                />
              ))}
           </div>
        </section>

        {/* ── STATS BAR ── */}
        <StatisticsSection />

        {/* ── CTA ── */}
        <section className="mt-16 md:mt-24 text-center">
            <h4 className="text-2xl md:text-4xl font-black mb-6 tracking-tighter">Ready to write your <span className="text-blue-500">own story?</span></h4>
            <button className="bg-gradient-to-br from-[#0A2A6E] to-[#1B4FD8] text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:scale-[1.05] active:scale-[0.95] transition-all shadow-2xl shadow-blue-900/40 flex items-center gap-3 mx-auto group">
               Start My Journey
               <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
        </section>

      </div>
    </main>
  );
}
