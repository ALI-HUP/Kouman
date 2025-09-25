"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/png/kouman.png";
import { useState } from "react";
import MobileMenu from "@/components/MobileMenu";
import { motion } from "framer-motion";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="
      relative z-20 
      m-5 w-[90%] md:w-[70%] mx-auto flex justify-between items-center p-3 px-6 
      rounded-full bg-orange-200/90 backdrop-blur-md 
      shadow-[0_12px_25px_-5px_rgba(0,0,0,0.35),-10px_0_20px_-6px_rgba(0,0,0,0.25),10px_0_20px_-6px_rgba(0,0,0,0.25)]
      transition-all duration-500 hover:translate-y-[-6px] hover:shadow-[0_18px_30px_-4px_rgba(0,0,0,0.45),-12px_0_24px_-6px_rgba(0,0,0,0.3),12px_0_24px_-6px_rgba(0,0,0,0.3)]
    ">
      
      <div className="flex gap-5">
        <Link href="/">
          <Image className="w-20 hover:scale-115 transition-transform duration-200" src={Logo} alt="Kouman Logo" />
        </Link>
      </div>

      <div className="hidden md:flex text-lg gap-8 font-bold">
        <Link href="/episodes" className="relative group">
          <span className="group-hover:text-orange-700 transition-colors">اپیزودها</span>
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-orange-700 transition-all group-hover:w-full"></span>
        </Link>

        <Link href="/universe" className="relative group">
          <span className="group-hover:text-orange-700 transition-colors">دنیای کومان</span>
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-orange-700 transition-all group-hover:w-full"></span>
        </Link>

        <Link href="/store" className="relative group">
          <span className="group-hover:text-orange-700 transition-colors">فروشگاه</span>
          <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-orange-700 transition-all group-hover:w-full"></span>
        </Link>
      </div>

      <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden" aria-label="menu-toggle">
        <motion.svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-8 w-8 text-black" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          animate={{ rotate: isMenuOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
          />
        </motion.svg>
      </button>

      <MobileMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    </header>
  );
}