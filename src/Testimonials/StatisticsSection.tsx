"use client";

import React from "react";

const StatisticsSection = () => {
  const stats = [
    { value: "500+", label: "Elite Buyers", color: "text-blue-500" },
    { value: "4.9★", label: "Average Rating", color: "text-indigo-500" },
    { value: "100%", label: "Verified Assets", color: "text-teal-500" },
    { value: "3 min", label: "Response Rate", color: "text-blue-400" },
  ];

  return (
    <section className="bg-white border border-slate-100 rounded-[2.5rem] p-12 md:p-20 grid grid-cols-2 md:grid-cols-4 gap-12 text-center shadow-sm">
      {stats.map((stat) => (
        <div key={stat.label}>
          <div className={`text-4xl md:text-5xl font-black mb-2 tracking-tighter ${stat.color}`}>
            {stat.value}
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
            {stat.label}
          </div>
        </div>
      ))}
    </section>
  );
};

export default StatisticsSection;
