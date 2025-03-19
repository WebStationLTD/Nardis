import Link from "next/link";
import Image from "next/image";
import WooCommerce from "../lib/woocomerce";

const RelatedProducts = async ({ relatedIds }) => {
  let relatedProducts = [];

  if (!relatedIds || relatedIds.length === 0) {
    return null; // Don't render if no related products exist
  }

  try {
    const response = await WooCommerce.get("products", {
      include: relatedIds.join(","), // Fetch specific related products
      per_page: 4
    });

    relatedProducts = response.data;
  } catch (error) {
    console.error("Грешка при извличане на подобни продукти:", error);
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
      {relatedProducts.map((product) => (
        <div key={product.id} className="group relative border rounded-lg p-4">
          <Link href={`/products/${product.slug}`}>
            <div className="relative w-full h-56 overflow-hidden rounded-md">
              <Image
                src={product.images[0]?.src || "/placeholder.webp"}
                alt={product.name}
                width={200}
                height={200}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h3 className="mt-4 text-sm font-medium text-gray-900">
              {product.name}
            </h3>

            {/* Show sale price if available */}
            {product.sale_price ? (
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-500 line-through">
                  {product.regular_price} лв.
                </p>
                <p className="text-sm font-bold text-gray-900">
                  {product.sale_price} лв.
                </p>
              </div>
            ) : (
              <p className="mt-1 text-sm font-medium text-gray-900">
                {product.price} лв.
              </p>
            )}
          </Link>

          {/* Add to Cart Button */}
          <button className="mt-4 w-full bg-gray-100 text-gray-900 py-2 rounded-md hover:bg-gray-200">
            Добави в количката
          </button>
        </div>
      ))}
    </div>
  );
};

export default RelatedProducts;
