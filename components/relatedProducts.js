import { getRelatedProducts } from "@/services/productService";
import ProductCard from "@/components/ProductCard";

const RelatedProducts = async ({ relatedIds }) => {
  let relatedProducts = [];

  if (!relatedIds || relatedIds.length === 0) {
    return null; // Don't render if no related products exist
  }

  try {
    relatedProducts = await getRelatedProducts(relatedIds, 4);
  } catch (error) {
    console.error("Грешка при извличане на подобни продукти:", error);
  }

  if (relatedProducts.length === 0) {
    return null; // Don't render if no related products found
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
      {relatedProducts.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          className="flex flex-col h-full"
        />
      ))}
    </div>
  );
};

export default RelatedProducts;
