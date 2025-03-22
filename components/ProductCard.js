"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import WishlistButton from "./wishlistButton";

export default function ProductCard({ product, className = "" }) {
  const [imageError, setImageError] = useState(false);

  // Handle missing product or incomplete data
  if (!product || !product.id) {
    return null;
  }

  // Format price display based on sale status
  const hasSale = product.sale_price && parseFloat(product.sale_price) > 0;
  const imageUrl = product.images?.[0]?.src || "/placeholder.webp";

  return (
    <div className={`group relative border border-solid rounded-lg border-[#1e2939] py-4 px-4 flex flex-col h-full transition-transform hover:shadow-md ${className}`}>
      <div className="relative flex-shrink-0 h-52 sm:h-60 lg:h-64 w-full overflow-hidden rounded-md bg-gray-100 mb-4">
        {/* Wishlist button overlay */}
        <div className="absolute top-2 right-2 z-10">
          <WishlistButton 
            productId={product.id} 
            size="small"
          />
        </div>
        
        <Link href={`/products/${product.slug}`} prefetch={true}>
          <Image
            width={280}
            height={320}
            alt={product.name}
            src={imageError ? "/placeholder.webp" : imageUrl}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:opacity-75"
          />
          {hasSale && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              Промоция
            </div>
          )}
        </Link>
      </div>

      <div className="flex-grow flex flex-col">
        <Link href={`/products/${product.slug}`} prefetch={true} className="flex-grow">
          <h3 className="text-sm text-gray-700 font-medium mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          <div className="mt-auto">
            {hasSale ? (
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-500 line-through">
                  {product.regular_price} лв.
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {product.sale_price} лв.
                </p>
              </div>
            ) : (
              <p className="text-lg font-medium text-gray-900">
                {product.regular_price || product.price} лв.
              </p>
            )}
          </div>
        </Link>
      </div>
    </div>
  );
} 