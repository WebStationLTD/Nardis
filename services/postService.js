import { fetchAPI } from "./api";

/**
 * Get single post by slug
 * @param {string} slug - Post slug
 * @returns {Promise<Object|null>} - Post data
 */
export const getPostBySlug = async (slug) => {
    return await fetchAPI(`posts?slug=${slug}&_fields=id,slug,yoast_head_json,date,title,content`);
};

/**
 * Get latest posts
 * @returns {Promise<Array>} - List of latest posts
 */
export const getLatestPosts = async () => {
    return await fetchAPI("posts?per_page=3&_fields=id,slug,yoast_head_json,date,title,content")
}
