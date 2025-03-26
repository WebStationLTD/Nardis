import dynamic from "next/dynamic";

import { getProducts, getMaxProductPrice } from "@/services/productService";
import { Suspense } from "react";
import ProductsList from "./productsList";
// import Filters from "./filters";
// import Pagination from "./pagination";

// Конфигурация за ISR
export const revalidate = 3600; // Ревалидиране на всеки час

// Компоненти, които поддържат SSR, но се зареждат лениво
const Pagination = dynamic(() => import("./pagination"), {
  ssr: true,
  loading: () => <p>Зареждане...</p>,
});

const Filters = dynamic(() => import("./filters"), {
  ssr: true,
  loading: () => <p>Зареждане...</p>,
});

// Use this function to safely extract parameters from searchParams
const getParamValue = async (searchParams, key, defaultValue) => {
  const params = await searchParams;
  const value = params?.[key];
  return value !== undefined && value !== null && value !== ""
    ? value
    : defaultValue;
};

const getNumericParam = async (searchParams, key, defaultValue) => {
  const params = await searchParams;
  const value = Number(params?.[key]);
  return !isNaN(value) ? value : defaultValue;
};

export default async function ProductsPage({ searchParams }) {
  // Await searchParams once at the beginning
  const params = await searchParams;

  // Get filter parameters from URL with fallbacks
  const category = await getParamValue(searchParams, "category", "");
  const searchQuery = await getParamValue(searchParams, "search", "");
  const currentPage = await getNumericParam(searchParams, "page", 1);
  const minPrice = await getNumericParam(searchParams, "minPrice", 0);

  // First, get the max price for filter boundaries - always fetch this
  const maxPossiblePrice = await getMaxProductPrice();

  // For the filter parameter, use the URL value if present
  const maxPriceParam = await getNumericParam(searchParams, "maxPrice", null);

  let products = [];
  let totalPages = 1;

  try {
    // Fetch products with all the filters
    const result = await getProducts({
      perPage: 12,
      page: currentPage,
      category,
      search: searchQuery,
      minPrice: minPrice || undefined, // Only send defined values
      maxPrice: maxPriceParam || undefined, // Only send if user specified
      fields: "id,name,images,slug,sale_price,regular_price",
    });

    products = result.products;
    totalPages = result.totalPages;
  } catch (error) {
    console.error("Грешка при зареждане на продуктите:", error);
  }

  return (
    <div className="bg-white">
      <div className="bg-white">
        <div className="mx-auto max-w-10/10 py-0 sm:px-6 sm:py-0 lg:px-0">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-12 text-center shadow-2xl sm:px-12">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Магазин
              </h1>
            </div>
            <svg
              viewBox="0 0 1024 1024"
              aria-hidden="true"
              className="absolute -top-50 left-1/2 -z-10 size-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
            >
              <circle
                r={512}
                cx={512}
                cy={512}
                fill="url(#827591b1-ce8c-4110-b064-7cb85a0b1217)"
                fillOpacity="0.9"
              />
              <defs>
                <radialGradient id="827591b1-ce8c-4110-b064-7cb85a0b1217">
                  <stop stopColor="#bc4b93" />
                  <stop offset={1} stopColor="#bc4b93" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      <div className="w-full max-w-[80%] xl:max-w-[80%] mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
          Филтри
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[15%_85%] gap-4">
          <div>
            <Filters maxPrice={maxPossiblePrice} />
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
