"use client";

import { createContext, useState, useContext, useEffect } from "react";

const WishlistContext = createContext();

// Константен обект за SSR, който ще използваме за фиктивна стойност
const SSR_FALLBACK = {
  wishlistItems: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  isInWishlist: () => false,
  wishlistCount: 0,
};

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    // Initialize from localStorage on client side
    if (typeof window !== "undefined") {
      const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setWishlistItems(storedWishlist);
    }
  }, []);

  const addToWishlist = (productId) => {
    if (!wishlistItems.includes(productId)) {
      const newWishlist = [...wishlistItems, productId];
      setWishlistItems(newWishlist);
      localStorage.setItem("wishlist", JSON.stringify(newWishlist));
    }
  };

  const removeFromWishlist = (productId) => {
    const newWishlist = wishlistItems.filter((id) => id !== productId);
    setWishlistItems(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
  };

  const isInWishlist = (productId) => {
    return wishlistItems.includes(productId);
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  // Първо извикваме useContext безусловно, за да спазваме правилата на React Hooks
  const context = useContext(WishlistContext);

  // Проверяваме дали сме в браузър и дали контекстът съществува
  if (typeof window === "undefined" || context === undefined) {
    // Връщаме фиктивна стойност ако сме в SSR или ако контекстът е undefined
    if (context === undefined) {
      console.warn("useWishlist must be used within a WishlistProvider");
    }
    return SSR_FALLBACK;
  }

  return context;
}
