// import Image from "next/image";
import Link from "next/link";

export default function Example() {
  return (
    <div className="relative overflow-hidden bg-gray-800">
      <div className="pt-16 pb-80 sm:pt-24 sm:pb-40 lg:pt-40 lg:pb-48">
        <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8">
          <div className="sm:max-w-lg">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              Nardis
            </h1>
            <quote className="text-4xl text-white">
              Когато красотата срещне съвършенството
            </quote>
            <p className="mt-4 text-xl text-white">
              Вдъхновени от природата, усъвършенствани от науката – твоята кожа
              заслужава най-доброто.
            </p>
          </div>
          <div>
            <div className="mt-10 relative z-2">
              {/* Decorative image grid */}
              <div className="lg:relative lg:inset-y-0 z-10 lg:mx-auto lg:w-full lg:max-w-7xl">
                <div className="absolute block z-4 transform sm:top-0 sm:left-1/2 sm:translate-x-8 lg:top-1/2 lg:left-1/2 lg:translate-x-8 sm:-translate-y-120 lg:-translate-y-125">
                  <div className="flex items-center space-x-6 lg:space-x-8">
                    <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg lg:opacity-100">
                        <img
                          alt=""
                          src="hero-1.jpg"
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          alt=""
                          src="hero-2.jpg"
                          className="size-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          alt=""
                          src="hero-3.jpg"
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          alt=""
                          src="hero-4.jpg"
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          alt=""
                          src="hero-5.jpg"
                          className="size-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="grid shrink-0 grid-cols-1 gap-y-6 lg:gap-y-8">
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          alt=""
                          src="hero-6.jpg"
                          className="size-full object-cover"
                        />
                      </div>
                      <div className="h-64 w-44 overflow-hidden rounded-lg">
                        <img
                          alt=""
                          src="hero-7.jpg"
                          className="size-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Link
                href="#"
                className="inline-flex rounded-md bg-[#b3438f] px-3.5 py-2.5 text-sm font-semibold text-white hover:text-black shadow-xs hover:bg-[#ebedeb] focus-visible:outline-2 cursor-pointer focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Пазарувайте онлайн
              </Link>
            </div>
          </div>
        </div>
      </div>
      <svg
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
            <stop stopColor="#bc4b93" />
            <stop offset={1} stopColor="#bc4b93" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
