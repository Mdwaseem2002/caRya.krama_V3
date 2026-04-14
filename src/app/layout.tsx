import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "caRyakrama - Verified Dealership",
  description: "Browse all verified used cars with our curated collection.",
  icons: {
    icon: "/logo/Favicon-1.png",
    shortcut: "/logo/Favicon-1.png",
    apple: "/logo/Favicon-1.png",
  },
};

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";

// SmoothScrollProvider initialises Lenis + GSAP ScrollTrigger — both are
// browser-only and ~70 kB gzipped. Dynamic import with ssr:false means:
//   • The server renders children immediately without waiting for these libs
//   • The client downloads Lenis/GSAP in a separate chunk after hydration
const SmoothScrollProvider = dynamic(
  () => import("@/components/SmoothScrollProvider"),
  { ssr: false }
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect hints tell the browser to open TCP connections to Google
            Font servers before the CSS parser even encounters the <link>.
            This shaves ~150–300 ms off first-contentful-paint on cold loads. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <SmoothScrollProvider>
          <AuthProvider>
            <WishlistProvider>
              <Navbar />
              {children}
              <Footer />
            </WishlistProvider>
          </AuthProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
