"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, ArrowRight, Quote, CheckCircle2, TrendingUp, Users, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { testimonials } from "./testimonials";

export default function TestimonialsHome() {
  // Take first 3 testimonials for the home preview
  const featuredTestimonials = testimonials.slice(0, 3);

  return (
    <div className="relative bg-[#F8FAFC] overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* ── TESTIMONIALS SECTION ── */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div className="text-left">
              <div className="inline-block px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">Social Proof</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-4 leading-tight text-[#0f172a]">
                Trusted by <span className="text-blue-500">Industry Leaders.</span>
              </h2>
              <p className="text-slate-500 text-sm md:text-base font-medium max-w-xl">
                Real stories from car buyers across India who prioritized transparency and precision.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredTestimonials.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="group relative h-[450px] rounded-[2.5rem] overflow-hidden bg-black shadow-2xl flex flex-col justify-end p-8 border border-white/10 transition-transform duration-500 hover:-translate-y-2"
              >
                {/* Video/Story Background Placeholder */}
                <div className="absolute inset-0 opacity-60 group-hover:opacity-40 transition-opacity">
                   <Image 
                     src={item.photo} // Using customer photo as background for now, stylized
                     alt="Testimonial Background"
                     fill
                     className="object-cover"
                   />
                </div>
                {/* Cinematic Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                
                {/* Play Button Icon Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-2xl">
                      <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1"></div>
                   </div>
                </div>

                <div className="relative z-10 space-y-4">
                  <div className="flex gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
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
                      <h4 className="font-black text-white text-xs tracking-tight">{item.name}</h4>
                      <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest uppercase truncate">{item.car.split(" ").slice(-1)} Driver</p>
                    </div>
                  </div>

                  <a 
                    href={item.instagramUrl || "https://www.instagram.com/car.diologist.bengaluru/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full bg-white text-black py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300"
                  >
                    Watch Story on IG
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA SECTION ── */}
      <section className="relative py-32 px-6 lg:px-12 overflow-hidden">
        {/* Cinematic gradient mask */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto">
           <div className="bg-white border border-slate-100 rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl">
              {/* Internal glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
              >
                <h2 className="text-4xl md:text-8xl font-black text-[#0f172a] mb-8 tracking-tighter leading-[0.9]">
                  Deploy Your <br className="hidden md:block" />
                  <span className="text-blue-500">Perfect Ride.</span>
                </h2>
                <p className="text-lg md:text-2xl text-slate-500 font-medium mb-16 max-w-2xl mx-auto leading-relaxed">
                  Explore thousands of verified, audited, and trusted assets with absolute confidence. 
                  Your mission starts here.
                </p>

                <Link
                  href="/BuyCar"
                  className="inline-flex items-center gap-4 bg-gradient-to-br from-[#0A2A6E] to-[#1B4FD8] text-white px-12 py-6 rounded-[2.5rem] text-xs font-black uppercase tracking-[0.3em] shadow-2xl shadow-blue-500/30 hover:scale-105 active:scale-95 transition-all group"
                >
                  Explore Inventory
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                </Link>

                {/* Performance Metrics */}
                <div className="mt-24 grid grid-cols-2 md:grid-cols-3 gap-8 pt-12 border-t border-slate-100">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-4 text-blue-500 shadow-sm">
                       <TrendingUp size={20} />
                    </div>
                    <p className="text-2xl md:text-4xl font-black mb-1 tracking-tighter text-[#0f172a]">10,000+</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Assets Deployed</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-4 text-indigo-500 shadow-sm">
                       <Users size={20} />
                    </div>
                    <p className="text-2xl md:text-4xl font-black mb-1 tracking-tighter text-[#0f172a]">98%</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loyalty Index</p>
                  </div>
                  <div className="flex flex-col items-center col-span-2 md:col-span-1">
                    <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mb-4 text-teal-500 shadow-sm">
                       <CheckCircle2 size={20} />
                    </div>
                    <p className="text-2xl md:text-4xl font-black mb-1 tracking-tighter text-[#0f172a]">100%</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Detailed Audits</p>
                  </div>
                </div>
              </motion.div>
           </div>
        </div>
      </section>
    </div>
  );
}
