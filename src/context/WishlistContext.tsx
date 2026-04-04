"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the car object matching the ones in Card.tsx
export type CarType = {
  id: number;
  name: string;
  year: string;
  image: string;
  odometer: string;
  startsFrom?: string;
  fullPrice?: string;
  price?: string;
  condition?: string;
  inspectionScore?: string;
  inspectionSummary?: string[];
  isNewArrival?: boolean;
};

type WishlistContextType = {
  wishlist: CarType[];
  toggleWishlist: (car: CarType) => void;
  isInWishlist: (id: number) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<CarType[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("caryakrama_wishlist");
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse wishlist from local storage");
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("caryakrama_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  const toggleWishlist = (car: CarType) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === car.id);
      if (exists) {
        return prev.filter((item) => item.id !== car.id);
      } else {
        return [...prev, car];
      }
    });
  };

  const isInWishlist = (id: number) => wishlist.some((item) => item.id === id);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
