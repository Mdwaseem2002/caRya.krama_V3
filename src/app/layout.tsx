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

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
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
