"use client";

import Link from "next/link";
import Image, { StaticImageData } from "next/image";
import { FC } from "react";
import { motion, type Variants } from "framer-motion";

import Kouman from "@/public/poster/kouman.jpg";
import Iman from "@/public/poster/iman.jpg";
import Mia from "@/public/poster/mia.jpg";
import Kouman2 from "@/public/poster/kouman2.jpg";
import Dogm from "@/public/poster/dogmnabash.jpeg";
import Aemia from "@/public/poster/aemia.jpg";
import Farahbakhsh from "@/public/poster/farahbakhsh.jpg";

interface UniverseMember {
  name: string;
  image: StaticImageData;
  url: string;
}

const baseShadow =
  "shadow-[0_12px_25px_-5px_rgba(0,0,0,0.35),-10px_0_20px_-6px_rgba(0,0,0,0.25),10px_0_20px_-6px_rgba(0,0,0,0.25)]";
const hoverShadow =
  "0 18px 30px -4px rgba(0,0,0,0.45), -12px 0 24px -6px rgba(0,0,0,0.3), 12px 0 24px -6px rgba(0,0,0,0.3)";

const circleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 24 },
  visible: { opacity: 1, scale: 1, y: 0 },
};

const titleVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

const gridVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

interface CircleComponentProps {
  member: UniverseMember;
}

export default function Universe() {
  const universeMembers: UniverseMember[] = [
    {
      name: "کومان (اصلی)",
      image: Kouman,
      url: "https://www.youtube.com/@Kouman",
    },
    {
      name: "پادکست دگم‌نباش",
      image: Dogm,
      url: "https://www.youtube.com/@DogmNabash",
    },
    {
      name: "ایمان دستپاک",
      image: Iman,
      url: "https://www.youtube.com/@ImanDastpak",
    },
    { name: "کومان۲", image: Kouman2, url: "https://www.youtube.com/@Kouman2" },
    { name: "میاپلیز", image: Mia, url: "https://www.youtube.com/@MiaPlays" },
    {
      name: "اِیمیا",
      image: Aemia,
      url: "https://www.youtube.com/@AEMIAMUSIC",
    },
    {
      name: "پادکست فرح‌بخش",
      image: Farahbakhsh,
      url: "https://www.youtube.com/@FarahbakhshPodcast",
    },
  ];

  const CircleComponent: FC<CircleComponentProps> = ({ member }) => {
    const baseClasses = `
      relative
      w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 lg:w-48 lg:h-48
      mx-auto rounded-full overflow-hidden border-5 border-orange-600
      ${baseShadow}
    `;

    return (
      <motion.div
        className={baseClasses}
        variants={circleVariants}
        whileHover={{ scale: 1.3, y: -10, boxShadow: hoverShadow }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={member.image}
          alt={`پروفایل ${member.name}`}
          fill
          className="object-cover"
        />
      </motion.div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold text-center mb-10">دنیای کومان</h1>

      <motion.div
        className="
          grid
          grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4
          gap-y-16 sm:gap-y-10 gap-x-4 sm:gap-x-6 justify-center
        "
        variants={gridVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
      >
        {universeMembers.map((member, index) => (
          <div key={index} className="flex flex-col items-center">
            <Link
              href={member.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-center group"
            >
              <CircleComponent member={member} />

              <motion.h2
                variants={titleVariants}
                transition={{ duration: 0.3 }}
                className="text-xl font-bold mt-4 transition-colors group-hover:text-orange-600"
              >
                {member.name}
              </motion.h2>
            </Link>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
