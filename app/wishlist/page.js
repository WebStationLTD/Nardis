"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/app/context/WishlistContext";
import { HeartIcon } from "@heroicons/react/24/outline";

export default function WishlistPage() {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { wishlistItems, removeFromWishlist } = useWishlist();

  useEffect(() => {
    if (wishlistItems.length > 0) {
      fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productIds: wishlistItems }),
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
      setWishlistProducts([]);
      setLoading(false);
    }
  }, [wishlistItems]);

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  return (
    <div className="mx-auto max-w-7xl py-16">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
      {error && <p className="text-red-500">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : wishlistProducts.length === 0 ? (
        <div className="text-center py-12">
          <HeartIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">Your wishlist is empty</h2>
          <p className="mt-1 text-sm text-gray-500">Start adding products to your wishlist.</p>
          <div className="mt-6">
            <Link href="/" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#b3438f] hover:bg-[#a03680] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Continue Shopping
            </Link>
          </div>
        </div>
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
                  className="rounded-lg object-cover h-64 w-full"
                />
              </Link>
              <h2 className="text-xl font-semibold mt-2">{product.name}</h2>
              <p className="text-gray-700">{product.price} лв.</p>
              <button
                className="mt-2 text-red-500 flex items-center"
                onClick={() => handleRemoveFromWishlist(product.id)}
              >
                <HeartIcon className="h-5 w-5 mr-1 text-red-500 fill-current" />
                Remove from Wishlist
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
