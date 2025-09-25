"use client";

import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useRef } from "react";

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const menuVariants: Variants = {
  closed: {
    scaleY: 0,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.42, 0, 0.58, 1] }
  },
  open: {
    scaleY: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: [0.42, 0, 0.58, 1] }
  }
};

export default function MobileMenu({ isMenuOpen, setIsMenuOpen }: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const menu = menuRef.current;
      const toggleBtn = document.querySelector("button[aria-label='menu-toggle']");

      if (
        menu &&
        !menu.contains(target) &&
        toggleBtn &&
        !toggleBtn.contains(target)
      ) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, setIsMenuOpen]);

  return (
    <AnimatePresence>
      {isMenuOpen && (
        <motion.div
          ref={menuRef}
          className="
            absolute top-20 right-5 left-5 
            bg-orange-200/95 backdrop-blur-md rounded-lg p-4 z-10
            flex flex-col items-center gap-4 text-lg font-bold
            shadow-lg md:hidden
          "
          variants={menuVariants}
          initial="closed"
          animate="open"
          exit="closed"
          style={{ transformOrigin: 'top' }}
        >
          <Link href="/episodes" onClick={() => setIsMenuOpen(false)} className="w-full text-center py-2 relative group">
            <span className="group-hover:text-orange-700 transition-colors">اپیزودها</span>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-orange-700 transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/universe" onClick={() => setIsMenuOpen(false)} className="w-full text-center py-2 relative group">
            <span className="group-hover:text-orange-700 transition-colors">دنیای کومان</span>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-orange-700 transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/store" onClick={() => setIsMenuOpen(false)} className="w-full text-center py-2 relative group">
            <span className="group-hover:text-orange-700 transition-colors">فروشگاه</span>
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-orange-700 transition-all group-hover:w-full"></span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
