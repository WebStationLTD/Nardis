"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";

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
        <p className="text-gray-500">Няма налични продукти в тази категория.</p>
      </div>
    );
  }

  // Render products
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8 mt-0">
      {displayProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
} 