import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  products,
  getProductById,
  getRelatedProducts,
  formatPrice,
  type Product,
} from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export function generateStaticParams() {
  return products.map((product) => ({ id: String(product.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(Number(id));
  return {
    title: product ? `${product.name} | فروشگاه کومان` : "فروشگاه کومان",
  };
}

const categoryLabels: Record<Product["category"], string> = {
  apparel: "لباس و پوشاک",
  accessories: "اکسسوری",
  posters: "پوسترها",
};

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProductById(Number(id));
  if (!product) notFound();

  const related = getRelatedProducts(product);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <Link
        href="/store"
        className="inline-flex items-center gap-1 text-orange-600 font-bold hover:underline mb-6 transition-colors"
      >
        <span>→</span>
        بازگشت به فروشگاه
      </Link>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden md:grid md:grid-cols-2">
        <div className="aspect-square relative bg-gray-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized={true}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        <div className="p-6 sm:p-8 lg:p-10 flex flex-col">
          <span className="self-start text-sm font-bold bg-orange-100 text-orange-700 rounded-full px-3 py-1 mb-4">
            {categoryLabels[product.category]}
          </span>

          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">
            {product.name}
          </h1>

          <p className="text-orange-600 font-bold text-2xl sm:text-3xl mb-6">
            {formatPrice(product.price)}
            <span className="text-sm sm:text-base font-medium text-gray-600 mr-1">
              تومان
            </span>
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            {product.description}
          </p>

          <ul className="space-y-2 mb-8">
            {product.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-gray-700">
                <span className="text-orange-500">✔</span>
                {feature}
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            <span className="block text-center bg-orange-100 text-orange-700 font-bold py-3 rounded-xl">
              به‌زودی قابل خرید از فروشگاه 🛍️
            </span>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            محصولات مشابه
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 justify-items-center">
            {related.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
