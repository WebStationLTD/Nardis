"use client";

import { useState } from "react";
import { useWishlist } from "@/app/context/WishlistContext";
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";

export default function WishlistButton({ productId, className = "" }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  
  const inWishlist = isInWishlist(productId);

  const handleToggleWishlist = () => {
    setIsAdding(true);
    setTimeout(() => {
      if (inWishlist) {
        removeFromWishlist(productId);
      } else {
        addToWishlist(productId);
      }
      setIsAdding(false);
    }, 300);
  };

  return (
    <button
      type="button"
      onClick={handleToggleWishlist}
      disabled={isAdding}
      className={`transition-transform ${isAdding ? 'scale-125' : ''} ${className}`}
      aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {inWishlist ? (
        <HeartIconSolid className="h-6 w-6 text-[#b3438f]" />
      ) : (
        <HeartIcon className="h-6 w-6 text-gray-500 hover:text-[#b3438f]" />
      )}
    </button>
  );
}
