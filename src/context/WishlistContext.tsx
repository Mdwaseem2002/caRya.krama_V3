"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";

// Define the car object matching the ones in Card.tsx
export type CarType = {
  id: number | string;
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
  isInWishlist: (id: number | string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

import AuthRequiredModal from "@/components/AuthRequiredModal";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<CarType[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, updateProfile } = useAuth();

  // Sync on mount or when user changes
  useEffect(() => {
    if (user?.wishlist) {
      setWishlist(user.wishlist);
    } else {
      // Not logged in or user has no wishlist → empty
      setWishlist([]);
    }
    setIsLoaded(true);
  }, [user]);

  // Sync to database (only when logged in)
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
    }
  };

  const toggleWishlist = (car: CarType) => {
    // SECURITY CHECK: If user is not logged in, show popup instead of wishlisting
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const exists = wishlist.some((item) => item.id === car.id);
    const updated = exists 
      ? wishlist.filter((item) => item.id !== car.id) 
      : [...wishlist, car];
      
    syncWishlist(updated);

    // If adding (not removing), trigger notification
    if (!exists && user) {
      import("@/Details/Notification/CustomerNotify").then(({ addNotification }) => {
        addNotification(user.id, {
          title: "Car Added to Wishlist ❤️",
          message: `You saved ${car.name} successfully.`,
          type: "wishlist",
          cta: { label: "View Wishlist", href: "/wishlist" }
        });
      });
    }
  };

  const openGlobalAuth = (mode: 'login' | 'signup') => {
    setShowAuthModal(false);
    window.dispatchEvent(new CustomEvent('OPEN_AUTH', { detail: { mode } }));
  };

  const isInWishlist = (id: number | string) => 
    wishlist.some((item) => item.id.toString() === id.toString());

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
      <AuthRequiredModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={() => openGlobalAuth('login')}
        onSignup={() => openGlobalAuth('signup')}
      />
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
