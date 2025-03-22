import { getProducts, getMaxProductPrice } from "@/services/productService";
import { Suspense } from "react";
import ProductsList from "./productsList";
import Filters from "./filters";
import Pagination from "./pagination";

export default async function ProductsPage({ searchParams }) {
  const category = (await searchParams)?.category || "";
  const searchQuery = (await searchParams)?.search || "";
  const currentPage = Number((await searchParams)?.page) || 1;
  const minPrice = Number((await searchParams)?.minPrice) || 0;
  let maxPrice = Number((await searchParams)?.maxPrice) || 10000;

  let products = [];
  let totalPages = 1;

  try {
    const result = await getProducts({
      perPage: 12,
      page: currentPage,
      category,
      search: searchQuery,
      minPrice,
      maxPrice,
      fields: "id,name,images,slug,sale_price,regular_price"
    });

    products = result.products;
    totalPages = result.totalPages;

    // Get max price for the price filter component
    maxPrice = await getMaxProductPrice();
  } catch (error) {
    console.error("Грешка при зареждане на продуктите:", error);
  }

  return (
    <div className="bg-white">
      {/* <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:max-w-7xl lg:px-8"> */}
      <div className="w-full max-w-[80%] xl:max-w-[80%] mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
          Филтри
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[15%_85%] gap-4">
          <div>
            <Filters maxPrice={maxPrice} />
          </div>

          <div>
            <Suspense fallback={<p>Зареждане...</p>}>
              <ProductsList products={products} />
            </Suspense>
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </div>
        </div>
      </div>
    </div>
  );
}
