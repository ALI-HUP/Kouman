"use client";

import Link from "next/link";
import Image from "next/image";
import Poster from "@/public/poster/Kouman-poster.png";
import { motion, type Variants } from "framer-motion";
import YouTubeSlider from "@/components/YouTubeSlider";

const MotionLink = motion(Link);

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Home() {
  return (
    <div>
      <div className="bg-orange-200 rounded-full mx-auto mt-5 flex justify-center items-center w-[750px] max-w-[90%] sm:max-w-[80%] md:max-w-[600px] lg:max-w-[750px] p-4 sm:p-6">
        <motion.div
          drag
          dragElastic={0.2}
          dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
          dragTransition={{
            bounceStiffness: 500,
            bounceDamping: 10,
          }}
          className="cursor-grab active:cursor-grabbing"
          animate={{
            x: [0, 13, 0, -13, 0],
            y: [0, -17, 0, 17, 0],
            scale: [1, 1.03, 1, 1.03, 1],
          }}
          transition={{
            y: { repeat: Infinity, duration: 6, ease: "easeInOut" },
            x: { repeat: Infinity, duration: 6, ease: "easeInOut" },
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
        <motion.div
          className="flex flex-col gap-6 sm:gap-8 max-w-3xl mx-auto text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h1
            variants={fadeUp}
            className="text-xl sm:text-2xl md:text-4xl font-black leading-snug"
          >
            جمعه‌های نمکی با کومان!!!؟
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg md:text-xl leading-relaxed text-gray-800"
          >
            <strong className="text-lg sm:text-xl md:text-2xl">کومان</strong>{" "}
            جاییه که هر جمعه کورش، ایمان و میا با یه چالش جدید غیرمنتظره شما رو
            همراه خودشون می‌برن تا هر‌جور غذایی که فکرشو بکنین بخورن، عجیب‌ترین
            محصولات اینترنتی رو امتحان کنن، به تاریخ ایران سفر کنن و تو فرهنگ
            غنیش جست‌وجو کنن و تو بازی‌های مختلف با هم مسابقه بدن!
          </motion.p>

          <motion.div variants={fadeUp} className="mt-5 flex justify-center">
            <MotionLink
              href="/game"
              whileHover={{
                scale: 1.03,
                boxShadow: "0 20px 35px -10px rgba(230,70,10,0.3)",
              }}
              whileTap={{
                scale: 0.95,
                y: 5,
              }}
              className="flex items-center justify-center
                          rounded-xl bg-yellow-300 
                          font-extrabold text-xl sm:text-2xl
                          py-3 px-10 sm:py-3 sm:px-12
                          shadow-xl transition-all duration-100
                          cursor-pointer"
            >
              چالش سیر کردن ایمان! 🕹️
            </MotionLink>
          </motion.div>
        </motion.div>
      </div>

      <div>
        <YouTubeSlider />
      </div>
    </div>
  );
}
