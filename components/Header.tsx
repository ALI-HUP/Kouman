"use client";

import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/png/kouman.png";
import { useState } from "react";
import { usePathname } from "next/navigation";
import MobileMenu from "@/components/MobileMenu";
import { motion } from "framer-motion";

const navLinks = [
  { href: "/episodes", label: "اپیزودها" },
  { href: "/universe", label: "دنیای کومان" },
  { href: "/store", label: "فروشگاه" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      className="
      relative z-20
      m-5 w-[90%] md:w-[70%] mx-auto flex justify-between items-center p-3 px-6
      rounded-full bg-orange-200/90 backdrop-blur-md
      shadow-[0_12px_25px_-5px_rgba(0,0,0,0.35),-10px_0_20px_-6px_rgba(0,0,0,0.25),10px_0_20px_-6px_rgba(0,0,0,0.25)]
      transition-all duration-500 hover:translate-y-[-6px] hover:shadow-[0_18px_30px_-4px_rgba(0,0,0,0.45),-12px_0_24px_-6px_rgba(0,0,0,0.3),12px_0_24px_-6px_rgba(0,0,0,0.3)]
    "
    >
      <div className="flex gap-5">
        <Link href="/">
          <Image
            className="w-20 hover:scale-110 transition-transform duration-200"
            src={Logo}
            alt="Kouman Logo"
          />
        </Link>
      </div>

      <div className="hidden md:flex text-lg gap-8 font-bold">
        {navLinks.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link key={href} href={href} className="relative group">
              <span
                className={`inline-block rounded-full px-4 py-1.5 transition-all duration-200 ${
                  isActive
                    ? "bg-orange-600 text-white shadow-lg"
                    : "hover:text-orange-600 hover:scale-105"
                }`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>

      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden"
        aria-label="menu-toggle"
      >
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
