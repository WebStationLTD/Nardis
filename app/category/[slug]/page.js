import dynamic from "next/dynamic";
import {
  getProducts,
  getMaxProductPrice,
  getCategories,
} from "@/services/productService";
import { Suspense } from "react";

// Dynamically import components with SSR support
const Pagination = dynamic(() => import("./pagination"), {
  ssr: true,
  loading: () => <p>Зареждане...</p>,
});

const Filters = dynamic(() => import("./filters"), {
  ssr: true,
  loading: () => <p>Зареждане...</p>,
});

const ProductsList = dynamic(() => import("./productsList"), {
  ssr: true,
  loading: () => <p>Зареждане...</p>,
});

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
const getAllCategories = async () => {
  try {
    // Fetch all categories without parent filter
    // First page with high per_page to get as many as possible
    const firstPageCategories = await getCategories({ perPage: 100, page: 1 });

    // Check if there are more pages
    if (firstPageCategories.length === 100) {
      // Likely more categories, fetch page 2
      const secondPageCategories = await getCategories({
        perPage: 100,
        page: 2,
      });
      return [...firstPageCategories, ...secondPageCategories];
    }

    return firstPageCategories;
  } catch (error) {
    console.error("Error fetching all categories:", error);
    return [];
  }
};

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    // Get all categories to find the right one
    const allCategories = await getAllCategories();
    const category = findCategoryBySlug(allCategories, slug);

    if (!category) {
      return {
        title: "Category Not Found",
        description: "The requested category could not be found.",
      };
    }

    return {
      title: `${category.name} | Nardis`,
      description:
        category.description ||
        `Browse our selection of ${category.name} products.`,
      openGraph: {
        title: `${category.name} | Nardis`,
        description:
          category.description ||
          `Browse our selection of ${category.name} products.`,
        type: "website",
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Category | Nardis",
      description: "Browse our product categories",
    };
  }
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;

  // Get category ID from slug
  let categoryId = "";
  let categoryName = "";
  let categoryDescription = "";
  try {
    // Get all categories including children
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

  // Get max price for filter boundaries
  const maxPossiblePrice = await getMaxProductPrice();

  // For the filter parameter, use the URL value if present
  const maxPriceParam = await getNumericParam(searchParams, "maxPrice", null);

  let products = [];
  let totalPages = 1;

  try {
    // Fetch products with filters
    const result = await getProducts({
      perPage: 12,
      page: currentPage,
      category: categoryId,
      search: searchQuery,
      minPrice: minPrice || undefined,
      maxPrice: maxPriceParam || undefined,
      fields: "id,name,images,slug,sale_price,regular_price,short_description",
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
                {categoryName}
              </h1>
              {/* <p className="mt-6 text-lg/8 text-white">{categoryDescription}</p> */}
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
        {currentPage === 1 && categoryDescription && (
          <p className="mt-6 text-lg/8 text-black">{categoryDescription}</p>
        )}
      </div>
    </div>
  );
}
