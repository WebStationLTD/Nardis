import Link from "next/link";
import { getProducts } from "@/services/productService";
import ProductCard from "@/components/ProductCard";

const PromoProducts = async () => {
  let products = [];

  try {
    const result = await getProducts({
      perPage: 4,
      orderBy: "date",
      order: "desc",
      onSale: true,
    });

    products = result.products;
  } catch (error) {
    console.error("Грешка при извличане на продуктите:", error);
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Промоционални продукти
          </h2>
          <Link
            href="#"
            className="hidden text-base font-medium text-[#b3438f] hover:text-black md:block"
          >
            Вижте всички <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-y-0 lg:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-sm md:hidden">
          <Link
            href="#"
            className="text-base font-medium text-[#b3438f] hover:text-black"
          >
            Вижте всички <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PromoProducts;
