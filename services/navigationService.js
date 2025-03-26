import { cache } from "react";
import WooCommerce from "@/lib/woocomerce";

/**
 * Fetch all categories and organize them hierarchically
 * @returns {Promise<Array>} - Array of all categories with subcategories
 */
export const getAllCategories = cache(async () => {
  try {
    const response = await WooCommerce.get("products/categories", {
      per_page: 100,
    });
    
    // Build hierarchical category tree
    const categoryTree = buildCategoryTree(response.data);
    return categoryTree;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
});

/**
 * Get top level categories (for main navigation)
 * @returns {Promise<Array>} - Array of top level categories with subcategories
 */
export const getTopLevelCategories = cache(async () => {
  try {
    const allCategories = await getAllCategories();
    return allCategories.filter(cat => cat.parent === 0);
  } catch (error) {
    console.error("Error fetching top level categories:", error);
    return [];
  }
});

/**
 * Get featured categories for navigation
 * @returns {Promise<Array>} - Array of featured navigation items
 */
export const getFeaturedNavItems = cache(async () => {
  try {
    // Get top level categories to use as featured items
    const topCategories = await getTopLevelCategories();
    
    // Start with the "All Products" item which is always included
    const featuredItems = [
      {
        name: "Всички продукти",
        href: "/products",
        imageSrc: "/nardis-online-shop-for-luxury-cosmetics.jpg",
        imageAlt: "Каталог продукти на Nardis.bg",
      }
    ];
    
    // Add featured categories from the top categories
    if (topCategories.length > 0) {
      // First featured category (index 0)
      const firstCategoryToFeature = topCategories[0];
      const firstImagePath = firstCategoryToFeature.image?.src || "/artdeco-asian-spa-mega-menu-bg.jpg";
      
      featuredItems.push({
        name: firstCategoryToFeature.name,
        href: `/category/${firstCategoryToFeature.slug}`,
        imageSrc: firstImagePath,
        imageAlt: `${firstCategoryToFeature.name} продукти`,
      });
      
      // Second featured category (index 1, if available)
      if (topCategories.length > 1) {
        const secondCategoryToFeature = topCategories[1];
        const secondImagePath = secondCategoryToFeature.image?.src || "/makeup-mega-menu-bg.jpg";
        
        featuredItems.push({
          name: secondCategoryToFeature.name,
          href: `/category/${secondCategoryToFeature.slug}`,
          imageSrc: secondImagePath,
          imageAlt: `${secondCategoryToFeature.name} продукти`,
        });
      }
    }
    
    return featuredItems;
  } catch (error) {
    console.error("Error generating featured items:", error);
    // Fallback to hardcoded featured items if there's an error
    return [
      {
        name: "Всички продукти",
        href: "/products",
        imageSrc: "/nardis-online-shop-for-luxury-cosmetics.jpg",
        imageAlt: "Каталог продукти на Nardis.bg",
      }
    ];
  }
});

/**
 * Get additional pages for navigation
 * @returns {Promise<Array>} - Array of page navigation items
 */
export const getNavigationPages = cache(async () => {
  return [
    { name: "За нас", href: "/about-us" },
    { name: "Блог", href: "/blog" },
    { name: "Контакти", href: "/contact" },
  ];
});

/**
 * Get complete navigation data
 * @returns {Promise<Object>} - Complete navigation data structure
 */
export const getNavigationData = cache(async () => {
  const [categories, featuredItems, pages] = await Promise.all([
    getTopLevelCategories(),
    getFeaturedNavItems(),
    getNavigationPages()
  ]);

  return {
    categories: categories,
    featuredItems: featuredItems,
    pages: pages
  };
});

/**
 * Recursively builds a category tree structure
 * @param {Array} categories - All categories
 * @param {number} parentId - Parent ID to filter by
 * @returns {Array} - Nested category structure
 */
function buildCategoryTree(categories, parentId = 0) {
  return categories
    .filter((cat) => cat.parent === parentId)
    .map((cat) => ({
      ...cat,
      subcategories: buildCategoryTree(categories, cat.id),
    }));
} 