"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Poster from "@/public/poster/Kouman-poster.png";
import Logo from "@/public/png/kouman.png";
import Twitter from "@/public/png/twitter.png";
import Instagram from "@/public/png/instagram.png";
import Youtube from "@/public/png/youtube.png";
import TwitterColor from "@/public/png/twitter-color.png";
import InstagramColor from "@/public/png/instagram-color.png";
import YoutubeColor from "@/public/png/youtube-color.png";
import { motion } from "framer-motion";


export default function Home() {
  const [twitterHover, setTwitterHover] = useState(false);
  const [instagramHover, setInstagramHover] = useState(false);
  const [youtubeHover, setYoutubeHover] = useState(false);

  return (
    <div className="w-full">
      <div className="bg-orange-200 rounded-full mx-auto mt-10 flex justify-center items-center w-[750px] max-w-[90%] sm:max-w-[80%] md:max-w-[600px] lg:max-w-[750px] p-4 sm:p-6">
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

      <div className="px-6 sm:px-10 md:px-16 lg:px-24 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="flex flex-col gap-6 sm:gap-8 max-w-3xl mx-auto text-center">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black leading-snug">
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
      </div>

      <div
        className="bg-orange-200 flex flex-col lg:flex-row justify-center items-center lg:items-start gap-10 lg:gap-72 p-6 lg:p-10 text-center lg:text-right"
        style={{ marginTop: 'auto' }}
      >
        <div className="flex flex-col gap-6 items-center lg:items-end">
          <motion.div whileHover={{ scale: 1.1 }}>
            <Link
              href="https://x.com/thekouman"
              onMouseEnter={() => setTwitterHover(true)}
              onMouseLeave={() => setTwitterHover(false)}
              className="flex gap-2 items-center"
            >
              <h2 className="text-sm sm:text-base">Twitter</h2>
              <Image
                src={twitterHover ? TwitterColor : Twitter}
                className="w-6 sm:w-7"
                alt="Kouman Twitter"
              />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }}>
            <Link
              href="https://www.instagram.com/thekouman?igsh=MWsxdHBpMnp4d2Y3cg=="
              onMouseEnter={() => setInstagramHover(true)}
              onMouseLeave={() => setInstagramHover(false)}
              className="flex gap-2 items-center"
            >
              <h2 className="text-sm sm:text-base">Instagram</h2>
              <Image
                src={instagramHover ? InstagramColor : Instagram}
                className="w-6 sm:w-7"
                alt="Kouman Instagram"
              />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }}>
            <Link
              href="https://www.youtube.com/@Kouman"
              onMouseEnter={() => setYoutubeHover(true)}
              onMouseLeave={() => setYoutubeHover(false)}
              className="flex gap-2 items-center"
            >
              <h2 className="text-sm sm:text-base">Youtube</h2>
              <Image
                src={youtubeHover ? YoutubeColor : Youtube}
                className="w-6 sm:w-7"
                alt="Kouman Youtube"
              />
            </Link>
          </motion.div>
        </div>

        <div className="flex flex-col items-center lg:items-end gap-6 lg:gap-10">
          <motion.div whileHover={{ scale: 1.1 }}>
            <Image
              src={Logo}
              alt="Kouman Logo"
              className="w-24 sm:w-28 md:w-32"
            />
          </motion.div>
          <div className="flex flex-col items-center lg:items-end text-xs sm:text-sm text-gray-700">
            <p>
              For business inquiries and correspondence, please contact us at{" "}
              <u>info@kouman.net</u>
            </p>
            <p>All Right Reserved By Kouman | @2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}
