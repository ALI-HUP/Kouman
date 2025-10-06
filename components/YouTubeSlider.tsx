"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import Image from "next/image";
import Youtube from "@/public/png/youtube-color.png";

const YOUTUBE_URL = "https://www.youtube.com/@Kouman";

export default function YouTubeSlider() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const [maxDrag, setMaxDrag] = useState<number>(0);

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const handle = handleRef.current;
      if (!container || !handle) return;

      const containerWidth = container.offsetWidth;
      const handleWidth = handle.offsetWidth;

      const max = containerWidth - handleWidth;
      setMaxDrag(max);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const handleDragEnd = () => {
    const currentX = x.get();
    const thresholdPx = 10;

    if (Math.abs(currentX) >= Math.max(0, maxDrag - thresholdPx)) {
      x.set(-maxDrag);

      setTimeout(() => {
        window.location.href = YOUTUBE_URL;
      }, 150);
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
    }
  };

  return (
    <div className="flex justify-center items-center py-10">
      <div
        ref={containerRef}
        className="relative w-[360px] sm:w-[440px] md:w-[520px] lg:w-[600px] h-14 bg-gray-200 rounded-2xl flex items-center justify-center text-xl font-bold text-gray-700 overflow-hidden select-none"
      >
        <span className="z-10 pointer-events-none">
          بریم؟؟&nbsp;&nbsp;&nbsp;&nbsp;بفرمایید!!
        </span>

        <motion.div
          ref={handleRef}
          drag="x"
          dragConstraints={{ left: -maxDrag, right: 0 }}
          dragElastic={0}
          onDragEnd={handleDragEnd}
          style={{ x }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-20 h-20 flex items-center justify-center cursor-grab active:cursor-grabbing z-20"
          whileTap={{ scale: 0.95 }}
          aria-label="رفتن به کانال یوتیوب"
          animate={{
              x: [0, -20, 0],
          }}
          transition={{
            duration: 1.2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 2,
          }}
        >
          <Image
            alt="YouTube logo"
            src={Youtube}
            className="w-20 h-auto select-none pointer-events-none"
            priority
          />
        </motion.div>
      </div>
    </div>
  );
}
