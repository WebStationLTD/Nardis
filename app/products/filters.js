"use client";

import { useState, useEffect, Suspense } from "react";
import { Range } from "react-range";
import useDebounce from "../../hooks/useDebounce";
import useProductsParams from "../../hooks/useProductsParams";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

// Компонент, който съдържа логиката с useSearchParams
function FiltersContent({ maxPrice }) {
  const { getParam, getNumberParam, updateParams } = useProductsParams();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

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
    // При десктоп размер, филтрите винаги са видими
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsFiltersOpen(true);
      } else {
        setIsFiltersOpen(false);
      }
    };

    // Инициализиране
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
    const initialSearch = getParam("search", "");
    const initialCategory = getParam("category", "");
    const initialMinPrice = getNumberParam("minPrice", 0);
    const initialMaxPrice = getNumberParam("maxPrice", maxPrice);

    const hasChanges =
      debouncedSearch !== initialSearch ||
      category !== initialCategory ||
      debouncedPriceRange[0] !== initialMinPrice ||
      debouncedPriceRange[1] !== initialMaxPrice;

    updateParams(
      {
        search: debouncedSearch,
        category,
        minPrice: debouncedPriceRange[0] > 0 ? debouncedPriceRange[0] : "",
        maxPrice:
          debouncedPriceRange[1] < maxPrice ? debouncedPriceRange[1] : "",
      },
      hasChanges
    );
  }, [debouncedSearch, category, debouncedPriceRange, maxPrice]);

  const toggleFilters = () => {
    setIsFiltersOpen(!isFiltersOpen);
  };

  return (
    <div>
      {/* Заглавие с бутон за скриване/показване на мобилни устройства */}
      <div
        className="flex items-center justify-between cursor-pointer lg:cursor-default mb-0 lg:border-0 border border-gray-300 rounded-md px-3 py-1 lg:p-0"
        onClick={toggleFilters}
      >
        <h3 className="font-semibold text-xl lg:text-2xl">Филтри</h3>
        <ChevronDownIcon
          className={`lg:hidden h-6 w-6 transition-transform duration-300 ease-in-out ${
            isFiltersOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {/* Съдържание на филтрите */}
      <div
        className={`flex flex-col gap-1 transition-all duration-300 ease-in-out ${
          isFiltersOpen
            ? "max-h-[2000px] opacity-100 mt-3 visible"
            : "max-h-0 opacity-0 mt-0 invisible lg:max-h-[2000px] lg:opacity-100 lg:mt-3 lg:visible"
        }`}
      >
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Търси продукт..."
          className="border p-2 rounded-md w-full"
        />
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Категория</label>
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
        </div>
        <div className="flex flex-col pt-2 pb-4">
          <label className="font-semibold mb-3">
            Цена: {priceRange[0]} лв - {priceRange[1]} лв
          </label>
          <div className="px-2">
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
      </div>
    </div>
  );
}

// Основен компонент обхващащ съдържанието с Suspense
export default function Filters({ maxPrice }) {
  return (
    <Suspense
      fallback={
        <div className="mb-6 flex flex-col gap-4">
          <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-20 bg-gray-200 rounded-md animate-pulse"></div>
        </div>
      }
    >
      <FiltersContent maxPrice={maxPrice} />
    </Suspense>
  );
}
