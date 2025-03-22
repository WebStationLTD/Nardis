import Link from "next/link";
import { getProducts } from "@/services/productService";

const NewProducts = async () => {
  let products = [];

  try {
    const result = await getProducts({
      perPage: 4,
      orderBy: "date",
      order: "desc"
    });

    products = result.products;
  } catch (error) {
    console.error("Грешка при извличане на новите продукти:", error);
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-12 lg:max-w-7xl lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Нови продукти
          </h2>
          <a
            href="#"
            className="hidden text-base font-medium text-[#b3438f] hover:text-black md:block"
          >
            Вижте всички <span aria-hidden="true"> &rarr;</span>
          </a>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-y-0 lg:gap-x-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative border-1 border-solid rounded-lg border-[#1e2939] py-4 px-4"
            >
              <div className="h-56 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:h-72 xl:h-80">
                <img
                  src={product.images[0]?.src}
                  alt={product.name}
                  className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 className="mt-4 text-sm text-gray-700">
                <Link href={`/products/${product.slug}`} prefetch={true}>
                  <span className="absolute inset-0" />
                  {product.name}
                </Link>
              </h3>
              <p className="mt-1 text-lg font-medium text-gray-900">
                {product.price} лв.
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 text-sm md:hidden">
          <a
            href="#"
            className="text-base font-medium text-[#b3438f] hover:text-black"
          >
            Вижте всички <span aria-hidden="true"> &rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewProducts;
