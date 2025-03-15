import { CheckCircleIcon } from "@heroicons/react/20/solid";

const benefits = [
  "Competitive salaries",
  "Flexible work hours",
  "30 days of paid vacation",
  "Annual team retreats",
  "Benefits for you and your family",
  "A great work environment",
];

export default function Example() {
  return (
    <div className="bg-gray-900 py-12 sm:py-12 overflow-hidden">
      <div className="relative isolate">
        <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-2xl flex-col gap-16 bg-white/5 px-6 py-12 ring-1 ring-white/10 sm:rounded-3xl sm:p-8 lg:mx-0 lg:max-w-none lg:flex-row lg:items-center lg:py-12 xl:gap-x-20 xl:px-20">
            <img
              alt=""
              src="https://nardis.bg/wp-content/uploads/webimage-60C17F8B-F56E-4A71-96CDAA4CBEBA9F9F.png"
              className="h-96 w-full flex-none rounded-2xl object-cover shadow-xl lg:aspect-square lg:h-auto lg:max-w-sm"
            />
            <div className="w-full flex-auto">
              <h2 className="text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl">
                Asian SPA
              </h2>
              <p className="mt-6 text-lg/8 text-pretty text-gray-300">
                Lorem ipsum dolor sit amet consect adipisicing elit. Possimus
                magnam voluptatum cupiditate veritatis in accusamus quisquam.
              </p>
              <ul
                role="list"
                className="mt-10 grid grid-cols-1 gap-x-8 gap-y-3 text-base/7 text-white sm:grid-cols-2"
              >
                {benefits.map((benefit) => (
                  <li key={benefit} className="flex gap-x-3">
                    <CheckCircleIcon
                      aria-hidden="true"
                      className="h-7 w-5 flex-none"
                    />
                    {benefit}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex">
                <a href="#" className="text-sm/6 font-semibold text-indigo-400">
                  See our job postings <span aria-hidden="true">&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-16 -z-10 flex transform-gpu justify-center overflow-hidden blur-3xl"
        >
          <div
            style={{
              clipPath:
                "polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)",
            }}
            className="aspect-1318/752 w-[82.375rem] flex-none bg-linear-to-r from-[#b3438f] to-[#b3438f] opacity-80"
          />
        </div>
      </div>
    </div>
  );
}
