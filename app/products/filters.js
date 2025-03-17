"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import useDebounce from "../../hooks/useDebounce";

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [categories, setCategories] = useState([]);

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setCategory(searchParams.get("category") || "");
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

    router.push(`/products?${params.toString()}`);
  }, [debouncedSearch, category, router]);

  return (
    <div className="mb-6 flex gap-4">
      {/* Търсачка */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Търси продукт..."
        className="border p-2 rounded-md w-full"
      />

      {/* Категории (динамично заредени) */}
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
  );
}
