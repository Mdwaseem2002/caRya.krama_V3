"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  Mail,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  ChevronRight,
  Heart,
  MessageCircle,
  ArrowUpRight,
} from "lucide-react";

/* ── data ── */
const quickLinks = [
  { label: "About", href: "/about-us" },
  { label: "FAQ", href: "/faq" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

const browseLinks = [
  { label: "Buy a Car", href: "/BuyCar" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Wishlist", href: "/wishlist" },
];

const contactInfo = [
  { Icon: Phone, text: "+91 99001 87847", href: "tel:+919900187847" },
  { Icon: MessageCircle, text: "WhatsApp Us", href: "https://wa.me/919900187847" },
  { Icon: Mail, text: "farhan@caryakrama.com", href: "mailto:farhan@caryakrama.com" },
];

const socials = [
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Twitter, href: "#", label: "Twitter / X" },
  { Icon: Facebook, href: "#", label: "Facebook" },
  { Icon: Youtube, href: "#", label: "YouTube" },
];

/* ── component ── */
export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let ctx: { revert: () => void } | null = null;
    const init = async () => {
      const gsap = (await import("gsap")).default;
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        gsap.fromTo(
          ".footer-col",
          { y: 40, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.8,
            stagger: 0.1, ease: "power3.out",
            scrollTrigger: { trigger: footerRef.current, start: "top 90%" },
          }
        );
        gsap.fromTo(
          ".footer-bottom",
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 0.6, ease: "power2.out",
            scrollTrigger: { trigger: ".footer-bottom", start: "top 99%" },
          }
        );
      });
    };
    init();
    return () => ctx?.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--color-carbon)", color: "var(--color-white)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* ── Ambient glow ── */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[200px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(200,168,75,0.06) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[400px] h-[200px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(27,79,216,0.05) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* ── NEWSLETTER STRIP ── */}
      <div
        className="relative z-10 border-b"
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-10 py-6 sm:py-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 sm:gap-6">
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: "var(--color-gold)" }}>
              The Inner Circle
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight" style={{ letterSpacing: "-0.03em" }}>
              Handpicked cars.<br className="sm:hidden" /> Delivered to you.
            </h3>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row items-stretch sm:items-center w-full lg:w-auto gap-3"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 lg:w-72 px-5 py-3.5 rounded-2xl text-sm font-bold text-gray-900 outline-none transition-all focus:ring-2 focus:ring-gold/20"
              style={{ background: "rgba(255,255,255,0.95)", border: "1px solid rgba(255,255,255,0.1)" }}
            />
            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-gold/10"
              style={{ background: "var(--color-gold)", color: "var(--color-carbon)" }}
            >
              Join Notify
            </button>
          </form>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* COL 1 — Brand */}
          <div className="footer-col lg:col-span-1">
            <div className="mb-6">
              <Image
                src="/logo/carYakrama.png"
                alt="caRyakrama"
                width={200}
                height={64}
                className="object-contain h-14 w-auto"
                priority
              />
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(200,215,240,0.90)" }}>
              Handpicked. Inspected.<br />Every car a statement.
            </p>
            <div className="flex items-center gap-2">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    color: "rgba(255,255,255,0.85)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--color-gold)";
                    e.currentTarget.style.borderColor = "var(--color-gold)";
                    e.currentTarget.style.color = "var(--color-carbon)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.85)";
                  }}
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* COL 2 — Quick Links */}
          <div className="footer-col">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] mb-6 flex items-center gap-2" style={{ color: "var(--color-gold)" }}>
              <span className="inline-block w-4 h-px" style={{ background: "var(--color-gold)" }} />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:text-white"
                    style={{ color: "rgba(210,225,245,0.88)" }}
                  >
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" style={{ color: "var(--color-gold)" }} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 3 — Browse */}
          <div className="footer-col">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] mb-6 flex items-center gap-2" style={{ color: "var(--color-gold)" }}>
              <span className="inline-block w-4 h-px" style={{ background: "var(--color-gold)" }} />
              Browse
            </h3>
            <ul className="space-y-3">
              {browseLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm font-medium transition-all duration-200 hover:text-white"
                    style={{ color: "rgba(210,225,245,0.88)" }}
                  >
                    <ChevronRight className="w-3.5 h-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" style={{ color: "var(--color-gold)" }} />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 4 — Contact */}
          <div className="footer-col">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.18em] mb-6 flex items-center gap-2" style={{ color: "var(--color-gold)" }}>
              <span className="inline-block w-4 h-px" style={{ background: "var(--color-gold)" }} />
              Contact Us
            </h3>
            <ul className="space-y-3">
              {contactInfo.map(({ Icon, text, href }) => (
                <li key={text}>
                  <a
                    href={href}
                    className="group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 hover:-translate-y-px"
                    style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(200,168,75,0.35)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"; }}
                  >
                    <span
                      className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-xl transition-colors"
                      style={{ background: "rgba(200,168,75,0.12)" }}
                    >
                      <Icon className="w-4 h-4" style={{ color: "var(--color-gold)" }} />
                    </span>
                    <span className="text-sm font-semibold text-white">
                      {text}
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--color-gold)" }} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div
        className="footer-bottom relative z-10 border-t"
        style={{ borderColor: "rgba(255,255,255,0.07)" }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 md:py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-medium text-center sm:text-left" style={{ color: "rgba(200,215,240,0.65)" }}>
            © {new Date().getFullYear()}{" "}
            <span className="font-bold" style={{ color: "var(--color-gold)" }}>caRya.krama</span>
            {" "}— All rights reserved.
          </p>
          <p className="text-xs font-medium flex items-center gap-1.5" style={{ color: "rgba(200,215,240,0.65)" }}>
            Curated with <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" /> for car enthusiasts.
          </p>
        </div>
      </div>
    </footer>
  );
}
