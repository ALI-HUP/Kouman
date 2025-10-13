import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
  };
}

const formatPrice = (price: number) => {
  const priceInToman = price / 10;
  return new Intl.NumberFormat('fa-IR').format(priceInToman);
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <motion.div
      initial={{ scale: 1 }}
      whileHover={{ 
        scale: 1.05, 
        y: -5,
        boxShadow: "0 25px 40px -8px rgba(234, 88, 12, 0.5), 0 10px 20px -5px rgba(0, 0, 0, 0.15)"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      
      className="
        relative w-full 
        bg-white rounded-xl overflow-hidden 
        shadow-lg border border-gray-100 
        cursor-pointer
      "
    >
      <Link href={`/store/${product.id}`} passHref>
        <div className="flex flex-col h-full">
          
          <div className="aspect-square relative w-full overflow-hidden bg-gray-100">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-opacity duration-300"
              unoptimized={true} 
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              priority={true}
            />
          </div>

          <div className="p-4 flex flex-col text-right flex-grow"> 
            
            <h3 className="
              text-base sm:text-lg font-bold
              text-gray-900 line-clamp-2 leading-tight mb-2 text-right
            ">
              {product.name}
            </h3>
            
            <p className="
              mt-auto text-xl sm:text-2xl
              text-orange-600 text-right
            ">
              {formatPrice(product.price)}
              <span className="
                text-xs sm:text-sm font-medium mr-1 text-gray-600
              ">
                تومان
              </span>
            </p>
            
            <button className="
              mt-3 sm:mt-4 w-full text-center 
              bg-orange-500 text-white 
              font-bold py-1.5 sm:py-2 rounded-lg 
              text-sm sm:text-base
              hover:bg-orange-600 transition-colors duration-200
            ">
              مشاهده جزئیات
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}