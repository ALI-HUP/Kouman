"use client";

import ProductCard from "@/components/ProductCard";
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { products } from "@/lib/products";

const filterItems = [
  { name: "همه محصولات", key: "all", icon: "✨" },
  { name: "لباس و پوشاک", key: "apparel", icon: "👕" },
  { name: "اکسسوری", key: "accessories", icon: "📦" },
  { name: "پوسترها", key: "posters", icon: "🖼️" },
];

export default function StorePage() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProducts = useMemo(() => {
    if (activeFilter === "all") {
      return products;
    }
    return products.filter((product) => product.category === activeFilter);
  }, [activeFilter]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: products.length };
    for (const product of products) {
      counts[product.category] = (counts[product.category] ?? 0) + 1;
    }
    return counts;
  }, []);

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="
        text-3xl sm:text-4xl
        font-bold text-center mb-10 text-gray-900
      ">
        تنها فروشگاه رسمی کومان
      </h1>

      <div className="flex justify-center mb-10 px-0 sm:px-4">
        <div
          className="
            flex gap-4 p-4 rounded-3xl
            bg-orange-100 ring-1 ring-orange-300
            overflow-x-auto whitespace-nowrap scrollbar-hide
          "
        >
          {filterItems.map((item) => {
            const isActive = activeFilter === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveFilter(item.key)}
                className={`
                  flex items-center gap-2 justify-center flex-shrink-0
                  px-5 py-2 rounded-full text-base font-bold
                  transition-all duration-200 min-w-[150px]
                  ${isActive
                    ? "bg-orange-600 text-white shadow-lg shadow-orange-400/50 transform scale-105"
                    : "bg-white text-gray-700 hover:bg-orange-100 hover:text-orange-600"
                  }
                `}
              >
                <span className="text-xl">
                  {item.icon}
                </span>

                {item.name}

                <span className={`text-xs ${isActive ? "text-orange-100" : "text-gray-500"}`}>
                  ({categoryCounts[item.key]?.toLocaleString("fa-IR") ?? 0})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="mb-8 border-gray-200" />

      <div className="
        grid
        grid-cols-2
        sm:grid-cols-3
        lg:grid-cols-4
        gap-6 sm:gap-8
        justify-items-center
      ">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: index * 0.06, duration: 0.45 }}
            className="w-full"
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="text-center text-xl text-gray-500 mt-12">
          محصولی در این دسته‌بندی یافت نشد.
        </p>
      )}
    </div>
  );
}
