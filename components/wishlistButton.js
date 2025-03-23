"use client";

import { useEffect, useState } from "react";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

export default function WishlistButton({
  productId,
  className = "",
  size = "default",
}) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [animation, setAnimation] = useState("");

  // Check if product is in wishlist on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      setIsWishlisted(wishlist.includes(productId));
    }
  }, [productId]);

  const toggleWishlist = () => {
    if (typeof window !== "undefined") {
      setIsAnimating(true);

      let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
      const wasWishlisted = wishlist.includes(productId);

      if (wasWishlisted) {
        // Remove from wishlist
        wishlist = wishlist.filter((id) => id !== productId);
        setIsWishlisted(false);
        setFeedbackMessage("Премахнато от любими");
        setAnimation("remove");
      } else {
        // Add to wishlist
        wishlist.push(productId);
        setIsWishlisted(true);
        setFeedbackMessage("Добавено в любими");
        setAnimation("add");
      }

      // Save to localStorage
      localStorage.setItem("wishlist", JSON.stringify(wishlist));

      // Show feedback message
      setShowFeedback(true);

      // Hide feedback after delay
      setTimeout(() => {
        setShowFeedback(false);
      }, 2000);

      // End animation after delay
      setTimeout(() => {
        setIsAnimating(false);
        setAnimation("");
      }, 500);
    }
  };

  // Size classes
  const sizeClasses = {
    small: "p-2",
    default: "p-3",
    large: "p-4",
  };

  const iconSizeClasses = {
    small: "h-6 w-6",
    default: "h-6 w-6",
    large: "h-8 w-8",
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={toggleWishlist}
        className={`relative flex items-center justify-center cursor-pointer rounded-md ${
          sizeClasses[size]
        } transition-all duration-300 ${
          isWishlisted ? "bg-pink-50" : "hover:bg-gray-100"
        }`}
        disabled={isAnimating}
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        {isWishlisted ? (
          <HeartSolid
            className={`${
              iconSizeClasses[size]
            } text-[#b3438f] transition-all duration-300 ${
              isAnimating && animation === "add" ? "scale-125" : ""
            }`}
          />
        ) : (
          <HeartOutline
            className={`${iconSizeClasses[size]} text-[#b3438f] hover:text-[#b3438f] transition-all duration-300`}
          />
        )}
      </button>

      {/* Feedback tooltip with Tailwind transitions */}
      <div
        className={`
          absolute -top-10 left-1/2 transform -translate-x-1/2 
          bg-gray-800 text-white text-xs rounded py-1 px-2 z-10 
          whitespace-nowrap pointer-events-none
          transition-all duration-300 ease-in-out
          ${
            showFeedback
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-2 invisible"
          }
        `}
      >
        {feedbackMessage}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 rotate-45 bg-gray-800"></div>
      </div>
    </div>
  );
}
