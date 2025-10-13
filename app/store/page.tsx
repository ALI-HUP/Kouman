"use client";

import ProductCard from "@/components/ProductCard";
import React, { useState, useMemo } from 'react';

const products = [
  {
    id: 1,
    name: "تیشرت مشکی دسکتاپ",
    price: 35000000,
    imageUrl: "/product/iman-desptop-768x1152.png",
    category: "apparel"
  },
  {
    id: 2,
    name: "تیشرت الحافوزلیق",
    price: 1200000,
    imageUrl: "/product/HALFOZIGH-back1.jpg",
    category: "apparel"
  },
  {
    id: 3,
    name: "تیشرت میالند",
    price: 8500000,
    imageUrl: "/product/mialand-front.png",
    category: "apparel"
  },
  {
    id: 4,
    name: "ماگ آبی کومان",
    price: 450000,
    imageUrl: "/product/mug-blue2.jpg",
    category: "accessories"
  },
  {
    id: 5,
    name: "ماگ قرمز کومان",
    price: 21000000,
    imageUrl: "/product/mug-red.jpg",
    category: "accessories"
  },
  {
    id: 6,
    name: "پوستر طرح قدیمی",
    price: 600000,
    imageUrl: "/product/kouman.jpg",
    category: "posters"
  },
];

const filterItems = [
  { name: "همه محصولات", key: "all", icon: "✨" },
  { name: "لباس و پوشاک", key: "apparel", icon: "👕" },
  { name: "اکسسوری", key: "accessories", icon: "📦" },
  { name: "پوسترها", key: "posters", icon: "🖼️" },
];


export default function StorePage() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredProducts = useMemo(() => {
    if (activeFilter === 'all') {
      return products;
    }
    return products.filter(product => product.category === activeFilter);
  }, [activeFilter]);

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
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-400/50 transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-orange-100 hover:text-orange-600'
                  }
                `}
              >
                <span className="text-xl">
                    {item.icon}
                </span>
                
                {item.name}
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
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
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
