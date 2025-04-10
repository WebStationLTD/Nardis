"use client";

import { useState, useEffect } from "react";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (!response.ok) {
          if (response.status === 401) {
            setError("Please log in to view your cart");
            setLoading(false);
            return;
          }
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setUser(data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setError("Failed to authenticate user");
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Fetch cart data when user is available
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await fetch('/api/cart');
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setCart(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch cart:", err);
        setError("Failed to load cart data");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [user]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      
      {user && (
        <div className="mb-4 p-3 bg-blue-50 rounded">
          <p>Logged in as: <strong>{user.username || user.email}</strong></p>
          <p>User ID: {user.id}</p>
        </div>
      )}

      {loading && <p>Loading cart...</p>}
      
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && !error && cart && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Cart Contents:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(cart, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}