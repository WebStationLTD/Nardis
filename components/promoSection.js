import Image from "next/image";
import Link from "next/link";

// Продуктови данни - тук можете лесно да променяте информацията
const heroProducts = [
  {
    id: 1,
    name: "База за грим",
    imageSrc: "/hero-1.jpg",
    productUrl: "/products/база-за-грим",
    altText: "База за грим",
    isPriority: true,
  },
  {
    id: 2,
    name: "Гланц за устни Lip Brilliance",
    imageSrc: "/hero-2.jpg",
    productUrl: "/products/гланц-за-устни-lip-brilliance",
    altText: "Гланц за устни Lip Brilliance",
  },
  {
    id: 3,
    name: "Спирала All In One",
    imageSrc: "/hero-3.jpg",
    productUrl: "/products/спирала-all-in-one",
    altText: "Спирала All In One",
    isPriority: true, // Маркираме специално това изображение като приоритетно
  },
  {
    id: 4,
    name: "Молив за устни с минерали",
    imageSrc: "/hero-4.jpg",
    productUrl: "/products/молив-за-устни-с-минерали",
    altText: "Молив за устни с минерали",
  },
  {
    id: 5,
    name: "Хидратиращ крем за ръце",
    imageSrc: "/hero-5.jpg",
    productUrl: "/products/хидратиращ-крем-за-ръце",
    altText: "Хидратиращ крем за ръце",
  },
  {
    id: 6,
    name: "Спирала Volume Supreme",
    imageSrc: "/hero-6.jpg",
    productUrl: "/products/спирала-volume-supreme",
    altText: "Спирала Volume Supreme",
  },
  {
    id: 7,
    name: "Гланц за устни Hydra Lip Booster",
    imageSrc: "/hero-7.jpg",
    productUrl: "/products/гланц-за-устни-hydra-lip-booster",
    altText: "Гланц за устни Hydra Lip Booster",
  },
];

export default function PromoSection() {
  // Организираме продуктите в колони
  const productsByColumn = [
    // Първа колона (2 продукта)
    heroProducts.slice(0, 2),
    // Втора колона (3 продукта)
    heroProducts.slice(2, 5),
    // Трета колона (2 продукта)
    heroProducts.slice(5, 7),
  ];

  return (
    <div className="relative overflow-hidden bg-gray-800">
      <div className="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          <div className="sm:max-w-lg">
            <h1 className="text-3xl md:text-6xl font-bold tracking-tight text-white sm:text-6xl text-balance">
              Lorem ipsum
            </h1>
            <p className="text-2xl md:text-3xl lg:text-4xl text-white text-balance font-medium">
              Lorem ipsum dolor sit amet
            </p>
            <p className="mt-4 text-lg md:text-xl text-white text-balance">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
            </p>
          </div>
          <div>
            <div className="mt-10 relative z-2">
              {/* Decorative image grid */}
              <div className="lg:relative lg:inset-y-0 z-10 lg:mx-auto lg:w-full lg:max-w-7xl">
                <div className="absolute block z-4 transform sm:top-0 sm:left-1/2 sm:translate-x-8 lg:top-1/2 lg:left-1/2 lg:translate-x-8 sm:-translate-y-120 lg:-translate-y-125">
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    {/* Рендерираме колоните с продукти */}
                    {productsByColumn.map((column, columnIndex) => (
                      <div
                        key={`column-${columnIndex}`}
                        className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8"
                      >
                        {column.map((product) => (
                          <div
                            key={product.id}
                            className="h-64 w-44 overflow-hidden rounded-lg group relative"
                          >
                            <Link
                              href={product.productUrl}
                              className="block h-full w-full transition-opacity"
                              prefetch={false}
                            >
                              <Image
                                alt={product.altText}
                                src={product.imageSrc}
                                width={176}
                                height={256}
                                priority={product.isPriority}
                                className="object-cover h-full w-full transition-transform duration-300 group-hover:scale-105"
                                fetchPriority={
                                  product.isPriority ? "high" : "auto"
                                }
                                sizes="(max-width: 768px) 176px, 176px"
                                quality={product.isPriority ? 90 : 75}
                              />
                              <div className="absolute inset-0 bg-transparent group-hover:bg-black/20 transition-opacity flex items-end justify-center">
                                <div className="p-2 w-full bg-transparent group-hover:bg-black/70 transition-all duration-300 translate-y-full group-hover:translate-y-0">
                                  <p className="text-white text-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    {product.name}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Link
                href="/products"
                className="inline-flex rounded-md bg-[#129160] px-3.5 py-2.5 text-sm font-semibold text-white hover:text-black shadow-xs hover:bg-[#ebedeb] focus-visible:outline-2 cursor-pointer focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Пазарувайте онлайн
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* <svg
        viewBox="0 0 1024 1024"
        aria-hidden="true"
        className="absolute top-1/2 left-10 size-[64rem] overflow-hidden -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
      >
        <circle
          r={512}
          cx={512}
          cy={512}
          fill="url(#8d958450-c69f-4251-94bc-4e091a323369)"
          fillOpacity="0.9"
        />
        <defs>
          <radialGradient id="8d958450-c69f-4251-94bc-4e091a323369">
            <stop stopColor="#129160" />
            <stop offset={1} stopColor="#129160" />
          </radialGradient>
        </defs>
      </svg> */}
    </div>
  );
}
