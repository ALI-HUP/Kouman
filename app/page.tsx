"use client";

import Link from "next/link";
import Image from "next/image";
import Poster from "@/public/poster/Kouman-poster.png";
import Logo from "@/public/png/kouman.png";
import Twitter from "@/public/png/twitter.png";
import Instagram from "@/public/png/instagram.png";
import Youtube from "@/public/png/youtube.png";
import { motion } from "framer-motion";


export default function Home() {
  return (
    <div>
      <div className="w-[750px] bg-orange-200 rounded-full mx-auto mt-10 flex justify-center items-center">
        <motion.div
          drag
          dragElastic={0.2}
          dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
          className="cursor-grab active:cursor-grabbing"
          animate={{
            y: [0, -20, 0, 20, 0],
            scale: [1, 1.04, 1, 1.04, 1]
          }}
          transition={{
            y: {
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut",
            },
            scale: {
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut",
            },
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
        >
          <Image
            src={Poster}
            alt="Kouman Poster"
            className="select-none pointer-events-none"
          />
        </motion.div>
      </div>

      <div className="m-20 text-center">
        <div className="flex flex-col gap-5">
          <h1 className="text-2xl font-black">جمعه‌های نمکی با کومان!!!؟</h1>
          <p className="text-xl">
            برنامه‌ی <strong className="text-2xl">کومان</strong> جاییه که هر جمعه‌ کورش، ایمان و میا با یه چالش جدید غیرمنتظره شما رو همراه خودشون می‌برن <br />
            تا هر‌جور غذایی که فکرشو بکنین بخورن، عجیب‌ترین محصولات اینترنتی رو امتحان کنن، به تاریخ ایران زمین سفر کنن <br />
            و تو فرهنگ غنیش جست و جو کنن و تو بازی‌های مختلف با هم مسابقه بدن!
          </p>
        </div>
      </div>

      <div className="bg-orange-200 flex justify-center gap-72 p-10">
        <div className="flex flex-col gap-10 items-end">
          <h2 className="flex gap-2 items-center">
            <Link href="https://x.com/thekouman">Twitter</Link>
            <Image src={Twitter} className="w-7" alt="Kouman Twitter" />
          </h2>
          <h2 className="flex gap-2 items-center">
            <Link href="https://instagram.com/kouman">Instagram</Link>
            <Image src={Instagram} className="w-7" alt="Kouman Instagram" />
          </h2>
          <h2 className="flex gap-2 items-center">
            <Link href="https://www.youtube.com/@Kouman">Youtube</Link>
            <Image src={Youtube} className="w-7" alt="Kouman Youtube" />
          </h2>
        </div>

        <div className="flex flex-col items-end gap-10">
          <Image src={Logo} alt="Kouman Logo" className="items-end" />
          <div className="flex flex-col items-end">
            <p>For business inquiries and correspondence, please contact us at info@kouman.net</p>
            <p>All Right Reseved By Kouman | @2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}