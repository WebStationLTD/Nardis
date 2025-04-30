"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import WishlistButton from "@/components/wishlistButton";
import SimpleAddToCartButton from "@/components/SimpleAddToCartButton";

// Функция за логване на проблемни URL-и
function checkImageUrl(url) {
  if (!url) return url;
  if (url.includes("nardis.rosset.website")) {
    console.warn("Намерен стар URL:", url);
    // Можем да го заменим, но това е само за диагностика
    return url;
  }
  return url;
}

export default function ProductCard({
  product,
  className = "",
  isFirst = false,
}) {
  const [imageError, setImageError] = useState(false);
  const [imageSrc, setImageSrc] = useState("/placeholder.webp");

  // При първоначално зареждане на компонента, валидираме URL-то на изображението
  useEffect(() => {
    if (product?.images?.[0]?.src) {
      // Проверка и логване на URL
      const url = checkImageUrl(product.images[0].src);
      console.log("ProductCard получи URL:", url);

      // Използваме HTMLImageElement вместо Image, за да избегнем конфликт с импортирания Image от next/image
      const imgElement = new window.Image();
      imgElement.onload = () => setImageSrc(url);
      imgElement.onerror = () => setImageError(true);
      imgElement.src = url;
    }
  }, [product]);

  // Handle missing product or incomplete data
  if (!product || !product.id) {
    return null;
  }

  // Format price display based on sale status
  const hasSale = product.sale_price && parseFloat(product.sale_price) > 0;
  const isOutOfStock = product.stock_status === "outofstock";

  return (
    <div
      className={`group relative border border-solid rounded-lg border-[#1e2939] py-4 px-4 flex flex-col h-full transition-transform hover:shadow-md ${className}`}
    >
      <div className="relative flex-shrink-0 h-52 sm:h-60 lg:h-64 w-full overflow-hidden rounded-md bg-gray-100 mb-4">
        {/* Wishlist button overlay */}
        <div className="absolute top-2 right-2 z-10">
          <WishlistButton productId={product.id} size="small" />
        </div>

        <Link href={`/products/${product.slug}`} prefetch={isFirst}>
          <div className="relative w-full h-full">
            <Image
              width={isFirst ? 400 : 280}
              height={isFirst ? 450 : 320}
              alt={product.name}
              src={imageError ? "/placeholder.webp" : imageSrc}
              onError={() => setImageError(true)}
              placeholder={isFirst ? "blur" : "empty"}
              blurDataURL={
                isFirst
                  ? "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z2Rlc2MAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5nZQAAAAAAAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5nZQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWFlaIAAAAAAAAPbWAAEAAAAA0y1zZjMyAAAAAAABDEIAAAXe///zJgAAB5IAAP2R///7ov///aMAAAPcAADAbA=="
                  : undefined
              }
              className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:opacity-75 ${
                isFirst ? "lcp-image" : ""
              }`}
              priority={isFirst}
              fetchPriority={isFirst ? "high" : "auto"}
              loading={isFirst ? "eager" : "lazy"}
              sizes={
                isFirst
                  ? "(max-width: 640px) 90vw, (max-width: 768px) 70vw, (max-width: 1024px) 30vw, 25vw"
                  : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              }
              quality={isFirst ? 90 : 75}
              decoding={isFirst ? "sync" : "async"}
            />
          </div>
          {hasSale && (
            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
              Промоция
            </div>
          )}
        </Link>
      </div>

      <div className="flex-grow flex flex-col">
        <Link
          href={`/products/${product.slug}`}
          prefetch={isFirst}
          className="flex-grow"
        >
          <h3 className="text-sm text-gray-700 font-medium mb-2 line-clamp-2">
            {product.name}
          </h3>

          <div className="mt-auto">
            {isOutOfStock ? (
              <p className="text-base font-medium text-red-600">Не е наличен</p>
            ) : hasSale ? (
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

        {!isOutOfStock && (
          <SimpleAddToCartButton
            productId={product.id}
            productName={product.name}
            productImage={imageSrc}
          />
        )}
      </div>
    </div>
  );
}
