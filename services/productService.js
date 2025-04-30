import WooCommerce from "@/lib/woocomerce";
import { cache } from "react";

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
export const getProducts = cache(async (options = {}) => {
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
    include,
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
    if (fields) {
      if (!fields.includes("stock_status")) {
        queryParams._fields = `${fields},stock_status`;
      } else {
        queryParams._fields = fields;
      }
    } else {
      queryParams._fields =
        "id,name,images,slug,price,sale_price,regular_price,stock_status";
    }
    if (include)
      queryParams.include = Array.isArray(include)
        ? include.join(",")
        : include;

    const response = await WooCommerce.get("products", queryParams);

    return {
      products: response.data,
      totalPages: Number(response.headers["x-wp-totalpages"]) || 1,
      totalProducts: Number(response.headers["x-wp-total"]) || 0,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
});

/**
 * Get a single product by ID or slug
 * @param {string|number} identifier - Product ID or slug
 * @param {boolean} [bySlug=false] - Whether to search by slug instead of ID
 * @returns {Promise<Object>} - Product data
 */
export const getProduct = cache(async (identifier, bySlug = false) => {
  try {
    if (bySlug) {
      const response = await WooCommerce.get("products", {
        slug: identifier,
        _fields:
          "id,name,images,slug,sale_price,regular_price,description,short_description,price,related_ids,attributes,meta_data,stock_status",
      });
      return response.data.length > 0 ? response.data[0] : null;
    }

    const response = await WooCommerce.get(`products/${identifier}`, {
      _fields:
        "id,name,images,slug,sale_price,regular_price,description,short_description,price,related_ids,attributes,meta_data,stock_status",
    });
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching product ${bySlug ? "by slug" : "by ID"}:`,
      error
    );
    throw error;
  }
});

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
      per_page: limit,
      _fields:
        "id,name,images,slug,price,sale_price,regular_price,stock_status",
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
      _fields:
        "id,name,images,slug,price,sale_price,regular_price,stock_status",
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
export const getCategories = cache(async (options = {}) => {
  const { perPage = 100, page = 1, parent } = options;

  try {
    const queryParams = {
      per_page: perPage,
      page,
    };

    if (parent !== undefined) queryParams.parent = parent;

    const response = await WooCommerce.get("products/categories", queryParams);
    return response.data;
  } catch (error) {
    console.error("Error fetching product categories:", error);
    throw error;
  }
});

/**
 * Get all categories without pagination limit
 * This is cached to avoid multiple API calls for the same data
 * @returns {Promise<Array>} - Complete array of all categories
 */
export const getAllCategories = cache(async () => {
  try {
    // Fetch all categories in a single request with max allowed limit
    const categories = await getCategories({ perPage: 100, page: 1 });

    // If we got 100 categories, there might be more, fetch page 2
    if (categories.length === 100) {
      const secondPageCategories = await getCategories({
        perPage: 100,
        page: 2,
      });
      return [...categories, ...secondPageCategories];
    }

    return categories;
  } catch (error) {
    console.error("Error fetching all categories:", error);
    return [];
  }
});
