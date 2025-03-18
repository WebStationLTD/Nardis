"use client";

import { useState, useEffect } from "react";
import { Range } from "react-range";
import useDebounce from "../../hooks/useDebounce";
import useProductsParams from "../../hooks/useProductsParams";

export default function Filters({ maxPrice }) {
  const { getParam, getNumberParam, updateParams } = useProductsParams();

  const [search, setSearch] = useState(getParam("search", ""));
  const [category, setCategory] = useState(getParam("category", ""));
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([
    getNumberParam("minPrice", 0),
    getNumberParam("maxPrice", maxPrice),
  ]);

  const debouncedSearch = useDebounce(search, 500);
  const debouncedPriceRange = useDebounce(priceRange, 300);
  const minDistance = 10;

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
    updateParams(
      {
        search: debouncedSearch,
        category,
        minPrice: debouncedPriceRange[0] > 0 ? debouncedPriceRange[0] : "",
        maxPrice:
          debouncedPriceRange[1] < maxPrice ? debouncedPriceRange[1] : "",
      },
      true // 🔥 Нулира страницата при промяна на филтрите!
    );
  }, [debouncedSearch, category, debouncedPriceRange]);

  return (
    <div className="mb-6 flex flex-col gap-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Търси продукт..."
        className="border p-2 rounded-md w-full"
      />
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
