"use client";

import { createContext, useState, useContext, useEffect } from "react";
import { getCartItemCountAction } from "@/app/cart/action";

const CartContext = createContext();

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
  // Проверка дали сме в браузър - нужно за избягване на грешки при SSR
  if (typeof window === "undefined") {
    // По време на SSR връщаме обект със същия интерфейс, но с празни функции
    return {
      cartCount: 0,
      loading: false,
      refreshCartCount: () => {},
    };
  }

  const context = useContext(CartContext);

  if (context === undefined) {
    // Връщаме фиктивен контекст вместо да хвърляме грешка
    console.warn("useCart must be used within a CartProvider");
    return {
      cartCount: 0,
      loading: false,
      refreshCartCount: () => {},
    };
  }

  return context;
}
