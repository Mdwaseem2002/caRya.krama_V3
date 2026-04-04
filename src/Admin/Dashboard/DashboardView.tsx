"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, FileText, Car, IndianRupee, TrendingUp, Activity, 
  Plus, FilePlus, CreditCard, CheckCircle2, AlertCircle, ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { getAnalyticsStats, getAllPayments, AnalyticsStats, PaymentRecord } from "../DataSaver/AnalyticsStore";
import { getAllStoredCars } from "../Upload/CarStorage";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function DashboardView({ 
  onAction 
}: { 
  onAction: (tab: "cars" | "reports" | "payments", action?: string) => void 
}) {
  const [stats, setStats] = useState<AnalyticsStats>({ totalVisitors: 0, totalReportDownloads: 0 });
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [totalCars, setTotalCars] = useState(0);
  const mobile = useIsMobile();

  useEffect(() => {
    Promise.all([
      getAnalyticsStats(),
      getAllPayments(),
      getAllStoredCars()
    ]).then(([fetchedStats, fetchedPayments, fetchedCars]) => {
      setStats(fetchedStats);
      setPayments(fetchedPayments);
      setTotalCars(fetchedCars.length);
    }).catch(console.error);
  }, []);

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);

  // MOCK GRAPH DATA
  const revenueHeights = [30, 50, 45, 80, 60, 90, 100]; // Last 7 days
  const activityHeights = [40, 60, 30, 70, 50, 85, 95];

  return (
    <div className="relative min-h-screen space-y-8 pb-12">
      {/* Background radial gradient for depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-indigo-500/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="space-y-6 md:space-y-8">
      
      {/* 1. TOP STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: "Visitors", value: stats.totalVisitors, trend: "+12%", color: "text-blue-500", icon: Users },
          { label: "Reports Sold", value: stats.totalReportDownloads, trend: "+8%", color: "text-indigo-500", icon: FileText },
          { label: "Cars Uploaded", value: totalCars, trend: "+15%", color: "text-teal-500", icon: Car },
          { label: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, trend: "+24%", color: "text-green-500", icon: IndianRupee },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.5 }}
            className="bg-white border border-gray-100 rounded-[2.25rem] p-6 relative overflow-hidden shadow-sm group hover:shadow-md hover:border-blue-100 transition-all duration-500"
          >
            <div className={`absolute -right-4 -top-4 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity ${stat.color}`}>
               <stat.icon size={80} strokeWidth={1} />
            </div>
            <div className="flex flex-col h-full justify-between relative z-10">
               <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm group-hover:scale-110 transition-transform ${stat.color}`}>
                    <stat.icon size={22} />
                  </div>
                  <div className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold border border-green-100">
                    <TrendingUp size={12} strokeWidth={3} /> {stat.trend}
                  </div>
               </div>
               <div>
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-2">{stat.label}</h3>
                  <div className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">{stat.value.toLocaleString()}</div>
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* 2. GRAPHS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Graph */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-[2.25rem] p-8 flex flex-col h-[350px] group hover:border-blue-100 transition-all duration-500">
           <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-3 mb-2">
                   <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                     <IndianRupee size={16} className="text-blue-600" />
                   </div>
                   Revenue Growth
                </h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest px-11">Financial Performance</p>
              </div>
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 uppercase tracking-widest">Last 7 Days</span>
           </div>
           <div className="flex-1 flex items-end justify-between gap-3 mt-auto px-2">
             {revenueHeights.map((h, i) => (
               <div key={i} className="w-full bg-gray-50 rounded-2xl relative group h-full flex items-end overflow-hidden border border-gray-100">
                 <motion.div 
                   initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 1.2, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                   className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-xl group-hover:to-blue-500 transition-all shadow-sm"
                 ></motion.div>
               </div>
             ))}
           </div>
        </div>

        {/* Activity Graph */}
        <div className="bg-white border border-gray-100 shadow-sm rounded-[2.25rem] p-8 flex flex-col h-[350px] group hover:border-indigo-100 transition-all duration-500">
           <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest flex items-center gap-3 mb-2">
                   <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100">
                     <Activity size={16} className="text-indigo-600" />
                   </div>
                   Platform Engagement
                </h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest px-11">Active Interaction</p>
              </div>
           </div>
           <div className="flex-1 flex items-end justify-between gap-3 mt-auto px-2">
             {activityHeights.map((h, i) => (
               <div key={i} className="w-full bg-gray-50 rounded-2xl relative group h-full flex items-end overflow-hidden border border-gray-100">
                 <motion.div 
                   initial={{ height: 0 }} animate={{ height: `${h}%` }} transition={{ duration: 1.2, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                   className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-xl group-hover:to-indigo-500 transition-all shadow-sm"
                 ></motion.div>
               </div>
             ))}
           </div>
        </div>
      </div>

      {/* 3. MIDDLE: ACTIVITY + TOP CARS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         
         {/* Recent Activity */}
         <div className="bg-white border border-gray-100 shadow-sm rounded-[2.25rem] p-8 hover:shadow-md transition-all duration-500">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-10 flex items-center gap-3">
               <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-100">
                 <Activity size={16} className="text-blue-600" />
               </div>
               Live Updates
            </h3>
            <div className="space-y-6">
               {[
                 { icon: Car, text: "New car added: Fortuner Legender", time: "10 mins ago", color: "text-teal-600", bg: "bg-teal-50 border-teal-100" },
                 { icon: FileText, text: "Report downloaded by John", time: "25 mins ago", color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-100" },
                 { icon: IndianRupee, text: "Payment received ₹299", time: "1 hour ago", color: "text-green-600", bg: "bg-green-50 border-green-100" },
                 { icon: Users, text: "New user signed up", time: "2 hours ago", color: "text-blue-600", bg: "bg-blue-50 border-blue-100" },
                 { icon: CheckCircle2, text: "System sync completed", time: "5 hours ago", color: "text-gray-600", bg: "bg-gray-100 border-gray-200" }
               ].map((act, i) => (
                 <div key={i} className="flex items-center gap-5 group cursor-default">
                    <div className={`w-12 h-12 rounded-2xl ${act.bg} ${act.color} flex items-center justify-center shrink-0 border group-hover:scale-110 transition-transform`}>
                      <act.icon size={20} />
                    </div>
                    <div className="flex-1 border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                      <div className="text-sm font-bold text-gray-800 tracking-tight group-hover:text-blue-600 transition-colors uppercase">{act.text}</div>
                      <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1.5">{act.time}</div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Top Performing Cars */}
         <div className="bg-gradient-to-br from-[#0A2A6E] via-[#1B4FD8] to-[#0A2A6E] rounded-[2.25rem] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-white/10 blur-[100px] rounded-full group-hover:bg-white/15 transition-all duration-700"></div>
            <div className="absolute -right-12 -bottom-12 opacity-[0.08] group-hover:rotate-12 transition-transform duration-1000">
               <Car size={280} strokeWidth={1} />
            </div>
            
            <div className="relative z-10 flex flex-col h-full">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-10 text-white/50">
                 Market Intelligence
              </h3>
              
              <div className="space-y-6 flex-1">
                 <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-md group/card hover:bg-white/10 transition-all">
                    <div className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                       <TrendingUp size={12} className="text-blue-300" /> Performance Leader
                    </div>
                    <div className="text-xl font-black text-white tracking-tight">Fortuner Legender</div>
                    <div className="mt-3 text-[10px] text-white/30 uppercase font-black tracking-[0.2em]">3,492 Unique Views</div>
                 </div>

                 <div className="bg-white/5 border border-white/10 rounded-[2rem] p-6 backdrop-blur-md group/card hover:bg-white/10 transition-all">
                    <div className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                       <FileText size={12} className="text-blue-300" /> High Demand Asset
                    </div>
                    <div className="text-xl font-black text-white tracking-tight">BMW 530i M Sport</div>
                    <div className="mt-3 text-[10px] text-white/30 uppercase font-black tracking-[0.2em]">142 Reports Sold</div>
                 </div>
              </div>
              
              <div className="mt-auto pt-8 flex items-center justify-between text-white/30">
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Real-time Data</span>
                <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
         </div>
      </div>

      {/* 4. BOTTOM: QUICK ACTIONS + SYSTEM STATUS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* Quick Actions */}
         <div className="lg:col-span-2 bg-white border border-gray-100 shadow-sm rounded-[2.25rem] p-8 hover:shadow-md transition-all duration-500 flex flex-col justify-center">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-10">Management Suite</h3>
            <div className="flex flex-wrap gap-5">
               <button 
                 onClick={() => onAction("cars", "upload")}
                 className="flex-1 min-w-[180px] bg-gradient-to-br from-[#0A2A6E] to-[#1B4FD8] hover:scale-[1.02] active:scale-[0.98] text-white p-6 rounded-[2rem] transition-all shadow-xl shadow-blue-900/10 group flex flex-col justify-between h-[160px]"
               >
                 <div className="bg-white/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-white/10">
                    <Plus size={24} />
                 </div>
                 <div className="text-left">
                   <div className="font-black text-lg tracking-tight">Add Inventory</div>
                   <div className="text-[10px] text-white/60 uppercase font-black tracking-widest mt-2">Upload New Asset</div>
                 </div>
               </button>
               
               <button 
                 onClick={() => onAction("reports")}
                 className="flex-1 min-w-[180px] bg-gray-50 border border-gray-100 hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] text-gray-900 p-6 rounded-[2rem] transition-all group flex flex-col justify-between h-[160px] shadow-sm"
               >
                 <div className="bg-indigo-50 text-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-indigo-100">
                    <FilePlus size={24} />
                 </div>
                 <div className="text-left">
                   <div className="font-black text-lg tracking-tight">Intelligence</div>
                   <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-2">Generate Reports</div>
                 </div>
               </button>

               <button 
                 onClick={() => onAction("payments")}
                 className="flex-1 min-w-[180px] bg-gray-50 border border-gray-100 hover:bg-gray-100 hover:scale-[1.02] active:scale-[0.98] text-gray-900 p-6 rounded-[2rem] transition-all group flex flex-col justify-between h-[160px] shadow-sm"
               >
                 <div className="bg-teal-50 text-teal-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform border border-teal-100">
                    <CreditCard size={24} />
                 </div>
                 <div className="text-left">
                   <div className="font-black text-lg tracking-tight">Treasury</div>
                   <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest mt-2">Financial Records</div>
                 </div>
               </button>
            </div>
         </div>

         {/* System Status */}
         <div className="bg-[#0A0A0B] border border-white/5 rounded-[2.25rem] p-8 text-white shadow-2xl flex flex-col justify-center relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
               <CheckCircle2 size={180} strokeWidth={1} />
            </div>
            <h3 className="text-sm font-bold text-white/30 uppercase tracking-widest mb-10">Infrastructure Status</h3>
            <div className="space-y-6 relative z-10">
               {[
                 { label: "Mainframe Core", status: "Operational", color: "bg-green-500" },
                 { label: "Payment Gateway", status: "Active", color: "bg-green-500" },
                 { label: "Data Integrity", status: "Synced", color: "bg-green-500" }
               ].map((sys, i) => (
                 <div key={i} className="flex items-center justify-between border-b border-white/5 pb-4 last:border-0 last:pb-0">
                    <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">{sys.label}</span>
                    <div className="flex items-center gap-3">
                       <span className="text-[10px] font-black text-white uppercase tracking-widest">{sys.status}</span>
                       <div className={`w-1.5 h-1.5 rounded-full ${sys.color} shadow-[0_0_12px_rgba(34,197,94,0.6)] animate-pulse`}></div>
                    </div>
                 </div>
               ))}
            </div>
            <div className="mt-10 pt-8 border-t border-white/5 flex items-center justify-between">
               <div className="flex flex-col">
                 <span className="text-[9px] text-white/20 font-black uppercase tracking-[0.2em] mb-2">Node Identifier</span>
                 <span className="text-xs font-black text-blue-500 font-mono tracking-tighter">CX_SOVEREIGN_NODE_01</span>
               </div>
               <Activity size={18} className="text-blue-500 animate-breathe" />
            </div>
         </div>

      </div>
    </div>
    </div>
  );
}
