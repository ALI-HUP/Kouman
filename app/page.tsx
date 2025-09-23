import next from "next";
import Image from "next/image";
import Poster from "@/public/poster/Kouman-poster.png";

export default function Home() {
  return (
    <div>
      <header className="m-5 rounded-full bg-orange-300 w-[75%] mx-auto flex justify-between items-center p-5">
        <div>
          <p className="text-xl font-semibold">KOUMAN</p>
        </div>

        <div className="flex gap-5">
          <p>فروشگاه</p>
          <p>دنیای کومان</p>
          <p>اپیزودها</p>
        </div>
      </header>

      <div className="w-[800px] mx-auto mt-10">
        <Image src={Poster} alt="Kouman Poster" />
      </div>
    </div>
  );
}