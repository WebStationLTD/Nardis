import WooCommerce from "../../lib/woocomerce";
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
    const response = await WooCommerce.get("products", {
      per_page: 12,
      page: currentPage,
      category,
      search: searchQuery,
      min_price: minPrice,
      max_price: maxPrice,
      _fields: "id,name,images,slug,sale_price,regular_price",
    });

    products = response.data;
    totalPages = Number(response.headers["x-wp-totalpages"]) || 1;

    const maxPriceResponse = await WooCommerce.get("products", {
      per_page: 1,
      orderby: "price",
      order: "desc",
      _fields: "id,price",
    });

    maxPrice =
      Math.ceil(Number(maxPriceResponse.data[0]?.price) / 10) * 10 || 10000;
  } catch (error) {
    console.error("Грешка при зареждане на продуктите:", error);
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:max-w-7xl lg:px-8">
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
