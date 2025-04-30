import Link from "next/link";
import { getProducts } from "@/services/productService";
import ProductsSlider from "./ProductsSlider";

const NewProducts = async () => {
  let products = [];

  try {
    const result = await getProducts({
      perPage: 10,
      orderBy: "date",
      order: "desc",
    });

    products = result.products;
  } catch (error) {
    console.error("Грешка при извличане на новите продукти:", error);
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Нови продукти
          </h2>
          <Link
            href="/products"
            className="hidden text-base font-medium text-[#129160] hover:text-black md:block"
          >
            Вижте всички <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>

        <ProductsSlider products={products} />

        <div className="mt-8 text-sm md:hidden">
          <Link
            href="/products"
            className="text-base font-medium text-[#129160] hover:text-black"
          >
            Вижте всички <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NewProducts;
