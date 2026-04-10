"use client";

import { ShieldCheck, Search, Wrench, ThumbsUp, ClipboardList, Coins, Target, TrendingUp, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function About() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".reveal-item", {
      opacity: 0,
      y: 30,
      duration: 1,
      stagger: 0.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".reveal-item",
        start: "top 85%",
      }
    });
  }, { scope: containerRef });

  const steps = [
    {
      id: 1,
      title: "Handpicked Selection",
      description: "We source only the finest vehicles, filtering out anything with a compromised history.",
      icon: Search,
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    {
      id: 2,
      title: "Quality Inspection",
      description: "Every car undergoes a rigorous mechanical and electrical check by certified experts.",
      icon: Wrench,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10"
    },
    {
      id: 3,
      title: "Exceptional Delivery",
      description: "Your car is detailed, polished, and presented ready for the road with absolute transparency.",
      icon: ThumbsUp,
      color: "text-blue-400",
      bg: "bg-blue-400/10"
    }
  ];

  return (
    <main ref={containerRef} className="relative min-h-screen bg-[#F8FAFC] text-[#0f172a] pt-24 pb-32 overflow-hidden">
      {/* Background radial gradients for depth */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-500/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* ── HEADER SECTION ── */}
        <section className="text-center mb-16 sm:mb-24 reveal-item px-4">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6 group">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              The Visionary Approach
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tighter mb-8 leading-[1.15]">
            Standardizing <span className="text-blue-500">Excellence.</span><br />
            Redefining <span className="text-slate-300">Trust.</span>
          </h1>
          <p className="text-base sm:text-xl md:text-2xl text-slate-500 leading-relaxed max-w-4xl mx-auto font-medium">
            &ldquo;caRya.krama exists to save your time and restore trust in car buying. Every car is inspected, curated, and presented with transparency.&rdquo;
          </p>
        </section>

        {/* ── HERO IMAGE ── */}
        <div className="reveal-item rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-2xl mb-24 sm:mb-32 relative w-full h-[350px] sm:h-[500px] md:h-[650px] group mx-auto">
          <Image
            src="/caRya.png"
            alt="The Sovereign Standard"
            fill
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent sm:h-[60%] top-auto bottom-0 transition-opacity duration-1000"></div>
          <div className="absolute bottom-6 left-6 right-6 sm:bottom-12 sm:left-12 md:left-20 group z-10">
             <div className="hidden sm:inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 mb-6 hover:bg-white/20 transition-all cursor-default shadow-sm text-white">
                <ShieldCheck className="text-blue-400" size={20} />
                <span className="text-xs font-black uppercase tracking-widest">certified standards</span>
             </div>
             <h2 className="text-2xl sm:text-4xl md:text-5xl font-black mb-3 tracking-tighter text-white">The Sovereign Standard</h2>
             <p className="text-white/80 text-[13px] sm:text-base md:text-lg max-w-xl font-medium leading-relaxed italic">Curating only the most verified, inspected vehicles for a clientele that refuses to compromise on quality.</p>
          </div>
        </div>

        {/* ── QUALITY STANDARDS SECTION ── */}
        <section className="mb-40 reveal-item">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8 text-left">
            <div>
              <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4">Quality Control</h2>
              <h3 className="text-3xl md:text-5xl font-black tracking-tighter">Only the elite make the <span className="text-blue-500">cut.</span></h3>
            </div>
            <p className="text-slate-400 max-w-md text-sm md:text-base font-bold uppercase tracking-widest leading-loose">
              Our platform is a curated selection, not a general marketplace. Not every car passes our protocol.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { title: "Expert Inspection", desc: "Every vehicle is thoroughly examined by our certified specialists.", icon: Search, color: "text-blue-500" },
              { title: "Verified Reports", desc: "Only cars that successfully pass the inspection qualify.", icon: ClipboardList, color: "text-indigo-500" },
              { title: "Competitive Pricing", desc: "Listed only if pricing is fair within the current market.", icon: Coins, color: "text-teal-500" },
              { title: "Curated Listings", desc: "Vehicles that meet our quality benchmarks earn a place.", icon: Target, color: "text-blue-400" }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 group hover:border-blue-500/20 transition-all duration-500 hover:-translate-y-2 shadow-sm"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-50 ${item.color} flex items-center justify-center border border-slate-100 mb-6 group-hover:scale-110 transition-transform`}>
                  <item.icon size={24} strokeWidth={2} />
                </div>
                <h4 className="text-lg font-black mb-3 tracking-tight text-[#0f172a]">{item.title}</h4>
                <p className="text-slate-500 text-[13px] leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-white border border-blue-500/10 rounded-[2.25rem] p-8 md:p-10 text-center relative overflow-hidden group shadow-sm">
            <div className="absolute inset-0 bg-blue-500/[0.02] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <p className="relative z-10 font-bold text-lg md:text-2xl tracking-tight leading-relaxed text-[#0f172a]">
              In short: <span className="text-blue-500">If a car is listed on caRya.krama, it has been inspected, verified, and valued by professionals.</span>
            </p>
          </div>
        </section>

        {/* ── TIMELINE SECTION ── */}
        <section className="mb-40 reveal-item">
          <div className="text-center mb-20">
             <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.4em] mb-4">Our Protocol</h2>
             <h3 className="text-3xl md:text-5xl font-black tracking-tighter">How we select your <span className="text-blue-500">perfect ride.</span></h3>
          </div>

          <div className="relative max-w-5xl mx-auto px-4 lg:px-0">
            {/* Minimalist Line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-slate-200 -translate-x-1/2 overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-[30%] bg-gradient-to-b from-transparent via-blue-500 to-transparent animate-scanline"></div>
            </div>

            <div className="space-y-16 lg:space-y-32">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isEven = index % 2 === 0;

                return (
                  <div key={step.id} className={`relative flex flex-col lg:flex-row items-center gap-8 lg:gap-0 ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                    
                    {/* Content */}
                    <div className={`w-full lg:w-[45%] ${isEven ? 'lg:text-right' : 'lg:text-left'} group`}>
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl ${step.bg} ${step.color} mb-6 lg:mb-4 border border-slate-100 shadow-sm`}>
                         <Icon size={22} />
                      </div>
                      <h4 className="text-2xl font-black mb-4 tracking-tight group-hover:text-blue-500 transition-colors text-[#0f172a]">{step.title}</h4>
                      <p className="text-slate-500 text-sm md:text-base leading-loose font-medium">
                        {step.description}
                      </p>
                    </div>

                    {/* Node on Desktop */}
                    <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-slate-200 items-center justify-center z-10 shadow-sm">
                       <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></div>
                    </div>

                    {/* Empty side on Desktop */}
                    <div className="hidden lg:block lg:w-[45%]"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

            {/* ── FINAL STATS ── */}
        <section className="reveal-item">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { value: "Sovereign", label: "Quality Inspected", color: "text-blue-500" },
              { value: "Zero", label: "Hidden Agency Fees", color: "text-indigo-500" },
              { value: "100%", label: "Absolute Transparency", color: "text-teal-500" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-white border border-slate-100 rounded-[2.25rem] p-10 text-center hover:border-blue-500/20 transition-all duration-500 group shadow-sm hover:shadow-xl"
              >
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4 group-hover:text-blue-500 transition-colors">{stat.label}</div>
                <div className={`text-4xl md:text-6xl font-black tracking-tighter ${stat.color} mb-2`}>{stat.value}</div>
              </div>
            ))}
          </div>
          
          <div className="mt-20 text-center">
             <Link href="/BuyCar" className="inline-flex bg-gradient-to-br from-[#0A2A6E] to-[#1B4FD8] text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:scale-[1.05] active:scale-[0.95] transition-all shadow-2xl shadow-blue-500/20 items-center gap-3 mx-auto group">
                Browse Collection
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
             </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
