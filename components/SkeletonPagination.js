"use client";

export default function SkeletonPagination() {
  return (
    <div className="flex items-center justify-center mt-8 animate-pulse">
      <div className="flex gap-2">
        {/* First page button */}
        <div className="h-10 w-10 bg-gray-200 rounded-md"></div>

        {/* Previous page button */}
        <div className="h-10 w-16 bg-gray-200 rounded-md"></div>

        {/* Page number input */}
        <div className="flex items-center">
          <div className="h-5 w-16 bg-gray-200 rounded-md mx-1"></div>
          <div className="h-8 w-12 bg-gray-200 rounded-md mx-1"></div>
          <div className="h-5 w-16 bg-gray-200 rounded-md mx-1"></div>
        </div>

        {/* Next page button */}
        <div className="h-10 w-16 bg-gray-200 rounded-md"></div>

        {/* Last page button */}
        <div className="h-10 w-10 bg-gray-200 rounded-md"></div>
      </div>
    </div>
  );
}
