import Image from "next/image";
import Link from "next/link";

export default function Example() {
  return (
    <div className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-12 lg:px-8">
        <div className="sm:flex sm:items-baseline sm:justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Топ категории
          </h2>
          <Link
            href="#"
            className="hidden text-base font-normal text-[#b3438f] hover:text-black sm:block"
          >
            Вижте всички категории
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-6 lg:gap-8">
          <div className="group relative aspect-2/1 overflow-hidden rounded-lg sm:row-span-2 sm:aspect-square">
            <Image
              alt="Two models wearing women's black cotton crewneck tee and off-white cotton crewneck tee."
              src="/nardis-online-shop-for-luxury-cosmetics.jpg"
              fill
              className="object-cover group-hover:opacity-75"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-b from-transparent to-black opacity-50"
            />
            <div className="absolute inset-0 flex items-end p-6">
              <div>
                <h3 className="font-semibold text-white">
                  <Link href="/products">
                    <span className="absolute inset-0" />
                    Всички продукти
                  </Link>
                </h3>
                <p aria-hidden="true" className="mt-1 text-sm text-white">
                  Пазарувайте сега
                </p>
              </div>
            </div>
          </div>
          <div className="group relative aspect-2/1 overflow-hidden rounded-lg sm:aspect-auto">
            <Image
              alt="Wooden shelf with gray and olive drab green baseball caps, next to wooden clothes hanger with sweaters."
              src="/artdeco-asian-spa-mega-menu-bg.jpg"
              fill
              className="object-cover group-hover:opacity-75"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-b from-transparent to-black opacity-50"
            />
            <div className="absolute inset-0 flex items-end p-6">
              <div>
                <h3 className="font-semibold text-white">
                  <Link href="/category/artdeco-asian-spa">
                    <span className="absolute inset-0" />
                    Artdeco ASIAN SPA
                  </Link>
                </h3>
                <p aria-hidden="true" className="mt-1 text-sm text-white">
                  Пазарувайте сега
                </p>
              </div>
            </div>
          </div>
          <div className="group relative aspect-2/1 overflow-hidden rounded-lg sm:aspect-auto">
            <Image
              alt="Walnut desk organizer set with white modular trays, next to porcelain mug on wooden desk."
              src="/makeup-mega-menu-bg.jpg"
              fill
              className="object-cover group-hover:opacity-75"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-b from-transparent to-black opacity-50"
            />
            <div className="absolute inset-0 flex items-end p-6">
              <div>
                <h3 className="font-semibold text-white">
                  <Link href="/category/grim">
                    <span className="absolute inset-0" />
                    Грим
                  </Link>
                </h3>
                <p aria-hidden="true" className="mt-1 text-sm text-white">
                  Пазарувайте сега
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:hidden">
          <Link
            href="#"
            className="block text-base font-normal text-[#b3438f] hover:text-black"
          >
            Вижте всички категории
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
