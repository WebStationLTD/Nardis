"use client";

import { useEffect, useState } from "react";
import { HeartIcon } from "@heroicons/react/24/outline";

export default function WishlistButton({ productId }) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setIsWishlisted(wishlist.includes(productId));
    }
  }, [productId]);

  const toggleWishlist = () => {
    if (typeof window !== "undefined") {
      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      if (wishlist.includes(productId)) {
        wishlist = wishlist.filter((id) => id !== productId);
        setIsWishlisted(false);
      } else {
        wishlist.push(productId);
        setIsWishlisted(true);
      }
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }
  };

  return (
    <button
      type="button"
      onClick={toggleWishlist}
      className={`ml-4 flex items-center justify-center rounded-md px-3 py-3 ${
        isWishlisted ? "text-red-500" : "text-gray-400"
      } hover:bg-gray-100 hover:text-gray-500`}
    >
      <HeartIcon className="size-6 shrink-0" />
      <span className="sr-only">
        {isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      </span>
    </button>
  );
}
