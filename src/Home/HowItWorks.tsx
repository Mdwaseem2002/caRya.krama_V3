"use client";

import { motion } from "framer-motion";
import { Search, MousePointer2, FileText, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: <Search className="w-8 h-8" />,
    title: "Browse Cars",
    description: "Explore our collection inspected pre loved vehicles",
  },
  {
    icon: <MousePointer2 className="w-8 h-8" />,
    title: "Choose Your Car",
    description: "Find the perfect match that suits your lifestyle and preferences.",
  },
  {
    icon: <FileText className="w-8 h-8" />,
    title: "View Inspection Report",
    description: "Get a detailed inspection report for complete transparency.",
  },
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: "Buy with Confidence",
    description: "Secure your dream car with easy financing and verified documentation.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-12 md:py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Heading Section */}
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl font-black mb-4 tracking-tight text-gray-900"
          >
            Buy Your Perfect Car in <span className="text-[#0059A3]">4 Simple Steps</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-gray-500 font-bold uppercase tracking-widest text-sm"
          >
            A seamless digital-first car buying experience
          </motion.p>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 border-t-2 border-dashed border-blue-200 -z-0" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="flex flex-col items-center text-center group"
              >
                {/* Icon Circle */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-[#0059A3] to-blue-400 flex items-center justify-center text-white shadow-xl group-hover:shadow-blue-300/50 transition-[box-shadow] duration-150 relative z-10">
                    <div className="scale-75 md:scale-100">{step.icon}</div>
                  </div>
                  {/* Outer Glow Effect */}
                  <div className="absolute inset-0 rounded-full bg-blue-400/20 blur-xl group-hover:bg-blue-400/40 transition-colors duration-150 -z-0" />
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-2 -right-1 w-7 h-7 md:w-9 md:h-9 rounded-full bg-white text-[#0059A3] font-black flex items-center justify-center shadow-lg border border-blue-50 text-[10px] md:text-sm z-20">
                    {index + 1}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-base md:text-xl font-black mb-2 text-gray-900 group-hover:text-[#0059A3] transition-colors">
                  {step.title}
                </h3>
                <p className="text-gray-600 font-medium leading-relaxed max-w-[240px] text-xs md:text-base">
                  {step.description}
                </p>

                <div className="lg:hidden h-2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
