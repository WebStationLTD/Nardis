import dynamic from "next/dynamic";
import Link from "next/link";
import {
  getProducts,
  getMaxProductPrice,
  getCategories,
} from "@/services/productService";
import ProductsList from "./productsList";
import SkeletonFilters from "@/components/SkeletonFilters";
import SkeletonPagination from "@/components/SkeletonPagination";
// import Filters from "./filters";
// import Pagination from "./pagination";

// Metadata for SEO
export const metadata = {
  title: "Всички продукти | Nardis",
  description:
    "Разгледайте нашата селекция от продукти с високо качество. Филтрирайте по категория, цена и други критерии.",
  openGraph: {
    title: "Всички продукти | Nardis",
    description: "Разгледайте нашата селекция от продукти с високо качество.",
    type: "website",
  },
};

// Конфигурация за ISR
export const revalidate = 3600; // Ревалидиране на всеки час

// Компоненти, които поддържат SSR, но се зареждат лениво
const Pagination = dynamic(() => import("./pagination"), {
  ssr: true,
  loading: () => <SkeletonPagination />,
});

const Filters = dynamic(() => import("./filters"), {
  ssr: true,
  loading: () => <SkeletonFilters />,
});

// Helper functions for parameters
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

// Get top categories for navigation
async function getTopCategories() {
  try {
    const categories = await getCategories({ perPage: 5, page: 1 });
    return categories || [];
  } catch (error) {
    console.error("Error fetching top categories for SEO:", error);
    return [];
  }
}

export default async function ProductsPage({ searchParams }) {
  // Get filter parameters from URL with fallbacks
  const category = await getParamValue(searchParams, "category", "");
  const searchQuery = await getParamValue(searchParams, "search", "");
  const currentPage = await getNumericParam(searchParams, "page", 1);
  const minPrice = await getNumericParam(searchParams, "minPrice", 0);
  const maxPriceParam = await getNumericParam(searchParams, "maxPrice", null);

  // Fetch data outside of Suspense
  const [maxPossiblePrice, topCategories] = await Promise.all([
    getMaxProductPrice(),
    getTopCategories(),
  ]);

  // Fetch products - make this run server-side for SEO
  let products = [];
  let totalPages = 1;

  try {
    const result = await getProducts({
      perPage: 12,
      page: currentPage,
      category,
      search: searchQuery,
      minPrice: minPrice || undefined,
      maxPrice: maxPriceParam || undefined,
      fields: "id,name,images,slug,sale_price,regular_price",
    });

    products = result.products;
    totalPages = result.totalPages;
  } catch (error) {
    console.error("Грешка при зареждане на продуктите:", error);
  }

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="bg-white">
        <div className="mx-auto max-w-10/10 py-0 sm:py-0 lg:px-0">
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
                  <stop stopColor="#129160" />
                  <stop offset={1} stopColor="#129160" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      {/* Breadcrumb and categories navigation for SEO */}
      <div className="w-full max-w-[100%] xl:max-w-[80%] mx-auto px-4 py-4 sm:px-6">
        <nav aria-label="Breadcrumb and key categories">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-indigo-600">
                Начало
              </Link>
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link
                href="/products"
                className="font-semibold hover:text-indigo-600"
                aria-current="page"
              >
                Всички продукти
              </Link>
            </li>
          </ol>

          {topCategories.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Популярни категории:
              </p>
              <div className="flex flex-wrap gap-2">
                {topCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="text-sm px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link
                  href="/category"
                  className="text-sm px-3 py-1 bg-indigo-100 rounded-full hover:bg-indigo-200 text-indigo-700"
                >
                  Всички категории
                </Link>
              </div>
            </div>
          )}
        </nav>
      </div>

      {/* Main content */}
      <div className="w-full max-w-[100%] xl:max-w-[80%] mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
          Филтри
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[15%_85%] gap-4">
          <div>
            <Filters maxPrice={maxPossiblePrice} />
          </div>

          <div>
            {/* No Suspense here - render products directly for SEO */}
            <ProductsList products={products} />
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </div>
        </div>

        {/* Hidden SEO links for pagination */}
        <div className="mt-8 hidden">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(
            (page) => (
              <Link
                key={page}
                href={`/products?page=${page}`}
                aria-label={`Page ${page}`}
              >
                {page}
              </Link>
            )
          )}
        </div>
      </div>
    </div>
  );
}
