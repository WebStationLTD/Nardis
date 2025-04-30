import {
  StarIcon,
  TruckIcon,
  PercentBadgeIcon,
} from "@heroicons/react/24/outline";

export default function FeatureList() {
  return (
    <div className="bg-[#129160]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-4 flex-wrap items-start justify-center md:justify-between">
          <div className="flex flex-row gap-4 px-4 sm:px-0 items-center text-center md:flex-1">
            <div className="">
              <TruckIcon aria-hidden="true" className="size-10 text-white" />
            </div>
            <div className="flex flex-col items-start text-left">
              <p className="text-white">
                Безплатна доставка до адрес при поръчки над 50 лв
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-4 px-4 sm:px-0 items-center text-center md:flex-1">
            <div className="">
              <StarIcon aria-hidden="true" className="size-10 text-white" />
            </div>
            <div className="flex flex-col items-start text-left">
              <p className="text-white">
                Качествени продукти от реномирани доставчици
              </p>
            </div>
          </div>
          <div className="flex flex-row gap-4 px-4 sm:px-0 items-center text-center md:flex-1">
            <div className="">
              <PercentBadgeIcon
                aria-hidden="true"
                className="size-10 text-white"
              />
            </div>
            <div className="flex flex-col items-start text-left">
              <p className="text-white">
                Специални намаления на избрани продукти
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
