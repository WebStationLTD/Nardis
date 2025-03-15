export default function Example() {
  return (
    <div className="relative isolate overflow-hidden bg-gray-900">
      <div className="px-6 py-12 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
            Качествена козметика онлайн от Nardis.bg
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg/8 text-pretty text-gray-300">
            Козметика онлайн с доставка до адреса Ви от интернет магазин NARDIS.
            Фирма Нардиз ЕООД е официален представител на маркова козметика
            Artdeco, Marbert и Bettina Barty.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <a
              href="#"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-xs hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Вижте повече
            </a>
            <a href="#" className="text-sm/6 font-semibold text-white">
              Контакти <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
      <svg
        viewBox="0 0 1024 1024"
        aria-hidden="true"
        className="absolute -top-1/4 left-1/2 -z-10 size-[64rem] -translate-x-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
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
            <stop stopColor="#b3438f" />
            <stop offset={1} stopColor="#b3438f" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
