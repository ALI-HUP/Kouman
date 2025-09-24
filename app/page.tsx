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
          <motion.div whileHover={{ scale: 1.1 }}>
            <Link
              href="https://x.com/thekouman"
              onMouseEnter={() => setTwitterHover(true)}
              onMouseLeave={() => setTwitterHover(false)}
              className="flex gap-2 items-center"
            >
              <h2>Twitter</h2>
              <Image
                src={twitterHover ? TwitterColor : Twitter}
                className="w-7"
                alt="Kouman Twitter"
              />
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }}>
            <Link
              href="https://instagram.com/kouman"
              onMouseEnter={() => setInstagramHover(true)}
              onMouseLeave={() => setInstagramHover(false)}
              className="flex gap-2 items-center"
            >
              <h2>Instagram</h2>
              <Image
                src={instagramHover ? InstagramColor : Instagram}
                className="w-7"
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
              <h2>Youtube</h2>
              <Image
                src={youtubeHover ? YoutubeColor : Youtube}
                className="w-7"
                alt="Kouman Youtube"
              />
            </Link>
          </motion.div>
        </div>

        <div className="flex flex-col items-end gap-10">
          <motion.div whileHover={{ scale: 1.1 }}>
            <Image src={Logo} alt="Kouman Logo" className="items-end" />
          </motion.div>
          <div className="flex flex-col items-end">
            <p>For business inquiries and correspondence, please contact us at info@kouman.net</p>
            <p>All Right Reseved By Kouman | @2025</p>
          </div>
        </div>
      </div>
    </div>
  );
}