import dynamic from "next/dynamic";
import { getProduct } from "@/services/productService";
// import RelatedProducts from "@/components/relatedProducts";
import Image from "next/image";
// import WishlistButton from "@/components/wishlistButton";
import StructuredData from "@/components/StructuredData";
import { generateProductSchema } from "@/utils/structuredData";

// Компоненти с SSR поддръжка, но зареждани лениво
const RelatedProducts = dynamic(() => import("@/components/relatedProducts"), {
  ssr: true,
  loading: () => <p>Зареждане...</p>,
});
const WishlistButton = dynamic(() => import("@/components/wishlistButton"), {
  ssr: true,
  loading: () => <p>Зареждане...</p>,
});

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Radio,
  RadioGroup,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/20/solid";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    // Извличане на данните за продукта използвайки slug параметъра
    const product = await getProduct(slug, true);

    if (!product) {
      return {
        title: "Продуктът не е намерен | Nardis",
        description: "Продуктът, който търсите, не беше намерен.",
      };
    }

    // Премахване на HTML тагове от описанието за описанието в метаданните
    const plainDescription = product.short_description
      ? product.short_description.replace(/<[^>]*>/g, "")
      : product.description
      ? product.description.replace(/<[^>]*>/g, "")
      : `Купете ${product.name} от официалния магазин на Nardis.`;

    return {
      title: `${product.name} | Nardis`,
      description: plainDescription.substring(0, 160),
      openGraph: {
        title: `${product.name} | Nardis`,
        description: plainDescription.substring(0, 160),
        images: product.images.length > 0 ? [product.images[0].src] : [],
        type: "website",
      },
      alternates: {
        canonical: `https://nardis.vercel.app/products/${product.slug}`,
      },
    };
  } catch (error) {
    console.error("Грешка при генериране на метаданни:", error);
    return {
      title: "Продукт | Nardis",
      description: "Разгледайте нашите висококачествени козметични продукти.",
    };
  }
}

export default async function ProductDetails({ params }) {
  const { slug } = await params;
  let product = null;

  try {
    product = await getProduct(slug, true); // true indicates search by slug
  } catch (error) {
    console.error("Грешка при извличане на продукта:", error);
  }

  if (!product) {
    return (
      <div className="text-center py-12 text-xl">Продуктът не е намерен.</div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl sm:px-6 sm:pt-16 lg:px-8">
      {product && <StructuredData data={generateProductSchema(product)} />}
      <div className="mx-auto max-w-2xl lg:max-w-none">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <TabGroup className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="mx-auto mt-6 w-full max-w-2xl block lg:max-w-none">
              <TabList className="grid grid-cols-3 gap-6">
                {product.images.map((image) => (
                  <Tab
                    key={image.id}
                    className="group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium text-gray-900 uppercase hover:bg-gray-50 focus:ring-3 focus:ring-indigo-500/50 focus:ring-offset-4 focus:outline-hidden"
                  >
                    <span className="sr-only">{image.name}</span>
                    <span className="absolute inset-0 overflow-hidden rounded-md">
                      <Image
                        width={200}
                        height={200}
                        quality={100}
                        alt={image.alt}
                        src={image.src}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z2Rlc2MAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5nZQAAAAAAAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5nZQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWFlaIAAAAAAAAPbWAAEAAAAA0y1zZjMyAAAAAAABDEIAAAXe///zJgAAB5IAAP2R///7ov///aMAAAPcAADAbA=="
                        className="size-full object-cover"
                      />
                    </span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-selected:ring-indigo-500"
                    />
                  </Tab>
                ))}
              </TabList>
            </div>

            <TabPanels>
              {product.images.map((image) => (
                <TabPanel key={image.id}>
                  <Image
                    width={800}
                    height={800}
                    priority
                    quality={100}
                    alt={image.alt}
                    src={image.src}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlhZWiAAAAAAAABvogAAOPUAAAOQWFlaIAAAAAAAAGKZAAC3hQAAGNpYWVogAAAAAAAAJKAAAA+EAAC2z2Rlc2MAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5nZQAAAAAAAAAAAAAAAFklFQyBodHRwOi8vd3d3LmllYy5nZQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWFlaIAAAAAAAAPbWAAEAAAAA0y1zZjMyAAAAAAABDEIAAAXe///zJgAAB5IAAP2R///7ov///aMAAAPcAADAbA=="
                    className="object-cover lg:aspect-auto lg:size-full"
                  />
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              {product.sale_price && (
                <p className="text-2xl font-semibold text-red-500 line-through">
                  {product.regular_price} лв.
                </p>
              )}

              {/* Show the correct price: sale price if available, otherwise the regular price */}
              <p className="text-3xl tracking-tight text-gray-900">
                {product.sale_price
                  ? `${product.sale_price} лв.`
                  : `${product.price} лв.`}
              </p>
            </div>

            {/* Reviews */}
            {/* <div className="mt-3">
              <h3 className="sr-only">Reviews</h3>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <StarIcon
                      key={rating}
                      aria-hidden="true"
                      className={
                        (product.rating > rating
                          ? "text-indigo-500"
                          : "text-gray-300",
                        "size-5 shrink-0")
                      }
                    />
                  ))}
                </div>
                <p className="sr-only">{product.rating} out of 5 stars</p>
              </div>
            </div> */}

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>

              {product.short_description && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Кратко описание
                  </h4>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: product.short_description,
                    }}
                    className="space-y-6 text-base text-gray-700 prose max-h-90 overflow-auto"
                  />
                </div>
              )}

              {product.description && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Пълно описание
                  </h4>
                  <div
                    dangerouslySetInnerHTML={{ __html: product.description }}
                    className="space-y-6 text-base text-gray-700 prose max-h-90 overflow-auto"
                  />
                </div>
              )}
            </div>

            <form className="mt-6">
              {/* Colors */}
              {/* <div>
                <h3 className="text-sm text-gray-600">Color</h3>

                <fieldset aria-label="Choose a color" className="mt-2">
                  <RadioGroup
                    value={selectedColor}
                    onChange={setSelectedColor}
                    className="flex items-center gap-x-3"
                  >
                    {product.colors.map((color) => (
                      <Radio
                        key={color.name}
                        value={color}
                        aria-label={color.name}
                        className={
                          (color.selectedColor,
                          "relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-hidden data-checked:ring-2 data-focus:data-checked:ring-3 data-focus:data-checked:ring-offset-1")
                        }
                      >
                        <span
                          aria-hidden="true"
                          className={
                            (color.bgColor,
                            "size-8 rounded-full border border-black/10")
                          }
                        />
                      </Radio>
                    ))}
                  </RadioGroup>
                </fieldset>
              </div> */}

              <div className="mt-10 flex">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md bg-[#b3438f] px-3.5 py-2.5 text-sm font-semibold text-white hover:text-black shadow-xs hover:bg-[#ebedeb] focus-visible:outline-2 cursor-pointer focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  Добави в количката
                </button>
                <span>
                  <WishlistButton productId={product.id} className="ml-4" />
                </span>
              </div>
            </form>
          </div>
        </div>

        <section
          aria-labelledby="related-heading"
          className="mt-10 border-t border-gray-200 px-4 py-16 sm:px-0"
        >
          <h2 id="related-heading" className="text-xl font-bold text-gray-900">
            Подобни продукти
          </h2>

          <RelatedProducts relatedIds={product.related_ids} />
        </section>
      </div>
    </div>
  );
}
