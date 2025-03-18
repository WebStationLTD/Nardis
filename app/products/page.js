import WooCommerce from "../../lib/woocomerce";
import { Suspense } from "react";
import ProductsList from "./productsList";
import Filters from "./filters";
import Pagination from "./pagination";

export default async function ProductsPage({ searchParams }) {
  const category = (await searchParams)?.category || "";
  const searchQuery = (await searchParams)?.search || "";
  const currentPage = Number((await searchParams)?.page) || 1;

  // NEW
  const minPrice = Number((await searchParams)?.minPrice) || 0;
  const maxPrice = Number((await searchParams)?.maxPrice) || 10000;

  let products = [];
  let totalPages = 1;

  try {
    const response = await WooCommerce.get("products", {
      per_page: 12,
      page: currentPage,
      category: category,
      search: searchQuery,
      min_price: minPrice,
      max_price: maxPrice,
    });

    products = response.data;
    totalPages = Number(response.headers["x-wp-totalpages"]) || 1;
  } catch (error) {
    console.error("Грешка при зареждане на продуктите:", error);
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Нашите продукти
        </h2>
        <Filters />
        <Suspense fallback={<p>Зареждане...</p>}>
          <ProductsList products={products} />
        </Suspense>
        {/* Добавяме странициране */}
        <Pagination currentPage={currentPage} totalPages={totalPages} />
      </div>
    </div>
  );
}
