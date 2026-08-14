"use client";

import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface MobileMenuProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const menuVariants: Variants = {
  closed: {
    scaleY: 0,
    opacity: 0,
    transition: { duration: 0.3, ease: [0.42, 0, 0.58, 1] },
  },
  open: {
    scaleY: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: [0.42, 0, 0.58, 1] },
  },
};

const menuLinks = [
  { href: "/episodes", label: "اپیزودها" },
  { href: "/universe", label: "دنیای کومان" },
  { href: "/store", label: "فروشگاه" },
];

export default function MobileMenu({
  isMenuOpen,
  setIsMenuOpen,
}: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const menu = menuRef.current;
      const toggleBtn = document.querySelector(
        "button[aria-label='menu-toggle']",
      );

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
          style={{ transformOrigin: "top" }}
        >
          {menuLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMenuOpen(false)}
                className={`w-full text-center py-2 rounded-md transition-colors ${
                  isActive ? "bg-orange-600 text-white" : "active:bg-orange-300"
                }`}
              >
                <span>{label}</span>
              </Link>
            );
          })}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
