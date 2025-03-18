// "use client";

// import { useRouter, useSearchParams } from "next/navigation";
// import { useState, useEffect } from "react";
// import useDebounce from "../../hooks/useDebounce";

// export default function Filters() {
//   const router = useRouter();
//   const searchParams = useSearchParams();

//   const [search, setSearch] = useState(searchParams.get("search") || "");
//   const [category, setCategory] = useState(searchParams.get("category") || "");
//   const [categories, setCategories] = useState([]);

//   const debouncedSearch = useDebounce(search, 300);

//   useEffect(() => {
//     setSearch(searchParams.get("search") || "");
//     setCategory(searchParams.get("category") || "");
//   }, [searchParams]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const res = await fetch("/api/categories");
//         const data = await res.json();
//         setCategories(data);
//       } catch (error) {
//         console.error("Грешка при зареждане на категориите:", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   useEffect(() => {
//     const params = new URLSearchParams();

//     if (debouncedSearch) params.set("search", debouncedSearch);
//     if (category) params.set("category", category);

//     router.push(`/products?${params.toString()}`);
//   }, [debouncedSearch, category, router]);

//   return (
//     <div className="mb-6 flex gap-4">
//       {/* Търсачка */}
//       <input
//         type="text"
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         placeholder="Търси продукт..."
//         className="border p-2 rounded-md w-full"
//       />

//       {/* Категории (динамично заредени) */}
//       <select
//         value={category}
//         onChange={(e) => setCategory(e.target.value)}
//         className="border p-2 rounded-md"
//       >
//         <option value="">Всички категории</option>
//         {categories.map((cat) => (
//           <option key={cat.id} value={cat.id}>
//             {cat.name}
//           </option>
//         ))}
//       </select>
//     </div>
//   );
// }

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Range } from "react-range";
import useDebounce from "../../hooks/useDebounce";

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [categories, setCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([
    Number(searchParams.get("minPrice")) || 0,
    Number(searchParams.get("maxPrice")) || 10000,
  ]);

  const debouncedSearch = useDebounce(search, 300);
  const debouncedPriceRange = useDebounce(priceRange, 300);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setCategory(searchParams.get("category") || "");
    setPriceRange([
      Number(searchParams.get("minPrice")) || 0,
      Number(searchParams.get("maxPrice")) || 10000,
    ]);
  }, [searchParams]);

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
    if (debouncedPriceRange[1] < 10000)
      params.set("maxPrice", debouncedPriceRange[1]);

    router.push(`/products?${params.toString()}`);
  }, [debouncedSearch, category, debouncedPriceRange, router]);

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
          max={10000}
          values={priceRange}
          onChange={setPriceRange}
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
