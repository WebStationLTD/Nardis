"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function Pagination({ currentPage, totalPages }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handlePageChange = (newPage) => {
    // Create a new params object from current URL params
    const params = new URLSearchParams(searchParams.toString());

    // Update or add the page parameter
    if (newPage === 1) {
      // Remove page parameter if it's page 1 (cleaner URLs)
      params.delete("page");
    } else {
      params.set("page", newPage);
    }

    // Navigate to the new URL, preserving all other filter parameters and the category path
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex justify-center mt-8 gap-1">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`px-4 py-2 border rounded-md ${
          currentPage <= 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-200 cursor-pointer"
        }`}
      >
        Предишна
      </button>
      <span className="px-2 py-2">
        Страница {currentPage} от {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`px-2 py-2 border rounded-md ${
          currentPage >= totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-200 cursor-pointer"
        }`}
      >
        Следваща
      </button>
    </div>
  );
}
