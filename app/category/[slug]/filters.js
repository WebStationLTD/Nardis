"use client";

import { useState, useEffect, Suspense } from "react";
import { Range } from "react-range";
import useDebounce from "../../../hooks/useDebounce";
import useCategoryParams from "../../../hooks/useCategoryParams";

// Вътрешен компонент, използващ useCategoryParams
function FiltersContent({ maxPrice }) {
  const { getParam, getNumberParam, updateParams } = useCategoryParams();

  const [search, setSearch] = useState(getParam("search", ""));
  const [category, setCategory] = useState(getParam("category", ""));
  const [categories, setCategories] = useState([]);
  const [subcategory, setSubcategory] = useState(getParam("subcategory", ""));
  const [subcategories, setSubcategories] = useState([]);
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
        const allCategories = await res.json();

        // Получаем категорию из URL (slug параметр на странице категории)
        const currentPath = window.location.pathname;
        const currentSlug = currentPath.split("/").pop();

        // Находим текущую категорию по slug
        const currentCategory = allCategories.find(
          (cat) => cat.slug === currentSlug
        );

        // Филтрираме всички основни категории (parent = 0)
        const mainCategories = allCategories.filter((cat) => cat.parent === 0);
        setCategories(mainCategories);

        // Если нашли категорию, показываем только её подкатегории
        // Иначе показываем все категории
        if (currentCategory) {
          const childCategories = allCategories.filter(
            (cat) => cat.parent === currentCategory.id
          );
          setSubcategories(childCategories);

          // Ако сме в категория, задаваме я като текуща
          if (!category) {
            setCategory(currentCategory.id);
          }
        } else {
          setSubcategories(allCategories.filter((cat) => cat.parent > 0));
        }
      } catch (error) {
        console.error("Грешка при зареждане на категориите:", error);
      }
    };
    fetchCategories();
  }, [category]);

  useEffect(() => {
    const initialSearch = getParam("search", "");
    const initialCategory = getParam("category", "");
    const initialSubcategory = getParam("subcategory", "");
    const initialMinPrice = getNumberParam("minPrice", 0);
    const initialMaxPrice = getNumberParam("maxPrice", maxPrice);

    const hasChanges =
      debouncedSearch !== initialSearch ||
      category !== initialCategory ||
      subcategory !== initialSubcategory ||
      debouncedPriceRange[0] !== initialMinPrice ||
      debouncedPriceRange[1] !== initialMaxPrice;

    updateParams(
      {
        search: debouncedSearch,
        category,
        subcategory,
        minPrice: debouncedPriceRange[0] > 0 ? debouncedPriceRange[0] : "",
        maxPrice:
          debouncedPriceRange[1] < maxPrice ? debouncedPriceRange[1] : "",
      },
      true // Reset to page 1 when filters change
    );
  }, [debouncedSearch, category, subcategory, debouncedPriceRange, maxPrice]);

  return (
    <div className="mb-6 flex flex-col gap-4">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Търси продукт..."
        className="border p-2 rounded-md w-full"
      />

      {/* Филтър по основна категория */}
      <div className="flex flex-col">
        <label className="font-semibold mb-1">Категория</label>
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setSubcategory(""); // Нулираме подкатегорията при смяна на категория
          }}
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

      {/* Филтър по подкатегория */}
      {subcategories.length > 0 && (
        <div className="flex flex-col">
          <label className="font-semibold mb-1">Подкатегория</label>
          <select
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            className="border p-2 rounded-md"
          >
            <option value="">Всички подкатегории</option>
            {subcategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      )}

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

// Основен компонент с Suspense обхващане
export default function Filters({ maxPrice }) {
  return (
    <Suspense
      fallback={
        <div className="mb-6 flex flex-col gap-4">
          <div className="h-10 bg-gray-200 rounded-md animate-pulse"></div>
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
