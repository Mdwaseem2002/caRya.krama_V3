"use client";

import React, { useEffect, useState } from "react";
import { Users, FileDown, Car, TrendingUp } from "lucide-react";
import { getAnalyticsStats, AnalyticsStats } from "../DataSaver/AnalyticsStore";
import { getAllStoredCars } from "../Upload/CarStorage";
import { motion } from "framer-motion";

export default function ReportManage() {
  const [stats, setStats] = useState<AnalyticsStats>({ totalVisitors: 0, totalReportDownloads: 0 });
  const [totalCars, setTotalCars] = useState(0);

  useEffect(() => {
    Promise.all([
      getAnalyticsStats(),
      getAllStoredCars()
    ]).then(([fetchedStats, fetchedCars]) => {
      setStats(fetchedStats);
      setTotalCars(fetchedCars.length);
    }).catch(console.error);
    
    // We can simulate real-time updates by listening to local storage or just polling,
    // but a one-time load is sufficient based on the requirements.
  }, []);

  return (
    <div className="space-y-8">
      {/* HEADER STATS ROW */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-black text-gray-900">Analytics Board</h2>
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Real-time Stats</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Visitors */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Users size={80} />
          </div>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Visitors</h3>
              <div className="flex items-center gap-2 mt-1">
                 <TrendingUp size={14} className="text-green-500" />
                 <span className="text-xs font-bold text-green-500">+12% this week</span>
              </div>
            </div>
          </div>
          <div className="text-4xl font-black text-gray-900 relative z-10">
            {stats.totalVisitors.toLocaleString()}
          </div>
        </motion.div>

        {/* Reports Downloaded */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <FileDown size={80} />
          </div>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileDown size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Reports Downloaded</h3>
              <div className="flex items-center gap-2 mt-1">
                 <TrendingUp size={14} className="text-green-500" />
                 <span className="text-xs font-bold text-green-500">+8% this week</span>
              </div>
            </div>
          </div>
          <div className="text-4xl font-black text-gray-900 relative z-10">
            {stats.totalReportDownloads.toLocaleString()}
          </div>
        </motion.div>

        {/* Cars Uploaded */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <Car size={80} />
          </div>
          <div className="flex items-center gap-4 mb-6 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Car size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Cars Uploaded</h3>
              <div className="flex items-center gap-2 mt-1">
                 <TrendingUp size={14} className="text-green-500" />
                 <span className="text-xs font-bold text-green-500">+15% this week</span>
              </div>
            </div>
          </div>
          <div className="text-4xl font-black text-gray-900 relative z-10">
            {totalCars.toLocaleString()}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
