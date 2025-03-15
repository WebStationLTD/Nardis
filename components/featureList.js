import {
  StarIcon,
  TruckIcon,
  PercentBadgeIcon,
} from "@heroicons/react/24/outline";

export default function FeatureList() {
  return (
    <div className="container mx-auto max-w-5xl py-6 flex gap-4 flex-wrap items-start justify-center md:justify-between">
      <div className="flex flex-row gap-4 px-4 sm:px-0 items-center text-center md:flex-1">
        <div className="">
          <TruckIcon aria-hidden="true" className="size-10 text-black" />
        </div>
        <div className="flex flex-col items-start text-left">
          <p>Безплатна доставка до адрес при поръчки над 50 лв</p>
        </div>
      </div>
      <div className="flex flex-row gap-4 px-4 sm:px-0 items-center text-center md:flex-1">
        <div className="Специални намаления на избрани продукти">
          <StarIcon aria-hidden="true" className="size-10 text-black" />
        </div>
        <div className="flex flex-col items-start text-left">
          <p>Качествена козметика от реномирани немски марки</p>
        </div>
      </div>
      <div className="flex flex-row gap-4 px-4 sm:px-0 items-center text-center md:flex-1">
        <div className="Специални намаления на избрани продукти">
          <PercentBadgeIcon aria-hidden="true" className="size-10 text-black" />
        </div>
        <div className="flex flex-col items-start text-left">
          <p>Специални намаления на избрани продукти</p>
        </div>
      </div>
    </div>
  );
}
