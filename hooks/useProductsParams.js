"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function useProductsParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Връща параметър или празна стойност
  const getParam = (key, defaultValue = "") => {
    return searchParams.get(key) || defaultValue;
  };

  // Връща число (ако няма - дефинирана стойност)
  const getNumberParam = (key, defaultValue = 1) => {
    return Number(searchParams.get(key)) || defaultValue;
  };

  // Актуализира параметрите + Нулира страницата при промяна на филтрите
  const updateParams = (newParams, resetPage = false) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Ако трябва да нулираме страницата (напр. при нов филтър)
    if (resetPage) {
      params.delete("page");
    }

    router.replace(`/products?${params.toString()}`);
  };

  return {
    getParam,
    getNumberParam,
    updateParams,
  };
}
