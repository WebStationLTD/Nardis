"use client";

import { useState } from "react";
import { addToCartAction } from "@/app/cart/action";
import { useCart } from "@/app/context/CartContext";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

/**
 * AddToCartButton component for adding products to the cart
 * @param {Object} props - Component props
 * @param {number} props.productId - Product ID to add to cart
 * @param {string} props.productName - Product name for notification
 * @param {string} props.productImage - Product image URL for notification
 * @param {Object} props.variations - Optional product variations
 * @param {string} props.className - Optional additional CSS classes
 */
export default function AddToCartButton({
  productId,
  productName,
  productImage,
  variations = {},
  className = "",
}) {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { refreshCartCount } = useCart();

  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Handle add to cart action
  const handleAddToCart = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);

      const result = await addToCartAction(productId, quantity, variations);

      if (result.error) {
        // Handle authentication error
        if (result.status === 401) {
          Swal.fire({
            title: "Необходимо е да влезете в акаунта си",
            text: "Моля, влезте в профила си, за да добавите продукти в количката",
            icon: "info",
            confirmButtonText: "Вход",
            showCancelButton: true,
            cancelButtonText: "Отказ",
            confirmButtonColor: "#b3438f",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/login";
            }
          });
          return;
        }

        // Handle other errors
        Swal.fire({
          title: "Грешка",
          text: result.error,
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#b3438f",
        });
        return;
      }

      // Success notification
      Swal.fire({
        title: "Добавено в количката",
        text: `${productName} беше добавен във вашата количка.`,
        imageUrl: productImage,
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: productName,
        icon: "success",
        confirmButtonText: "Към количката",
        showCancelButton: true,
        cancelButtonText: "Продължи пазаруването",
        confirmButtonColor: "#b3438f",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/cart";
        }
      });

      // Refresh cart count using the context
      refreshCartCount();
    } catch (error) {
      console.error("Error adding to cart:", error);
      Swal.fire({
        title: "Грешка",
        text: "Възникна проблем при добавяне на продукта в количката",
        icon: "error",
        confirmButtonText: "OK",
        confirmButtonColor: "#b3438f",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      {/* Quantity selector */}
      <div className="flex items-center border border-gray-300 rounded-md">
        <button
          type="button"
          onClick={decreaseQuantity}
          disabled={quantity <= 1 || isLoading}
          className="px-3 py-2 text-gray-600 hover:text-gray-700 disabled:opacity-50"
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className="px-3 py-2 text-gray-800 min-w-[40px] text-center">
          {quantity}
        </span>
        <button
          type="button"
          onClick={increaseQuantity}
          disabled={isLoading}
          className="px-3 py-2 text-gray-600 hover:text-gray-700 disabled:opacity-50"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      {/* Add to cart button */}
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={isLoading}
        className="inline-flex items-center justify-center rounded-md bg-[#b3438f] px-3.5 py-2.5 text-sm font-semibold text-white hover:text-black shadow-xs hover:bg-[#ebedeb] focus-visible:outline-2 cursor-pointer focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-70"
      >
        {isLoading ? (
          <span className="inline-flex items-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Добавяне...
          </span>
        ) : (
          <>
            <ShoppingCartIcon className="mr-2 h-5 w-5" aria-hidden="true" />
            Добави в количката
          </>
        )}
      </button>
    </div>
  );
}
