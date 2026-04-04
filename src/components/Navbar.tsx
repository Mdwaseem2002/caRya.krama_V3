"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Heart, User, Menu, X, Bell } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { motion, AnimatePresence } from 'framer-motion';
import SignupLoginPop from '@/Profile/SingupLoginPop';
import Login from '@/Details/Sign/Login';
import Signup from '@/Details/Sign/Signup';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Callus, { FloatingCallButton } from '@/Details/CallUs/Callus';

const navLinks = [
  { label: 'caRya.krama', href: '/' },
  { label: 'Buy', href: '/BuyCar' },
  { label: 'Sell Car', href: '/sell-your-car' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Testimonials', href: '/testimonials' },
  { label: 'Contact Us', href: '/contact-us' },
];

export default function Navbar() {
  const { wishlist } = useWishlist();
  const { user } = useAuth();
  const router = useRouter();

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [authMode, setAuthMode] = useState<null | 'login' | 'signup'>(null);
  const [isMobileAccountOpen, setIsMobileAccountOpen] = useState(false);
  const [isCallUsOpen, setIsCallUsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const iconBtn =
    "relative flex items-center justify-center w-9 h-9 rounded-full transition-[color,background-color] duration-200 text-white hover:bg-white/10 active:scale-95";

  return (
    <>
      {/* ── HEADER ── */}
      <header
        className={`glass-navbar w-full sticky top-0 z-[100] text-white transition-[background-color,backdrop-filter,box-shadow,height] duration-500 ${
          scrolled ? "scrolled shadow-xl" : ""
        }`}
      >
        {/* BMW 3-zone grid: Logo | Nav | Icons */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-10 h-full flex items-center justify-between gap-4">

          {/* ── ZONE 1: LOGO ── */}
          <div className="flex items-center" style={{ overflow: 'visible' }}>
            <Link href="/" className="flex items-center">
              <Image
                src="/logo/carYakrama.png"
                alt="caRyakrama"
                width={200}
                height={60}
                className="w-auto object-contain h-10 md:h-[72px]"
                priority
              />
            </Link>
          </div>

          {/* ── ZONE 2: NAV LINKS (desktop only) ── */}
          <nav className="hidden lg:flex items-center justify-center gap-6 xl:gap-8">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="nav-link text-[13px] tracking-wide uppercase whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* ── ZONE 3: ICON GROUP ── */}
          <div className="flex items-center gap-1 md:gap-2">

            {/* Call */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCallUsOpen(true)}
              className={`hidden sm:flex ${iconBtn}`}
              title="Call Us"
            >
              <Phone className="w-[18px] h-[18px]" strokeWidth={1.5} />
            </motion.button>

            {/* Bell */}
            <Link href="/details">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className={iconBtn}
                title="Notifications"
              >
                <Bell className="w-[18px] h-[18px]" strokeWidth={1.5} />
              </motion.button>
            </Link>

            {/* Wishlist */}
            <Link href="/wishlist">
              <motion.div
                whileTap={{ scale: 0.9 }}
                className={`${iconBtn} cursor-pointer`}
                title="Wishlist"
              >
                <Heart className="w-[18px] h-[18px]" strokeWidth={1.5} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-white text-navy text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </motion.div>
            </Link>

            {/* Separator */}
            <div className="hidden sm:block w-px h-5 bg-white/15 mx-1" />

            {/* Profile */}
            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (user) router.push('/Profile');
                  else setIsProfileOpen(!isProfileOpen);
                }}
                className={`hidden sm:flex ${iconBtn}`}
                title="Account"
              >
                {user ? (
                  <div className="w-7 h-7 rounded-full bg-royal flex items-center justify-center text-[11px] font-bold text-white">
                    <User className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                ) : (
                  <User className="w-[18px] h-[18px]" strokeWidth={1.5} />
                )}
              </motion.button>

              <AnimatePresence>
                {!user && isProfileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-[90]"
                      onClick={() => setIsProfileOpen(false)}
                    />
                    <SignupLoginPop
                      onLogin={() => { setAuthMode('login'); setIsProfileOpen(false); }}
                      onSignup={() => { setAuthMode('signup'); setIsProfileOpen(false); }}
                    />
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile hamburger */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileOpen(true)}
              className={`lg:hidden ${iconBtn}`}
            >
              <Menu className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* ── BOTTOM EDGE LINE ── */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </header>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 30 }}
              className="lg:hidden fixed top-0 left-0 h-full w-72 z-[120] flex flex-col glass-dark border-r border-white/5"
              style={{ background: 'rgba(5,8,16,0.6)', backdropFilter: 'blur(32px)' }}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 h-16 border-b border-white/10">
                <Image
                  src="/logo/carYakrama.png"
                  alt="caRyakrama"
                  width={130}
                  height={44}
                  className="h-9 w-auto object-contain"
                  priority
                />
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-1">
                {navLinks.map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsMobileOpen(false)}
                      className="flex items-center py-3 text-white/70 hover:text-white font-medium text-[15px] tracking-wide border-b border-white/[0.06] transition-colors"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                <div className="flex flex-col gap-3 mt-8">
                  <button
                    onClick={() => { setIsMobileOpen(false); setIsCallUsOpen(true); }}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-semibold text-white bg-royal/90 hover:bg-royal transition-colors"
                  >
                    <Phone className="w-4 h-4" strokeWidth={1.5} />
                    Call Us
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileOpen(false);
                      if (user) router.push('/Profile');
                      else setIsMobileAccountOpen(!isMobileAccountOpen);
                    }}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-semibold text-white/80 border border-white/15 hover:bg-white/10 transition-colors"
                  >
                    <User className="w-4 h-4" strokeWidth={1.5} />
                    {user ? 'My Profile' : 'Account'}
                  </button>

                  {!user && isMobileAccountOpen && (
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => { setIsMobileOpen(false); setIsMobileAccountOpen(false); setAuthMode('signup'); }}
                        className="py-3 rounded-xl text-sm font-bold text-white bg-royal"
                      >Sign Up</button>
                      <button
                        onClick={() => { setIsMobileOpen(false); setIsMobileAccountOpen(false); setAuthMode('login'); }}
                        className="py-3 rounded-xl text-sm font-bold text-royal border border-royal/50"
                      >Log In</button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── AUTH MODAL ── */}
      <AnimatePresence>
        {authMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
            onClick={() => setAuthMode(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 24 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 24 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="w-full max-w-md relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setAuthMode(null)}
                className="absolute -top-12 right-0 text-white/60 hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold"
              >
                Close <X size={18} />
              </button>
              {authMode === 'login' ? (
                <Login onSwitch={() => setAuthMode('signup')} onSuccess={() => setAuthMode(null)} />
              ) : (
                <Signup onSwitch={() => setAuthMode('login')} onSuccess={() => setAuthMode(null)} />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CALLUS MODAL ── */}
      <Callus isOpen={isCallUsOpen} onClose={() => setIsCallUsOpen(false)} />

      {/* ── FLOATING CTA ── */}
      <FloatingCallButton onOpen={() => setIsCallUsOpen(true)} />
    </>
  );
}
