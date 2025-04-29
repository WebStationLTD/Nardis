import dynamic from "next/dynamic";
import Link from "next/link";
import {
  getProducts,
  getMaxProductPrice,
  getCategories,
  getAllCategories,
} from "@/services/productService";
import SkeletonFilters from "@/components/SkeletonFilters";
import SkeletonPagination from "@/components/SkeletonPagination";

// Подобрена конфигурация за ISR
export const revalidate = 3600; // Ревалидиране на всеки час
export const fetchCache = "force-cache"; // Подобрено кеширане

// Dynamically import components with SSR support
const Pagination = dynamic(() => import("./pagination"), {
  ssr: true,
  loading: () => <SkeletonPagination />,
});

const Filters = dynamic(() => import("./filters"), {
  ssr: true,
  loading: () => <SkeletonFilters />,
});

// Import ProductsList directly without dynamic import for SEO
import ProductsList from "./productsList";

// Helper functions for parameters
const getParamValue = async (searchParams, key, defaultValue) => {
  const params = await searchParams;
  const value = (await params)?.[key];
  return value !== undefined && value !== null && value !== ""
    ? value
    : defaultValue;
};

const getNumericParam = async (searchParams, key, defaultValue) => {
  const params = await searchParams;
  const value = Number(params?.[key]);
  return !isNaN(value) ? value : defaultValue;
};

// Helper function to find a category by slug recursively through all categories
const findCategoryBySlug = (categories, slug) => {
  // First, try direct match
  const directMatch = categories.find((cat) => cat.slug === slug);
  if (directMatch) return directMatch;

  // No direct match found, return null
  return null;
};

