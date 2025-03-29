"use client";

import SkeletonProductCard from './skeletonProductCard';

export default function SkeletonProductsList() {
  // Create an array of 12 items to match the perPage value in the ProductsPage
  const skeletonCards = Array(12).fill(null);
  
  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {skeletonCards.map((_, index) => (
          <SkeletonProductCard key={index} />
        ))}
      </div>
    </div>
  );
} 