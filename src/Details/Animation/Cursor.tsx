"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function Cursor() {
  const [hovered, setHovered] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Mouse position values
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Spring configuration for smooth "lag" animation
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const mainX = useSpring(mouseX, { damping: 30, stiffness: 1000 });
  const mainY = useSpring(mouseY, { damping: 30, stiffness: 1000 });
  const trailX = useSpring(mouseX, springConfig);
  const trailY = useSpring(mouseY, springConfig);

  useEffect(() => {
    setMounted(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === "button" ||
        target.tagName.toLowerCase() === "a" ||
        target.closest("button") ||
        target.closest("a") ||
        target.getAttribute("role") === "button"
      ) {
        setHovered(true);
      } else {
        setHovered(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <>
      {/* Outer Ring (Trailing Circle) */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-blue-500 rounded-full pointer-events-none z-[9999] hidden md:block"
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
          scale: hovered ? 1.8 : 1,
          opacity: 1,
        }}
        transition={{ type: "spring", damping: 30, stiffness: 200 }}
      >
        <motion.div
          className="absolute inset-0 bg-blue-500/10 rounded-full"
          animate={{ scale: hovered ? 1 : 0 }}
        />
      </motion.div>

      {/* Main Dot */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 bg-blue-600 rounded-full pointer-events-none z-[9999] hidden md:block shadow-[0_0_10px_rgba(37,99,235,0.5)]"
        style={{
          x: mainX,
          y: mainY,
          translateX: "-50%",
          translateY: "-50%",
          scale: hovered ? 0.5 : 1,
        }}
      />

      <style jsx global>{`
        @media (pointer: fine) {
          * {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}
