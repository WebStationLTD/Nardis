"use client";

export default function SkeletonPagination() {
  return (
    <div className="flex items-center justify-center mt-8 animate-pulse">
      <div className="flex gap-2">
        {/* Previous page button */}
        <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
        
        {/* Page number buttons */}
        {Array(3).fill(null).map((_, index) => (
          <div key={index} className="h-10 w-10 bg-gray-200 rounded-md"></div>
        ))}
        
        {/* Next page button */}
        <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );
} 