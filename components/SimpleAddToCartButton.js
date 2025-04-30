"use client";

import { useState } from "react";
import { addToCartAction } from "@/app/cart/action";
import { useCart } from "@/app/context/CartContext";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import Swal from "sweetalert2";

/**
 * SimpleAddToCartButton - Опростена версия на бутона за добавяне в количката
 * Използва се за бързо добавяне на продукти без селектор за количество
 */
export default function SimpleAddToCartButton({
  productId,
  productName,
  productImage,
  className = "",
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { refreshCartCount } = useCart();

  const handleAddToCart = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      // Винаги добавя 1 продукт
      const result = await addToCartAction(productId, 1, {});

      if (result.error) {
        // Обработка на грешка при вход
        if (result.status === 401) {
          Swal.fire({
            title: "Необходимо е да влезете в акаунта си",
            text: "Моля, влезте в профила си, за да добавите продукти в количката",
            icon: "info",
            confirmButtonText: "Вход",
            showCancelButton: true,
            cancelButtonText: "Отказ",
            confirmButtonColor: "#129160",
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = "/login";
            }
          });
          return;
        }

        // Обработка на други грешки
        Swal.fire({
          title: "Грешка",
          text: result.error,
          icon: "error",
          confirmButtonText: "OK",
          confirmButtonColor: "#129160",
        });
        return;
      }

      // Уведомление за успех
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
        confirmButtonColor: "#129160",
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
        confirmButtonColor: "#129160",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleAddToCart}
      disabled={isLoading}
      className={`inline-flex items-center justify-center rounded-md bg-[#129160] px-3 py-2 cursor-pointer text-sm font-semibold text-white hover:text-black shadow-xs hover:bg-[#ebedeb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:opacity-70 w-full mt-2 ${className}`}
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
          <ShoppingCartIcon className="mr-2 h-4 w-4" aria-hidden="true" />
          Купи
        </>
      )}
    </button>
  );
}
