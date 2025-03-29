"use client";

export default function SkeletonFilters() {
  return (
    <div className="animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
      
      {/* Category section */}
      <div className="mb-6">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
        <div className="space-y-2">
          {Array(5).fill(null).map((_, index) => (
            <div key={index} className="flex items-center">
              <div className="h-4 w-4 bg-gray-200 rounded mr-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Price range section */}
      <div className="mb-6">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
        <div className="h-6 bg-gray-200 rounded w-full mb-3"></div>
        <div className="flex justify-between">
          <div className="h-3 bg-gray-200 rounded w-1/5"></div>
          <div className="h-3 bg-gray-200 rounded w-1/5"></div>
        </div>
      </div>
      
      {/* Apply button */}
      <div className="h-10 bg-gray-200 rounded w-full mt-6"></div>
    </div>
  );
} 