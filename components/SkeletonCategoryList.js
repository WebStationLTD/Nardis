"use client";

import SkeletonCategoryCard from './SkeletonCategoryCard';

export default function SkeletonCategoryList({ parentCount = 3, childrenPerParent = 3 }) {
  return (
    <div className="mt-10 space-y-16 animate-pulse">
      {/* Parent category sections */}
      {Array(parentCount).fill(null).map((_, parentIndex) => (
        <div key={parentIndex}>
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array(childrenPerParent).fill(null).map((_, index) => (
              <SkeletonCategoryCard key={index} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 