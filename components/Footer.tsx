"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Logo from "@/public/png/kouman.png";
import Twitter from "@/public/png/twitter.png";
import Instagram from "@/public/png/instagram.png";
import Youtube from "@/public/png/youtube.png";
import TwitterColor from "@/public/png/twitter-color.png";
import InstagramColor from "@/public/png/instagram-color.png";
import YoutubeColor from "@/public/png/youtube-color.png";
import { motion } from "framer-motion";

export default function Footer() {
  const [twitterHover, setTwitterHover] = useState(false);
  const [instagramHover, setInstagramHover] = useState(false);
  const [youtubeHover, setYoutubeHover] = useState(false);

  return (
    <footer
      className="bg-orange-200 flex flex-col lg:flex-row justify-center items-center lg:items-start gap-10 lg:gap-72 p-6 lg:p-10 text-center lg:text-right w-full"
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
    </footer>
  );
}
