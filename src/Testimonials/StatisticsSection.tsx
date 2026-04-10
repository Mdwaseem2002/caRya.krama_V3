"use client";

import React, { useEffect } from "react";
import { motion, useSpring, useTransform, useInView } from "framer-motion";

const Counter = ({ value }: { value: string }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  // Extract number from string (e.g., "500+" -> 500, "4.9★" -> 4.9, "100%" -> 100, "3 min" -> 3)
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  const spring = useSpring(0, { bounce: 0, duration: 2000 });
  const display = useTransform(spring, (current) => {
    const isDecimal = value.includes('.');
    if (isDecimal) return current.toFixed(1);
    return Math.floor(current).toLocaleString();
  });

  useEffect(() => {
    if (isInView) {
      spring.set(numericValue);
    }
  }, [isInView, spring, numericValue]);

  return (
    <span ref={ref}>
      <motion.span>{display}</motion.span>
      {value.replace(/[0-9.]/g, '')}
    </span>
  );
};

const StatisticsSection = () => {
  const stats = [
    { value: "500+", label: "Elite Buyers", color: "text-blue-500" },
    { value: "4.9★", label: "Average Rating", color: "text-indigo-500" },
    { value: "100%", label: "Verified Assets", color: "text-teal-500" },
    { value: "3 min", label: "Response Rate", color: "text-blue-400" },
  ];

  return (
    <section className="bg-white border border-slate-100 rounded-[2.5rem] p-12 md:p-20 grid grid-cols-2 md:grid-cols-4 gap-12 text-center shadow-sm relative overflow-hidden">
      {/* Background Subtle Shape */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl pointer-events-none" />
      
      {stats.map((stat, index) => (
        <motion.div 
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.1 }}
          whileHover={{ scale: 1.05 }}
          className="relative z-10"
        >
          <div className={`text-4xl md:text-5xl font-black mb-2 tracking-tighter ${stat.color}`}>
            <Counter value={stat.value} />
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]"
          >
            {stat.label}
          </motion.div>
        </motion.div>
      ))}
    </section>
  );
};

export default StatisticsSection;
