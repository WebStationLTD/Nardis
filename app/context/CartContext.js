"use client";

import { createContext, useState, useContext, useEffect } from "react";
import { getCartItemCountAction } from "@/app/cart/action";

const CartContext = createContext();

// Константен обект за SSR, който ще използваме за фиктивна стойност
const SSR_FALLBACK = {
  cartCount: 0,
  loading: false,
  refreshCartCount: () => {},
};

export function CartProvider({ children }) {
  // Initialize with null (instead of 0) to indicate loading state
  const [cartCount, setCartCount] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch cart count from server
  const fetchCartCount = async () => {
    try {
      setLoading(true);
      const result = await getCartItemCountAction();

      if (result.count !== undefined) {
        setCartCount(result.count);
      }
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0); // Set to 0 on error
    } finally {
      setLoading(false);
    }
  };

  // Initialize cart count on client-side only
  useEffect(() => {
    fetchCartCount();

    // Set up polling to refresh cart count every 30 seconds
    const intervalId = setInterval(fetchCartCount, 30000);

    return () => clearInterval(intervalId);
  }, []);

  // Function to manually refresh cart count
  const refreshCartCount = () => {
    fetchCartCount();
  };

  // Default to 0 when cartCount is null (during initial server render)
  const displayCount = cartCount === null ? 0 : cartCount;

  return (
    <CartContext.Provider
      value={{
        cartCount: displayCount,
        loading,
        refreshCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  // Първо извикваме useContext безусловно, за да спазваме правилата на React Hooks
  const context = useContext(CartContext);

  // Проверяваме дали сме в браузър и дали контекстът съществува
  if (typeof window === "undefined" || context === undefined) {
    // Връщаме фиктивна стойност ако сме в SSR или ако контекстът е undefined
    if (context === undefined) {
      console.warn("useCart must be used within a CartProvider");
    }
    return SSR_FALLBACK;
  }

  return context;
}
