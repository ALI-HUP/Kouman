import Link from "next/link";
import Image from "next/image";

import Kouman from "@/public/poster/kouman.jpg";
import Iman from "@/public/poster/iman.jpg";
import Mia from "@/public/poster/mia.jpg";
import Kouman2 from "@/public/poster/kouman2.jpg";
import Dogm from "@/public/poster/dogmnabash.jpeg";
import Aemia from "@/public/poster/aemia.jpg";
import Farahbakhsh from "@/public/poster/farahbakhsh.jpg";

export default function Universe() {
  const universeMembers = [
    { name: "کومان (اصلی)", image: Kouman, url: "https://www.youtube.com/@Kouman" },
    { name: "پادکست دگم‌نباش", image: Dogm, url: "https://www.youtube.com/@DogmNabash" },
    { name: "ایمان دستپاک", image: Iman, url: "https://www.youtube.com/@ImanDastpak" },
    { name: "میاپلیز", image: Mia, url: "https://www.youtube.com/@MiaPlays" },
    { name: "کومان۲", image: Kouman2, url: "https://www.youtube.com/@Kouman2" },
    { name: "اِیمیا", image: Aemia, url: "https://www.youtube.com/@AEMIAMUSIC" },
    { name: "پادکست فرح‌بخش", image: Farahbakhsh, url: "https://www.youtube.com/@FarahbakhshPodcast" },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center mb-10">دنیای کومان</h1>

      <div className="
        grid 
        grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
        gap-y-4 sm:gap-y-5 gap-x-4 sm:gap-x-6 justify-center
      ">
        {universeMembers.map((member, index) => (
          <Link
            key={index}
            href={member.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center m-3 group transition-all duration-500"
          >
            <div
              className="
                relative 
                w-36 sm:w-40 md:w-44 lg:w-48 
                h-36 sm:h-40 md:h-44 lg:h-48
                mx-auto rounded-full overflow-hidden border-5 border-orange-600
                shadow-[0_12px_25px_-5px_rgba(0,0,0,0.35),-10px_0_20px_-6px_rgba(0,0,0,0.25),10px_0_20px_-6px_rgba(0,0,0,0.25)]
                transition-all duration-400 hover:translate-y-[-6px] hover:scale-115
                hover:shadow-[0_18px_30px_-4px_rgba(0,0,0,0.45),-12px_0_24px_-6px_rgba(0,0,0,0.3),12px_0_24px_-6px_rgba(0,0,0,0.3)]
              "
            >
              <Image
                src={member.image}
                alt={`پروفایل ${member.name}`}
                fill
                className="object-cover"
              />
            </div>

            <h2 className="text-xl font-bold mt-4 group-hover:text-orange-600 transition-colors">
              {member.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
