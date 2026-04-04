"use client";

import Image from "next/image";
import { Phone, Clock, Mail, MapPin, Globe, ArrowUpRight, MessageSquare, ShieldCheck } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";

export default function Contact() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(() => {
    gsap.from(".reveal-item", {
      opacity: 0,
      y: 30,
      duration: 1,
      stagger: 0.15,
      ease: "power3.out",
    });
  }, { scope: containerRef });

  return (
    <main ref={containerRef} className="relative min-h-screen bg-[#F8FAFC] text-[#0f172a] pt-24 pb-32 overflow-hidden">
      {/* Background gradients */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-500/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        
        {/* ── HEADER ── */}
        <section className="text-center mb-24 reveal-item">
          <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/5 backdrop-blur-md border border-blue-500/10 mb-6 group">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-500/60 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
              The Communication Node
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-8 leading-[1.1]">
            Connect with <br />
            <span className="text-blue-500">The Source.</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium">
            Deploy your inquiries directly to our central response team. We operate with absolute precision and transparency.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* ── LEFT: INFORMATION HUB ── */}
          <div className="space-y-8 reveal-item">
            
            {/* Showroom Visual */}
            <div className="relative w-full h-64 md:h-80 rounded-[2.5rem] overflow-hidden border border-white/5 group shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1200&auto=format&fit=crop"
                alt="caRyakrama Bengaluru Showroom"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent h-[60%] top-auto border-none"></div>
              
              {/* Scanline Overlay */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,128,0.06))] bg-[length:100%_4px,3px_100%]"></div>

              <div className="absolute bottom-8 left-8 z-10 w-full drop-shadow-sm">
                 <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                    <ShieldCheck size={12} /> Operational Center
                 </div>
                 <h2 className="text-2xl font-black tracking-tight text-white">Bengaluru Showroom</h2>
              </div>
            </div>

            {/* Direct Connect Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <a
                href="tel:+919900187847"
                className="flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-[#0A2A6E] to-[#1B4FD8] text-white p-8 rounded-[2rem] transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-500/20 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                   <Phone size={24} />
                </div>
                <div className="text-center font-black uppercase tracking-widest text-[11px]">Direct Line</div>
              </a>
              <a
                href="mailto:info@caryakrama.in"
                className="flex flex-col items-center justify-center gap-4 glass-light border border-white/40 text-[#0f172a] p-8 rounded-[2rem] transition-all hover:bg-white/80 hover:scale-[1.02] active:scale-95 group shadow-sm"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-500/5 flex items-center justify-center group-hover:scale-110 transition-transform border border-blue-500/10">
                   <Mail size={24} className="text-blue-500" />
                </div>
                <div className="text-center font-black uppercase tracking-widest text-[11px]">Secure Mail</div>
              </a>
            </div>

            {/* Detailed Info Tiles */}
            <div className="glass-light border border-white/40 backdrop-blur-3xl rounded-[2.5rem] p-4 divide-y divide-slate-100/50 shadow-sm relative overflow-hidden">
               <div className="absolute inset-0 bg-white/5 -z-10" />
              {[
                { icon: Phone, label: "Direct Support", value: "+91 99001 87847", link: "tel:+919900187847" },
                { icon: Clock, label: "Response Window", value: "Sun–Sat : 9 AM – 12 AM", link: null },
                { icon: Globe, label: "Global Outreach", value: "info@caryakrama.in", link: "mailto:info@caryakrama.in" }
              ].map((item, i) => (
                <div key={i} className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-6 py-8 gap-4 sm:gap-0 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-slate-100">
                      <item.icon size={18} className="text-blue-500" />
                    </div>
                    <div>
                      <div className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{item.label}</div>
                      {item.link ? (
                        <a href={item.link} className="text-sm font-black tracking-tight group-hover:text-blue-500 transition-colors uppercase text-[#0f172a]">{item.value}</a>
                      ) : (
                        <div className="text-sm font-black tracking-tight uppercase text-[#0f172a]">{item.value}</div>
                      )}
                    </div>
                  </div>
                  {item.link && (
                    <ArrowUpRight size={20} className="text-slate-200 group-hover:text-blue-500 transition-all group-hover:translate-x-1 group-hover:-translate-y-1" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: INTERACTIVE MAP ── */}
          <div className="flex flex-col gap-8 reveal-item lg:pt-12">
            
            <div className="glass-light border border-white/40 rounded-[2.5rem] p-10 relative overflow-hidden group shadow-sm">
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                  <div>
                    <p className="text-slate-500 text-sm font-medium leading-[2] flex items-start gap-3 uppercase tracking-tighter">
                      <MapPin size={18} className="text-blue-500 shrink-0 mt-1" />
                      <span className="animate-pulse text-blue-600 font-extrabold text-lg">Location Revealing soon</span>
                    </p>
                  </div>
                </div>
            </div>

            {/* Map Container - Coming Soon Placeholder */}
            <div className="flex-1 min-h-[450px] rounded-[3rem] overflow-hidden border border-white/40 shadow-2xl relative glass-light flex items-center justify-center group">
               {/* Animated Placeholder Background */}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50 via-white to-white opacity-50"></div>
               
               <div className="relative z-10 flex flex-col items-center text-center p-8">
                  <div className="relative mb-8">
                     {/* Radar Pulse Effect */}
                     <motion.div
                       animate={{ scale: [1, 1.5, 2], opacity: [0.3, 0.1, 0] }}
                       transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
                       className="absolute inset-0 border-2 border-blue-400 rounded-full"
                     />
                     <motion.div
                       animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                       transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                       className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-200 relative z-10"
                     >
                        <MapPin size={32} className="text-blue-500 animate-bounce" />
                     </motion.div>
                  </div>
                  
                  <h3 className="text-2xl font-black mb-2 tracking-tighter text-[#0f172a]">Map Coming Soon</h3>
                  <p className="text-xs font-black uppercase tracking-[0.4em] text-blue-400 animate-pulse">Establishing Connection Protocols...</p>
               </div>

               {/* Scanline/Grid Effect */}
               <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,128,0.06))] bg-[length:100%_4px,3px_100%]"></div>
               <div className="absolute inset-0 pointer-events-none border-[12px] border-[#F8FAFC] rounded-[3rem]"></div>
            </div>

            {/* Quick Contact Line */}
            <div className="bg-blue-50 border border-blue-500/10 rounded-[2rem] p-8 flex items-center justify-between group cursor-default shadow-sm">
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center border border-blue-200">
                     <MessageSquare size={22} className="text-blue-600" />
                  </div>
                  <div>
                     <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mb-1">Instant Reach</div>
                     <div className="text-lg font-black tracking-tight text-[#0f172a]">Rapid Response Protocols Engaged</div>
                  </div>
               </div>
               <div className="hidden sm:flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-green-500">Live</span>
               </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}
