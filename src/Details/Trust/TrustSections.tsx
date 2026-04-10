"use client";

import React from "react";
import { ShieldCheck, Search, Award, CircleDollarSign, TrendingUp, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function TrustSections() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* ── 1017: PROCUREMENT SECTION ── */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div>
              <div className="inline-block px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">The Sourcing Protocol</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8 leading-tight text-gray-900">
                How We <span className="text-blue-600">Procure</span> <br /> the Best Cars.
              </h2>
              <p className="text-lg text-gray-500 font-medium leading-relaxed max-w-xl">
                We don’t list cars. We curate excellence — only the top-tier vehicles make it through.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {[
                { 
                  icon: Search, 
                  title: "Expert Handpicking", 
                  desc: "Every car is physically scouted by our mechanical enthusiasts, not just listed from a database." 
                },
                { 
                  icon: ShieldCheck, 
                  title: "Multi-Point Audit", 
                  desc: "A exhaustive structural and electrical scan ensures zero accident history and perfect health." 
                },
                { 
                  icon: Award, 
                  title: "Verified History", 
                  desc: "We validate every service log and ownership document to ensure 100% legal and technical clarity." 
                }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 p-6 rounded-[2rem] bg-slate-50 border border-slate-100 hover:border-blue-200 transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-100 shadow-sm group-hover:bg-blue-600 group-hover:border-blue-500 transition-all">
                     <item.icon size={22} className="text-blue-500 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-gray-900 mb-1">{item.title}</h4>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* ── 1016: PRICING MESSAGING ── */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-10 lg:pt-20"
          >
            <div className="bg-[#0f172a] rounded-[3rem] p-10 md:p-14 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
               {/* Background Decorative Element */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
               
               <div className="relative z-10">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 mb-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">Value Transparency</span>
                  </div>
                  
                  <h2 className="text-4xl font-black tracking-tighter mb-8 leading-tight">
                    Fair Pricing <br /> <span className="text-blue-400">Guaranteed.</span>
                  </h2>
                  
                  <p className="text-slate-400 text-lg font-medium leading-relaxed mb-12">
                    No hidden markups or overpriced listings. Every vehicle on caRya.krama is priced based on actual market data and expert condition score.
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-center gap-4 py-4 border-t border-white/10">
                       <CircleDollarSign className="text-emerald-400" size={24} />
                       <div>
                          <h4 className="text-sm font-black uppercase tracking-widest text-white">Market Reasonable</h4>
                          <p className="text-xs text-slate-500 font-bold">Scientific pricing against live market data.</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-4 py-4 border-t border-white/10">
                       <TrendingUp className="text-blue-400" size={24} />
                       <div>
                          <h4 className="text-sm font-black uppercase tracking-widest text-white">Expert Valuation</h4>
                          <p className="text-xs text-slate-500 font-bold">Adjusted for every unique restoration and condition detail.</p>
                       </div>
                    </div>
                  </div>

                  <div className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                     <div className="flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-emerald-500" />
                        <span className="text-xs font-black uppercase tracking-widest text-white">Zero Uncertainty Protocol Engagement</span>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
