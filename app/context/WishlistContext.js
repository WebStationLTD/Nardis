"use client";

import { createContext, useState, useContext, useEffect } from "react";

const WishlistContext = createContext();

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
    const newWishlist = wishlistItems.filter(id => id !== productId);
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
        wishlistCount 
      }}
    >
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