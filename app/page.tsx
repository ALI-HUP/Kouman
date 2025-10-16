"use client";

import Link from "next/link";
import Image from "next/image";
import Poster from "@/public/poster/Kouman-poster.png";
import { motion } from "framer-motion";
import YouTubeSlider from "@/components/YouTubeSlider";

const MotionLink = motion(Link);

export default function Home() {
  return (
    <div className="w-full">
      <div className="bg-orange-200 rounded-full mx-auto mt-5 flex justify-center items-center w-[750px] max-w-[90%] sm:max-w-[80%] md:max-w-[600px] lg:max-w-[750px] p-4 sm:p-6">
        <motion.div
          drag
          dragElastic={0.2}
          dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
          className="cursor-grab active:cursor-grabbing"
          animate={{
            y: [0, -20, 0, 20, 0],
            scale: [1, 1.04, 1, 1.04, 1],
          }}
          transition={{
            y: { repeat: Infinity, duration: 6, ease: "easeInOut" },
            scale: { repeat: Infinity, duration: 6, ease: "easeInOut" },
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
        >
          <Image
            src={Poster}
            alt="Kouman Poster"
            className="select-none pointer-events-none w-full h-auto"
          />
        </motion.div>
      </div>

      <div className="px-6 sm:px-10 md:px-16 lg:px-14 py-10 sm:py-16 md:py-14 lg:py-12">
        <div className="flex flex-col gap-6 sm:gap-8 max-w-3xl mx-auto text-center">
          <h1 className="text-xl sm:text-2xl md:text-4xl font-black leading-snug">
            جمعه‌های نمکی با کومان!!!؟
          </h1>
          <p className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-800">
            برنامه‌ی <strong className="text-lg sm:text-xl md:text-2xl">کومان</strong>{" "}
            جاییه که هر جمعه کورش، ایمان و میا با یه چالش جدید غیرمنتظره شما رو همراه
            خودشون می‌برن تا هر‌جور غذایی که فکرشو بکنین بخورن، عجیب‌ترین محصولات
            اینترنتی رو امتحان کنن، به تاریخ ایران زمین سفر کنن و تو فرهنگ غنیش جست‌وجو
            کنن و تو بازی‌های مختلف با هم مسابقه بدن!
          </p>
        </div>

        <div className="mt-16 flex justify-center">
            <MotionLink 
                href="/game" 
                whileHover={{ 
                    scale: 1.05, 
                }}
                whileTap={{ 
                    scale: 0.95,
                    y: 5,
                }}
                className="flex items-center justify-center 
                            bg-yellow-300 hover:bg-yellow-400 
                            font-extrabold text-xl sm:text-2xl 
                            py-4 px-12 sm:py-5 sm:px-14 
                            rounded-xl 
                            shadow-2xl transition-all duration-150 
                            cursor-pointer"
            >
                چالش سیر کردن ایمان! 🕹️
            </MotionLink>
        </div>
      </div>

      <div>
          <YouTubeSlider />
      </div>
    </div>
  );
}
