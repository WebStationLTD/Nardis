import { fetchAPI } from "./api";

/**
 * Get a single page by slug
 * @param {string} slug - Page slug
 * @returns {Promise<Object|null>} - Page data
 */
export const getPageBySlug = async (slug) => {
  return await fetchAPI(
    `pages?slug=${slug}&_fields=id,slug,yoast_head_json,date,title,content`
  );
};

/**
 * Get all pages
 * @param {Object} options - Options for the request
 * @param {number} [options.perPage=10] - Pages per page
 * @param {number} [options.page=1] - Page number
 * @returns {Promise<Array>} - List of pages
 */
export const getPages = async (options = {}) => {
  const { perPage = 10, page = 1 } = options;
  return await fetchAPI(
    `pages?per_page=${perPage}&page=${page}&_fields=id,slug,yoast_head_json,date,title`
  );
};

/**
 * Get a page by ID
 * @param {number} id - Page ID
 * @returns {Promise<Object|null>} - Page data
 */
export const getPageById = async (id) => {
  return await fetchAPI(
    `pages/${id}?_fields=id,slug,yoast_head_json,date,title,content`
  );
};
