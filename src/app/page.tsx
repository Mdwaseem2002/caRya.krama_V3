"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Hero from "@/Home/Hero";
import ValueProp from "@/Home/ValueProp";
import ShowCar from "@/Home/ShowCar";
import HowItWorks from "@/Home/HowItWorks";
import InspectedCar from "@/Home/InspectedCar";
import OurStory from "@/Home/OurStory";
import TestimonialsHome from "@/Testimonials/testimonialsHome";
import VisitorTracker from "@/components/VisitorTracker";
import TrustSections from "@/Details/Trust/TrustSections";
import SearchEngine from "@/Details/SearchEngine/SearchEngine";
import StatisticsSection from "@/Testimonials/StatisticsSection";
import Splash from "@/Details/Animation/Splash";
import { getSplashShown, setSplashShown } from "@/lib/splashState";

export default function Home() {
  const [showSplash, setShowSplash] = useState(() => {
    // Check if splash was already shown in this running instance (before navigation)
    return !getSplashShown();
  });

  useEffect(() => {
    // Force body background to black while splash is active to prevent white flashes
    if (showSplash) {
      document.body.style.backgroundColor = "#030303";
    } else {
      // Once splash is gone, ensure we don't show it again on navigation
      setSplashShown(true);
      
      const timer = setTimeout(() => {
        document.body.style.backgroundColor = "";
      }, 1200); // Match Splash exit duration
      return () => clearTimeout(timer);
    }
  }, [showSplash]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <main className={`relative min-h-screen ${showSplash ? "bg-[#030303]" : "bg-transparent"}`}>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <Splash key="splash" onComplete={handleSplashComplete} />
        ) : (
          <motion.div
            key="home-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <VisitorTracker />
            <Hero />
            <ValueProp />
            <ShowCar />
            <HowItWorks />
            <TrustSections />
            <InspectedCar />
            <OurStory />
            <div className="max-w-7xl mx-auto px-6 mb-20">
              <StatisticsSection />
            </div>
            <TestimonialsHome />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