// Function to fetch all categories including all parent and child categories
// We'll use the cached version from productService.js now

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    // Get all categories to find the right one - using cached function
    const allCategories = await getAllCategories();
    const category = findCategoryBySlug(allCategories, slug);

    if (!category) {
      return {
        title: "Category Not Found",
        description: "The requested category could not be found.",
      };
    }

    // Fetch first product image for preload
    const result = await getProducts({
      perPage: 1,
      page: 1,
      category: category.id.toString(),
      fields: "images",
    });

    const firstProductImageUrl = result.products[0]?.images?.[0]?.src;

    return {
      title: `${category.name} | Nardis`,
      description:
        category.description ||
        `Разгледайте нашата селекция от ${category.name} продукти.`,
      openGraph: {
        title: `${category.name} | Nardis`,
        description:
          category.description ||
          `Разгледайте нашата селекция от ${category.name} продукти.`,
        type: "website",
        locale: "bg_BG",
      },
      other: firstProductImageUrl
        ? {
            'link[rel="preload"]': {
              as: "image",
              href: firstProductImageUrl,
              fetchPriority: "high",
            },
          }
        : {},
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Категории | Nardis",
      description: "Разгледайте нашите продуктови категории",
    };
  }
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;

  // Get category ID from slug - Важно: използваме кешираната функция
  let categoryId = "";
  let categoryName = "";
  let categoryDescription = "";
  try {
    // Get all categories including children - using the cached function
    const allCategories = await getAllCategories();
    const category = findCategoryBySlug(allCategories, slug);

    if (category) {
      categoryId = category.id.toString();
      categoryName = category.name;
      categoryDescription = category.description;
    } else {
      return (
        <div className="text-center py-12 text-xl">
          Категорията не е намерена.
        </div>
      );
    }
  } catch (error) {
    console.error("Грешка при зареждане на категорията:", error);
    return (
      <div className="text-center py-12 text-xl">
        Грешка при зареждане на категорията.
      </div>
    );
  }

  // Get filter parameters from URL with fallbacks
  const searchQuery = await getParamValue(searchParams, "search", "");
  const currentPage = await getNumericParam(searchParams, "page", 1);
  const minPrice = await getNumericParam(searchParams, "minPrice", 0);
  const category = await getParamValue(searchParams, "category", "");
  const subcategory = await getParamValue(searchParams, "subcategory", "");

  // Get max price for filter boundaries
  const maxPossiblePrice = await getMaxProductPrice();

  // For the filter parameter, use the URL value if present
  const maxPriceParam = await getNumericParam(searchParams, "maxPrice", null);

  let products = [];
  let totalPages = 1;
  let totalProducts = 0;

  try {
    // Определяме коя категория да използваме за филтъра
    let categoryToUse = categoryId; // По подразбиране - текущата категория от URL

    // Ако е зададена категория от филтрите - взимаме нея
    if (category && category !== categoryId) {
      categoryToUse = category;
    }

    // Ако е зададена подкатегория от филтрите - тя има приоритет
    if (subcategory) {
      categoryToUse = subcategory;
    }

    // Fetch products with filters
    const result = await getProducts({
      perPage: 12,
      page: currentPage,
      category: categoryToUse,
      search: searchQuery,
      minPrice: minPrice || undefined,
      maxPrice: maxPriceParam || undefined,
      fields:
        "id,name,images,slug,sale_price,regular_price,short_description,stock_status",
    });

    products = result.products;
    totalPages = result.totalPages;
    totalProducts = result.totalProducts;
  } catch (error) {
    console.error("Грешка при зареждане на продуктите:", error);
  }

  // Get related categories for SEO - reusing the already fetched categories
  let relatedCategories = [];
  try {
    const allCategories = await getAllCategories(); // This is now cached
    // Find categories with the same parent or siblings
    const currentCategory = findCategoryBySlug(allCategories, slug);
    if (currentCategory) {
      relatedCategories = allCategories
        .filter(
          (cat) =>
            cat.id !== currentCategory.id &&
            (cat.parent === currentCategory.parent || // siblings
              cat.parent === currentCategory.id) // children
        )
        .slice(0, 5); // Limit to 5 categories
    }
  } catch (error) {
    console.error("Error loading related categories:", error);
  }

  return (
    <div className="bg-white">
      <div className="bg-white">
        <div className="mx-auto max-w-10/10 py-0 sm:py-0 lg:px-0">
          <div className="relative isolate overflow-hidden bg-gray-900 px-6 py-12 text-center shadow-2xl sm:px-12">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {categoryName}
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

      {/* SEO breadcrumb navigation */}
      <div className="w-full max-w-[100%] md:max-w-[80%] mx-auto px-4 py-4 sm:px-6">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-indigo-600">
                Начало
              </Link>
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link href="/category" className="hover:text-indigo-600">
                Категории
              </Link>
              <span className="mx-2">/</span>
            </li>
            <li>
              <Link
                href={`/category/${slug}`}
                className="font-semibold hover:text-indigo-600"
                aria-current="page"
              >
                {categoryName}
              </Link>
            </li>
          </ol>

          {/* Related categories for SEO */}
          {relatedCategories.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Свързани категории:
              </p>
              <div className="flex flex-wrap gap-2">
                {relatedCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className="text-sm px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>
      </div>

      <div className="w-full max-w-[100%] md:max-w-[80%] mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
          Филтри
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-[15%_85%] gap-4">
          <div>
            <Filters maxPrice={maxPossiblePrice} />
          </div>

          <div>
            {totalProducts > 0 ? (
              <>
                {/* No Suspense here - render products directly for SEO */}
                <ProductsList products={products} />
                <Pagination currentPage={currentPage} totalPages={totalPages} />
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Няма намерени продукти в тази категория.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Hidden pagination links for SEO */}
        <div className="mt-8 hidden">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(
            (page) => (
              <Link
                key={page}
                href={`/category/${slug}?page=${page}`}
                aria-label={`Page ${page}`}
              >
                {page}
              </Link>
            )
          )}
        </div>

        {currentPage === 1 && categoryDescription && (
          <div className="mt-8 prose max-w-none">
            <h2>Относно {categoryName}</h2>
            <div dangerouslySetInnerHTML={{ __html: categoryDescription }} />
          </div>
        )}
      </div>
    </div>
  );
}
