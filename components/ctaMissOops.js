import Image from "next/image";
import Link from "next/link";

export default function Example() {
  return (
    <div className="container mx-auto p-6 py-12">
      <div className="grid grid-cols-1 h-auto md:h-[300px] bg-[#f6f4fc] px-8 py-8 md:py-0 flex items-center md:grid-cols-2 gap-6">
        <div className="rounded-lg">
          <h2 className="text-4xl font-semibold mb-4">
            Хитри решения за <br></br>досадни проблеми от<br></br>
            <Link
              href="#"
              className="text-[#9E706E] hover:text-[#B3438F] font-[1000]"
            >
              Miss Oops
            </Link>
          </h2>
        </div>

        <div className="rounded-lg h-[100%] flex items-center justify-center">
          <Image
            width={415}
            height={300}
            alt="Miss Oops"
            src="/missoops.jpg"
            className="rounded-2xl object-cover"
          />
        </div>
      </div>
    </div>
  );
}
