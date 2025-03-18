"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Range } from "react-range";
import useDebounce from "../../hooks/useDebounce";

export default function Filters({ maxPrice }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || maxPrice,
  ]);

  const debouncedSearch = useDebounce(search, 500);
  const debouncedPriceRange = useDebounce(priceRange, 300);

  const minDistance = 10;

  useEffect(() => {
    if (searchParams.get("search") !== debouncedSearch) {
      setSearch(searchParams.get("search") || "");
    }
    setCategory(searchParams.get("category") || "");
    setPriceRange([
      Number(searchParams.get("minPrice")) || 0,
      Number(searchParams.get("maxPrice")) || maxPrice,
    ]);
  }, [searchParams, maxPrice]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Грешка при зареждане на категориите:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();

    if (debouncedSearch) params.set("search", debouncedSearch);
    if (category) params.set("category", category);
    if (debouncedPriceRange[0] > 0)
      params.set("minPrice", debouncedPriceRange[0]);
    if (debouncedPriceRange[1] < maxPrice)
      params.set("maxPrice", debouncedPriceRange[1]);

    router.push(`/products?${params.toString()}`);
  }, [debouncedSearch, category, debouncedPriceRange, router, maxPrice]);

  return (
    <div className="mb-6 flex flex-col gap-4">
      {/* Търсачка */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Търси продукт..."
        className="border p-2 rounded-md w-full"
      />

      {/* Категории */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="border p-2 rounded-md"
      >
        <option value="">Всички категории</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      {/* Слайдер за цена */}
      <div className="flex flex-col">
        <label className="font-semibold">
          Цена: {priceRange[0]} лв - {priceRange[1]} лв
        </label>
        <Range
          step={10}
          min={0}
          max={maxPrice}
          values={priceRange}
          onChange={(values) => {
            if (values[1] - values[0] >= minDistance) {
              setPriceRange(values);
            }
          }}
          renderTrack={({ props, children }) => (
            <div {...props} className="h-2 bg-gray-300 rounded-md">
              {children}
            </div>
          )}
          renderThumb={({ props, index }) => {
            const { key, ...restProps } = props;
            return (
              <div
                key={index}
                {...restProps}
                className="w-4 h-4 bg-blue-500 rounded-full cursor-pointer"
              />
            );
          }}
        />
      </div>
    </div>
  );
}
