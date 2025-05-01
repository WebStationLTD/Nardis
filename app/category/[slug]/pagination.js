"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Pagination({ currentPage, totalPages }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [pageInput, setPageInput] = useState(currentPage);

  // Синхронизирай входната стойност с текущата страница при промяна
  useEffect(() => {
    setPageInput(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    // Валидиране на страницата
    const validPage = Math.max(1, Math.min(totalPages, newPage));

    // Create a new params object from current URL params
    const params = new URLSearchParams(searchParams.toString());

    // Update or add the page parameter
    if (validPage === 1) {
      // Remove page parameter if it's page 1 (cleaner URLs)
      params.delete("page");
    } else {
      params.set("page", validPage);
    }

    // Navigate to the new URL, preserving all other filter parameters and the category path
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    const newPage = parseInt(pageInput, 10);
    if (!isNaN(newPage)) {
      handlePageChange(newPage);
    }
  };

  return (
    <div className="flex justify-center flex-wrap mt-8 gap-1">
      <button
        onClick={() => handlePageChange(1)}
        disabled={currentPage <= 1}
        className={`px-3 py-2 border rounded-md ${
          currentPage <= 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-200 cursor-pointer"
        }`}
        title="Първа страница"
      >
        &laquo;
      </button>
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className={`px-3 py-2 border rounded-md ${
          currentPage <= 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-200 cursor-pointer"
        }`}
      >
        Предишна
      </button>

      <form
        onSubmit={handleInputSubmit}
        className="flex items-center w-full sm:w-auto"
      >
        <span className="px-2 py-2">Страница</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={pageInput}
          onChange={handleInputChange}
          className="w-16 px-2 py-1 border rounded-md text-center"
          aria-label="Номер на страница"
        />
        <span className="px-2 py-2">от {totalPages}</span>
      </form>

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`px-3 py-2 border rounded-md ${
          currentPage >= totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-200 cursor-pointer"
        }`}
      >
        Следваща
      </button>
      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage >= totalPages}
        className={`px-3 py-2 border rounded-md ${
          currentPage >= totalPages
            ? "opacity-50 cursor-not-allowed"
            : "hover:bg-gray-200 cursor-pointer"
        }`}
        title="Последна страница"
      >
        &raquo;
      </button>
    </div>
  );
}
