"use client";

import { motion } from "framer-motion";
import { ShieldCheck, RefreshCw, FileSearch, BadgeIndianRupee } from "lucide-react";

const valueProps = [
  {
    id: 1,
    title: "Verified Quality Every Time",
    description: "All vehicles are inspected rigorously to ensure pristine condition before they are listed on our website.",
    icon: ShieldCheck,
    color: "#10b981", // Emerald
  },
  {
    id: 2,
    title: "Gearbox and Engine Warranty",
    description: "Coming Soon",
    icon: RefreshCw,
    color: "#3b82f6", // Blue
  },
  {
    id: 3,
    title: "Transparent, Hassle-Free",
    description: "Clear reports, straightforward pricing, and open communication. No hidden fees or surprise charges.",
    icon: FileSearch,
    color: "#f59e0b", // Amber
  },
  {
    id: 4,
    title: "Fair Pricing You Can Trust",
    description: "Pricing meticulously aligned with exact inspection scores and true market reality.",
    icon: BadgeIndianRupee,
    color: "var(--color-gold)",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, y: 0,
    transition: { type: "spring" as const, stiffness: 100, damping: 20 }
  },
};

export default function ValueProp() {
  return (
    <section className="relative md:min-h-screen flex items-center py-8 md:py-20 overflow-hidden" style={{ background: "var(--background)" }}>
      {/* Subtle Background Elements */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          background: `radial-gradient(circle at top right, var(--color-muted) 0%, transparent 40%), 
                       radial-gradient(circle at bottom left, var(--color-royal) 15%, transparent 40%)`
        }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.6 }}
          >
            <span 
              className="inline-block text-xs font-bold tracking-widest px-4 py-2 rounded-full mb-4 bg-royal/10 text-royal"
            >
              THE caRya.krama DIFFERENCE
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-navy">
              Built on Trust. Driven by <span className="text-royal">Quality.</span>
            </h2>
            <p className="text-base md:text-lg" style={{ color: "var(--muted)" }}>
              We've designed every step of our process to deliver the most secure, transparent, Used car buying experience possible.
            </p>
          </motion.div>
        </div>

        {/* Feature Cards Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {valueProps.map((prop) => (
            <motion.div
              key={prop.id}
              variants={cardVariants}
              whileHover={{ 
                y: -8,
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                transition: { duration: 0.3 }
              }}
              className="group relative p-8 rounded-[2rem] h-full flex flex-col overflow-hidden"
              style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}
            >
              {/* Subtle gradient hover effect inside the card */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
                style={{ background: `linear-gradient(135deg, ${prop.color}, transparent)` }}
              />

              {/* Icon Container with 3D Perspective */}
              <div 
                className="w-14 h-14 rounded-2xl mb-6 shadow-sm flex items-center justify-center transition-colors duration-300"
                style={{ 
                  background: `color-mix(in srgb, ${prop.color} 15%, var(--background))`,
                  perspective: "1000px"
                }}
              >
                <motion.div
                  whileHover={{ 
                    rotateX: 15, 
                    rotateY: 15, 
                    z: 20,
                    scale: 1.1
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  className="w-full h-full flex items-center justify-center"
                >
                  <prop.icon className="w-7 h-7" style={{ color: prop.color }} />
                </motion.div>
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold mb-3 leading-tight" style={{ color: "var(--foreground)" }}>
                {prop.title}
              </h3>
              <p className="text-[15px] leading-relaxed flex-grow" style={{ color: "var(--muted)" }}>
                {prop.description}
              </p>

              {/* Bottom Decorative Line */}
              <div 
                className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 ease-out"
                style={{ background: prop.color }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
