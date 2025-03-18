"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Pagination({ currentPage, totalPages }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("page", newPage);

    router.replace(`/products?${params.toString()}`);
  };

  return (
    <div className="flex justify-center mt-8 gap-4">
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
      <span className="px-4 py-2">
        Страница {currentPage} от {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className={`px-4 py-2 border rounded-md ${
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
