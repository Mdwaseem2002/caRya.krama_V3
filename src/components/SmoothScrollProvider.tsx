"use client";

import { useEffect, ReactNode } from "react";

/**
 * SmoothScrollProvider initialises Lenis + GSAP ScrollTrigger.
 * It is SSR-safe because it only executes the heavy animation logic
 * inside the useEffect (client-side only).
 */
export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Only initialize if the user hasn't requested reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let lenis: any;
    let ctx: any;

    const initScroll = async () => {
      // Dynamic imports inside useEffect ensure these heavy libs are not touched during SSR
      const Lenis = (await import("lenis")).default;
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      gsap.registerPlugin(ScrollTrigger);

      lenis = new Lenis({
        lerp: 0.08,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });

      lenis.on('scroll', ScrollTrigger.update);

      // Sync with GSAP ticker
      ctx = gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    };

    initScroll();

    return () => {
      if (lenis) lenis.destroy();
      // Cleanup ticker if needed (GSAP handles ctx cleanup usually but good to be explicit)
    };
  }, []);

  return <>{children}</>;
}
