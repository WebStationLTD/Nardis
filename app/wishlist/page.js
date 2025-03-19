"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function WishlistPage() {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

      if (wishlist.length > 0) {
        fetch("/api/wishlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ productIds: wishlist }),
        })
          .then(async (res) => {
            if (!res.ok) {
              throw new Error(`API Error: ${res.status} ${res.statusText}`);
            }
            return res.json();
          })
          .then((data) => {
            setWishlistProducts(data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching wishlist products:", error);
            setError(error.message);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }
  }, []);

  return (
    <div className="mx-auto max-w-7xl py-16">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
      {error && <p className="text-red-500">{error}</p>}{" "}
      {/* Display error message */}
      {loading ? (
        <p>Loading...</p>
      ) : wishlistProducts.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {wishlistProducts.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg">
              <Link href={`/products/${product.slug}`} className="block">
                <Image
                  src={product.images[0]?.src}
                  alt={product.name}
                  width={300}
                  height={300}
                  className="rounded-lg"
                />
              </Link>
              <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
              <p className="text-gray-700">{product.price} лв.</p>
              <button
                className="mt-2 text-red-500"
                onClick={() => {
                  const updatedWishlist = wishlistProducts.filter(
                    (p) => p.id !== product.id
                  );
                  setWishlistProducts(updatedWishlist);
                  localStorage.setItem(
                    "wishlist",
                    JSON.stringify(updatedWishlist.map((p) => p.id))
                  );
                }}
              >
                Remove from Wishlist
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
