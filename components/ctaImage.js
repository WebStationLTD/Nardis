import Image from "next/image";
import Link from "next/link";

export default function Example() {
  return (
    <div className="relative bg-gray-800">
      <div className="relative h-80 overflow-hidden bg-indigo-600 md:absolute md:left-0 md:h-full md:w-1/3 lg:w-1/2">
        <Image
          alt="Nardis маркова козметика"
          src="https://nardis.bg/wp-content/uploads/webimage-51190EDE-28E3-4A42-BC51691E2236AFC8.jpg"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
        <svg
          viewBox="0 0 926 676"
          aria-hidden="true"
          className="absolute -bottom-24 left-24 w-[57.875rem] transform-gpu blur-[118px]"
        >
          <path
            d="m254.325 516.708-90.89 158.331L0 436.427l254.325 80.281 163.691-285.15c1.048 131.759 36.144 345.144 168.149 144.613C751.171 125.508 707.17-93.823 826.603 41.15c95.546 107.978 104.766 294.048 97.432 373.585L685.481 297.694l16.974 360.474-448.13-141.46Z"
            fill="url(#60c3c621-93e0-4a09-a0e6-4c228a0116d8)"
            fillOpacity=".4"
          />
          <defs>
            <linearGradient
              id="60c3c621-93e0-4a09-a0e6-4c228a0116d8"
              x1="926.392"
              x2="-109.635"
              y1=".176"
              y2="321.024"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#776FFF" />
              <stop offset={1} stopColor="#FF4694" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div className="relative mx-auto max-w-7xl py-12 sm:py-12 lg:px-8 lg:py-12">
        <div className="pr-6 pl-6 md:ml-auto md:w-2/3 md:pl-16 lg:w-1/2 lg:pr-0 lg:pl-24 xl:pl-32">
          <h2 className="text-xl font-semibold text-[#b3438f]">Nardis.bg</h2>
          <p className="mt-2 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Маркова козметика от Nardis
          </p>
          <p className="mt-6 text-base/7 text-gray-300">
            Маркова козметика от NARDIS може да бъде намерена в над 80
            козметични магазина и студия в страната. За улеснение на нашите
            клиенти ние създадохме този онлайн магазин. Тук ще намерите пълната
            гама продукти Artdeco и други марки директно от официалния вносител
            и представител. Вижте нашите моливи за очи, спирала за очи или
            маркови червила, както и много полезна информация за индивидуални
            продукти, като крем коректор, база за сенки за очи и база за грим.
          </p>
          <div className="mt-8">
            <Link
              href="#"
              className="inline-flex rounded-md bg-[#b3438f] px-3.5 py-2.5 text-sm font-semibold text-white hover:text-black shadow-xs hover:bg-[#ebedeb] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Купете онлайн
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
