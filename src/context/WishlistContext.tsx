"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

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
  const { user, updateProfile } = useAuth();

  // Sync on mount or when user changes
  useEffect(() => {
    if (user?.wishlist) {
      setWishlist(user.wishlist);
      setIsLoaded(true);
    } else if (!user) {
      const saved = localStorage.getItem("caryakrama_wishlist");
      if (saved) {
        try {
          setWishlist(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse wishlist from local storage");
        }
      }
      setIsLoaded(true);
    }
  }, [user]);

  // Sync to database if logged in, else local storage
  const syncWishlist = async (updatedWishlist: CarType[]) => {
    setWishlist(updatedWishlist);
    
    if (user && user.id) {
      try {
        await fetch(`/api/users/${user.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wishlist: updatedWishlist })
        });
        updateProfile({ wishlist: updatedWishlist });
      } catch (err) {
        console.error("Failed to sync wishlist to database", err);
      }
    } else {
      localStorage.setItem("caryakrama_wishlist", JSON.stringify(updatedWishlist));
    }
  };

  const toggleWishlist = (car: CarType) => {
    const exists = wishlist.some((item) => item.id === car.id);
    const updated = exists 
      ? wishlist.filter((item) => item.id !== car.id) 
      : [...wishlist, car];
      
    syncWishlist(updated);
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
