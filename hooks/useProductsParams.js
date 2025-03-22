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
    let hasFilterChange = false;

    // Check if there's an actual change in filter values
    Object.entries(newParams).forEach(([key, value]) => {
      if (key !== 'page') {
        const currentValue = params.get(key);
        // If the value is different, mark as filter change
        if (String(currentValue) !== String(value)) {
          hasFilterChange = true;
        }
      }
    });

    // Apply all parameter updates
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    // Reset page only if explicitly requested AND there's a filter change
    if (resetPage && hasFilterChange) {
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
