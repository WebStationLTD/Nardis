"use client";

import SkeletonProductCard from './SkeletonProductCard';

export default function SkeletonProductsList({ itemCount = 12 }) {
  // Create an array of itemCount items (default 12 to match typical perPage value)
  const skeletonCards = Array(itemCount).fill(null);
  
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