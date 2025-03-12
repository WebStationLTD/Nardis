import Image from "next/image";
import Link from "next/link";

export default function Example() {
  return (
    <div className="container mx-auto p-6 py-24">
      <div className="grid grid-cols-1 h-[300px] flex items-center md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg">
          <h2 className="text-4xl font-semibold mb-4">
            Хитри решения за <br></br>досадни проблеми от<br></br>
            <Link href="#">Miss Oops</Link>
          </h2>
        </div>

        <div className="bg-white rounded-lg h-[100%] flex items-center justify-center">
          <Image
            width={415}
            height={300}
            priority
            alt="Miss Oops"
            src="/missoops.jpg"
            className="rounded-2xl object-cover"
          />
        </div>
      </div>
    </div>
  );
}
