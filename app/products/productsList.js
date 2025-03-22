"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ProductsList({ products }) {
  const [loading, setLoading] = useState(true);
  const [displayProducts, setDisplayProducts] = useState(products || []);
  const searchParams = useSearchParams();

  // Initialize with products on first render
  useEffect(() => {
    if (products && products.length > 0) {
      setDisplayProducts(products);
      setLoading(false);
    }
  }, []);

  // Update when products change
  useEffect(() => {
    // Set loading state when URL params change
    const handleProductChange = () => {
      // Only show loading if products are different
      if (JSON.stringify(displayProducts) !== JSON.stringify(products)) {
        setLoading(true);
        
        // Short timeout for smooth transition
        const timer = setTimeout(() => {
          setDisplayProducts(products);
          setLoading(false);
        }, 300);
        
        return () => clearTimeout(timer);
      }
    };
    
    handleProductChange();
  }, [products, searchParams.toString()]);

  // For debugging
  console.log("Products array:", products?.length, "Display products:", displayProducts?.length);
  
  // Loading skeleton
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

  // No products case
  if (!displayProducts || displayProducts.length === 0) {
    return (
      <div className="col-span-full py-10 text-center">
        <p className="text-gray-500">Няма налични продукти.</p>
      </div>
    );
  }

  // Render products
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 mt-0">
      {displayProducts.map((product) => (
        <Link
          key={product.id}
          href={`/products/${product.slug}`}
          className="group relative border-1 border-solid rounded-lg border-[#1e2939] py-4 px-4"
          prefetch={true}
        >
          <Image
            width={280}
            height={320}
            alt={product.name}
            src={product.images?.[0]?.src || "/placeholder.webp"}
            className="aspect-square w-full rounded-lg bg-gray-200 object-cover transition-transform duration-300 group-hover:scale-105 group-hover:opacity-75 xl:aspect-7/8"
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
      ))}
    </div>
  );
}
