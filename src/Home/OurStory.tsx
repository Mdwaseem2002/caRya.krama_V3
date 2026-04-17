"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function OurStory() {
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Text slides from left
    gsap.from(textRef.current, {
      x: -100,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        once: true,
      }
    });

    // Image slides from right
    gsap.from(imageRef.current, {
      x: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
        once: true,
      }
    });
  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef}
      className="w-full md:min-h-screen flex items-center py-8 md:py-20 overflow-hidden bg-ghost"
    >
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Text Content */}
        <div ref={textRef} className="flex flex-col gap-6">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-royal">
            Our Story
          </span>
          <h2 className="text-3xl md:text-6xl font-black leading-tight text-navy">
            Restoring Trust in <br />
            <span className="text-royal">Car Buying.</span>
          </h2>
          <p className="text-base md:text-xl leading-relaxed text-gray-500 max-w-xl">
            caRya.krama exists to save your time and restore trust in car buying. 
            Every car is inspected, curated, and presented with transparency — 
            so you can focus on what matters: finding the perfect vehicle.
          </p>
          
          <Link 
            href="/BuyCar"
            className="inline-flex items-center gap-2 text-sm font-bold text-royal hover:text-sky transition-colors group mt-4"
          >
            Explore Our Cars 
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Image Content */}
        <div ref={imageRef} className="relative aspect-[4/3] md:aspect-video lg:aspect-square w-full rounded-[2.5rem] overflow-hidden shadow-2xl">
          <Image
            src="/Key handovering.png"
            alt="Restoring Trust in Car Buying"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
        </div>

      </div>
    </section>
  );
}
