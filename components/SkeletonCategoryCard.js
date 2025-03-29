"use client";

export default function SkeletonCategoryCard() {
  return (
    <div className="group relative animate-pulse rounded-lg border border-gray-200 overflow-hidden">
      {/* Image placeholder */}
      <div className="h-64 w-full bg-gray-200"></div>
      
      {/* Content placeholder */}
      <div className="p-6">
        <div className="h-6 bg-gray-200 rounded w-2/3 mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
        
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
} 