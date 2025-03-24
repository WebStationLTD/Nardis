import dynamic from "next/dynamic";
import { getProducts, getMaxProductPrice, getCategories } from "@/services/productService";
import { Suspense } from "react";

// Dynamically import components that are not critical for initial loading
const Pagination = dynamic(() => import("./pagination"), {
  loading: () => <p>Зареждане...</p>,
});

const Filters = dynamic(() => import("./filters"), {
  loading: () => <p>Зареждане...</p>,
});

const ProductsList = dynamic(() => import("./productsList"), {
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
  const directMatch = categories.find(cat => cat.slug === slug);
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
      const secondPageCategories = await getCategories({ perPage: 100, page: 2 });
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
        title: 'Category Not Found',
        description: 'The requested category could not be found.'
      };
    }
    
    return {
      title: `${category.name} | Nardis`,
      description: category.description || `Browse our selection of ${category.name} products.`,
      openGraph: {
        title: `${category.name} | Nardis`,
        description: category.description || `Browse our selection of ${category.name} products.`,
        type: 'website',
      }
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Category | Nardis',
      description: 'Browse our product categories',
    };
  }
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  
  // Get category ID from slug
  let categoryId = "";
  let categoryName = "";
  try {
    // Get all categories including children
    const allCategories = await getAllCategories();
    const category = findCategoryBySlug(allCategories, slug);
    
    if (category) {
      categoryId = category.id.toString();
      categoryName = category.name;
    } else {
      return (
        <div className="text-center py-12 text-xl">Категорията не е намерена.</div>
      );
    }
  } catch (error) {
    console.error("Грешка при зареждане на категорията:", error);
    return (
      <div className="text-center py-12 text-xl">Грешка при зареждане на категорията.</div>
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
      fields: "id,name,images,slug,sale_price,regular_price",
    });

    products = result.products;
    totalPages = result.totalPages;
  } catch (error) {
    console.error("Грешка при зареждане на продуктите:", error);
  }

  return (
    <div className="bg-white">
      <div className="w-full max-w-[80%] xl:max-w-[80%] mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
          {categoryName}
        </h1>
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