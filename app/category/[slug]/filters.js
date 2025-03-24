"use client";

import { useState, useEffect } from "react";
import { Range } from "react-range";
import useDebounce from "../../../hooks/useDebounce";
import useCategoryParams from "../../../hooks/useCategoryParams";

export default function Filters({ maxPrice }) {
  const { getParam, getNumberParam, updateParams } = useCategoryParams();

  const [search, setSearch] = useState(getParam("search", ""));
  const [priceRange, setPriceRange] = useState([
    getNumberParam("minPrice", 0),
    getNumberParam("maxPrice", maxPrice),
  ]);

  const debouncedSearch = useDebounce(search, 500);
  const debouncedPriceRange = useDebounce(priceRange, 300);
  const minDistance = 10;

  useEffect(() => {
    const initialSearch = getParam("search", "");
    const initialMinPrice = getNumberParam("minPrice", 0);
    const initialMaxPrice = getNumberParam("maxPrice", maxPrice);

    const hasChanges = 
      debouncedSearch !== initialSearch || 
      debouncedPriceRange[0] !== initialMinPrice || 
      debouncedPriceRange[1] !== initialMaxPrice;

    updateParams(
      {
        search: debouncedSearch,
        minPrice: debouncedPriceRange[0] > 0 ? debouncedPriceRange[0] : "",
        maxPrice:
          debouncedPriceRange[1] < maxPrice ? debouncedPriceRange[1] : "",
      },
      true // Reset to page 1 when filters change
    );
  }, [debouncedSearch, debouncedPriceRange, maxPrice]);

  return (
    <div className="mb-6 flex flex-col gap-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Търси продукт..."
        className="border p-2 rounded-md w-full"
      />
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