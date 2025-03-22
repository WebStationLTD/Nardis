import WooCommerce from "@/lib/woocomerce";

/**
 * Fetch products with optional filtering parameters
 * @param {Object} options - Query parameters for products
 * @param {number} [options.page=1] - Page number
 * @param {number} [options.perPage=12] - Products per page
 * @param {string} [options.category] - Category slug or ID
 * @param {string} [options.search] - Search term
 * @param {number} [options.minPrice] - Minimum price filter
 * @param {number} [options.maxPrice] - Maximum price filter
 * @param {boolean} [options.onSale] - Filter by on-sale products
 * @param {string} [options.orderBy='date'] - Order by parameter
 * @param {string} [options.order='desc'] - Order direction
 * @param {string} [options.fields] - Fields to include in response
 * @param {string|number[]} [options.include] - Specific product IDs to include
 * @returns {Promise<{products: Array, totalPages: number, maxPrice: number}>}
 */
export async function getProducts(options = {}) {
  const {
    page = 1,
    perPage = 12,
    category = "",
    search = "",
    minPrice = 0,
    maxPrice,
    onSale,
    orderBy = "date",
    order = "desc",
    fields,
    include
  } = options;

  try {
    const queryParams = {
      per_page: perPage,
      page,
      orderby: orderBy,
      order,
    };

    if (category) queryParams.category = category;
    if (search) queryParams.search = search;
    if (minPrice !== undefined) queryParams.min_price = minPrice;
    if (maxPrice !== undefined) queryParams.max_price = maxPrice;
    if (onSale !== undefined) queryParams.on_sale = onSale;
    if (fields) queryParams._fields = fields;
    if (include) queryParams.include = Array.isArray(include) ? include.join(",") : include;

    const response = await WooCommerce.get("products", queryParams);

    return {
      products: response.data,
      totalPages: Number(response.headers["x-wp-totalpages"]) || 1,
      totalProducts: Number(response.headers["x-wp-total"]) || 0
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

/**
 * Get a single product by ID or slug
 * @param {string|number} identifier - Product ID or slug
 * @param {boolean} [bySlug=false] - Whether to search by slug instead of ID
 * @returns {Promise<Object>} - Product data
 */
export async function getProduct(identifier, bySlug = false) {
  try {
    if (bySlug) {
      const response = await WooCommerce.get("products", {
        slug: identifier,
      });
      return response.data.length > 0 ? response.data[0] : null;
    }
    
    const response = await WooCommerce.get(`products/${identifier}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching product ${bySlug ? 'by slug' : 'by ID'}:`, error);
    throw error;
  }
}

/**
 * Get related products by product IDs
 * @param {number[]} productIds - Array of product IDs
 * @param {number} [limit=4] - Number of products to fetch
 * @returns {Promise<Array>} - Array of product data
 */
export async function getRelatedProducts(productIds, limit = 4) {
  if (!productIds || !productIds.length) {
    return [];
  }

  try {
    const response = await WooCommerce.get("products", {
      include: Array.isArray(productIds) ? productIds.join(",") : productIds,
      per_page: limit
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching related products:", error);
    throw error;
  }
}

/**
 * Get maximum product price in the shop
 * @returns {Promise<number>} - Maximum price
 */
export async function getMaxProductPrice() {
  try {
    const response = await WooCommerce.get("products", {
      per_page: 1,
      orderby: "price",
      order: "desc",
      _fields: "id,price",
    });
    
    return Math.ceil(Number(response.data[0]?.price) / 10) * 10 || 10000;
  } catch (error) {
    console.error("Error fetching max product price:", error);
    return 10000; // Default fallback value
  }
}

/**
 * Get products by IDs (useful for wishlist)
 * @param {number[]} productIds - Array of product IDs
 * @returns {Promise<Array>} - Array of product data
 */
export async function getProductsByIds(productIds) {
  if (!productIds || !productIds.length) {
    return [];
  }

  try {
    const response = await WooCommerce.get("products", {
      include: Array.isArray(productIds) ? productIds.join(",") : productIds,
    });
    
    return response.data;
  } catch (error) {
    console.error("Error fetching products by IDs:", error);
    throw error;
  }
}

/**
 * Get product categories
 * @param {Object} options - Query parameters for categories
 * @param {number} [options.perPage=100] - Categories per page
 * @param {number} [options.page=1] - Page number
 * @param {number} [options.parent] - Parent category ID to filter by
 * @returns {Promise<Array>} - Array of category data
 */
export async function getCategories(options = {}) {
  const {
    perPage = 100,
    page = 1,
    parent
  } = options;

  try {
    const queryParams = {
      per_page: perPage,
      page
    };

    if (parent !== undefined) queryParams.parent = parent;

    const response = await WooCommerce.get("products/categories", queryParams);
    return response.data;
  } catch (error) {
    console.error("Error fetching product categories:", error);
    throw error;
  }
} 