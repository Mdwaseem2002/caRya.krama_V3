"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  User,
  Heart,
  Bell,
  Phone,
  ShieldCheck,
  BadgeCheck,
  Sparkles,
  CheckCircle2,
  ScanSearch,
  Trophy,
  ClipboardList,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useAuth } from "@/context/AuthContext";

gsap.registerPlugin(ScrollTrigger);

const tickerItems = [
  { icon: CheckCircle2,  label: "Verified Cars Only"           },
  { icon: ScanSearch,    label: "Inspected for Your Confidence" },
  { icon: Trophy,        label: "Handpicked for Enthusiasts"   },
  { icon: ClipboardList, label: "Full Transparency"            },
];

const trustBadges = [
  { icon: BadgeCheck,  label: "Verified Listings"   },
  { icon: Sparkles,    label: "Handpicked Selection" },
  { icon: ShieldCheck, label: "Rigorous Inspection" },
];

const secondaryCTAs = [
  { icon: User,          label: "Login / Sign-Up", href: "#"                          },
  { icon: Heart,         label: "Wishlist",         href: "/wishlist"                 },
  { icon: Bell,          label: "Notifications",    href: "#"                          },
  { icon: Phone,         label: "Call Us",          href: "tel:+919900187847"         },
];

export default function Hero() {
  const { user } = useAuth();
  const containerRef  = useRef<HTMLDivElement>(null);
  const group1Ref     = useRef<HTMLDivElement>(null);  // badge + headline
  const group2Ref     = useRef<HTMLDivElement>(null); // subheadline + badge
  const group3Ref     = useRef<HTMLDivElement>(null);  // badges + CTAs

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Stage 1 – badge + headline
    tl.from(group1Ref.current, { y: 50, opacity: 0, duration: 0.9 })
    // Stage 2 – subheadline (starts after stage 1 finishes)
      .from(group2Ref.current, { y: 20, opacity: 0, duration: 0.8 }, "+= 0.2")
    // Stage 3 – trust badges + CTAs
      .from(group3Ref.current, { y: 30, opacity: 0, duration: 0.8 }, "+= 0.2");

    // MatchMedia removed as it was only used for USP animation
  }, { scope: containerRef });

  return (
    <>
      {/* ── HERO WRAPPER ── */}
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden flex flex-col text-white bg-black min-h-[100svh]"
      >
        {/* ── TOP TICKER BAR ── */}
        <div
          className="relative w-full py-2.5 overflow-hidden"
          style={{ zIndex: 10, background: "rgba(0,0,0,0.90)" }}
        >
          {/* Mobile: Scrolling Ticker */}
          <div 
            className="flex items-center whitespace-nowrap md:hidden" 
            style={{ 
              width: "max-content", 
              animation: "ticker-scroll 30s linear infinite" 
            }}
          >
            {/* Array doubled for seamless loop */}
            {[...tickerItems, ...tickerItems, ...tickerItems].map(({ icon: Icon, label }, i) => (
              <span key={i} className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-black tracking-[0.2em] uppercase text-white shrink-0 mx-8 sm:mx-16">
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </span>
            ))}
          </div>

          {/* Desktop: Static, Distributed Items */}
          <div className="hidden md:flex items-center justify-around max-w-7xl mx-auto px-10">
            {tickerItems.map(({ icon: Icon, label }, i) => (
              <span key={i} className="inline-flex items-center gap-2.5 text-[11px] font-black tracking-[0.15em] uppercase text-white transition-opacity hover:opacity-80">
                <Icon className="w-4 h-4 shrink-0 text-white/90" />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* ── BACKGROUND LAYER (Right Side Image) ── */}
        <div className="relative md:absolute md:inset-0 z-0 flex justify-end pointer-events-none">
          {/* Image Container */}
          <div className="relative w-full aspect-[3/2] sm:aspect-video md:h-full md:aspect-auto md:w-[70%] lg:w-[75%]">
            <Image
              src="/car Brand.png"
              alt="caRyakrama Verified Used Cars"
              fill
              priority
              className="object-cover opacity-100"
              sizes="(max-width: 1024px) 100vw, 75vw"
            />
            {/* Desktop Gradient Mask — cinematic black vignette */}
            <div 
              className="absolute inset-0 hidden md:block" 
              style={{
                background: "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,0,0,0.9) 15%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.2) 60%, transparent 85%)"
              }}
            />
            {/* Mobile Bottom Shade for smoother transition if needed, but keeping image visible as requested */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black to-transparent md:hidden" />
          </div>
        </div>

        {/* ── MAIN CONTENT (Left Side Text) ── */}
        <div
          className="relative flex flex-col flex-grow w-full md:w-[60%] lg:w-[50%] xl:w-[45%] px-5 sm:px-12 lg:px-20 pt-2 pb-10 sm:py-12 lg:pt-20 lg:pb-8"
          style={{ zIndex: 10 }}
        >
          {/* Top Group: Headline + Subheadline */}
          <div className="flex flex-col items-start gap-2 sm:gap-5 max-w-5xl w-full">
            {/* ── GROUP 1: Headline ── */}
            <div ref={group1Ref} className="flex flex-col items-start gap-4 sm:gap-5">
              {/* Powered By Badge */}
              <Link
                href="https://www.instagram.com/car.diologist/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/15 text-[9px] font-black tracking-[0.2em] uppercase text-white mb-0.5 shadow-2xl transition-transform hover:scale-105"
                style={{ 
                  background: "rgba(0,0,0,0.45)", 
                  backdropFilter: "blur(12px)",
                }}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-royal" strokeWidth={2.5} />
                <span className="truncate max-w-[150px] sm:max-w-none" style={{ 
                  background: "linear-gradient(90deg, #E2E8F0 0%, #FFFFFF 50%, #E2E8F0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "0.2em"
                }}>
                  Powered by car.diologist
                </span>
              </Link>
 
              {/* Headline */}
              <h1 className="text-[24px] leading-[1.15] sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-white drop-shadow-2xl text-left">
                Every Car You See is{" "}
                <span className="text-royal">Handpicked,</span>
                <br className="hidden sm:block" />
                {" "}Inspected, and{" "}
                <span className="text-royal">Verified.</span>
              </h1>
            </div>
 
            {/* ── GROUP 2: Subheadline + USP Badge ── */}
            <div ref={group2Ref} className="flex flex-col items-start gap-3 sm:gap-6 w-full -mt-1 md:mt-0">
              <p className="text-[13px] sm:text-base lg:text-[18px] max-w-[650px] leading-[1.6] text-white/85 font-medium tracking-wide drop-shadow-2xl text-left">
                We eliminate the noise. Our experts scout hundreds of vehicles, selecting only the <span className="text-sky font-semibold">top 5%</span> that match our uncompromising standards.
              </p>
 
              {/* ── SIMPLIFIED USP PILL ── */}
              <div id="usp-container" className="relative w-full flex items-center justify-start mt-1">
                <div 
                  className="px-4 py-1.5 rounded-full border border-white/20 text-white flex items-center gap-2 overflow-hidden shadow-2xl"
                  style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(12px)" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-royal shrink-0 shadow-[0_0_8px_rgba(27,79,216,0.8)]" />
                  <span className="text-[9px] sm:text-[11px] font-black tracking-widest uppercase">
                    The Best Car — or Nothing.
                  </span>
                </div>
              </div>
            </div>
          </div>
 
          {/* Middle Group: CTA */}
          <div className="flex flex-col items-center lg:items-start w-full mt-6 sm:mt-12 lg:mt-6">
            <div className="w-full flex flex-row sm:flex-row gap-2 sm:gap-3 justify-center lg:justify-start">
              <Link
                href="/BuyCar"
                className={`hero-cta-btn inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-bold transition-all group hover:-translate-y-1 bg-royal/90 text-white ${!user ? 'flex-1 sm:flex-none' : 'w-full sm:w-auto'} text-center justify-center backdrop-blur-md border border-white/10`}
                style={{
                  boxShadow: "0 10px 30px rgba(27,79,216,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
                }}
              >
                <span className="hidden sm:inline">Explore Used Cars</span><span className="sm:hidden">Explore</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              {!user && (
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('OPEN_AUTH', { detail: { mode: 'signup' } }))}
                  className="hero-cta-btn sm:hidden flex-1 inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs font-bold transition-all group hover:-translate-y-1 bg-royal/90 text-white text-center justify-center backdrop-blur-md border border-white/10"
                  style={{
                    boxShadow: "0 10px 30px rgba(27,79,216,0.5), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  Sign Up
                  <User className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                </button>
              )}
            </div>
          </div>
 
          {/* Bottom Group: Trust Badges */}
          <div ref={group3Ref} className="flex flex-col items-center lg:items-start gap-3 sm:gap-5 w-full mt-12 md:mt-auto lg:mt-6 mb-1">
            <div className="grid grid-cols-2 sm:flex sm:flex-row flex-wrap justify-between lg:justify-start gap-2 sm:gap-2.5 w-full max-w-4xl">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="trust-badge flex justify-center items-center gap-2 px-3 py-2.5 rounded-xl sm:rounded-full border border-white/10 text-[10px] sm:text-xs font-semibold text-white bg-white/5 backdrop-blur-xl hover:bg-white/10 transition-colors"
                >
                  <Icon className="w-3.5 h-3.5 text-royal shrink-0" />
                  <span className="truncate">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="relative flex flex-col items-center pb-2 sm:pb-5 gap-1.5 opacity-50" style={{ zIndex: 10 }}>
          <span className="text-[10px] uppercase tracking-widest text-white font-bold">Scroll</span>
          <div className="w-px h-7 overflow-hidden rounded-full bg-white/30">
            <div className="w-full h-1/3 bg-white rounded-full" style={{ animation: "scroll-indicator 1.6s ease-in-out infinite" }} />
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes ticker-scroll {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }
        @keyframes scroll-indicator {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
      `}</style>

    </>
  );
}
