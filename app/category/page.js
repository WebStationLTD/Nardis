import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { getCategories } from "@/services/productService";
import SkeletonCategoryList from "@/components/SkeletonCategoryList";

export const metadata = {
  title: 'Product Categories | Nardis',
  description: 'Browse our product categories',
};

// Function to fetch all categories including all parent and child categories
const getAllCategories = async () => {
  try {
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

// Helper function to organize categories into a hierarchical structure
const organizeCategoriesHierarchy = (categories) => {
  // First, separate into parent and child categories
  const parentCategories = categories.filter(cat => !cat.parent);
  const childCategories = categories.filter(cat => cat.parent);
  
  // Function to find direct children of a category
  const findDirectChildren = (parentId) => {
    return categories.filter(cat => cat.parent === parentId);
  };
  
  // Add children to each parent category
  parentCategories.forEach(parent => {
    parent.children = findDirectChildren(parent.id);
  });
  
  return parentCategories;
};

// Create a separate component for the categories content
async function CategoriesContent() {
  let categories = [];
  
  try {
    // Get all categories
    const allCategories = await getAllCategories();
    
    // For the main category page, we'll display both parent categories 
    // and child categories that may be directly useful to users
    categories = allCategories;
  } catch (error) {
    console.error("Error loading categories:", error);
  }
  
  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-12 text-xl">
        No categories found.
      </div>
    );
  }

  // Organize categories hierarchically for display
  const parentCategories = organizeCategoriesHierarchy(categories);

  return (
    <>
      {/* Display parent categories */}
      <div className="mt-10 space-y-16">
        {parentCategories.map((parentCategory) => (
          <div key={parentCategory.id}>
            <h2 className="text-2xl font-semibold mb-6">{parentCategory.name}</h2>
            
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {/* Display the parent category itself */}
              <Link 
                href={`/category/${parentCategory.slug}`}
                className="group block overflow-hidden rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
              >
                <div className="relative h-64 w-full overflow-hidden">
                  {parentCategory.image ? (
                    <Image
                      src={parentCategory.image.src}
                      alt={parentCategory.name}
                      className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                      width={600}
                      height={400}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-100">
                      <span className="text-gray-400">All {parentCategory.name}</span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600">
                    All {parentCategory.name}
                  </h3>
                  
                  {parentCategory.description && (
                    <div 
                      className="mt-2 text-sm text-gray-600 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: parentCategory.description }}
                    />
                  )}
                  
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      {parentCategory.count} {parentCategory.count === 1 ? 'product' : 'products'}
                    </p>
                    
                    <span className="inline-flex items-center text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                      Browse products
                      <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
              
              {/* Display child categories */}
              {parentCategory.children && parentCategory.children.length > 0 && 
                parentCategory.children.map((childCategory) => (
                  <Link 
                    key={childCategory.id} 
                    href={`/category/${childCategory.slug}`}
                    className="group block overflow-hidden rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="relative h-64 w-full overflow-hidden">
                      {childCategory.image ? (
                        <Image
                          src={childCategory.image.src}
                          alt={childCategory.name}
                          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                          width={600}
                          height={400}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-100">
                          <span className="text-gray-400">No Image</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600">
                        {childCategory.name}
                      </h3>
                      
                      {childCategory.description && (
                        <div 
                          className="mt-2 text-sm text-gray-600 line-clamp-2"
                          dangerouslySetInnerHTML={{ __html: childCategory.description }}
                        />
                      )}
                      
                      <div className="mt-4 flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          {childCategory.count} {childCategory.count === 1 ? 'product' : 'products'}
                        </p>
                        
                        <span className="inline-flex items-center text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                          Browse products
                          <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              }
            </div>
          </div>
        ))}
      </div>
      
      {/* Display any orphaned categories that don't have parents but aren't top-level */}
      {categories.filter(cat => cat.parent && !parentCategories.some(p => 
        p.children && p.children.some(c => c.id === cat.id)
      )).length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">Other Categories</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {categories
              .filter(cat => cat.parent && !parentCategories.some(p => 
                p.children && p.children.some(c => c.id === cat.id)
              ))
              .map((category) => (
                <Link 
                  key={category.id} 
                  href={`/category/${category.slug}`}
                  className="group block overflow-hidden rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="relative h-64 w-full overflow-hidden">
                    {category.image ? (
                      <Image
                        src={category.image.src}
                        alt={category.name}
                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
                        width={600}
                        height={400}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100">
                        <span className="text-gray-400">No Image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600">
                      {category.name}
                    </h3>
                    
                    {category.description && (
                      <div 
                        className="mt-2 text-sm text-gray-600 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: category.description }}
                      />
                    )}
                    
                    <div className="mt-4 flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        {category.count} {category.count === 1 ? 'product' : 'products'}
                      </p>
                      
                      <span className="inline-flex items-center text-sm font-medium text-indigo-600 group-hover:text-indigo-700">
                        Browse products
                        <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            }
          </div>
        </div>
      )}
    </>
  );
}

export default function CategoryIndexPage() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Product Categories</h1>
        
        <Suspense fallback={<SkeletonCategoryList />}>
          <CategoriesContent />
        </Suspense>
      </div>
    </div>
  );
} 