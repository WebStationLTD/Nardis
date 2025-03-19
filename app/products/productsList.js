"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ProductsList({ products }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500); // Симулираме зареждане
    return () => clearTimeout(timer);
  }, [products]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 mt-6">
        {[...Array(12)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-52 bg-gray-300 rounded-lg"></div>
            <div className="mt-4 h-5 bg-gray-300 rounded w-3/4"></div>
            <div className="mt-2 h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 mt-6">
      {products.length > 0 ? (
        products.map((product) => (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group"
            prefetch={true}
          >
            <Image
              width={280}
              height={320}
              alt={product.name}
              src={product.images?.[0]?.src || "/placeholder.webp"}
              className="aspect-square w-full rounded-lg bg-gray-200 object-cover group-hover:opacity-75 xl:aspect-7/8"
            />
            <h3 className="mt-4 text-sm text-gray-700">{product.name}</h3>
            {product.sale_price ? (
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-500 line-through">
                  {product.regular_price} лв.
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {product.sale_price} лв.
                </p>
              </div>
            ) : (
              <p className="mt-1 text-lg font-medium text-gray-900">
                {product.regular_price} лв.
              </p>
            )}
          </Link>
        ))
      ) : (
        <p className="text-center text-gray-500">Няма налични продукти.</p>
      )}
    </div>
  );
}
