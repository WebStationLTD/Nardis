"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function PaginationControl({
  currentPage,
  totalPages,
  basePath,
}) {
  const [pageInput, setPageInput] = useState(currentPage);

  useEffect(() => {
    setPageInput(currentPage);
  }, [currentPage]);

  const getPageUrl = (page) => {
    if (page === 1) {
      return basePath;
    }
    return `${basePath}?page=${page}`;
  };

  const handleInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let newPage = parseInt(pageInput, 10);

    if (isNaN(newPage)) {
      newPage = currentPage;
    } else if (newPage < 1) {
      newPage = 1;
    } else if (newPage > totalPages) {
      newPage = totalPages;
    }

    if (newPage !== currentPage) {
      window.location.href = getPageUrl(newPage);
    }
  };

  return (
    <div className="mt-10 flex justify-center flex-wrap gap-2">
      {/* Първа страница */}
      {currentPage > 1 && (
        <Link
          href={getPageUrl(1)}
          className="px-3 py-2 mx-1 bg-gray-200 rounded-md"
          prefetch={true}
          title="Първа страница"
        >
          &laquo;
        </Link>
      )}

      {/* Предишна страница */}
      {currentPage > 1 && (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="px-3 py-2 mx-1 bg-gray-200 rounded-md"
          prefetch={true}
        >
          Предишна
        </Link>
      )}

      {/* Избор на страница */}
      <form onSubmit={handleSubmit} className="flex items-center mx-1">
        <span className="px-2 py-2">Страница</span>
        <input
          type="number"
          min="1"
          max={totalPages}
          value={pageInput}
          onChange={handleInputChange}
          className="w-12 px-2 py-1 border rounded-md text-center"
          aria-label="Номер на страница"
        />
        <span className="px-2 py-2">от {totalPages}</span>
      </form>

      {/* Следваща страница */}
      {currentPage < totalPages && (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="px-3 py-2 mx-1 bg-gray-200 rounded-md"
          prefetch={true}
        >
          Следваща
        </Link>
      )}

      {/* Последна страница */}
      {currentPage < totalPages && (
        <Link
          href={getPageUrl(totalPages)}
          className="px-3 py-2 mx-1 bg-gray-200 rounded-md"
          prefetch={true}
          title="Последна страница"
        >
          &raquo;
        </Link>
      )}
    </div>
  );
}
