import { getProducts, getMaxProductPrice } from "@/services/productService";
import { Suspense } from "react";
import ProductsList from "./productsList";
import Filters from "./filters";
import Pagination from "./pagination";

// Use this function to safely extract parameters from searchParams
const getParamValue = async (searchParams, key, defaultValue) => {
  const params = await searchParams;
  const value = params?.[key];
  return value !== undefined && value !== null && value !== "" ? value : defaultValue;
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
      fields: "id,name,images,slug,sale_price,regular_price"
    });

    products = result.products;
    totalPages = result.totalPages;
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
