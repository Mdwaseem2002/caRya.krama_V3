"use client";

import React, { useEffect, useState } from "react";
import { IndianRupee, FileText, Calendar, Filter, Download } from "lucide-react";
import { getAllPayments, PaymentRecord } from "../DataSaver/AnalyticsStore";
import { motion, AnimatePresence } from "framer-motion";

type FilterType = 'current' | '10days' | '30days' | 'year' | 'custom';

export default function PaymentTraker() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [filter, setFilter] = useState<FilterType>('30days');
  const [customRange, setCustomRange] = useState({ min: 1, max: 10 });

  useEffect(() => {
    // In a real app we'd fetch or set this correctly. Here we grab from our mock store.
    getAllPayments().then(setPayments).catch(console.error);
  }, []);

  // Filter Logic
  const filteredPayments = payments.filter(p => {
    const pDate = new Date(p.date);
    const now = new Date();
    
    if (filter === 'current') {
      return pDate.getMonth() === now.getMonth() && pDate.getFullYear() === now.getFullYear();
    } else if (filter === '10days') {
      const tenDaysAgo = new Date();
      tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);
      return pDate >= tenDaysAgo;
    } else if (filter === '30days') {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return pDate >= thirtyDaysAgo;
    } else if (filter === 'custom') {
      const minAgo = new Date();
      minAgo.setDate(minAgo.getDate() - customRange.max);
      
      const maxAgo = new Date();
      maxAgo.setDate(maxAgo.getDate() - customRange.min + 1);
      
      return pDate >= minAgo && pDate <= maxAgo;
    } else {
      // Year
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      return pDate >= oneYearAgo;
    }
  });

  const totalEarnings = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
  const reportsSold = filteredPayments.length; // Assuming each payment is for a report right now

  // Graph data generation (Mock)
  const graphHeights = filter === 'current' 
    ? [20, 30, 45, 10, 60, 40, 80]
    : filter === '10days'
    ? [30, 45, 60, 50, 80, 70, 95, 85, 65, 90]
    : filter === '30days'
    ? [40, 70, 45, 90, 65, 80, 55, 95, 75, 60, 85, 50, 60, 70]
    : [20, 40, 30, 80, 50, 60, 90, 100, 70, 80, 50, 40];

  return (
    <div className="space-y-8">
      
      {/* 1. TOP FILTERS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
           <Filter size={18} className="text-gray-400" />
           Timeframe
        </h2>
        <div className="flex bg-gray-50 p-1 rounded-xl flex-wrap gap-1">
          {[
            { id: '10days', label: 'Last 10 Days' },
            { id: 'current', label: 'This Month' },
            { id: '30days', label: 'Last 30 Days' },
            { id: 'year', label: 'Last Year' },
            { id: 'custom', label: 'Custom Range' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as FilterType)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                filter === f.id 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white hover:shadow-sm'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {filter === 'custom' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 overflow-hidden"
          >
            <span className="text-sm font-bold text-gray-700">Days from:</span>
            <input 
              type="number" 
              min="1"
              value={customRange.min}
              onChange={(e) => setCustomRange(p => ({ ...p, min: parseInt(e.target.value) || 1 }))}
              className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm font-bold text-gray-700">to:</span>
            <input 
              type="number" 
              min={customRange.min}
              value={customRange.max}
              onChange={(e) => setCustomRange(p => ({ ...p, max: parseInt(e.target.value) || customRange.min }))}
              className="w-20 px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-xs text-gray-400 font-medium ml-2">(e.g., 1 to 10 days ago)</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. STATS & GRAPH (BONUS) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            key={`earning-${filter}`}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-[#0059A3] to-[#0077D4] rounded-3xl p-6 text-white shadow-lg overflow-hidden relative"
          >
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <IndianRupee size={120} />
            </div>
            <h3 className="text-white/80 font-bold uppercase tracking-widest text-xs mb-2">Total Earnings</h3>
            <div className="text-4xl font-black mb-1">₹{totalEarnings.toLocaleString()}</div>
            <p className="text-white/60 text-xs font-medium">earned ({filter === 'current' ? 'this month' : filter === '10days' ? 'last 10 days' : filter === 'custom' ? `${customRange.min} to ${customRange.max} days ago` : filter === '30days' ? 'last 30 days' : 'last 12 months'})</p>
          </motion.div>

          <motion.div 
            key={`reports-${filter}`}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex items-center gap-4"
          >
             <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                <FileText size={24} />
             </div>
             <div>
                <div className="text-2xl font-black text-gray-900">{reportsSold}</div>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">Reports Sold</div>
             </div>
          </motion.div>
        </div>

        {/* Payment Graph */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-gray-900 mb-6 uppercase tracking-wider">Revenue Trend</h3>
          <div className="flex-1 flex items-end justify-between gap-1 sm:gap-2 h-[200px] mt-auto">
             <AnimatePresence mode="popLayout">
               {graphHeights.map((h, i) => (
                 <motion.div 
                   key={`${filter}-${i}`}
                   initial={{ height: 0, opacity: 0 }}
                   animate={{ height: `${h}%`, opacity: 1 }}
                   exit={{ height: 0, opacity: 0 }}
                   transition={{ duration: 0.5, delay: i * 0.02 }}
                   className="w-full bg-blue-100 rounded-t-lg relative group"
                 >
                   <div className="absolute inset-x-0 bottom-0 bg-blue-500 rounded-t-lg transition-all h-[50%] group-hover:h-full group-hover:bg-blue-600"></div>
                 </motion.div>
               ))}
             </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 3. TABLE */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
           <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
           <button className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
             <Download size={16} /> Export
           </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
             <thead>
               <tr className="bg-gray-50/50">
                 <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Transaction Ref</th>
                 <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                 <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                 <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                 <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
               {filteredPayments.length === 0 ? (
                 <tr>
                   <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium">
                     No transactions found for this period.
                   </td>
                 </tr>
               ) : (
                 filteredPayments.map(p => (
                   <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                     <td className="px-6 py-4">
                       <span className="text-sm font-bold text-gray-900">{p.id}</span>
                       <div className="text-xs text-gray-400 mt-1">Car: {p.carId}</div>
                     </td>
                     <td className="px-6 py-4">
                       <span className="text-sm font-bold text-gray-900">{p.userName}</span>
                       <div className="text-xs text-gray-500 mt-1">{p.userEmail}</div>
                     </td>
                     <td className="px-6 py-4 text-sm font-black text-gray-900">
                       ₹{p.amount.toLocaleString()}
                     </td>
                     <td className="px-6 py-4 text-sm font-medium text-gray-600 flex items-center gap-2">
                       <Calendar size={14} className="text-gray-400" />
                       {new Date(p.date).toLocaleDateString()}
                     </td>
                     <td className="px-6 py-4">
                       <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                         p.status.toLowerCase() === 'completed' || p.status.toLowerCase() === 'deployed'
                          ? 'bg-green-50 text-green-600'
                          : 'bg-amber-50 text-amber-600'
                       }`}>
                         {p.status}
                       </span>
                     </td>
                   </tr>
                 ))
               )}
             </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
